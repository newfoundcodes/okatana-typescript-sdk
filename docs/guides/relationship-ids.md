# Discovering relationship IDs

Many write endpoints require IDs that must belong to the same organization or project.

Use read endpoints before writes:

```ts
const projects = await client.organizations.listProjects(orgId);
const boards = await client.projects.listBoards(projectId);
const members = await client.projects.listMembers(projectId);
const labels = await client.projects.listLabels(projectId);
const tags = await client.projects.listTags(projectId);
```

Ticket creation accepts `boardId` or `boardSlug`. The Okatana guide states that a missing board selector uses the project-local `open` slug when available. For durable automation, a board slug can be easier to configure than a ULID, but it remains local to one project.

Do not copy IDs between organizations. Okatana validates organization/project relationships server-side and can return 403, 404, or 422 when a relationship is invalid.
