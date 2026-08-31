# Runbook and knowledge publishing

The document endpoints support project-linked or organization-wide knowledge records.

A publishing automation can:

1. list project members to discover valid editor IDs;
2. create a draft with rich HTML, editors, and tags;
3. add review comments;
4. update content while the document is draft;
5. publish by changing `status` to `published`;
6. later archive or soft-delete the document as lifecycle rules require.

Source example: `examples/document-publishing.ts`.
