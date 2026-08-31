# Tickets API

Ticket-level operations are on `client.tickets`. Project-level ticket list/create/reorder operations are on `client.projects`.

## Ticket priority

`TicketPriority` is:

```ts
'lowest' | 'low' | 'normal' | 'high' | 'highest' | 'critical'
```

## `get()`

```ts
get(ticketId: string, options?: CallOptions): Promise<Ticket>
```

`GET /tickets/{ticket}` — scope `tickets:read`.

## `update()`

```ts
update(ticketId: string, input: UpdateTicketInput, options?: CallOptions): Promise<Ticket>
```

`PATCH /tickets/{ticket}` — scope `tickets:write`.

Supported fields:

- `title`, maximum 500 characters;
- `descriptionHtml`, nullable, maximum 200,000;
- `priority`;
- `dueAt`, nullable date-time;
- `assigneeIds`;
- `labelIds`;
- `archived`.

```ts
await client.tickets.update(ticketId, {
  title: 'Design and review deployment runbook',
  priority: 'highest',
  dueAt: null,
  archived: false,
});
```

Because the serializer removes only `undefined`, the explicit `dueAt: null` is preserved on the wire.

## `delete()`

```ts
delete(ticketId: string, options?: CallOptions): Promise<void>
```

`DELETE /tickets/{ticket}` — scope `tickets:write`, response 204. The endpoint is a soft delete.

## `move()`

```ts
move(ticketId: string, input: MoveTicketInput, options?: CallOptions): Promise<Ticket>
```

`POST /tickets/{ticket}/move` — scope `tickets:write`.

```ts
const moved = await client.tickets.move(ticketId, {
  boardId: deployedBoardId,
  position: 2000,
});
```

`position` is optional and must be an integer of at least 0 when supplied. The public Okatana guide states that omitting it appends the ticket to the destination board.

A 422 can indicate an invalid destination board or WIP limit failure.

## `createComment()`

```ts
createComment(
  ticketId: string,
  input: CreateTicketCommentInput,
  options?: CallOptions,
): Promise<TicketComment>
```

`POST /tickets/{ticket}/comments` — scope `comments:write`.

```ts
await client.tickets.createComment(ticketId, {
  bodyHtml: '<p>Deployment validation is complete.</p>',
});
```

`bodyHtml` is limited to 200,000 characters by the supplied OpenAPI schema. The endpoint guide states that Okatana records the API credential as the audit actor rather than impersonating a browser user.
