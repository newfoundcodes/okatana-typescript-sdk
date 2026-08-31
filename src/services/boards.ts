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
import { board, dataObject } from '../internal/hydrate.js';
import { wire } from '../internal/serialize.js';
import type { Board } from '../types/';
import type { DeleteBoardInput, UpdateBoardInput } from '../types/';

const id = (value: string) => encodeURIComponent(value);

export class BoardsApi {
  constructor(private readonly http: HttpTransport) {}

  async update(boardId: string, input: UpdateBoardInput, options?: CallOptions): Promise<Board> {
    return dataObject(
      await this.http.request({
        method: 'PATCH',
        path: `/boards/${id(boardId)}`,
        body: wire.updateBoard(input),
        ...callOptions(options),
      }),
      board,
    );
  }

  async delete(boardId: string, input?: DeleteBoardInput, options?: CallOptions): Promise<void> {
    const body = wire.deleteBoard(input);
    await this.http.request({
      method: 'DELETE',
      path: `/boards/${id(boardId)}`,
      ...(Object.keys(body).length ? { body } : {}),
      ...callOptions(options),
    });
  }
}
