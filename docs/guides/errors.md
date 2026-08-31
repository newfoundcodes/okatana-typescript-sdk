# Errors

The SDK separates local request/configuration errors from HTTP API errors.

## Local errors

- `ConfigurationError`: missing or invalid client configuration.
- `RequestValidationError`: a request violates a documented OpenAPI constraint before HTTP is sent.
- `TransportError`: no usable HTTP response was received.

## HTTP errors

- `AuthenticationError` — 401
- `AuthorizationError` — 403
- `NotFoundError` — 404
- `ValidationError` — 422
- `RateLimitError` — 429
- `ApiError` — other non-success HTTP errors

```ts
try {
  await client.projects.createTicket(projectId, { title: '' });
} catch (error) {
  if (error instanceof RequestValidationError) {
    console.error(error.issues);
  }
}
```

Laravel validation errors are exposed as `validationErrors`:

```ts
try {
  await client.tickets.update(ticketId, { priority: 'high' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.status, error.validationErrors);
  }
}
```

`RateLimitError.retryAfterMs` is populated when the server returns a usable `Retry-After` header.
