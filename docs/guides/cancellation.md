# Timeouts and cancellation

The client applies a default 30-second timeout. Configure it globally with `timeoutMs`.

For individual calls, pass an `AbortSignal`:

```ts
const controller = new AbortController();

const promise = client.projects.listTickets(projectId, undefined, {
  signal: controller.signal,
});

controller.abort();
await promise;
```

Cancellation is useful for job shutdown, request-scoped server handlers, and worker termination.
