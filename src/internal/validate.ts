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

import { RequestValidationError } from '../errors.js';
import type {
  CreateBoardInput,
  CreateDocumentCommentInput,
  CreateDocumentInput,
  CreateProjectInput,
  CreateTicketCommentInput,
  CreateTicketInput,
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

function fail(issues: string[]): void {
  if (issues.length) {
    throw new RequestValidationError(issues);
  }
}

function requiredString(issues: string[], name: string, value: string, max: number): void {
  if (value.length > max) {
    issues.push(`${name} must be at most ${max} characters.`);
  }
}

function optionalString(
  issues: string[],
  name: string,
  value: string | null | undefined,
  max: number,
): void {
  if (typeof value === 'string' && value.length > max) {
    issues.push(`${name} must be at most ${max} characters.`);
  }
}

function maxArray(issues: string[], name: string, value: unknown[] | undefined, max: number): void {
  if (value && value.length > max) {
    issues.push(`${name} must contain at most ${max} items.`);
  }
}

function validDate(issues: string[], name: string, value: string | Date | null | undefined): void {
  if (value == null) {
    return;
  }

  const time = value instanceof Date ? value.getTime() : Date.parse(value);
  if (Number.isNaN(time)) {
    issues.push(`${name} must be a valid date-time.`);
  }
}

export const validate = {
  createProject(input: CreateProjectInput) {
    const issues: string[] = [];

    requiredString(issues, 'name', input.name, 180);
    requiredString(issues, 'key', input.key, 12);

    optionalString(issues, 'description', input.description, 5000);
    fail(issues);
  },

  updateProject(input: UpdateProjectInput) {
    const issues: string[] = [];

    optionalString(issues, 'name', input.name, 180);
    optionalString(issues, 'description', input.description, 5000);

    fail(issues);
  },

  createBoard(input: CreateBoardInput) {
    const issues: string[] = [];

    requiredString(issues, 'name', input.name, 120);
    optionalString(issues, 'color', input.color, 32);

    if (
      input.wipLimit !== undefined &&
      input.wipLimit !== null &&
      (!Number.isInteger(input.wipLimit) || input.wipLimit < 1)
    ) {
      issues.push('wipLimit must be an integer greater than or equal to 1, or null.');
    }

    fail(issues);
  },

  updateBoard(input: UpdateBoardInput) {
    const issues: string[] = [];

    optionalString(issues, 'name', input.name, 120);
    optionalString(issues, 'color', input.color, 32);

    if (
      input.wipLimit !== undefined &&
      input.wipLimit !== null &&
      (!Number.isInteger(input.wipLimit) || input.wipLimit < 1)
    ) {
      issues.push('wipLimit must be an integer greater than or equal to 1, or null.');
    }

    fail(issues);
  },

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  reorderBoards(input: ReorderBoardsInput) {
    // The supplied OpenAPI marks board_ids as required but does not declare minItems.
  },

  listTickets(input?: ListTicketsOptions) {
    const issues: string[] = [];
    if (
      input?.perPage !== undefined &&
      (!Number.isInteger(input.perPage) || input.perPage < 1 || input.perPage > 200)
    ) {
      issues.push('perPage must be an integer from 1 to 200.');
    }

    fail(issues);
  },

  createTicket(input: CreateTicketInput) {
    const issues: string[] = [];

    requiredString(issues, 'title', input.title, 500);
    optionalString(issues, 'descriptionHtml', input.descriptionHtml, 200000);

    validDate(issues, 'dueAt', input.dueAt);
    fail(issues);
  },

  updateTicket(input: UpdateTicketInput) {
    const issues: string[] = [];

    optionalString(issues, 'title', input.title, 500);
    optionalString(issues, 'descriptionHtml', input.descriptionHtml, 200000);

    validDate(issues, 'dueAt', input.dueAt);
    fail(issues);
  },

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  reorderTickets(input: ReorderTicketsInput) {
    // board_id and ticket_ids are required by TypeScript. The OpenAPI declares no further limits.
  },

  moveTicket(input: MoveTicketInput) {
    const issues: string[] = [];
    if (input.position !== undefined && (!Number.isInteger(input.position) || input.position < 0)) {
      issues.push('position must be an integer greater than or equal to 0.');
    }

    fail(issues);
  },

  ticketComment(input: CreateTicketCommentInput) {
    const issues: string[] = [];

    requiredString(issues, 'bodyHtml', input.bodyHtml, 200000);
    fail(issues);
  },

  listDocuments(input?: ListDocumentsOptions) {
    const issues: string[] = [];
    if (
      input?.perPage !== undefined &&
      (!Number.isInteger(input.perPage) || input.perPage < 1 || input.perPage > 200)
    ) {
      issues.push('perPage must be an integer from 1 to 200.');
    }

    fail(issues);
  },

  createDocument(input: CreateDocumentInput) {
    const issues: string[] = [];

    requiredString(issues, 'title', input.title, 500);
    optionalString(issues, 'caption', input.caption, 2000);
    optionalString(issues, 'contentHtml', input.contentHtml, 1000000);

    maxArray(issues, 'editorIds', input.editorIds, 100);
    maxArray(issues, 'tagNames', input.tagNames, 20);

    for (const tag of input.tagNames ?? []) {
      optionalString(issues, 'tagNames[]', tag, 50);
    }

    fail(issues);
  },

  updateDocument(input: UpdateDocumentInput) {
    const issues: string[] = [];

    optionalString(issues, 'title', input.title, 500);
    optionalString(issues, 'caption', input.caption, 2000);
    optionalString(issues, 'contentHtml', input.contentHtml, 1000000);

    maxArray(issues, 'editorIds', input.editorIds, 100);
    maxArray(issues, 'tagNames', input.tagNames, 20);

    for (const tag of input.tagNames ?? []) {
      optionalString(issues, 'tagNames[]', tag, 50);
    }

    fail(issues);
  },

  documentComment(input: CreateDocumentCommentInput) {
    const issues: string[] = [];

    requiredString(issues, 'bodyHtml', input.bodyHtml, 200000);
    fail(issues);
  },

  notification(input: SendNotificationInput) {
    const issues: string[] = [];
    if (input.userIds.length < 1 || input.userIds.length > 100) {
      issues.push('userIds must contain 1 to 100 user IDs.');
    }

    requiredString(issues, 'title', input.title, 180);
    requiredString(issues, 'body', input.body, 2000);

    if (input.url !== undefined && input.url !== null && !input.url.startsWith('/app')) {
      issues.push('url must be an internal /app path.');
    }

    fail(issues);
  },
};
