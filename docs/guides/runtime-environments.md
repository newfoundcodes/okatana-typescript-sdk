# Runtime environments

## Node.js

Node.js 18+ includes `fetch`, so no runtime HTTP dependency is required.

## Bun and Deno

The client can work in runtimes that provide Web-standard `fetch`, `Request`, `Response`, `Headers`, `AbortController`, and `URL` APIs. Run your own integration tests before production use because package resolution and CommonJS support differ by runtime.

## Serverless and edge workers

Construct the client outside a hot request path when practical. Keep the API key in platform secrets. Use per-request `AbortSignal` when the platform supplies one.

## Browsers

Do not use an organization-scoped Okatana API credential in browser code. The package can use Web APIs, but the authentication model is intended for trusted server-to-server integrations.
