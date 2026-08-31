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

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { endpointCatalog } from '../src/endpoint-catalog.js';

interface OpenApiDocument {
  paths: Record<string, Record<string, unknown>>;
}

const methods = new Set(['get', 'post', 'put', 'patch', 'delete']);

describe('OpenAPI coverage', () => {
  it('contains one SDK operation for every supplied OpenAPI operation', () => {
    const path = fileURLToPath(new URL('../resources/openapi.yaml', import.meta.url));
    const spec = parse(readFileSync(path, 'utf8')) as OpenApiDocument;
    const fromSpec = Object.entries(spec.paths)
      .flatMap(([route, item]) =>
        Object.keys(item)
          .filter((method) => methods.has(method))
          .map((method) => `${method.toUpperCase()} ${route}`),
      )
      .sort();
    const fromSdk = endpointCatalog.map((e) => `${e.method} ${e.path}`).sort();

    expect(fromSdk).toEqual(fromSpec);
    expect(fromSdk).toHaveLength(30);
  });
});
