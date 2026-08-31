# Organizations API

Access organization-scoped operations through `client.organizations`.

All methods accept optional `CallOptions` as the final argument. The service never chooses an organization automatically because every API credential is organization-scoped and the route still requires the organization identifier.

## `get()`

```ts
get(organizationId: string, options?: CallOptions): Promise<Organization>
```

Calls `GET /organizations/{organization}` and requires `organization:read`.

```ts
const organization = await client.organizations.get(orgId);
console.log(organization.id, organization.name);
```

## `listProjects()`

```ts
listProjects(organizationId: string, options?: CallOptions): Promise<Project[]>
```

Calls `GET /organizations/{organization}/projects` and requires `projects:read`. This is a complete array, not a paginator.

```ts
const projects = await client.organizations.listProjects(orgId);
for (const project of projects) console.log(project.key, project.name);
```

## `createProject()`

```ts
createProject(
  organizationId: string,
  input: CreateProjectInput,
  options?: CallOptions,
): Promise<Project>
```

Calls `POST /organizations/{organization}/projects` and requires `projects:write`.

```ts
const project = await client.organizations.createProject(orgId, {
  name: 'Platform',
  key: 'PLAT',
  description: 'Platform engineering work',
});
```

`name` is limited to 180 characters, `key` to 12, and `description` to 5000 when supplied. `description: null` is valid.

The current Okatana endpoint documentation states that project creation also creates the default Open, Hold, In-progress, Pull Request, and Deployed boards.

## `listDocuments()`

```ts
listDocuments(
  organizationId: string,
  input?: ListDocumentsOptions,
  options?: CallOptions,
): Promise<Paginated<Document>>
```

Calls `GET /organizations/{organization}/documents` and requires `documents:read`.

Filters:

```ts
const page = await client.organizations.listDocuments(orgId, {
  projectId,
  status: 'published',
  q: 'runbook',
  tags: ['production', 'runbook'],
  perPage: 100,
});
```

The SDK converts `tags` to the API's comma-separated query value. `perPage` is validated from 1 through 200.

## `iterateDocuments()`

```ts
iterateDocuments(
  organizationId: string,
  input?: ListDocumentsOptions,
  options?: CallOptions,
): AsyncGenerator<Document>
```

This is an SDK convenience method. It calls `listDocuments()` and follows the server's `next_page_url` until no next page remains.

```ts
for await (const document of client.organizations.iterateDocuments(orgId, {
  status: 'published',
  perPage: 200,
})) {
  console.log(document.title);
}
```

## `createDocument()`

```ts
createDocument(
  organizationId: string,
  input: CreateDocumentInput,
  options?: CallOptions,
): Promise<Document>
```

Calls `POST /organizations/{organization}/documents` and requires `documents:write`.

```ts
const document = await client.organizations.createDocument(orgId, {
  projectId,
  title: 'Production Runbook',
  caption: 'How to deploy the service',
  contentHtml: '<h2>Deployment</h2><p>...</p>',
  status: 'draft',
  editorIds: ['01USER...'],
  tagNames: ['runbook', 'production'],
});
```

OpenAPI limits enforced locally include title 500, caption 2000, content HTML 1,000,000, up to 100 editors, up to 20 tag names, and 50 characters per tag name.

## `sendNotifications()`

```ts
sendNotifications(
  organizationId: string,
  input: SendNotificationInput,
  options?: CallOptions,
): Promise<NotificationBatchResult>
```

Calls `POST /organizations/{organization}/notifications` and requires `notifications:write`.

```ts
await client.organizations.sendNotifications(orgId, {
  userIds: ['01USER1...', '01USER2...'],
  title: 'Deployment window changed',
  body: 'Production deployment starts at 18:00.',
  url: `/app/projects/${projectId}`,
});
```

The OpenAPI contract requires 1 to 100 recipients, title up to 180 characters, body up to 2000, and an internal `/app` URL when `url` is supplied.
