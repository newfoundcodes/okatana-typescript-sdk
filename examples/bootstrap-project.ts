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

const project = await client.organizations.createProject(organizationId, {
  name: 'Payments Platform',
  key: 'PAY',
  description: 'Production work for the payments platform.',
});

console.log(`Created project ${project.key} (${project.id})`);

const initialBoards = await client.projects.listBoards(project.id);
console.log(
  'Default boards:',
  initialBoards.map((board) => `${board.name}:${board.slug}`),
);

const review = await client.projects.createBoard(project.id, {
  name: 'Security Review',
  color: '#7c3aed',
  wipLimit: 5,
});

const boards = await client.projects.listBoards(project.id);
const done = boards.find((board) => board.isDone || board.slug === 'deployed');
const desired = boards
  .filter((board) => board.id !== review.id && board.id !== done?.id)
  .map((board) => board.id);

desired.push(review.id);
if (done) {
  desired.push(done.id);
}

await client.projects.reorderBoards(project.id, { boardIds: desired });

const ticket = await client.projects.createTicket(project.id, {
  boardSlug: 'open',
  title: 'Establish PCI-sensitive service boundaries',
  descriptionHtml: '<p>Document trust boundaries and deployment controls.</p>',
  priority: 'highest',
});

console.log(`Created ticket #${ticket.number} (${ticket.id})`);
