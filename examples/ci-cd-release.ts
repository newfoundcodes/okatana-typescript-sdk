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
const release = process.env.RELEASE_VERSION ?? 'v2026.08.30';
const deploymentUrl = process.env.DEPLOYMENT_URL ?? 'https://service.example.com';

const boards = await client.projects.listBoards(projectId);
const inProgress = boards.find((board) => board.slug === 'in_progress');
const deployed = boards.find((board) => board.slug === 'deployed' || board.isDone);
if (!inProgress || !deployed) {
  throw new Error('Expected in-progress and deployed boards.');
}

const marker = `[release:${release}]`;
let ticket = undefined;
for await (const candidate of client.projects.iterateTickets(projectId, {
  q: marker,
  perPage: 100,
})) {
  if (candidate.title.includes(marker)) {
    ticket = candidate;
    break;
  }
}

if (!ticket) {
  ticket = await client.projects.createTicket(projectId, {
    boardId: inProgress.id,
    title: `${marker} Deploy ${release}`,
    descriptionHtml: `<p>Automated release ticket for <strong>${release}</strong>.</p>`,
    priority: 'high',
  });
}

await client.tickets.createComment(ticket.id, {
  bodyHtml: `<p>CI passed. Deployment target: <a href="${deploymentUrl}">${deploymentUrl}</a>.</p>`,
});

await client.tickets.move(ticket.id, { boardId: deployed.id });
await client.tickets.createComment(ticket.id, {
  bodyHtml: `<p>Release ${release} deployed successfully.</p>`,
});

console.log(`Release ticket ${ticket.id} moved to ${deployed.name}.`);
