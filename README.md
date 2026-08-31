<div align="center">
  <img src="https://raw.githubusercontent.com/newfoundcodes/okatana/refs/heads/main/public/logo.png" width="128" />
  <h1>Okatana TypeScript SDK</h1>
  <p>
    <a href="https://github.com/newfoundcodes/okatana-typescript-sdk/actions"><img src="https://github.com/newfoundcodes/okatana-typescript-sdk/actions/workflows/ci.yml/badge.svg" alt="Build Status"></a>
  </p>
</div>

Type-safe TypeScript SDK for the Okatana External API v1. Provides typed camelCase inputs and models, automatic snake_case wire serialization, explicit exception mapping, safe read retries, custom fetch support, and Material for MkDocs documentation.

## API URL configuration

Every client must receive the URL of the user's own Okatana deployment:

```ts
import { OkatanaClient } from '@newfoundcodes/okatana';

const client = new OkatanaClient({
  baseUrl: 'https://project-management.example.com',
  apiKey: 'oka_public.secret',
});
```

The client accepts either a deployment origin (`https://project-management.example.com`) or a full v1 base (`https://project-management.example.com/api/v1`). Origin URLs append `/api/v1` automatically.

## Quick Start

Install the package via npm:

```bash
npm install @newfoundcodes/okatana
```

Then, initialize the client and make your first request:

```ts
import { OkatanaClient } from '@newfoundcodes/okatana';

const client = new OkatanaClient({
  baseUrl: process.env.OKATANA_URL!,
  apiKey: process.env.OKATANA_API_KEY!,
});

const organization = await client.organizations.get(process.env.OKATANA_ORG!);
console.log(organization);
```

## Typed request example

```ts
const ticket = await client.projects.createTicket(projectId, {
  title: 'Validate production deployment',
  boardSlug: 'open',
  descriptionHtml: '<p>Run deployment checks.</p>',
  priority: 'high',
  assigneeIds: [operatorId],
  labelIds: [releaseLabelId],
});
```

Explicit `null` values are preserved in PATCH operations:

```ts
await client.tickets.update(ticketId, {
  descriptionHtml: null, // send JSON null
  archived: false,
});
```

## API services

- `organizations` — read organization.
- `projects` — list/create/read/update/delete projects; members; labels; tags; analytics.
- `boards` — list/create/update/reorder/delete boards.
- `tickets` — list/create/reorder/read/update/delete/move/comment tickets.
- `documents` — list/create/read/update/delete/comment documents.
- `notifications` — send organization notifications.

## Response helpers

Collections return standard paginated structures:

```ts
const page = await client.tickets.list(projectId);
console.log(page.data); // Array of tickets
console.log(page.meta); // Laravel paginator metadata
```

You can also use async iterators for automatic pagination:

```ts
for await (const ticket of client.tickets.listIterable(projectId)) {
  console.log(ticket.id);
}
```

Models retain unknown fields in the `extra` property to preserve unknown fields.

## Errors

Common Okatana statuses map to specific exceptions:

```ts
import { ValidationException, RateLimitException } from '@newfoundcodes/okatana';

try {
  await client.projects.createTicket(projectId, { title: 'Deploy' });
} catch (e) {
  if (e instanceof ValidationException) {
    console.error(e.errors);
  } else if (e instanceof RateLimitException) {
    console.error(e.retryAfterSeconds);
  }
}
```

## Retry behavior

The default policy retries safe read methods (`GET`, `HEAD`) on transport failures and transient statuses. Write requests are not retried automatically as the Okatana API lacks idempotency keys.

```ts
import { OkatanaClient, RetryPolicy } from '@newfoundcodes/okatana';

const client = new OkatanaClient({
  baseUrl: process.env.OKATANA_URL!,
  apiKey: process.env.OKATANA_API_KEY!,
  retryPolicy: new RetryPolicy({ maxAttempts: 1 }),
});
```

## Custom fetch client

```ts
const client = new OkatanaClient({
  baseUrl: process.env.OKATANA_URL!,
  apiKey: process.env.OKATANA_API_KEY!,
  fetch: customFetchFunction,
});
```

Configure transport-specific timeouts or default headers directly via the configuration object.

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Build the documentation:

```bash
python -m pip install -r requirements.txt
npm run docs:build
```

See `docs/` for the complete manual and `examples/` for executable scenarios.
