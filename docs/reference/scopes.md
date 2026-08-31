# Scope constants

`OkatanaScope` is a string union that contains the 14 current scope values, including wildcard `*`.

```ts
import type { OkatanaScope } from '@newfoundcodes/okatana';

const required: OkatanaScope[] = [
  'projects:read',
  'tickets:read',
  'tickets:write',
];
```

The SDK does not decode or inspect credential scopes locally. Scope enforcement remains authoritative on the Okatana server.
