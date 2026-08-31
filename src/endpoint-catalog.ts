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

import type { OkatanaScope } from './types/common.js';

export interface EndpointDefinition {
  service: 'organizations' | 'projects' | 'boards' | 'tickets' | 'documents';
  operation: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  scope: OkatanaScope;
}

export const endpointCatalog = [
  {
    service: 'organizations',
    operation: 'get',
    method: 'GET',
    path: '/organizations/{organization}',
    scope: 'organization:read',
  },
  {
    service: 'organizations',
    operation: 'listProjects',
    method: 'GET',
    path: '/organizations/{organization}/projects',
    scope: 'projects:read',
  },
  {
    service: 'organizations',
    operation: 'createProject',
    method: 'POST',
    path: '/organizations/{organization}/projects',
    scope: 'projects:write',
  },
  {
    service: 'projects',
    operation: 'get',
    method: 'GET',
    path: '/projects/{project}',
    scope: 'projects:read',
  },
  {
    service: 'projects',
    operation: 'update',
    method: 'PATCH',
    path: '/projects/{project}',
    scope: 'projects:write',
  },
  {
    service: 'projects',
    operation: 'delete',
    method: 'DELETE',
    path: '/projects/{project}',
    scope: 'projects:write',
  },
  {
    service: 'projects',
    operation: 'listMembers',
    method: 'GET',
    path: '/projects/{project}/members',
    scope: 'projects:read',
  },
  {
    service: 'projects',
    operation: 'listLabels',
    method: 'GET',
    path: '/projects/{project}/labels',
    scope: 'projects:read',
  },
  {
    service: 'projects',
    operation: 'listBoards',
    method: 'GET',
    path: '/projects/{project}/boards',
    scope: 'boards:read',
  },
  {
    service: 'projects',
    operation: 'createBoard',
    method: 'POST',
    path: '/projects/{project}/boards',
    scope: 'boards:write',
  },
  {
    service: 'projects',
    operation: 'reorderBoards',
    method: 'PUT',
    path: '/projects/{project}/boards/reorder',
    scope: 'boards:write',
  },
  {
    service: 'boards',
    operation: 'update',
    method: 'PATCH',
    path: '/boards/{board}',
    scope: 'boards:write',
  },
  {
    service: 'boards',
    operation: 'delete',
    method: 'DELETE',
    path: '/boards/{board}',
    scope: 'boards:write',
  },
  {
    service: 'projects',
    operation: 'listTickets',
    method: 'GET',
    path: '/projects/{project}/tickets',
    scope: 'tickets:read',
  },
  {
    service: 'projects',
    operation: 'createTicket',
    method: 'POST',
    path: '/projects/{project}/tickets',
    scope: 'tickets:write',
  },
  {
    service: 'projects',
    operation: 'reorderTickets',
    method: 'PUT',
    path: '/projects/{project}/tickets/reorder',
    scope: 'tickets:write',
  },
  {
    service: 'projects',
    operation: 'analytics',
    method: 'GET',
    path: '/projects/{project}/analytics',
    scope: 'analytics:read',
  },
  {
    service: 'tickets',
    operation: 'get',
    method: 'GET',
    path: '/tickets/{ticket}',
    scope: 'tickets:read',
  },
  {
    service: 'tickets',
    operation: 'update',
    method: 'PATCH',
    path: '/tickets/{ticket}',
    scope: 'tickets:write',
  },
  {
    service: 'tickets',
    operation: 'delete',
    method: 'DELETE',
    path: '/tickets/{ticket}',
    scope: 'tickets:write',
  },
  {
    service: 'tickets',
    operation: 'move',
    method: 'POST',
    path: '/tickets/{ticket}/move',
    scope: 'tickets:write',
  },
  {
    service: 'tickets',
    operation: 'createComment',
    method: 'POST',
    path: '/tickets/{ticket}/comments',
    scope: 'comments:write',
  },
  {
    service: 'organizations',
    operation: 'listDocuments',
    method: 'GET',
    path: '/organizations/{organization}/documents',
    scope: 'documents:read',
  },
  {
    service: 'organizations',
    operation: 'createDocument',
    method: 'POST',
    path: '/organizations/{organization}/documents',
    scope: 'documents:write',
  },
  {
    service: 'documents',
    operation: 'get',
    method: 'GET',
    path: '/documents/{document}',
    scope: 'documents:read',
  },
  {
    service: 'documents',
    operation: 'update',
    method: 'PATCH',
    path: '/documents/{document}',
    scope: 'documents:write',
  },
  {
    service: 'documents',
    operation: 'delete',
    method: 'DELETE',
    path: '/documents/{document}',
    scope: 'documents:write',
  },
  {
    service: 'documents',
    operation: 'createComment',
    method: 'POST',
    path: '/documents/{document}/comments',
    scope: 'document_comments:write',
  },
  {
    service: 'organizations',
    operation: 'sendNotifications',
    method: 'POST',
    path: '/organizations/{organization}/notifications',
    scope: 'notifications:write',
  },
  {
    service: 'projects',
    operation: 'listTags',
    method: 'GET',
    path: '/projects/{project}/tags',
    scope: 'projects:read',
  },
] as const satisfies readonly EndpointDefinition[];
