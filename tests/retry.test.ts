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
import { OkatanaClient } from '../src/index.js';

describe('retry policy', () => {
  it('retries GET requests on transient 503 responses', async () => {
    let calls = 0;
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      retry: { maxRetries: 2, baseDelayMs: 0, maxDelayMs: 0 },
      fetch: async () => {
        calls += 1;
        if (calls < 3) {
          return Response.json({ message: 'temporary' }, { status: 503 });
        }
        return Response.json({ data: { id: 'o1' } });
      },
    });

    await client.organizations.get('o1');
    expect(calls).toBe(3);
  });

  it('does not retry POST requests by default', async () => {
    let calls = 0;
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      retry: { maxRetries: 4, baseDelayMs: 0, maxDelayMs: 0 },
      fetch: async () => {
        calls += 1;
        return Response.json({ message: 'temporary' }, { status: 503 });
      },
    });

    await expect(
      client.organizations.createProject('o1', { name: 'A', key: 'A' }),
    ).rejects.toThrow();
    expect(calls).toBe(1);
  });
});
