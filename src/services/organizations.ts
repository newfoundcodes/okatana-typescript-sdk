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
  dataArray,
  dataObject,
  document,
  notificationResult,
  organization,
  paginated,
  project,
} from '../internal/hydrate.js';
import { wire } from '../internal/serialize.js';
import type { Paginated } from '../types/';
import type { Document, NotificationBatchResult, Organization, Project } from '../types/';
import type {
  CreateDocumentInput,
  CreateProjectInput,
  ListDocumentsOptions,
  SendNotificationInput,
} from '../types/';

const id = (value: string) => encodeURIComponent(value);

export class OrganizationsApi {
  constructor(private readonly http: HttpTransport) {}

  async get(organizationId: string, options?: CallOptions): Promise<Organization> {
    const body = await this.http.request({
      path: `/organizations/${id(organizationId)}`,
      ...callOptions(options),
    });
    return dataObject(body, organization);
  }

  async listProjects(organizationId: string, options?: CallOptions): Promise<Project[]> {
    const body = await this.http.request({
      path: `/organizations/${id(organizationId)}/projects`,
      ...callOptions(options),
    });
    return dataArray(body, project);
  }

  async createProject(
    organizationId: string,
    input: CreateProjectInput,
    options?: CallOptions,
  ): Promise<Project> {
    const body = await this.http.request({
      method: 'POST',
      path: `/organizations/${id(organizationId)}/projects`,
      body: wire.createProject(input),
      ...callOptions(options),
    });
    return dataObject(body, project);
  }

  async listDocuments(
    organizationId: string,
    input?: ListDocumentsOptions,
    options?: CallOptions,
  ): Promise<Paginated<Document>> {
    const body = await this.http.request({
      path: `/organizations/${id(organizationId)}/documents`,
      query: wire.listDocuments(input),
      ...callOptions(options),
    });
    return paginated(body, document);
  }

  async *iterateDocuments(
    organizationId: string,
    input?: ListDocumentsOptions,
    options?: CallOptions,
  ): AsyncGenerator<Document, void, void> {
    let page = await this.listDocuments(organizationId, input, options);

    while (true) {
      for (const item of page.items) {
        yield item;
      }

      if (!page.nextPageUrl) {
        return;
      }

      const body = await this.http.request({ path: page.nextPageUrl, ...callOptions(options) });
      page = paginated(body, document);
    }
  }

  async createDocument(
    organizationId: string,
    input: CreateDocumentInput,
    options?: CallOptions,
  ): Promise<Document> {
    const body = await this.http.request({
      method: 'POST',
      path: `/organizations/${id(organizationId)}/documents`,
      body: wire.createDocument(input),
      ...callOptions(options),
    });

    return dataObject(body, document);
  }

  async sendNotifications(
    organizationId: string,
    input: SendNotificationInput,
    options?: CallOptions,
  ): Promise<NotificationBatchResult> {
    const body = await this.http.request({
      method: 'POST',
      path: `/organizations/${id(organizationId)}/notifications`,
      body: wire.sendNotification(input),
      ...callOptions(options),
    });

    return dataObject(body, notificationResult);
  }
}
