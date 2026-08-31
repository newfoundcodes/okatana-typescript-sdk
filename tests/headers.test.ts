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
import { recorder } from './helpers.js';

describe('request headers', () => {
  it('sends bearer authentication and JSON accept headers', async () => {
    const r = recorder();
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'oka_public.secret',
      fetch: r.fetch,
    });

    await client.organizations.get('org');

    const headers = new Headers(r.calls[0]?.init?.headers);
    expect(headers.get('authorization')).toBe('Bearer oka_public.secret');
    expect(headers.get('accept')).toBe('application/json');
    expect(headers.get('x-okatana-sdk')).toContain('@newfoundcodes/okatana');
  });
});
