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

import { client, requireId } from './_env.js';

const projectId = requireId('projectId');
const externalIssue = {
  id: process.env.EXTERNAL_ISSUE_ID ?? 'GH-1842',
  title: process.env.EXTERNAL_ISSUE_TITLE ?? 'Fix token refresh race',
  body: process.env.EXTERNAL_ISSUE_BODY ?? 'Observed during concurrent refresh.',
};

// Okatana has no idempotency key. Use a stable marker and reconcile before create.
const marker = `[external:${externalIssue.id}]`;
let existing = undefined;
for await (const ticket of client.projects.iterateTickets(projectId, { q: marker, perPage: 100 })) {
  if (ticket.title.includes(marker)) {
    existing = ticket;
    break;
  }
}

if (existing) {
  await client.tickets.update(existing.id, {
    title: `${marker} ${externalIssue.title}`,
    descriptionHtml: `<p>${externalIssue.body}</p>`,
  });
  console.log(`Updated existing Okatana ticket ${existing.id}.`);
} else {
  const created = await client.projects.createTicket(projectId, {
    boardSlug: 'open',
    title: `${marker} ${externalIssue.title}`,
    descriptionHtml: `<p>${externalIssue.body}</p>`,
    priority: 'normal',
  });
  console.log(`Created Okatana ticket ${created.id}.`);
}
