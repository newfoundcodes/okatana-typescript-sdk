# Testing integrations

The package includes unit tests with a fake `fetch` implementation. No live Okatana server is required for unit tests.

```bash
npm test
npm run test:coverage
```

The test suite covers:

- required URL and API key configuration;
- `/api/v1` URL normalization;
- all 30 service method routes and HTTP verbs;
- request serialization and explicit null handling;
- local OpenAPI constraint validation;
- bearer/Accept headers;
- 401/403/404/422/429 error mapping;
- `Retry-After` handling;
- safe-read retries and no default POST retries;
- nested pagination;
- pagination URL containment;
- exact endpoint coverage against `resources/openapi.yaml`.

For deployment integration tests, use a dedicated credential and disposable test organization/project data.
