# Upgrading the SDK

## Before upgrading

1. Read the SDK changelog.
2. Compare the pinned `resources/openapi.yaml` with the server contract used by your deployment.
3. Run `npm run check:openapi` in the SDK repository.
4. Run your integration test suite against a non-production Okatana deployment.

## Compatibility behavior

The SDK ignores unknown response fields and retains them in `extra`. This reduces breakage from additive response changes.

Enum additions can still require application changes. Code that uses exhaustive `switch` statements over ticket priority or document status should include a defensive default when consuming data from newer servers.

## Server version drift

If a server adds a v1 endpoint before the SDK supports it, use `client.request()` as a temporary escape hatch. Replace the low-level call with a typed method after the SDK adds the operation.
