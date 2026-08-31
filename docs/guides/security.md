# Security guidance

## Keep credentials server-side

The API key is a bearer secret. Do not put this package into browser code with a real credential. Browser users can inspect bundled JavaScript, memory, network calls, and source maps.

## Use least privilege

Create a separate credential for each integration or environment. Grant only the scopes it needs.

## Do not log tokens

The SDK's logger integration records method, URL, and attempt number. It does not record the Authorization header. Custom `fetch` or proxy code must apply the same rule.

## Pagination URL containment

Server-supplied next-page URLs are checked against the configured API origin and base path. This prevents an unexpected paginator link from forwarding the bearer credential to another host.

## HTML fields

Okatana accepts rich HTML for tickets, documents, and comments and sanitizes it server-side. Integrations should still treat all remote input as untrusted when rendering it elsewhere.
