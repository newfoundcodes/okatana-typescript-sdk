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

import { OkatanaClient } from '@newfoundcodes/okatana';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export const env = {
  url: required('OKATANA_URL'),
  apiKey: required('OKATANA_API_KEY'),
  organizationId: process.env.OKATANA_ORGANIZATION_ID,
  projectId: process.env.OKATANA_PROJECT_ID,
};

export const client = new OkatanaClient({
  baseUrl: env.url,
  apiKey: env.apiKey,
});

export function requireId(name: 'organizationId' | 'projectId'): string {
  const value = env[name];
  if (!value) {
    const variable = name === 'organizationId' ? 'OKATANA_ORGANIZATION_ID' : 'OKATANA_PROJECT_ID';
    throw new Error(`${variable} is required for this example.`);
  }

  return value;
}
