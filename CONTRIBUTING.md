# Contributing

1. Install dependencies with `npm ci`.
2. Keep `resources/openapi.yaml` aligned with the Okatana contract targeted by the release.
3. Add or update `endpointCatalog` for every route change.
4. Add service, serialization, hydration, and unit-test changes together.
5. Run `npm run typecheck`, `npm test`, and `npm run docs:build`.
6. Do not add a default API deployment hostname.
7. Do not add automatic write retries unless the server contract gains a safe idempotency mechanism.
