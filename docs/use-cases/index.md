# Real-world use cases

The repository includes executable TypeScript scenarios in `examples/`.

| Example | Scenario |
| --- | --- |
| `bootstrap-project.ts` | Create a project, inspect default boards, add a review phase, reorder workflow, create a first ticket |
| `ci-cd-release.ts` | Reconcile/create a release ticket, comment from CI, move it to deployed |
| `incident-response.ts` | Create a critical incident, assign responders, send organization notifications |
| `document-publishing.ts` | Create, review, and publish a runbook with editors and tags |
| `analytics-dashboard.ts` | Read project analytics and compare board counts/WIP limits |
| `export-all-tickets.ts` | Stream every paginated ticket and export JSON |
| `external-tracker-sync.ts` | Synchronize an external issue with a stable marker to reduce duplicate creates |
| `custom-fetch-and-timeout.ts` | Inject fetch instrumentation and handle cancellation |
| `board-consolidation.ts` | Delete a legacy board and move its tickets to another board |
| `publish-release-notes.ts` | Build release notes from completed tickets and publish a document |

See the detailed scenario pages for design notes and failure-handling guidance.
