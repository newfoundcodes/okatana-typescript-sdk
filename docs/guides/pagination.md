# Pagination

Ticket and document list endpoints use a nested Laravel paginator. The SDK normalizes it to `Paginated<T>`.

```ts
const page = await client.projects.listTickets(projectId, {
  q: 'deployment',
  perPage: 100,
});

console.log(page.items);
console.log(page.currentPage, page.lastPage, page.total);
console.log(page.nextPageUrl);
```

## Async iteration

The SDK can follow the server's `next_page_url` automatically.

```ts
for await (const ticket of client.projects.iterateTickets(projectId, { perPage: 200 })) {
  console.log(ticket.number, ticket.title);
}
```

Documents use the same pattern:

```ts
for await (const document of client.organizations.iterateDocuments(orgId, {
  status: 'published',
  tags: ['runbook', 'production'],
})) {
  console.log(document.title);
}
```

For security, the iterator refuses a pagination URL that leaves the configured Okatana origin or API base path.
