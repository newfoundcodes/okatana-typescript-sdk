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
import { dataObject, ticket, ticketComment } from '../internal/hydrate.js';
import { wire } from '../internal/serialize.js';
import type { Ticket, TicketComment } from '../types/';
import type { CreateTicketCommentInput, MoveTicketInput, UpdateTicketInput } from '../types/';

const id = (value: string) => encodeURIComponent(value);

export class TicketsApi {
  constructor(private readonly http: HttpTransport) {}

  async get(ticketId: string, options?: CallOptions): Promise<Ticket> {
    return dataObject(
      await this.http.request({ path: `/tickets/${id(ticketId)}`, ...callOptions(options) }),
      ticket,
    );
  }

  async update(ticketId: string, input: UpdateTicketInput, options?: CallOptions): Promise<Ticket> {
    return dataObject(
      await this.http.request({
        method: 'PATCH',
        path: `/tickets/${id(ticketId)}`,
        body: wire.updateTicket(input),
        ...callOptions(options),
      }),
      ticket,
    );
  }

  async delete(ticketId: string, options?: CallOptions): Promise<void> {
    await this.http.request({
      method: 'DELETE',
      path: `/tickets/${id(ticketId)}`,
      ...callOptions(options),
    });
  }

  async move(ticketId: string, input: MoveTicketInput, options?: CallOptions): Promise<Ticket> {
    return dataObject(
      await this.http.request({
        method: 'POST',
        path: `/tickets/${id(ticketId)}/move`,
        body: wire.moveTicket(input),
        ...callOptions(options),
      }),
      ticket,
    );
  }

  async createComment(
    ticketId: string,
    input: CreateTicketCommentInput,
    options?: CallOptions,
  ): Promise<TicketComment> {
    return dataObject(
      await this.http.request({
        method: 'POST',
        path: `/tickets/${id(ticketId)}/comments`,
        body: wire.createTicketComment(input),
        ...callOptions(options),
      }),
      ticketComment,
    );
  }
}
