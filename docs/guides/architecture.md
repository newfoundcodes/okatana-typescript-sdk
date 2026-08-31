# SDK architecture

The package has five layers.

## 1. `OkatanaClient`

The client resolves configuration once and exposes domain services:

```text
OkatanaClient
├── organizations
├── projects
├── boards
├── tickets
└── documents
```

## 2. Domain services

Service classes own route construction and public method signatures. They do not own authentication or retry logic.

## 3. HTTP transport

`HttpTransport` owns:

- base URL resolution;
- bearer authentication;
- JSON headers;
- query serialization;
- timeout and abort handling;
- safe retry decisions;
- response parsing;
- structured API errors;
- same-origin checks for server pagination URLs.

## 4. Wire serializers and hydrators

Serializers map ergonomic camelCase input names to the API's snake_case contract. Hydrators map known response fields back to camelCase and preserve unknown fields in `extra`.

## 5. Contract catalog

`endpointCatalog` is a machine-readable list of every supported method/path pair and required scope. The OpenAPI coverage test compares it with `resources/openapi.yaml`.

This separation keeps the endpoint surface easy to audit and lets transport behavior evolve without changing service method names.
