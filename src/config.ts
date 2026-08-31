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

import { ConfigurationError } from './errors.js';

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface OkatanaLogger {
  debug?(message: string, context?: Record<string, unknown>): void;
  info?(message: string, context?: Record<string, unknown>): void;
  warn?(message: string, context?: Record<string, unknown>): void;
  error?(message: string, context?: Record<string, unknown>): void;
}

export interface RetryOptions {
  /** Number of retries after the first attempt. Default: 2. */
  maxRetries?: number;

  /** Initial backoff delay in milliseconds. Default: 250. */
  baseDelayMs?: number;

  /** Maximum backoff delay in milliseconds. Default: 4000. */
  maxDelayMs?: number;

  /** HTTP statuses that can be retried for safe methods. */
  retryStatuses?: number[];

  /** Retry transport errors for safe methods. Default: true. */
  retryTransportErrors?: boolean;
}

export interface OkatanaClientOptions {
  /**
   * Required Okatana deployment URL. Examples:
   * https://okatana.example.com
   * https://internal.example.com/okatana
   * https://okatana.example.com/api/v1
   *
   * There is intentionally no default host.
   */
  baseUrl: string;

  /** Required organization-scoped bearer credential. */
  apiKey: string;

  /** Request timeout in milliseconds. Default: 30000. */
  timeoutMs?: number;

  /** Optional fetch implementation. Defaults to globalThis.fetch. */
  fetch?: FetchLike;

  /** Extra headers sent with every request. */
  defaultHeaders?: Record<string, string>;
  retry?: RetryOptions;
  logger?: OkatanaLogger;
}

export interface ResolvedClientOptions {
  apiBaseUrl: string;
  apiKey: string;
  timeoutMs: number;
  fetch: FetchLike;
  defaultHeaders: Record<string, string>;
  retry: Required<RetryOptions>;
  logger?: OkatanaLogger;
}

function normalizeApiBaseUrl(input: string): string {
  if (!input.trim()) {
    throw new ConfigurationError('baseUrl is required.');
  }

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new ConfigurationError('baseUrl must be an absolute http:// or https:// URL.');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new ConfigurationError('baseUrl must use http:// or https://.');
  }

  url.search = '';
  url.hash = '';
  url.pathname = url.pathname.replace(/\/+$/, '');

  if (!url.pathname.endsWith('/api/v1')) {
    url.pathname = `${url.pathname}/api/v1`.replace(/\/+/g, '/');
  }

  return url.toString().replace(/\/$/, '');
}

export function resolveClientOptions(options: OkatanaClientOptions): ResolvedClientOptions {
  if (!options || typeof options !== 'object') {
    throw new ConfigurationError('Client options are required.');
  }

  if (!options.apiKey?.trim()) {
    throw new ConfigurationError('apiKey is required.');
  }

  const fetchImpl = options.fetch ?? globalThis.fetch?.bind(globalThis);
  if (!fetchImpl) {
    throw new ConfigurationError('No fetch implementation is available. Supply options.fetch.');
  }

  const timeoutMs = options.timeoutMs ?? 30_000;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new ConfigurationError('timeoutMs must be greater than 0.');
  }

  const maxRetries = options.retry?.maxRetries ?? 2;
  const baseDelayMs = options.retry?.baseDelayMs ?? 250;
  const maxDelayMs = options.retry?.maxDelayMs ?? 4_000;

  if (!Number.isInteger(maxRetries) || maxRetries < 0) {
    throw new ConfigurationError('retry.maxRetries must be a non-negative integer.');
  }

  if (baseDelayMs < 0 || maxDelayMs < 0 || maxDelayMs < baseDelayMs) {
    throw new ConfigurationError('Retry delays are invalid.');
  }

  return {
    apiBaseUrl: normalizeApiBaseUrl(options.baseUrl),
    apiKey: options.apiKey.trim(),
    timeoutMs,
    fetch: fetchImpl,
    defaultHeaders: { ...(options.defaultHeaders ?? {}) },
    retry: {
      maxRetries,
      baseDelayMs,
      maxDelayMs,
      retryStatuses: options.retry?.retryStatuses ?? [429, 500, 502, 503, 504],
      retryTransportErrors: options.retry?.retryTransportErrors ?? true,
    },
    ...(options.logger ? { logger: options.logger } : {}),
  };
}
