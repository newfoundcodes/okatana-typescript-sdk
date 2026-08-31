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

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type UnknownRecord = Record<string, unknown>;

export interface ModelBase {
  /** Unknown fields returned by the server. Kept for forward compatibility. */
  extra: UnknownRecord;
}

export type TicketPriority = 'lowest' | 'low' | 'normal' | 'high' | 'highest' | 'critical';

export type DocumentStatus = 'draft' | 'published';

export type OkatanaScope =
  | '*'
  | 'organization:read'
  | 'projects:read'
  | 'projects:write'
  | 'boards:read'
  | 'boards:write'
  | 'tickets:read'
  | 'tickets:write'
  | 'comments:write'
  | 'analytics:read'
  | 'documents:read'
  | 'documents:write'
  | 'document_comments:write'
  | 'notifications:write';

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Paginated<T> {
  items: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
  firstPageUrl: string | null;
  lastPageUrl: string | null;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
  links: PaginationLink[];
  extra: UnknownRecord;
}
