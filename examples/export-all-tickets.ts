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

import { writeFile } from 'node:fs/promises';
import { client, requireId } from './_env.js';

const projectId = requireId('projectId');
const rows: object[] = [];

for await (const ticket of client.projects.iterateTickets(projectId, { perPage: 200 })) {
  rows.push({
    id: ticket.id,
    number: ticket.number,
    title: ticket.title,
    priority: ticket.priority,
    boardId: ticket.boardId,
    dueAt: ticket.dueAt,
    completedAt: ticket.completedAt,
    archivedAt: ticket.archivedAt,
  });
}

await writeFile('okatana-tickets.json', JSON.stringify(rows, null, 2));
console.log(`Exported ${rows.length} tickets.`);
