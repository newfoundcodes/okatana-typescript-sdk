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

import { describe, expect, it } from 'vitest';
import { OkatanaClient, RequestValidationError } from '../src/index.js';
import { recorder } from './helpers.js';

describe('request serialization', () => {
  it('maps camelCase ticket fields to snake_case', async () => {
    const r = recorder();
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      fetch: r.fetch,
    });

    await client.projects.createTicket('project-1', {
      boardSlug: 'open',
      title: 'Ship release',
      descriptionHtml: '<p>Deploy</p>',
      priority: 'high',
      dueAt: new Date('2026-09-01T00:00:00Z'),
      assigneeIds: ['u1'],
      labelIds: ['l1'],
    });

    const body = JSON.parse(String(r.calls[0]?.init?.body));
    expect(body).toEqual({
      board_slug: 'open',
      title: 'Ship release',
      description_html: '<p>Deploy</p>',
      priority: 'high',
      due_at: '2026-09-01T00:00:00.000Z',
      assignee_ids: ['u1'],
      label_ids: ['l1'],
    });
  });

  it('preserves explicit null while omitting undefined', async () => {
    const r = recorder();
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      fetch: r.fetch,
    });
    await client.tickets.update('ticket-1', { descriptionHtml: null });

    const body = JSON.parse(String(r.calls[0]?.init?.body));
    expect(body).toEqual({ description_html: null });
  });

  it('serializes document tag filters as comma-separated names', async () => {
    const r = recorder();
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      fetch: r.fetch,
    });

    await client.organizations.listDocuments('org-1', {
      tags: ['runbook', 'production'],
      perPage: 25,
    });

    expect(r.calls[0]?.url).toContain('tags=runbook%2Cproduction');
    expect(r.calls[0]?.url).toContain('per_page=25');
  });

  it('validates OpenAPI field limits before sending', async () => {
    const r = recorder();
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      fetch: r.fetch,
    });

    await expect(client.projects.createBoard('p1', { name: 'x', wipLimit: 0 })).rejects.toThrow(
      RequestValidationError,
    );

    expect(r.calls).toHaveLength(0);
  });

  it('validates notification URL as an internal /app path', async () => {
    const r = recorder();
    const client = new OkatanaClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'secret',
      fetch: r.fetch,
    });

    await expect(
      client.organizations.sendNotifications('o1', {
        userIds: ['u1'],
        title: 'Test',
        body: 'Test',
        url: 'https://evil.example',
      }),
    ).rejects.toThrow(RequestValidationError);
  });
});
