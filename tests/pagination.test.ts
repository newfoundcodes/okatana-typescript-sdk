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

describe('pagination', () => {
  it('normalizes nested Laravel pagination', async () => {
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      fetch: async () =>
        Response.json({
          data: {
            data: [{ id: 't1', title: 'One', priority: 'normal' }],
            current_page: 2,
            last_page: 5,
            per_page: 50,
            total: 201,
            from: 51,
            to: 100,
            first_page_url: 'https://api.example.test/api/v1/projects/p/tickets?page=1',
            last_page_url: 'https://api.example.test/api/v1/projects/p/tickets?page=5',
            next_page_url: 'https://api.example.test/api/v1/projects/p/tickets?page=3',
            prev_page_url: 'https://api.example.test/api/v1/projects/p/tickets?page=1',
            links: [],
          },
        }),
    });
    const page = await client.projects.listTickets('p');

    expect(page.currentPage).toBe(2);
    expect(page.lastPage).toBe(5);
    expect(page.total).toBe(201);
    expect(page.items[0]?.id).toBe('t1');
  });

  it('refuses pagination URLs outside the configured API origin', async () => {
    let calls = 0;
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      fetch: async () => {
        calls += 1;
        return Response.json({
          data: {
            data: [{ id: 't1', title: 'One', priority: 'normal' }],
            current_page: 1,
            last_page: 2,
            per_page: 1,
            total: 2,
            from: 1,
            to: 1,
            first_page_url: null,
            last_page_url: null,
            next_page_url: 'https://evil.example/api/v1/projects/p/tickets?page=2',
            prev_page_url: null,
            links: [],
          },
        });
      },
    });

    const iterator = client.projects.iterateTickets('p');
    expect((await iterator.next()).value?.id).toBe('t1');

    await expect(iterator.next()).rejects.toThrow(/Refusing to follow/);
    expect(calls).toBe(1);
  });
});
