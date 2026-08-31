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

import type { OkatanaClientOptions } from './config.js';
import { resolveClientOptions } from './config.js';
import { HttpTransport, type RequestOptions } from './http.js';
import { BoardsApi } from './services/boards.js';
import { DocumentsApi } from './services/documents.js';
import { OrganizationsApi } from './services/organizations.js';
import { ProjectsApi } from './services/projects.js';
import { TicketsApi } from './services/tickets.js';

export class OkatanaClient {
  readonly organizations: OrganizationsApi;
  readonly projects: ProjectsApi;
  readonly boards: BoardsApi;
  readonly tickets: TicketsApi;
  readonly documents: DocumentsApi;

  private readonly http: HttpTransport;

  constructor(options: OkatanaClientOptions) {
    this.http = new HttpTransport(resolveClientOptions(options));
    this.organizations = new OrganizationsApi(this.http);
    this.projects = new ProjectsApi(this.http);
    this.boards = new BoardsApi(this.http);
    this.tickets = new TicketsApi(this.http);
    this.documents = new DocumentsApi(this.http);
  }

  /** Final normalized API base URL, always ending in /api/v1. */
  get apiBaseUrl(): string {
    return this.http.apiBaseUrl;
  }

  /**
   * Low-level escape hatch for endpoints or fields added after this SDK release.
   * Relative paths are resolved under the configured /api/v1 base.
   */
  request<T = unknown>(options: RequestOptions): Promise<T> {
    return this.http.request<T>(options);
  }
}
