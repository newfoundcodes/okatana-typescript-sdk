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
const members = await client.projects.listMembers(projectId);
const editors = members.slice(0, 2).map((member) => member.id);

const document = await client.organizations.createDocument(organizationId, {
  projectId,
  title: 'Production Deployment Runbook',
  caption: 'Standard operating procedure for production deployments.',
  contentHtml: '<h2>Pre-flight</h2><p>Confirm release approval and rollback readiness.</p>',
  status: 'draft',
  editorIds: editors,
  tagNames: ['runbook', 'production', 'deployment'],
});

await client.documents.createComment(document.id, {
  bodyHtml: '<p>Initial runbook generated from the release checklist.</p>',
});

const published = await client.documents.update(document.id, {
  status: 'published',
});

console.log(
  `Published document ${published.id} at ${published.publishedAt ?? 'server timestamp'}.`,
);
