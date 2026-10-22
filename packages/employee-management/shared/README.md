# employee-management-shared

This buildable Nx library contains the reusable UI components and TypeScript
models shared by the employee-management application.

Import public APIs from the library entry point:

```ts
import {
  CustomInputComponent,
  EmployeeInterface,
} from 'employee-management-shared';
```

Add exports for new reusable components and models in `src/index.ts`. Keep
application-specific shell components and services in the app.

Build the library with:

```bash
npx nx build shared
```
