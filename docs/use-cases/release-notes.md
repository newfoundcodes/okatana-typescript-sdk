# Generated release notes

A release automation can combine tickets and documents:

1. stream project tickets;
2. select completed items for the release window;
3. generate sanitized HTML;
4. create a project-linked document;
5. publish it with release tags.

```ts
await client.organizations.createDocument(orgId, {
  projectId,
  title: `Release notes ${version}`,
  contentHtml: html,
  status: 'published',
  tagNames: ['release-notes', version],
});
```

Source example: `examples/publish-release-notes.ts`.
