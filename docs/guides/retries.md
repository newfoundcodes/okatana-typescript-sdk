# Retries and idempotency

Okatana currently has no idempotency key. A write that succeeded on the server but timed out at the client can be duplicated if the caller blindly retries it.

The SDK therefore uses this policy:

- GET: retry transient network errors and selected transient statuses by default.
- POST, PUT, PATCH, DELETE: zero retries by default.
- `429`: safe reads honor `Retry-After` when possible.
- backoff is bounded and includes jitter.

## Explicit write retry

You can override retries per call, but do this only when your integration has its own reconciliation strategy.

```ts
await client.organizations.createProject(orgId, input, { retries: 1 });
```

For create operations, prefer a client-chosen stable marker or another reconciliation key. The real-world examples show this pattern for external ticket synchronization.
