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

export class OkatanaError extends Error {
  override name = 'OkatanaError';
}

export class ConfigurationError extends OkatanaError {
  override name = 'ConfigurationError';
}

export class RequestValidationError extends OkatanaError {
  override name = 'RequestValidationError';
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Invalid Okatana request: ${issues.join(' ')}`);
    this.issues = issues;
  }
}

export class TransportError extends OkatanaError {
  override name = 'TransportError';
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}

export interface ApiErrorOptions {
  status: number;
  method: string;
  url: string;
  message: string;
  requestId?: string;
  body?: unknown;
  validationErrors?: Record<string, string[]>;
  retryAfterMs?: number;
  headers?: Record<string, string>;
}

export class ApiError extends OkatanaError {
  override name = 'ApiError';
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly requestId?: string;
  readonly body?: unknown;
  readonly validationErrors?: Record<string, string[]>;
  readonly retryAfterMs?: number;
  readonly headers?: Record<string, string>;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.status = options.status;
    this.method = options.method;
    this.url = options.url;
    if (options.requestId !== undefined) {
      this.requestId = options.requestId;
    }
    if (options.body !== undefined) {
      this.body = options.body;
    }
    if (options.validationErrors !== undefined) {
      this.validationErrors = options.validationErrors;
    }
    if (options.retryAfterMs !== undefined) {
      this.retryAfterMs = options.retryAfterMs;
    }
    if (options.headers !== undefined) {
      this.headers = options.headers;
    }
  }
}

export class AuthenticationError extends ApiError {
  override name = 'AuthenticationError';
}

export class AuthorizationError extends ApiError {
  override name = 'AuthorizationError';
}

export class NotFoundError extends ApiError {
  override name = 'NotFoundError';
}

export class ValidationError extends ApiError {
  override name = 'ValidationError';
}

export class RateLimitError extends ApiError {
  override name = 'RateLimitError';
}

export class UnexpectedResponseError extends ApiError {
  override name = 'UnexpectedResponseError';
}
