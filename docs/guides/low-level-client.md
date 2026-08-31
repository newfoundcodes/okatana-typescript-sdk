# Low-level client

Use `client.request()` when a deployment exposes a compatible v1 extension that the current SDK version does not model yet.

```ts
const result = await client.request<{ data: unknown }>({
  method: 'GET',
  path: '/custom-extension',
  query: { limit: 25 },
});
```

Relative paths always resolve below the configured API base. This escape hatch uses the same authentication, timeout, error mapping, and retry engine as typed services.

Prefer typed service methods for standard OpenAPI operations.
