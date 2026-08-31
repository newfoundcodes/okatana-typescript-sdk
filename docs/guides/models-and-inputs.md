# Models and inputs

## CamelCase public API

The library maps public TypeScript properties to Okatana JSON names.

```ts
await client.projects.createBoard(projectId, {
  name: 'Security Review',
  wipLimit: 5,
  isDone: false,
});
```

Wire JSON:

```json
{
  "name": "Security Review",
  "wip_limit": 5,
  "is_done": false
}
```

## Explicit `null` versus omitted values

An `undefined` optional property is not sent. An explicit `null` is sent as JSON `null` when the OpenAPI contract permits it.

```ts
await client.tickets.update(ticketId, {
  descriptionHtml: null,
});
```

This sends `{"description_html":null}`.

## Date-time inputs

Fields such as `dueAt` accept an ISO 8601 string or `Date`. `Date` values are serialized with `toISOString()`.

## Forward compatibility

Typed models include an `extra` object. Unknown fields returned by newer Okatana versions are retained there instead of being discarded.
