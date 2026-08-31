# External tracker synchronization

When synchronizing GitHub, GitLab, Jira, or an internal issue system, do not assume POST can be retried safely.

Use a stable marker that is derived from the external issue identity:

```text
[external:GH-1842]
```

Search for the marker first. If it exists, update the matched Okatana ticket. If it does not exist, create one.

After a create returns successfully, store the Okatana ticket ULID in your own integration state immediately. On ambiguous network failure, reconcile before sending another create.

Source example: `examples/external-tracker-sync.ts`.
