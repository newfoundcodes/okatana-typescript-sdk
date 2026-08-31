# Troubleshooting

## URL has `/api/v1/api/v1`

Pass either the deployment origin or a URL ending in `/api/v1`. The normalizer detects the latter. Do not concatenate `/api/v1` yourself after reading `client.apiBaseUrl`.

## 401 AuthenticationError

Check that the bearer token is complete, not revoked, not expired, and belongs to the intended deployment.

## 403 AuthorizationError

Check the credential organization and required scope. A wildcard scope still cannot cross organizations.

## 404 NotFoundError

Check the object ID and whether the object was soft-deleted. Relationship-constrained route binding may also hide an object that is outside the permitted project/organization.

## 422 ValidationError

Inspect `error.validationErrors` and `error.body`. Business-rule errors may contain only a message.

## 429 RateLimitError

For reads, let the SDK's retry policy back off. For writes, decide at the workflow level whether the request can be repeated safely.

## `RequestValidationError` before HTTP

The SDK found a local contract violation, such as `perPage > 200`, `wipLimit < 1`, too many document tags, or a notification URL that is not an internal `/app` path.

## Iterator rejects a next-page URL

The server returned a next-page URL outside the configured Okatana API base. The SDK refuses to send the bearer credential there. Verify reverse-proxy and application URL configuration on the deployment.
