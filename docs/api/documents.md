# Documents API

Document-level operations live under `client.documents`. Organization-level list/create methods are under `client.organizations`.

`DocumentStatus` is:

```ts
'draft' | 'published'
```

## `get()`

```ts
get(documentId: string, options?: CallOptions): Promise<Document>
```

`GET /documents/{document}` — scope `documents:read`.

## `update()`

```ts
update(documentId: string, input: UpdateDocumentInput, options?: CallOptions): Promise<Document>
```

`PATCH /documents/{document}` — scope `documents:write`.

```ts
const published = await client.documents.update(documentId, {
  status: 'published',
  caption: 'Approved production procedure',
  tagNames: ['runbook', 'production'],
});
```

Supported fields are `projectId`, `title`, `caption`, `contentHtml`, `status`, `archived`, `editorIds`, and `tagNames`.

`projectId`, `caption`, and `contentHtml` can be explicitly null according to the supplied OpenAPI document.

The public Okatana guide states that moving a document to another organization is not supported and that project/editor relationships are validated server-side.

## `delete()`

```ts
delete(documentId: string, options?: CallOptions): Promise<void>
```

`DELETE /documents/{document}` — scope `documents:write`, response 204. This is a soft delete.

## `createComment()`

```ts
createComment(
  documentId: string,
  input: CreateDocumentCommentInput,
  options?: CallOptions,
): Promise<DocumentComment>
```

`POST /documents/{document}/comments` — scope `document_comments:write`.

```ts
await client.documents.createComment(documentId, {
  bodyHtml: '<p>Reviewed and approved.</p>',
});
```

The OpenAPI request body limits `bodyHtml` to 200,000 characters.
