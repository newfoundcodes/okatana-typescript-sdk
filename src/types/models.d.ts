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

import type { DocumentStatus, ModelBase, TicketPriority, UnknownRecord } from './common.js';

export interface Organization extends ModelBase {
  id: string;
  name?: string;
  slug?: string;
}

export interface Project extends ModelBase {
  id: string;
  organizationId: string;
  name: string;
  key: string;
  description: string | null;
  archivedAt: string | null;
}

export interface ProjectMember extends ModelBase {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface ProjectLabel extends ModelBase {
  id: string;
  name?: string;
  color?: string | null;
}

export interface ProjectTag extends ModelBase {
  id?: string;
  name: string;
  ticketCount?: number;
}

export interface Board extends ModelBase {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  position: number;
  color: string | null;
  wipLimit: number | null;
  isDone: boolean;
  isHidden: boolean;
}

export interface Ticket extends ModelBase {
  id: string;
  projectId: string;
  boardId: string;
  number: number;
  title: string;
  descriptionHtml: string | null;
  priority: TicketPriority;
  position: number;
  dueAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  apiCredentialId: string | null;
  archivedAt: string | null;
}

export interface DocumentTag extends ModelBase {
  id: string;
  name: string;
}

export interface Document extends ModelBase {
  id: string;
  organizationId: string;
  projectId: string | null;
  authorId: string | null;
  title: string;
  caption: string | null;
  contentHtml: string | null;
  status: DocumentStatus;
  apiCredentialId: string | null;
  publishedAt: string | null;
  archivedAt: string | null;
  tags: DocumentTag[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment extends ModelBase {
  id?: string;
  ticketId?: string;
  bodyHtml?: string;
  createdAt?: string;
}

export interface DocumentComment extends ModelBase {
  id?: string;
  documentId?: string;
  bodyHtml?: string;
  createdAt?: string;
}

export interface BoardAnalytics extends ModelBase {
  boardId?: string;
  boardName?: string;
  count?: number;
  done?: boolean;
}

export interface ProjectAnalytics extends ModelBase {
  total?: number;
  done?: number;
  open?: number;
  overdue?: number;
  completionPercentage?: number;
  byBoard?: BoardAnalytics[];
}

export interface NotificationBatchResult extends ModelBase {
  queued?: number;
  sent?: number;
  notificationIds?: string[];
}

export interface RawApiObject extends ModelBase {
  [key: string]: unknown;
  extra: UnknownRecord;
}
