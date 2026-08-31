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
const boards = await client.projects.listBoards(projectId);
const legacy = boards.find((board) => board.name === 'QA Legacy');
const target =
  boards.find((board) => board.slug === 'pull_request') ??
  boards.find((board) => board.name === 'Review');

if (!legacy) {
  console.log('No legacy board exists. Nothing to migrate.');
} else if (!target) {
  throw new Error('No target review board exists.');
} else {
  await client.boards.delete(legacy.id, { moveToBoardId: target.id });
  console.log(`Deleted ${legacy.name} and moved its tickets to ${target.name}.`);
}
