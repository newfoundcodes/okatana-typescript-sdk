# Production integration checklist

Before a production rollout:

1. Store the URL and credential in a secret/configuration system.
2. Use a dedicated credential per integration and environment.
3. Grant minimum scopes.
4. Run a valid read and verify 401, 403, 404, 422, and 429 handling.
5. Verify credential revocation behavior.
6. Confirm write retries are disabled unless your workflow has reconciliation.
7. Record created Okatana IDs immediately after successful create responses.
8. Add metrics for latency, HTTP status, retries, and rate-limit events. Never record the bearer token.
9. Verify audit history and webhooks for writes that your integration performs.
10. Pin SDK versions and run the OpenAPI coverage test when updating the server contract.
