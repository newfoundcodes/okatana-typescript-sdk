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
const metrics = await client.projects.analytics(projectId);
const boards = await client.projects.listBoards(projectId);

console.table({
  total: metrics.total ?? 0,
  open: metrics.open ?? 0,
  done: metrics.done ?? 0,
  overdue: metrics.overdue ?? 0,
  completion: `${metrics.completionPercentage ?? 0}%`,
});

for (const board of boards) {
  const page = await client.projects.listTickets(projectId, { boardId: board.id, perPage: 200 });
  console.log(
    `${board.name}: ${page.total} tickets${board.wipLimit ? ` / WIP ${board.wipLimit}` : ''}`,
  );
}
