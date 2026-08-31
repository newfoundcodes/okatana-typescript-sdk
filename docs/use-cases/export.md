# Bulk ticket export

Use `iterateTickets()` when the integration needs every ticket and should follow the server's paginator rather than calculate pages itself.

```ts
const rows = [];
for await (const ticket of client.projects.iterateTickets(projectId, { perPage: 200 })) {
  rows.push(ticket);
}
```

For large exports, stream each item to a file, object store, database, or message queue instead of keeping every ticket in memory.

Source example: `examples/export-all-tickets.ts`.
