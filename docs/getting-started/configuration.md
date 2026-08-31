# Configuration

`baseUrl` and `apiKey` are required.

```ts
const client = new OkatanaClient({
  baseUrl: 'https://okatana.internal.example',
  apiKey: 'oka_public.secret',
});
```

## URL normalization

The SDK accepts a deployment origin:

```text
https://okatana.internal.example
```

and normalizes it to:

```text
https://okatana.internal.example/api/v1
```

It also accepts a deployment subpath:

```text
https://apps.example.com/okatana
```

which becomes:

```text
https://apps.example.com/okatana/api/v1
```

If the supplied URL already ends in `/api/v1`, the SDK does not append it again.

There is no fallback host. An empty or invalid URL raises `ConfigurationError` before any request is made.

## Complete options

```ts
const client = new OkatanaClient({
  baseUrl: process.env.OKATANA_URL!,
  apiKey: process.env.OKATANA_API_KEY!,
  timeoutMs: 30_000,
  defaultHeaders: {
    'X-Integration-Name': 'release-automation',
  },
  retry: {
    maxRetries: 2,
    baseDelayMs: 250,
    maxDelayMs: 4_000,
    retryStatuses: [429, 500, 502, 503, 504],
    retryTransportErrors: true,
  },
  logger: console,
});
```

## Custom `fetch`

Use `fetch` injection for tracing, proxies, tests, or runtime-specific HTTP stacks.

```ts
const client = new OkatanaClient({
  baseUrl,
  apiKey,
  fetch: async (input, init) => {
    console.log(init?.method ?? 'GET', input);
    return fetch(input, init);
  },
});
```
