# `OkatanaClient`

`OkatanaClient` is the package entry point.

```ts
import { OkatanaClient } from '@newfoundcodes/okatana';

const client = new OkatanaClient({
  baseUrl: 'https://okatana.example.com',
  apiKey: process.env.OKATANA_API_KEY!,
});
```

## Constructor

```ts
new OkatanaClient(options: OkatanaClientOptions)
```

Required options:

- `baseUrl`: absolute HTTP(S) URL for **your deployment**;
- `apiKey`: organization-scoped Okatana bearer credential.

Optional options:

- `timeoutMs`;
- custom `fetch`;
- `defaultHeaders`;
- retry policy;
- logger.

## Service properties

```ts
client.organizations
client.projects
client.boards
client.tickets
client.documents
```

These service objects reuse the same transport and configuration.

## `apiBaseUrl`

```ts
client.apiBaseUrl: string
```

Returns the normalized URL ending in `/api/v1`.

```ts
const client = new OkatanaClient({
  baseUrl: 'https://example.com/okatana',
  apiKey,
});

console.log(client.apiBaseUrl);
// https://example.com/okatana/api/v1
```

## `request()`

```ts
request<T = unknown>(options: RequestOptions): Promise<T>
```

Low-level escape hatch for compatible v1 extensions.

```ts
const body = await client.request<{ data: unknown }>({
  method: 'GET',
  path: '/extension/status',
  query: { detail: 1 },
});
```

Relative paths resolve under the configured API base. Absolute URLs are accepted only when they remain on the configured origin and within the configured API base path. This rule is mainly used for paginator links.

## `CallOptions`

Every typed service method accepts optional per-call settings:

```ts
interface CallOptions {
  signal?: AbortSignal;
  retries?: number;
  headers?: Record<string, string>;
}
```

Example:

```ts
await client.projects.get(projectId, {
  signal: request.signal,
  headers: { 'X-Correlation-ID': correlationId },
});
```

The SDK always sets its own `Authorization` and `Accept` headers after custom headers are applied. A caller cannot replace the bearer credential through `CallOptions`.

## Retry override warning

`retries` can explicitly enable retries for writes. This is intentionally opt-in because the current Okatana API does not expose idempotency keys. Use write retries only when the workflow can reconcile ambiguous success.
