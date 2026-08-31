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

import type { DocumentStatus, TicketPriority } from './common.js';

export interface CreateProjectInput {
  name: string;
  key: string;
  description?: string | null;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  archived?: boolean;
}

export interface CreateBoardInput {
  name: string;
  color?: string | null;
  wipLimit?: number | null;
  isDone?: boolean;
}

export interface UpdateBoardInput {
  name?: string;
  color?: string | null;
  wipLimit?: number | null;
  isDone?: boolean;
  isHidden?: boolean;
}

export interface DeleteBoardInput {
  moveToBoardId?: string;
}

export interface ReorderBoardsInput {
  boardIds: string[];
}

export interface ListTicketsOptions {
  boardId?: string;
  q?: string;
  perPage?: number;
}

export interface CreateTicketInput {
  boardId?: string;
  boardSlug?: string;
  title: string;
  descriptionHtml?: string | null;
  priority?: TicketPriority;
  dueAt?: string | Date | null;
  assigneeIds?: string[];
  labelIds?: string[];
}

export interface UpdateTicketInput {
  title?: string;
  descriptionHtml?: string | null;
  priority?: TicketPriority;
  dueAt?: string | Date | null;
  assigneeIds?: string[];
  labelIds?: string[];
  archived?: boolean;
}

export interface ReorderTicketsInput {
  boardId: string;
  ticketIds: string[];
}

export interface MoveTicketInput {
  boardId: string;
  position?: number;
}

export interface CreateTicketCommentInput {
  bodyHtml: string;
}

export interface ListDocumentsOptions {
  projectId?: string;
  status?: DocumentStatus;
  q?: string;

  /** Tag names. The SDK serializes this array as the API's comma-separated tags query. */
  tags?: string[];
  perPage?: number;
}

export interface CreateDocumentInput {
  projectId?: string | null;
  title: string;
  caption?: string | null;
  contentHtml?: string | null;
  status?: DocumentStatus;
  editorIds?: string[];
  tagNames?: string[];
}

export interface UpdateDocumentInput {
  projectId?: string | null;
  title?: string;
  caption?: string | null;
  contentHtml?: string | null;
  status?: DocumentStatus;
  archived?: boolean;
  editorIds?: string[];
  tagNames?: string[];
}

export interface CreateDocumentCommentInput {
  bodyHtml: string;
}

export interface SendNotificationInput {
  userIds: string[];
  title: string;
  body: string;
  url?: string | null;
}
