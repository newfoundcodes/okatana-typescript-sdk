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

const organizationId = requireId('organizationId');
const projectId = requireId('projectId');
const summary = process.env.INCIDENT_SUMMARY ?? 'Elevated API latency';

const boards = await client.projects.listBoards(projectId);
const active = boards.find((board) => board.slug === 'in_progress') ?? boards[0];
if (!active) {
  throw new Error('The project has no boards.');
}

const members = await client.projects.listMembers(projectId);
const responders = members.slice(0, 3).map((member) => member.id);

const ticket = await client.projects.createTicket(projectId, {
  boardId: active.id,
  title: `[SEV-1] ${summary}`,
  descriptionHtml: '<p>Incident created by the monitoring integration.</p>',
  priority: 'critical',
  assigneeIds: responders,
});

await client.tickets.createComment(ticket.id, {
  bodyHtml: '<p>Initial response started. Add findings and timeline updates here.</p>',
});

if (responders.length > 0) {
  await client.organizations.sendNotifications(organizationId, {
    userIds: responders,
    title: `Incident: ${summary}`,
    body: `A critical incident ticket was created as #${ticket.number}.`,
    url: `/app/projects/${projectId}`,
  });
}

console.log(`Incident ticket created: ${ticket.id}`);
