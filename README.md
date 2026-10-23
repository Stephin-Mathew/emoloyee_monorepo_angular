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
`@employee-management/shared-ui` and `@employee-management/data`.

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
- `packages/employee-management/` — application routes and initialization configuration
- `packages/feature-auth/` — login, signup, access management, and route guards
- `packages/feature-information/` — About and Help pages
- `packages/data/` — shared models and data services
- `packages/feature-employees/` — employee pages and components
- `packages/feature-analysis/` — employee analysis and charts
- `packages/shared-ui/` — reusable UI components and application shell
- `apps/employee-management/assets/` — application assets
- `nx.json` — Nx workspace defaults and task caching
- `tsconfig.base.json` — shared TypeScript compiler options
- `package.json` — shared dependencies and root-level commands

Keep code inside its owning feature unless it is genuinely reused. Add future applications
under `apps/` and workspace libraries under `packages/`. Import packages through their
public entry points (such as `@employee-management/feature-employees`) rather than
reaching into their source folders. npm links workspace packages during the root
`npm install`; declare package-to-package dependencies in each package manifest
and app dependencies in the root `package.json`.

Build a package independently with `npx nx build <project-name>`, such as
`npx nx build shared-ui`. Package build output is generated under `dist/packages/`.

## Icons

UI icons are stored in `apps/employee-management/assets/icons.svg`. Reference a
symbol with
`<svg aria-hidden="true"><use href="assets/icons.svg#icon-name"></use></svg>`,
and apply sizing and colors to the outer `<svg>` through its CSS class.
