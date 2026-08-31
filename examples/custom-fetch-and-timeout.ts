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

const baseUrl = process.env.OKATANA_URL;
const apiKey = process.env.OKATANA_API_KEY;
if (!baseUrl || !apiKey) {
  throw new Error('OKATANA_URL and OKATANA_API_KEY are required.');
}

const instrumentedFetch: typeof fetch = async (input, init) => {
  const started = performance.now();
  try {
    return await fetch(input, init);
  } finally {
    console.log(`HTTP request completed in ${(performance.now() - started).toFixed(1)} ms.`);
  }
};

const client = new OkatanaClient({
  baseUrl,
  apiKey,
  timeoutMs: 10_000,
  fetch: instrumentedFetch,
  defaultHeaders: { 'X-Integration-Name': 'payments-control-plane' },
  retry: { maxRetries: 3, baseDelayMs: 200, maxDelayMs: 2_000 },
});

const controller = new AbortController();
process.once('SIGINT', () => controller.abort());

const organizationId = process.env.OKATANA_ORGANIZATION_ID;
if (!organizationId) {
  throw new Error('OKATANA_ORGANIZATION_ID is required.');
}

const organization = await client.organizations.get(organizationId, { signal: controller.signal });
console.log(organization);
