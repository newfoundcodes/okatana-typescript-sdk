# Analytics reporting

Use `projects.analytics()` for the server's project summary and combine it with board/ticket reads when a report needs workflow-level detail.

```ts
const metrics = await client.projects.analytics(projectId);
const boards = await client.projects.listBoards(projectId);

for (const board of boards) {
  const page = await client.projects.listTickets(projectId, {
    boardId: board.id,
    perPage: 200,
  });
  console.log(board.name, page.total);
}
```

This pattern is useful for internal dashboards, weekly operating reviews, SLA reports, and WIP monitoring.

Source example: `examples/analytics-dashboard.ts`.
