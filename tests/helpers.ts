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

import type { FetchLike } from '../src/config.js';

export interface RecordedCall {
  url: string;
  init?: RequestInit;
}

function responseFor(url: string, method: string): Response {
  if (method === 'DELETE' || (method === 'PUT' && url.includes('/tickets/reorder'))) {
    return new Response(null, { status: 204 });
  }

  if (method === 'GET' && /\/projects\/[^/]+\/tickets(?:\?|$)/.test(url)) {
    return Response.json({
      data: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 50,
        total: 0,
        from: null,
        to: null,
        first_page_url: url,
        last_page_url: url,
        next_page_url: null,
        prev_page_url: null,
        links: [],
      },
    });
  }

  if (method === 'GET' && /\/organizations\/[^/]+\/documents(?:\?|$)/.test(url)) {
    return Response.json({
      data: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 50,
        total: 0,
        from: null,
        to: null,
        first_page_url: url,
        last_page_url: url,
        next_page_url: null,
        prev_page_url: null,
        links: [],
      },
    });
  }

  if (
    method === 'GET' &&
    (url.endsWith('/projects') ||
      url.endsWith('/members') ||
      url.endsWith('/labels') ||
      url.endsWith('/tags') ||
      url.endsWith('/boards'))
  ) {
    return Response.json({ data: [] });
  }

  if (method === 'PUT' && url.endsWith('/boards/reorder')) {
    return Response.json({ data: [] });
  }

  return Response.json({ data: {} }, { status: method === 'POST' ? 201 : 200 });
}

export function recorder(): { calls: RecordedCall[]; fetch: FetchLike } {
  const calls: RecordedCall[] = [];
  const fetch: FetchLike = async (input, init) => {
    const url = String(input);
    calls.push({ url, ...(init ? { init } : {}) });
    return responseFor(url, init?.method ?? 'GET');
  };

  return { calls, fetch };
}
