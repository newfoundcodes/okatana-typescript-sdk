# Projects API

`client.projects` contains project resource operations and project-owned collections.

## `get()`

```ts
get(projectId: string, options?: CallOptions): Promise<Project>
```

`GET /projects/{project}` — scope `projects:read`.

## `update()`

```ts
update(projectId: string, input: UpdateProjectInput, options?: CallOptions): Promise<Project>
```

`PATCH /projects/{project}` — scope `projects:write`.

Supported fields are `name`, `description`, and `archived`. `description: null` clears the description when the server accepts the update.

```ts
await client.projects.update(projectId, {
  name: 'Core Platform',
  archived: false,
});
```

## `delete()`

```ts
delete(projectId: string, options?: CallOptions): Promise<void>
```

`DELETE /projects/{project}` — scope `projects:write`. The endpoint is documented as a soft delete and returns 204.

## `listMembers()`

```ts
listMembers(projectId: string, options?: CallOptions): Promise<ProjectMember[]>
```

`GET /projects/{project}/members` — scope `projects:read`.

Use this method to discover valid ticket assignee IDs and document editor IDs. The Okatana documentation states that the result includes explicit project users plus organization owners/admins that have implicit project access.

## `listLabels()`

```ts
listLabels(projectId: string, options?: CallOptions): Promise<ProjectLabel[]>
```

`GET /projects/{project}/labels` — scope `projects:read`. Use the returned IDs in ticket `labelIds`.

## `listTags()`

```ts
listTags(projectId: string, options?: CallOptions): Promise<ProjectTag[]>
```

`GET /projects/{project}/tags` — scope `projects:read`. The endpoint documentation says it returns tags currently used by tickets and includes ticket counts.

## `listBoards()`

```ts
listBoards(projectId: string, options?: CallOptions): Promise<Board[]>
```

`GET /projects/{project}/boards` — scope `boards:read`.

Board slugs are useful in automation because ticket creation accepts `boardSlug` as an alternative to `boardId`.

## `createBoard()`

```ts
createBoard(projectId: string, input: CreateBoardInput, options?: CallOptions): Promise<Board>
```

`POST /projects/{project}/boards` — scope `boards:write`.

```ts
const review = await client.projects.createBoard(projectId, {
  name: 'Security Review',
  color: '#7c3aed',
  wipLimit: 5,
  isDone: false,
});
```

The SDK validates `name` up to 120 characters, `color` up to 32, and `wipLimit` as null or an integer of at least 1.

## `reorderBoards()`

```ts
reorderBoards(projectId: string, input: ReorderBoardsInput, options?: CallOptions): Promise<Board[]>
```

`PUT /projects/{project}/boards/reorder` — scope `boards:write`.

```ts
await client.projects.reorderBoards(projectId, {
  boardIds: [openId, progressId, reviewId, deployedId],
});
```

The API expects the board IDs in the desired order.

## `listTickets()`

```ts
listTickets(
  projectId: string,
  input?: ListTicketsOptions,
  options?: CallOptions,
): Promise<Paginated<Ticket>>
```

`GET /projects/{project}/tickets` — scope `tickets:read`.

```ts
const page = await client.projects.listTickets(projectId, {
  boardId,
  q: 'deployment',
  perPage: 100,
});
```

The supplied OpenAPI file defines `board_id`, `q`, and `per_page`. The SDK does not invent query fields that are absent from that file. It follows later pages by using the paginator's returned `next_page_url`.

## `iterateTickets()`

```ts
iterateTickets(
  projectId: string,
  input?: ListTicketsOptions,
  options?: CallOptions,
): AsyncGenerator<Ticket>
```

SDK convenience iterator for all pages.

```ts
for await (const ticket of client.projects.iterateTickets(projectId, { perPage: 200 })) {
  console.log(ticket.number, ticket.title);
}
```

## `createTicket()`

```ts
createTicket(projectId: string, input: CreateTicketInput, options?: CallOptions): Promise<Ticket>
```

`POST /projects/{project}/tickets` — scope `tickets:write`.

```ts
const ticket = await client.projects.createTicket(projectId, {
  boardSlug: 'open',
  title: 'Design deployment runbook',
  descriptionHtml: '<p>Write the first version.</p>',
  priority: 'high',
  dueAt: new Date('2026-09-01T01:00:00Z'),
  assigneeIds: [],
  labelIds: [],
});
```

The OpenAPI allows either `boardId` or `boardSlug`; only `title` is declared required in the request schema. The SDK does not force one of the board selectors because the public Okatana guide states that the server can choose the `open` board when neither is present.

## `reorderTickets()`

```ts
reorderTickets(projectId: string, input: ReorderTicketsInput, options?: CallOptions): Promise<void>
```

`PUT /projects/{project}/tickets/reorder` — scope `tickets:write`, response 204.

The request contains the owning `boardId` and the ordered `ticketIds` array.

## `analytics()`

```ts
analytics(projectId: string, options?: CallOptions): Promise<ProjectAnalytics>
```

`GET /projects/{project}/analytics` — scope `analytics:read`.

The public endpoint guide describes total, done, open, overdue, completion percentage, and board counts. Because the supplied OpenAPI response does not define a detailed schema, these model fields are optional and unknown server fields remain in `extra`.
