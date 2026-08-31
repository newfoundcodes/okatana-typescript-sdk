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

import { describe, expect, it } from 'vitest';
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  OkatanaClient,
  RateLimitError,
  ValidationError,
} from '../src/index.js';

function clientWith(status: number, body: unknown, headers?: HeadersInit) {
  return new OkatanaClient({
    baseUrl: 'https://api.example.test',
    apiKey: 'secret',
    retry: { maxRetries: 0 },
    fetch: async () => Response.json(body, headers ? { status, headers } : { status }),
  });
}

describe('HTTP error mapping', () => {
  it('maps 401', async () => {
    await expect(
      clientWith(401, { message: 'Invalid credential' }).organizations.get('o'),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('maps 403', async () => {
    await expect(
      clientWith(403, { message: 'Forbidden' }).organizations.get('o'),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it('maps 404', async () => {
    await expect(clientWith(404, { message: 'Missing' }).tickets.get('t')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('maps Laravel 422 validation errors', async () => {
    const error = await clientWith(422, { message: 'Invalid', errors: { title: ['Required'] } })
      .tickets.get('t')
      .catch((e) => e);

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.validationErrors).toEqual({ title: ['Required'] });
  });

  it('maps 429 and Retry-After', async () => {
    const error = await clientWith(429, { message: 'Slow down' }, { 'retry-after': '2' })
      .tickets.get('t')
      .catch((e) => e);

    expect(error).toBeInstanceOf(RateLimitError);
    expect(error.retryAfterMs).toBe(2000);
  });
});
