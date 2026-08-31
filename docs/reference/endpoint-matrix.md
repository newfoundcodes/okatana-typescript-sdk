# Endpoint matrix

All 30 operations from the supplied OpenAPI file are implemented.

| HTTP | Path | SDK method | Scope |
| --- | --- | --- | --- |
| `GET` | `/organizations/{organization}` | `client.organizations.get()` | `organization:read` |
| `GET` | `/organizations/{organization}/projects` | `client.organizations.listProjects()` | `projects:read` |
| `POST` | `/organizations/{organization}/projects` | `client.organizations.createProject()` | `projects:write` |
| `GET` | `/projects/{project}` | `client.projects.get()` | `projects:read` |
| `PATCH` | `/projects/{project}` | `client.projects.update()` | `projects:write` |
| `DELETE` | `/projects/{project}` | `client.projects.delete()` | `projects:write` |
| `GET` | `/projects/{project}/members` | `client.projects.listMembers()` | `projects:read` |
| `GET` | `/projects/{project}/labels` | `client.projects.listLabels()` | `projects:read` |
| `GET` | `/projects/{project}/boards` | `client.projects.listBoards()` | `boards:read` |
| `POST` | `/projects/{project}/boards` | `client.projects.createBoard()` | `boards:write` |
| `PUT` | `/projects/{project}/boards/reorder` | `client.projects.reorderBoards()` | `boards:write` |
| `PATCH` | `/boards/{board}` | `client.boards.update()` | `boards:write` |
| `DELETE` | `/boards/{board}` | `client.boards.delete()` | `boards:write` |
| `GET` | `/projects/{project}/tickets` | `client.projects.listTickets()` | `tickets:read` |
| `POST` | `/projects/{project}/tickets` | `client.projects.createTicket()` | `tickets:write` |
| `PUT` | `/projects/{project}/tickets/reorder` | `client.projects.reorderTickets()` | `tickets:write` |
| `GET` | `/projects/{project}/analytics` | `client.projects.analytics()` | `analytics:read` |
| `GET` | `/tickets/{ticket}` | `client.tickets.get()` | `tickets:read` |
| `PATCH` | `/tickets/{ticket}` | `client.tickets.update()` | `tickets:write` |
| `DELETE` | `/tickets/{ticket}` | `client.tickets.delete()` | `tickets:write` |
| `POST` | `/tickets/{ticket}/move` | `client.tickets.move()` | `tickets:write` |
| `POST` | `/tickets/{ticket}/comments` | `client.tickets.createComment()` | `comments:write` |
| `GET` | `/organizations/{organization}/documents` | `client.organizations.listDocuments()` | `documents:read` |
| `POST` | `/organizations/{organization}/documents` | `client.organizations.createDocument()` | `documents:write` |
| `GET` | `/documents/{document}` | `client.documents.get()` | `documents:read` |
| `PATCH` | `/documents/{document}` | `client.documents.update()` | `documents:write` |
| `DELETE` | `/documents/{document}` | `client.documents.delete()` | `documents:write` |
| `POST` | `/documents/{document}/comments` | `client.documents.createComment()` | `document_comments:write` |
| `POST` | `/organizations/{organization}/notifications` | `client.organizations.sendNotifications()` | `notifications:write` |
| `GET` | `/projects/{project}/tags` | `client.projects.listTags()` | `projects:read` |
