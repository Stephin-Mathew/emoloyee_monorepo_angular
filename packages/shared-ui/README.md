# Shared UI

This buildable Nx library contains reusable UI components and application shell
components. Shared models and services are owned by `packages/data`.

Import public APIs from the library entry point:

```ts
import {
  CustomInputComponent,
} from '@employee-management/shared-ui';
import { EmployeeInterface } from '@employee-management/data';
```

Add exports for reusable components in `src/index.ts`. Export models and
services from the data package instead of adding them here.

Build the library with:

```bash
npx nx build shared-ui
```
