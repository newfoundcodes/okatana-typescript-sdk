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
const version = process.env.RELEASE_VERSION ?? 'v2026.08.30';

const completed: string[] = [];
for await (const ticket of client.projects.iterateTickets(projectId, { perPage: 200 })) {
  if (ticket.completedAt) {
    completed.push(`#${ticket.number} ${ticket.title}`);
  }
}

const html = [
  `<h1>Release ${version}</h1>`,
  '<h2>Completed work</h2>',
  `<ul>${completed.map((item) => `<li>${item}</li>`).join('')}</ul>`,
].join('');

const document = await client.organizations.createDocument(organizationId, {
  projectId,
  title: `Release notes ${version}`,
  caption: `Generated release notes for ${version}.`,
  contentHtml: html,
  status: 'published',
  tagNames: ['release-notes', version],
});

console.log(`Published release notes document ${document.id}.`);
