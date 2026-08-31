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

export interface CallOptions {
  /** Abort this individual request. */
  signal?: AbortSignal;
  /**
   * Override the retry count for this call.
   * Write methods default to 0 because Okatana has no idempotency key.
   */
  retries?: number;
  /** Extra headers for this request. Authorization is always managed by the SDK. */
  headers?: Record<string, string>;
}

export function callOptions(options?: CallOptions): {
  signal?: AbortSignal;
  retries?: number;
  headers?: Record<string, string>;
} {
  return {
    ...(options?.signal ? { signal: options.signal } : {}),
    ...(options?.retries !== undefined ? { retries: options.retries } : {}),
    ...(options?.headers ? { headers: options.headers } : {}),
  };
}
