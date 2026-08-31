# Board consolidation

A workflow cleanup may need to remove a board that still has tickets. The OpenAPI contract permits an optional `move_to_board_id` field on board deletion.

The SDK exposes it as:

```ts
await client.boards.delete(legacyBoardId, {
  moveToBoardId: targetBoardId,
});
```

The server remains authoritative for relationship checks and WIP limits. If the move would exceed a WIP rule, handle the resulting 422 rather than retrying blindly.

Source example: `examples/board-consolidation.ts`.
