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
import { dataObject, document, documentComment } from '../internal/hydrate.js';
import { wire } from '../internal/serialize.js';
import type { Document, DocumentComment } from '../types/';
import type { CreateDocumentCommentInput, UpdateDocumentInput } from '../types/';

const id = (value: string) => encodeURIComponent(value);

export class DocumentsApi {
  constructor(private readonly http: HttpTransport) {}

  async get(documentId: string, options?: CallOptions): Promise<Document> {
    return dataObject(
      await this.http.request({ path: `/documents/${id(documentId)}`, ...callOptions(options) }),
      document,
    );
  }

  async update(
    documentId: string,
    input: UpdateDocumentInput,
    options?: CallOptions,
  ): Promise<Document> {
    return dataObject(
      await this.http.request({
        method: 'PATCH',
        path: `/documents/${id(documentId)}`,
        body: wire.updateDocument(input),
        ...callOptions(options),
      }),
      document,
    );
  }

  async delete(documentId: string, options?: CallOptions): Promise<void> {
    await this.http.request({
      method: 'DELETE',
      path: `/documents/${id(documentId)}`,
      ...callOptions(options),
    });
  }

  async createComment(
    documentId: string,
    input: CreateDocumentCommentInput,
    options?: CallOptions,
  ): Promise<DocumentComment> {
    return dataObject(
      await this.http.request({
        method: 'POST',
        path: `/documents/${id(documentId)}/comments`,
        body: wire.createDocumentComment(input),
        ...callOptions(options),
      }),
      documentComment,
    );
  }
}
