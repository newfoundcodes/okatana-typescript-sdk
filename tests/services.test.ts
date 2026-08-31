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

import { describe, expect, it } from 'vitest';
import type { OkatanaClient } from '../src/client.js';
import { OkatanaClient as Client } from '../src/client.js';
import { recorder } from './helpers.js';

interface Case {
  name: string;
  method: string;
  path: string;
  invoke: (client: OkatanaClient) => Promise<unknown>;
}

const cases: Case[] = [
  {
    name: 'read organization',
    method: 'GET',
    path: '/organizations/org',
    invoke: (c) => c.organizations.get('org'),
  },
  {
    name: 'list projects',
    method: 'GET',
    path: '/organizations/org/projects',
    invoke: (c) => c.organizations.listProjects('org'),
  },
  {
    name: 'create project',
    method: 'POST',
    path: '/organizations/org/projects',
    invoke: (c) => c.organizations.createProject('org', { name: 'P', key: 'P' }),
  },
  {
    name: 'read project',
    method: 'GET',
    path: '/projects/proj',
    invoke: (c) => c.projects.get('proj'),
  },
  {
    name: 'update project',
    method: 'PATCH',
    path: '/projects/proj',
    invoke: (c) => c.projects.update('proj', { name: 'P2' }),
  },
  {
    name: 'delete project',
    method: 'DELETE',
    path: '/projects/proj',
    invoke: (c) => c.projects.delete('proj'),
  },
  {
    name: 'list members',
    method: 'GET',
    path: '/projects/proj/members',
    invoke: (c) => c.projects.listMembers('proj'),
  },
  {
    name: 'list labels',
    method: 'GET',
    path: '/projects/proj/labels',
    invoke: (c) => c.projects.listLabels('proj'),
  },
  {
    name: 'list boards',
    method: 'GET',
    path: '/projects/proj/boards',
    invoke: (c) => c.projects.listBoards('proj'),
  },
  {
    name: 'create board',
    method: 'POST',
    path: '/projects/proj/boards',
    invoke: (c) => c.projects.createBoard('proj', { name: 'Ready' }),
  },
  {
    name: 'reorder boards',
    method: 'PUT',
    path: '/projects/proj/boards/reorder',
    invoke: (c) => c.projects.reorderBoards('proj', { boardIds: ['b1'] }),
  },
  {
    name: 'update board',
    method: 'PATCH',
    path: '/boards/board',
    invoke: (c) => c.boards.update('board', { name: 'Done' }),
  },
  {
    name: 'delete board',
    method: 'DELETE',
    path: '/boards/board',
    invoke: (c) => c.boards.delete('board'),
  },
  {
    name: 'list tickets',
    method: 'GET',
    path: '/projects/proj/tickets',
    invoke: (c) => c.projects.listTickets('proj'),
  },
  {
    name: 'create ticket',
    method: 'POST',
    path: '/projects/proj/tickets',
    invoke: (c) => c.projects.createTicket('proj', { title: 'T' }),
  },
  {
    name: 'reorder tickets',
    method: 'PUT',
    path: '/projects/proj/tickets/reorder',
    invoke: (c) => c.projects.reorderTickets('proj', { boardId: 'b1', ticketIds: ['t1'] }),
  },
  {
    name: 'analytics',
    method: 'GET',
    path: '/projects/proj/analytics',
    invoke: (c) => c.projects.analytics('proj'),
  },
  {
    name: 'read ticket',
    method: 'GET',
    path: '/tickets/ticket',
    invoke: (c) => c.tickets.get('ticket'),
  },
  {
    name: 'update ticket',
    method: 'PATCH',
    path: '/tickets/ticket',
    invoke: (c) => c.tickets.update('ticket', { priority: 'high' }),
  },
  {
    name: 'delete ticket',
    method: 'DELETE',
    path: '/tickets/ticket',
    invoke: (c) => c.tickets.delete('ticket'),
  },
  {
    name: 'move ticket',
    method: 'POST',
    path: '/tickets/ticket/move',
    invoke: (c) => c.tickets.move('ticket', { boardId: 'b2' }),
  },
  {
    name: 'ticket comment',
    method: 'POST',
    path: '/tickets/ticket/comments',
    invoke: (c) => c.tickets.createComment('ticket', { bodyHtml: '<p>Hi</p>' }),
  },
  {
    name: 'list documents',
    method: 'GET',
    path: '/organizations/org/documents',
    invoke: (c) => c.organizations.listDocuments('org'),
  },
  {
    name: 'create document',
    method: 'POST',
    path: '/organizations/org/documents',
    invoke: (c) => c.organizations.createDocument('org', { title: 'Doc' }),
  },
  {
    name: 'read document',
    method: 'GET',
    path: '/documents/doc',
    invoke: (c) => c.documents.get('doc'),
  },
  {
    name: 'update document',
    method: 'PATCH',
    path: '/documents/doc',
    invoke: (c) => c.documents.update('doc', { title: 'Doc2' }),
  },
  {
    name: 'delete document',
    method: 'DELETE',
    path: '/documents/doc',
    invoke: (c) => c.documents.delete('doc'),
  },
  {
    name: 'document comment',
    method: 'POST',
    path: '/documents/doc/comments',
    invoke: (c) => c.documents.createComment('doc', { bodyHtml: '<p>Reviewed</p>' }),
  },
  {
    name: 'send notifications',
    method: 'POST',
    path: '/organizations/org/notifications',
    invoke: (c) =>
      c.organizations.sendNotifications('org', { userIds: ['u1'], title: 'A', body: 'B' }),
  },
  {
    name: 'list tags',
    method: 'GET',
    path: '/projects/proj/tags',
    invoke: (c) => c.projects.listTags('proj'),
  },
];

describe('all OpenAPI service methods', () => {
  for (const item of cases) {
    it(item.name, async () => {
      const r = recorder();
      const client = new Client({
        baseUrl: 'https://api.example.test',
        apiKey: 'secret',
        fetch: r.fetch,
      });

      await item.invoke(client);

      expect(r.calls).toHaveLength(1);
      expect(r.calls[0]?.init?.method ?? 'GET').toBe(item.method);

      const url = new URL(r.calls[0]?.url ?? 'https://invalid.test');
      expect(url.pathname).toBe(`/api/v1${item.path}`);
    });
  }
});
