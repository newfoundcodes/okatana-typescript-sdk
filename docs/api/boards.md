# Boards API

Board-level mutation methods live under `client.boards`. Project-level board list/create/reorder methods are under `client.projects`.

## `update()`

```ts
update(boardId: string, input: UpdateBoardInput, options?: CallOptions): Promise<Board>
```

Calls `PATCH /boards/{board}` and requires `boards:write`.

```ts
const board = await client.boards.update(boardId, {
  name: 'Security Review',
  color: '#7c3aed',
  wipLimit: 8,
  isDone: false,
  isHidden: false,
});
```

Supported OpenAPI fields are:

- `name`, maximum 120 characters;
- `color`, nullable, maximum 32 characters;
- `wipLimit`, nullable, minimum 1;
- `isDone`;
- `isHidden`.

## `delete()`

```ts
delete(boardId: string, input?: DeleteBoardInput, options?: CallOptions): Promise<void>
```

Calls `DELETE /boards/{board}` and requires `boards:write`.

Without a body:

```ts
await client.boards.delete(boardId);
```

When tickets must move before deletion:

```ts
await client.boards.delete(boardId, {
  moveToBoardId: targetBoardId,
});
```

The server can return 422 for an invalid target or when the move would violate a WIP limit. The SDK does not retry this write automatically.
