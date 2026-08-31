# Error class reference

| Class | Source | Meaning |
| --- | --- | --- |
| `ConfigurationError` | local | Required client configuration is missing or invalid |
| `RequestValidationError` | local | Input violates a documented contract limit |
| `TransportError` | local/transport | No usable HTTP response was received |
| `AuthenticationError` | HTTP 401 | Credential missing, invalid, revoked, or expired |
| `AuthorizationError` | HTTP 403 | Wrong organization or missing scope |
| `NotFoundError` | HTTP 404 | Resource not found or not available through route binding |
| `ValidationError` | HTTP 422 | Field, relationship, WIP, or lifecycle validation failed |
| `RateLimitError` | HTTP 429 | Credential rate limit reached |
| `ApiError` | HTTP | Other non-success status |
| `UnexpectedResponseError` | HTTP | Response status is outside the expected HTTP error range |

`ApiError` properties include `status`, `method`, `url`, `body`, `headers`, optional `requestId`, optional `validationErrors`, and optional `retryAfterMs`.
