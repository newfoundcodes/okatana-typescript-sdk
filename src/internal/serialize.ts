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

import { validate } from './validate.js';

import type {
  CreateBoardInput,
  CreateDocumentCommentInput,
  CreateDocumentInput,
  CreateProjectInput,
  CreateTicketCommentInput,
  CreateTicketInput,
  DeleteBoardInput,
  ListDocumentsOptions,
  ListTicketsOptions,
  MoveTicketInput,
  ReorderBoardsInput,
  ReorderTicketsInput,
  SendNotificationInput,
  UpdateBoardInput,
  UpdateDocumentInput,
  UpdateProjectInput,
  UpdateTicketInput,
} from '../types/';

function iso(value: string | Date | null | undefined): string | null | undefined {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function clean<T extends Record<string, unknown>>(input: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

export const wire = {
  createProject(input: CreateProjectInput) {
    validate.createProject(input);
    return clean({ name: input.name, key: input.key, description: input.description });
  },

  updateProject(input: UpdateProjectInput) {
    validate.updateProject(input);
    return clean({ name: input.name, description: input.description, archived: input.archived });
  },

  createBoard(input: CreateBoardInput) {
    validate.createBoard(input);
    return clean({
      name: input.name,
      color: input.color,
      wip_limit: input.wipLimit,
      is_done: input.isDone,
    });
  },

  updateBoard(input: UpdateBoardInput) {
    validate.updateBoard(input);
    return clean({
      name: input.name,
      color: input.color,
      wip_limit: input.wipLimit,
      is_done: input.isDone,
      is_hidden: input.isHidden,
    });
  },

  deleteBoard(input?: DeleteBoardInput) {
    return clean({ move_to_board_id: input?.moveToBoardId });
  },

  reorderBoards(input: ReorderBoardsInput) {
    validate.reorderBoards(input);
    return { board_ids: input.boardIds };
  },

  listTickets(input?: ListTicketsOptions) {
    validate.listTickets(input);
    return clean({ board_id: input?.boardId, q: input?.q, per_page: input?.perPage });
  },

  createTicket(input: CreateTicketInput) {
    validate.createTicket(input);
    return clean({
      board_id: input.boardId,
      board_slug: input.boardSlug,
      title: input.title,
      description_html: input.descriptionHtml,
      priority: input.priority,
      due_at: iso(input.dueAt),
      assignee_ids: input.assigneeIds,
      label_ids: input.labelIds,
    });
  },

  updateTicket(input: UpdateTicketInput) {
    validate.updateTicket(input);
    return clean({
      title: input.title,
      description_html: input.descriptionHtml,
      priority: input.priority,
      due_at: iso(input.dueAt),
      assignee_ids: input.assigneeIds,
      label_ids: input.labelIds,
      archived: input.archived,
    });
  },

  reorderTickets(input: ReorderTicketsInput) {
    validate.reorderTickets(input);
    return { board_id: input.boardId, ticket_ids: input.ticketIds };
  },

  moveTicket(input: MoveTicketInput) {
    validate.moveTicket(input);
    return clean({ board_id: input.boardId, position: input.position });
  },

  createTicketComment(input: CreateTicketCommentInput) {
    validate.ticketComment(input);
    return { body_html: input.bodyHtml };
  },

  listDocuments(input?: ListDocumentsOptions) {
    validate.listDocuments(input);
    return clean({
      project_id: input?.projectId,
      status: input?.status,
      q: input?.q,
      tags: input?.tags?.join(','),
      per_page: input?.perPage,
    });
  },

  createDocument(input: CreateDocumentInput) {
    validate.createDocument(input);
    return clean({
      project_id: input.projectId,
      title: input.title,
      caption: input.caption,
      content_html: input.contentHtml,
      status: input.status,
      editor_ids: input.editorIds,
      tag_names: input.tagNames,
    });
  },

  updateDocument(input: UpdateDocumentInput) {
    validate.updateDocument(input);
    return clean({
      project_id: input.projectId,
      title: input.title,
      caption: input.caption,
      content_html: input.contentHtml,
      status: input.status,
      archived: input.archived,
      editor_ids: input.editorIds,
      tag_names: input.tagNames,
    });
  },

  createDocumentComment(input: CreateDocumentCommentInput) {
    validate.documentComment(input);
    return { body_html: input.bodyHtml };
  },

  sendNotification(input: SendNotificationInput) {
    validate.notification(input);
    return clean({ user_ids: input.userIds, title: input.title, body: input.body, url: input.url });
  },
};
