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

import type {
  Paginated,
  PaginationLink,
  TicketPriority,
  DocumentStatus,
  UnknownRecord,
} from '../types/';
import type {
  Board,
  BoardAnalytics,
  Document,
  DocumentComment,
  DocumentTag,
  NotificationBatchResult,
  Organization,
  Project,
  ProjectAnalytics,
  ProjectLabel,
  ProjectMember,
  ProjectTag,
  Ticket,
  TicketComment,
} from '../types/';
import {
  extraFields,
  getBoolean,
  getNullableString,
  getNumber,
  getString,
  isRecord,
  unwrapData,
} from './json.js';

function record(value: unknown): UnknownRecord {
  return isRecord(value) ? value : {};
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function organization(value: unknown): Organization {
  const r = record(value);
  return {
    id: getString(r, 'id'),
    ...(typeof r.name === 'string' ? { name: r.name } : {}),
    ...(typeof r.slug === 'string' ? { slug: r.slug } : {}),
    extra: extraFields(r, ['id', 'name', 'slug']),
  };
}

export function project(value: unknown): Project {
  const r = record(value);
  return {
    id: getString(r, 'id'),
    organizationId: getString(r, 'organization_id'),
    name: getString(r, 'name'),
    key: getString(r, 'key'),
    description: getNullableString(r, 'description'),
    archivedAt: getNullableString(r, 'archived_at'),
    extra: extraFields(r, ['id', 'organization_id', 'name', 'key', 'description', 'archived_at']),
  };
}

export function member(value: unknown): ProjectMember {
  const r = record(value);
  return {
    id: getString(r, 'id'),
    ...(typeof r.name === 'string' ? { name: r.name } : {}),
    ...(typeof r.email === 'string' ? { email: r.email } : {}),
    ...(typeof r.role === 'string' ? { role: r.role } : {}),
    extra: extraFields(r, ['id', 'name', 'email', 'role']),
  };
}

export function label(value: unknown): ProjectLabel {
  const r = record(value);
  return {
    id: getString(r, 'id'),
    ...(typeof r.name === 'string' ? { name: r.name } : {}),
    ...(typeof r.color === 'string' || r.color === null ? { color: r.color as string | null } : {}),
    extra: extraFields(r, ['id', 'name', 'color']),
  };
}

export function tag(value: unknown): ProjectTag {
  const r = record(value);
  const count =
    typeof r.ticket_count === 'number'
      ? r.ticket_count
      : typeof r.count === 'number'
        ? r.count
        : undefined;

  return {
    ...(typeof r.id === 'string' ? { id: r.id } : {}),
    name: getString(r, 'name'),
    ...(count !== undefined ? { ticketCount: count } : {}),
    extra: extraFields(r, ['id', 'name', 'ticket_count', 'count']),
  };
}

export function board(value: unknown): Board {
  const r = record(value);
  return {
    id: getString(r, 'id'),
    projectId: getString(r, 'project_id'),
    name: getString(r, 'name'),
    slug: getString(r, 'slug'),
    position: getNumber(r, 'position'),
    color: getNullableString(r, 'color'),
    wipLimit: typeof r.wip_limit === 'number' ? r.wip_limit : null,
    isDone: getBoolean(r, 'is_done'),
    isHidden: getBoolean(r, 'is_hidden'),
    extra: extraFields(r, [
      'id',
      'project_id',
      'name',
      'slug',
      'position',
      'color',
      'wip_limit',
      'is_done',
      'is_hidden',
    ]),
  };
}

export function ticket(value: unknown): Ticket {
  const r = record(value);
  return {
    id: getString(r, 'id'),
    projectId: getString(r, 'project_id'),
    boardId: getString(r, 'board_id'),
    number: getNumber(r, 'number'),
    title: getString(r, 'title'),
    descriptionHtml: getNullableString(r, 'description_html'),
    priority: (getString(r, 'priority', 'normal') || 'normal') as TicketPriority,
    position: getNumber(r, 'position'),
    dueAt: getNullableString(r, 'due_at'),
    startedAt: getNullableString(r, 'started_at'),
    completedAt: getNullableString(r, 'completed_at'),
    apiCredentialId: getNullableString(r, 'api_credential_id'),
    archivedAt: getNullableString(r, 'archived_at'),
    extra: extraFields(r, [
      'id',
      'project_id',
      'board_id',
      'number',
      'title',
      'description_html',
      'priority',
      'position',
      'due_at',
      'started_at',
      'completed_at',
      'api_credential_id',
      'archived_at',
    ]),
  };
}

function documentTag(value: unknown): DocumentTag {
  const r = record(value);
  return {
    id: getString(r, 'id'),
    name: getString(r, 'name'),
    extra: extraFields(r, ['id', 'name']),
  };
}

export function document(value: unknown): Document {
  const r = record(value);
  return {
    id: getString(r, 'id'),
    organizationId: getString(r, 'organization_id'),
    projectId: getNullableString(r, 'project_id'),
    authorId: getNullableString(r, 'author_id'),
    title: getString(r, 'title'),
    caption: getNullableString(r, 'caption'),
    contentHtml: getNullableString(r, 'content_html'),
    status: (getString(r, 'status', 'draft') || 'draft') as DocumentStatus,
    apiCredentialId: getNullableString(r, 'api_credential_id'),
    publishedAt: getNullableString(r, 'published_at'),
    archivedAt: getNullableString(r, 'archived_at'),
    tags: array(r.tags).map(documentTag),
    createdAt: getString(r, 'created_at'),
    updatedAt: getString(r, 'updated_at'),
    extra: extraFields(r, [
      'id',
      'organization_id',
      'project_id',
      'author_id',
      'title',
      'caption',
      'content_html',
      'status',
      'api_credential_id',
      'published_at',
      'archived_at',
      'tags',
      'created_at',
      'updated_at',
    ]),
  };
}

export function ticketComment(value: unknown): TicketComment {
  const r = record(value);
  return {
    ...(typeof r.id === 'string' ? { id: r.id } : {}),
    ...(typeof r.ticket_id === 'string' ? { ticketId: r.ticket_id } : {}),
    ...(typeof r.body_html === 'string' ? { bodyHtml: r.body_html } : {}),
    ...(typeof r.created_at === 'string' ? { createdAt: r.created_at } : {}),
    extra: extraFields(r, ['id', 'ticket_id', 'body_html', 'created_at']),
  };
}

export function documentComment(value: unknown): DocumentComment {
  const r = record(value);
  return {
    ...(typeof r.id === 'string' ? { id: r.id } : {}),
    ...(typeof r.document_id === 'string' ? { documentId: r.document_id } : {}),
    ...(typeof r.body_html === 'string' ? { bodyHtml: r.body_html } : {}),
    ...(typeof r.created_at === 'string' ? { createdAt: r.created_at } : {}),
    extra: extraFields(r, ['id', 'document_id', 'body_html', 'created_at']),
  };
}

function boardAnalytics(value: unknown): BoardAnalytics {
  const r = record(value);
  return {
    ...(typeof r.board_id === 'string' ? { boardId: r.board_id } : {}),
    ...(typeof r.board_name === 'string' ? { boardName: r.board_name } : {}),
    ...(typeof r.count === 'number' ? { count: r.count } : {}),
    ...(typeof r.done === 'boolean' ? { done: r.done } : {}),
    extra: extraFields(r, ['board_id', 'board_name', 'count', 'done']),
  };
}

export function analytics(value: unknown): ProjectAnalytics {
  const r = record(value);
  const byBoardSource = Array.isArray(r.by_board)
    ? r.by_board
    : Array.isArray(r.boards)
      ? r.boards
      : undefined;
  return {
    ...(typeof r.total === 'number' ? { total: r.total } : {}),
    ...(typeof r.done === 'number' ? { done: r.done } : {}),
    ...(typeof r.open === 'number' ? { open: r.open } : {}),
    ...(typeof r.overdue === 'number' ? { overdue: r.overdue } : {}),
    ...(typeof r.completion_percentage === 'number'
      ? { completionPercentage: r.completion_percentage }
      : {}),
    ...(byBoardSource ? { byBoard: byBoardSource.map(boardAnalytics) } : {}),
    extra: extraFields(r, [
      'total',
      'done',
      'open',
      'overdue',
      'completion_percentage',
      'by_board',
      'boards',
    ]),
  };
}

export function notificationResult(value: unknown): NotificationBatchResult {
  const r = record(value);
  return {
    ...(typeof r.queued === 'number' ? { queued: r.queued } : {}),
    ...(typeof r.sent === 'number' ? { sent: r.sent } : {}),
    ...(Array.isArray(r.notification_ids) && r.notification_ids.every((v) => typeof v === 'string')
      ? { notificationIds: r.notification_ids as string[] }
      : {}),
    extra: extraFields(r, ['queued', 'sent', 'notification_ids']),
  };
}

function link(value: unknown): PaginationLink {
  const r = record(value);
  return {
    url: typeof r.url === 'string' ? r.url : null,
    label: getString(r, 'label'),
    active: getBoolean(r, 'active'),
  };
}

export function paginated<T>(body: unknown, map: (value: unknown) => T): Paginated<T> {
  const outer = record(body);
  const paginator = record(unwrapData(outer));
  const consumed = [
    'data',
    'current_page',
    'last_page',
    'per_page',
    'total',
    'from',
    'to',
    'first_page_url',
    'last_page_url',
    'next_page_url',
    'prev_page_url',
    'links',
  ] as const;

  return {
    items: array(paginator.data).map(map),
    currentPage: getNumber(paginator, 'current_page', 1),
    lastPage: getNumber(paginator, 'last_page', 1),
    perPage: getNumber(paginator, 'per_page', array(paginator.data).length),
    total: getNumber(paginator, 'total', array(paginator.data).length),
    from: typeof paginator.from === 'number' ? paginator.from : null,
    to: typeof paginator.to === 'number' ? paginator.to : null,
    firstPageUrl: getNullableString(paginator, 'first_page_url'),
    lastPageUrl: getNullableString(paginator, 'last_page_url'),
    nextPageUrl: getNullableString(paginator, 'next_page_url'),
    previousPageUrl: getNullableString(paginator, 'prev_page_url'),
    links: array(paginator.links).map(link),
    extra: extraFields(paginator, consumed),
  };
}

export function dataArray<T>(body: unknown, map: (value: unknown) => T): T[] {
  return array(unwrapData(body)).map(map);
}

export function dataObject<T>(body: unknown, map: (value: unknown) => T): T {
  return map(unwrapData(body));
}
