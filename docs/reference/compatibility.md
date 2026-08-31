# Compatibility and contract policy

The package is pinned to the supplied `Okatana External API` OpenAPI 3.1 document, version `1.0.0`.

## Source of truth

`resources/openapi.yaml` is copied from the file used to generate this SDK release. `tests/openapi-coverage.test.ts` compares its method/path set to `endpointCatalog` and fails if they differ.

## Sparse response schemas

The supplied OpenAPI file gives full component schemas for `Project`, `Board`, `Ticket`, and `Document`, but several endpoint responses contain descriptions without detailed JSON schemas. The SDK does not invent required fields for those responses. It provides useful known fields from the public Okatana documentation and keeps unknown values in `extra`.

## Future additions

Unknown response fields do not break hydration. New endpoints can be accessed through `client.request()` until the SDK is updated.
