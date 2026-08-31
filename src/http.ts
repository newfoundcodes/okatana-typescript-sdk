/*
 * Okatana TypeScript SDK - A Newfoundcodes project.
 *
 * Copyright (C) 2026 Jonathan Eldy Baldivicio
 *
 * Author: Jonathan Eldy Baldivicio
 * Contact: jonathaneldy.baldivicio@newfoundcodes.com
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import type { ResolvedClientOptions } from './config.js';
import {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  TransportError,
  UnexpectedResponseError,
  ValidationError,
} from './errors.js';
import { isRecord } from './internal/json.js';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;

  /** Override default retry count. Writes are never retried unless this is greater than 0. */
  retries?: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function queryString(query?: Record<string, unknown>): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, String(item));
      }
    } else {
      params.set(key, String(value));
    }
  }

  const value = params.toString();
  return value ? `?${value}` : '';
}

function headersObject(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers.entries());
}

function validationErrors(body: unknown): Record<string, string[]> | undefined {
  if (!isRecord(body) || !isRecord(body.errors)) {
    return undefined;
  }

  const out: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(body.errors)) {
    if (Array.isArray(value)) {
      out[key] = value.map(String);
    }
  }

  return Object.keys(out).length ? out : undefined;
}

function messageFromBody(body: unknown, status: number): string {
  if (isRecord(body) && typeof body.message === 'string') {
    return body.message;
  }

  return `Okatana API request failed with HTTP ${status}.`;
}

function retryAfterMs(response: Response): number | undefined {
  const value = response.headers.get('retry-after');
  if (!value) {
    return undefined;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000);
  }

  const at = Date.parse(value);
  if (Number.isNaN(at)) {
    return undefined;
  }

  return Math.max(0, at - Date.now());
}

function combineSignals(
  timeoutMs: number,
  caller?: AbortSignal,
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new DOMException('Request timed out', 'TimeoutError')),
    timeoutMs,
  );
  const onAbort = () => controller.abort(caller?.reason);

  if (caller?.aborted) {
    controller.abort(caller.reason);
  } else {
    caller?.addEventListener('abort', onAbort, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      caller?.removeEventListener('abort', onAbort);
    },
  };
}

export class HttpTransport {
  constructor(private readonly config: ResolvedClientOptions) {}

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    if (/^https?:\/\//i.test(path)) {
      const requested = new URL(path);
      const base = new URL(this.config.apiBaseUrl);
      const insideBasePath =
        requested.pathname === base.pathname || requested.pathname.startsWith(`${base.pathname}/`);

      if (requested.origin !== base.origin || !insideBasePath) {
        throw new Error(
          'Refusing to follow a pagination URL outside the configured Okatana API base URL.',
        );
      }

      if (query && Object.keys(query).length) {
        for (const [key, value] of Object.entries(query)) {
          if (value === undefined || value === null || value === '') {
            continue;
          }

          if (Array.isArray(value)) {
            requested.searchParams.delete(key);
            for (const item of value) {
              requested.searchParams.append(key, String(item));
            }
          } else {
            requested.searchParams.set(key, String(value));
          }
        }
      }

      return requested.toString();
    }

    return `${this.config.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}${queryString(query)}`;
  }

  async request<T = unknown>(options: RequestOptions): Promise<T> {
    const method = options.method ?? 'GET';
    const url = this.buildUrl(options.path, options.query);
    const write = !['GET', 'HEAD', 'OPTIONS'].includes(method);
    const retries = options.retries ?? (write ? 0 : this.config.retry.maxRetries);

    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const { signal, cleanup } = combineSignals(this.config.timeoutMs, options.signal);
      const headers = new Headers(this.config.defaultHeaders);

      for (const [key, value] of Object.entries(options.headers ?? {})) {
        headers.set(key, value);
      }

      headers.set('Accept', 'application/json');
      headers.set('Authorization', `Bearer ${this.config.apiKey}`);
      headers.set('X-Okatana-SDK', '@newfoundcodes/okatana/1.0.0');

      let body: BodyInit | undefined;
      if (options.body !== undefined) {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(options.body);
      }

      this.config.logger?.debug?.('Okatana API request', { method, url, attempt: attempt + 1 });

      try {
        const response = await this.config.fetch(url, {
          method,
          headers,
          ...(body !== undefined ? { body } : {}),
          signal,
        });
        cleanup();

        const canRetry =
          attempt < retries && this.config.retry.retryStatuses.includes(response.status);
        if (canRetry) {
          const serverDelay = retryAfterMs(response);
          const backoff = Math.min(
            this.config.retry.maxDelayMs,
            this.config.retry.baseDelayMs * 2 ** attempt,
          );
          const jitter = Math.floor(Math.random() * Math.max(1, Math.floor(backoff * 0.25)));

          await sleep(serverDelay ?? backoff + jitter);
          continue;
        }

        if (response.status === 204) {
          return undefined as T;
        }

        const contentType = response.headers.get('content-type') ?? '';
        let parsed: unknown;

        if (contentType.includes('application/json')) {
          try {
            parsed = await response.json();
          } catch {
            parsed = undefined;
          }
        } else {
          const text = await response.text();
          parsed = text || undefined;
        }

        if (!response.ok) {
          throw this.makeApiError(response, method, url, parsed);
        }

        return parsed as T;
      } catch (error) {
        cleanup();

        if (error instanceof ApiError) {
          throw error;
        }

        lastError = error;
        if (options.signal?.aborted) {
          throw new TransportError('Okatana API request was aborted by the caller.', error);
        }

        const canRetry = attempt < retries && this.config.retry.retryTransportErrors;
        if (canRetry) {
          const backoff = Math.min(
            this.config.retry.maxDelayMs,
            this.config.retry.baseDelayMs * 2 ** attempt,
          );
          const jitter = Math.floor(Math.random() * Math.max(1, Math.floor(backoff * 0.25)));

          await sleep(backoff + jitter);
          continue;
        }
      }
    }

    throw new TransportError(
      `Okatana API request failed before a response was received: ${String(lastError)}`,
      lastError,
    );
  }

  private makeApiError(response: Response, method: string, url: string, body: unknown): ApiError {
    const requestId = response.headers.get('x-request-id');
    const errors = validationErrors(body);
    const retryAfter = retryAfterMs(response);
    const common = {
      status: response.status,
      method,
      url,
      message: messageFromBody(body, response.status),
      body,
      ...(requestId ? { requestId } : {}),
      ...(errors ? { validationErrors: errors } : {}),
      ...(retryAfter !== undefined ? { retryAfterMs: retryAfter } : {}),
      headers: headersObject(response.headers),
    };

    switch (response.status) {
      case 401:
        return new AuthenticationError(common);
      case 403:
        return new AuthorizationError(common);
      case 404:
        return new NotFoundError(common);
      case 422:
        return new ValidationError(common);
      case 429:
        return new RateLimitError(common);
      default:
        if (response.status < 400 || response.status > 599) {
          return new UnexpectedResponseError(common);
        }
        return new ApiError(common);
    }
  }
}
