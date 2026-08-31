# Authentication and scopes

Okatana External API v1 uses an organization-scoped bearer credential.

The SDK sends:

```http
Authorization: Bearer oka_<public-id>.<secret>
Accept: application/json
```

Treat the token as a secret. Keep it in a secret manager or server environment variable. Never send it to browser code, logs, issue trackers, documents, or telemetry payloads.

## Scope model

| Scope | SDK operations |
| --- | --- |
| `organization:read` | Read organization |
| `projects:read` | List/read projects, members, labels, tags |
| `projects:write` | Create/update/delete projects |
| `boards:read` | List boards |
| `boards:write` | Create/update/reorder/delete boards |
| `tickets:read` | List/read tickets |
| `tickets:write` | Create/update/move/reorder/delete tickets |
| `comments:write` | Create ticket comments |
| `analytics:read` | Project analytics |
| `documents:read` | List/read documents |
| `documents:write` | Create/update/delete documents |
| `document_comments:write` | Create document comments |
| `notifications:write` | Send organization notifications |
| `*` | All external operations in the credential organization |

A wildcard credential still cannot cross its organization boundary.
