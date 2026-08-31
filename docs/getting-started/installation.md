# Installation

## npm

```bash
npm install @newfoundcodes/okatana
```

## pnpm

```bash
pnpm add @newfoundcodes/okatana
```

## Yarn

```bash
yarn add @newfoundcodes/okatana
```

The package ships its own TypeScript declaration files. No separate `@types` package is required.

## Runtime requirements

- Node.js 18 or newer, or another runtime with a compatible global `fetch` implementation.
- TypeScript is optional for consumers. JavaScript users can import the same package.
- The API credential must stay in trusted server-side code. Do not bundle it into a browser application.

## Development dependencies

Clone the SDK repository, then run:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

The package build uses `tsup` to emit ESM, CommonJS, source maps, and declarations.
