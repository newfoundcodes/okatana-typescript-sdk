# Okatana TypeScript SDK

Okatana TypeScript SDK for the Okatana External API v1. Designed for server-to-server integrations, scheduled jobs, CI/CD automation, operational tooling, and application backends.

!!! warning "Explicit Okatana host required"
    The client requires an explicit API deployment URL. `https://okatana.newfoundcodes.com` is the documentation site, not a default API host.

## SDK features

Provides six service objects: organizations, projects, boards, tickets, documents, and notifications. Features include schema-based request validation, typed camelCase inputs and models, standard `fetch` transport, normalized bearer authentication, automatic snake_case wire serialization, pagination helpers, and status-specific exceptions.

Service methods map directly to routes, return raw models or paginated responses, and preserve unknown response fields.

## Typical client lifecycle

```ts
import { OkatanaClient } from '@newfoundcodes/okatana';

const client = new OkatanaClient({
  baseUrl: process.env.OKATANA_URL!,
  apiKey: process.env.OKATANA_API_KEY!,
});

const page = await client.projects.list(process.env.OKATANA_ORG!);
```

`baseUrl` normalizes to `/api/v1`. Origin and full API base are both valid:

```text
https://okatana.internal.example      -> https://okatana.internal.example/api/v1
https://okatana.internal.example/api/v1 -> unchanged
```

## Design principles

1. **Explicit deployment configuration.** Requires deployment URL before sending tokens.
2. **One method per endpoint.**
3. **Predictable transport.** Uses standard `fetch` semantics; accepts custom `fetch` implementations.
4. **Conservative writes.** Limits automatic retries to safe reads.
5. **Schema-aware.** Validates documented constraints; preserves unknown fields in responses.
6. **Raw requests.** `OkatanaClient.request()` supports unmapped v1 routes.

## Documentation

See [Installation](getting-started/installation.md), [Configuration](getting-started/configuration.md), and [Quickstart](getting-started/quickstart.md). For production integration behavior, read [Errors](guides/errors.md), [Retries and idempotency](guides/retries.md), and [Security](guides/security.md).
