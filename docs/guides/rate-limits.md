# Rate limits

The current Okatana guide documents a per-credential request limit and a default of 120 requests per minute unless the deployment changes it.

For safe reads, the SDK can retry HTTP 429. If `Retry-After` is present, it uses that delay. Otherwise it uses bounded exponential backoff with jitter.

For writes, the SDK does not retry by default even on 429 because the API does not provide idempotency keys. The caller should decide whether a write is safe to repeat.

## Workload design

- Avoid sharing one broad credential between unrelated high-volume integrations.
- Use pagination page sizes that reduce unnecessary calls.
- Cache slow-changing relationship IDs such as board IDs when your integration can refresh them safely.
- Do not run concurrent reorder operations against the same project workflow.
