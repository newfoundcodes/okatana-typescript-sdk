# Logging and observability

Pass a small logger implementation through `logger`.

```ts
const client = new OkatanaClient({
  baseUrl,
  apiKey,
  logger: {
    debug(message, context) {
      telemetry.debug(message, context);
    },
    warn(message, context) {
      telemetry.warn(message, context);
    },
  },
});
```

The SDK does not log the bearer token. The default debug event contains the HTTP method, request URL, and attempt number.

## Recommended metrics

Track these outside the SDK:

- request count by operation and status;
- latency distribution;
- retry count;
- 429 count and `Retry-After` values;
- 401/403 count as credential/scope configuration signals;
- 422 count by integration workflow;
- transport timeout count;
- created object IDs where business audit requirements allow it.

Do not record request bodies blindly. Ticket/document HTML and notifications may contain sensitive business data.
