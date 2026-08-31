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
import { OkatanaClient, ConfigurationError } from '../src/index.js';

const fetch = async () => Response.json({ data: {} });

describe('client configuration', () => {
  it('requires an explicit baseUrl', () => {
    expect(() => new OkatanaClient({ baseUrl: '', apiKey: 'oka_public.secret', fetch })).toThrow(
      ConfigurationError,
    );
  });

  it('requires an API key', () => {
    expect(
      () => new OkatanaClient({ baseUrl: 'https://api.example.test', apiKey: '', fetch }),
    ).toThrow(ConfigurationError);
  });

  it('appends /api/v1 to a deployment origin', () => {
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'oka_public.secret',
      fetch,
    });
    expect(client.apiBaseUrl).toBe('https://api.example.test/api/v1');
  });

  it('preserves a base URL that already ends in /api/v1', () => {
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test/api/v1/',
      apiKey: 'oka_public.secret',
      fetch,
    });
    expect(client.apiBaseUrl).toBe('https://api.example.test/api/v1');
  });

  it('supports an application subpath', () => {
    const client = new OkatanaClient({
      baseUrl: 'https://example.test/okatana',
      apiKey: 'oka_public.secret',
      fetch,
    });
    expect(client.apiBaseUrl).toBe('https://example.test/okatana/api/v1');
  });
});
