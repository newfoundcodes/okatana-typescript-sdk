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

import type { CallOptions } from '../call-options.js';
import { callOptions } from '../call-options.js';
import type { HttpTransport } from '../http.js';
import {
  analytics,
  board,
  dataArray,
  dataObject,
  label,
  member,
  paginated,
  project,
  tag,
  ticket,
} from '../internal/hydrate.js';
import { wire } from '../internal/serialize.js';
import type { Paginated } from '../types/';
import type {
  Board,
  Project,
  ProjectAnalytics,
  ProjectLabel,
  ProjectMember,
  ProjectTag,
  Ticket,
} from '../types/';
import type {
  CreateBoardInput,
  CreateTicketInput,
  ListTicketsOptions,
  ReorderBoardsInput,
  ReorderTicketsInput,
  UpdateProjectInput,
} from '../types/';

const id = (value: string) => encodeURIComponent(value);

export class ProjectsApi {
  constructor(private readonly http: HttpTransport) {}

  async get(projectId: string, options?: CallOptions): Promise<Project> {
    return dataObject(
      await this.http.request({ path: `/projects/${id(projectId)}`, ...callOptions(options) }),
      project,
    );
  }

  async update(
    projectId: string,
    input: UpdateProjectInput,
    options?: CallOptions,
  ): Promise<Project> {
    return dataObject(
      await this.http.request({
        method: 'PATCH',
        path: `/projects/${id(projectId)}`,
        body: wire.updateProject(input),
        ...callOptions(options),
      }),
      project,
    );
  }

  async delete(projectId: string, options?: CallOptions): Promise<void> {
    await this.http.request({
      method: 'DELETE',
      path: `/projects/${id(projectId)}`,
      ...callOptions(options),
    });
  }

  async listMembers(projectId: string, options?: CallOptions): Promise<ProjectMember[]> {
    return dataArray(
      await this.http.request({
        path: `/projects/${id(projectId)}/members`,
        ...callOptions(options),
      }),
      member,
    );
  }

  async listLabels(projectId: string, options?: CallOptions): Promise<ProjectLabel[]> {
    return dataArray(
      await this.http.request({
        path: `/projects/${id(projectId)}/labels`,
        ...callOptions(options),
      }),
      label,
    );
  }

  async listTags(projectId: string, options?: CallOptions): Promise<ProjectTag[]> {
    return dataArray(
      await this.http.request({ path: `/projects/${id(projectId)}/tags`, ...callOptions(options) }),
      tag,
    );
  }

  async listBoards(projectId: string, options?: CallOptions): Promise<Board[]> {
    return dataArray(
      await this.http.request({
        path: `/projects/${id(projectId)}/boards`,
        ...callOptions(options),
      }),
      board,
    );
  }

  async createBoard(
    projectId: string,
    input: CreateBoardInput,
    options?: CallOptions,
  ): Promise<Board> {
    return dataObject(
      await this.http.request({
        method: 'POST',
        path: `/projects/${id(projectId)}/boards`,
        body: wire.createBoard(input),
        ...callOptions(options),
      }),
      board,
    );
  }

  async reorderBoards(
    projectId: string,
    input: ReorderBoardsInput,
    options?: CallOptions,
  ): Promise<Board[]> {
    return dataArray(
      await this.http.request({
        method: 'PUT',
        path: `/projects/${id(projectId)}/boards/reorder`,
        body: wire.reorderBoards(input),
        ...callOptions(options),
      }),
      board,
    );
  }

  async listTickets(
    projectId: string,
    input?: ListTicketsOptions,
    options?: CallOptions,
  ): Promise<Paginated<Ticket>> {
    const body = await this.http.request({
      path: `/projects/${id(projectId)}/tickets`,
      query: wire.listTickets(input),
      ...callOptions(options),
    });
    return paginated(body, ticket);
  }

  async *iterateTickets(
    projectId: string,
    input?: ListTicketsOptions,
    options?: CallOptions,
  ): AsyncGenerator<Ticket, void, void> {
    let page = await this.listTickets(projectId, input, options);

    while (true) {
      for (const item of page.items) {
        yield item;
      }

      if (!page.nextPageUrl) {
        return;
      }

      const body = await this.http.request({ path: page.nextPageUrl, ...callOptions(options) });
      page = paginated(body, ticket);
    }
  }

  async createTicket(
    projectId: string,
    input: CreateTicketInput,
    options?: CallOptions,
  ): Promise<Ticket> {
    return dataObject(
      await this.http.request({
        method: 'POST',
        path: `/projects/${id(projectId)}/tickets`,
        body: wire.createTicket(input),
        ...callOptions(options),
      }),
      ticket,
    );
  }

  async reorderTickets(
    projectId: string,
    input: ReorderTicketsInput,
    options?: CallOptions,
  ): Promise<void> {
    await this.http.request({
      method: 'PUT',
      path: `/projects/${id(projectId)}/tickets/reorder`,
      body: wire.reorderTickets(input),
      ...callOptions(options),
    });
  }

  async analytics(projectId: string, options?: CallOptions): Promise<ProjectAnalytics> {
    return dataObject(
      await this.http.request({
        path: `/projects/${id(projectId)}/analytics`,
        ...callOptions(options),
      }),
      analytics,
    );
  }
}
