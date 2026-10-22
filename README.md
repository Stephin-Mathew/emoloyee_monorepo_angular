# Employee Management Monorepo

This repository uses Nx to manage the Angular application in `apps/employee-management`.

## Requirements

- Node.js 24.15.0 or newer in the 24.x line (or Node.js 22.22.3 or newer in the 22.x line)
- npm 11

## Install dependencies

From the repository root:

```bash
npm install
```

## Run the application

```bash
npm start
```

Or run the Nx target directly:

```bash
npx nx serve employee-management
```

## Minimal shared-components example

`apps/employee-directory` is a small, no-login directory app that uses the reusable
input, checkbox, table, chart, and shared employee models from
`employee-management-shared`.

```bash
npm run start:directory
```

## Build and test

```bash
npm run build
npm test
```

Nx can also run each target directly:

```bash
npx nx build employee-management
npx nx test employee-management
```

## Workspace layout

- `apps/employee-management/` — Angular application, assets, and project configuration
- `apps/employee-management/app/core/` — app-wide services and route guards
- `apps/employee-management/app/features/` — feature-owned pages and components
- `apps/employee-management/app/features/information/` — About and Help pages
- `packages/employee-management/shared/` — npm workspace package and buildable Nx library for reusable UI components and shared models
- `apps/employee-management/app/shared/ui/` — application-specific shell components
- `apps/employee-management/assets/` — application assets
- `nx.json` — Nx workspace defaults and task caching
- `tsconfig.base.json` — shared TypeScript compiler options
- `package.json` — shared dependencies and root-level commands

Keep code inside its owning feature unless it is genuinely reused. Add future applications
under `apps/` and workspace-wide packages under `packages/`. Import the shared library
through its public entry point (`employee-management-shared`) rather than reaching into
its source folders. npm links workspace packages during the root `npm install`; keep the
dependency declared in the root `package.json` and do not install the library separately.

Build the shared library independently with `npx nx build shared`. This generates its
package build output under `dist/packages/employee-management/shared`.

## Icons

UI icons are stored in `apps/employee-management/assets/icons.svg`. Reference a
symbol with
`<svg aria-hidden="true"><use href="assets/icons.svg#icon-name"></use></svg>`,
and apply sizing and colors to the outer `<svg>` through its CSS class.
