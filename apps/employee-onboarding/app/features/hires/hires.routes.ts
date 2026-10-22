import { Routes } from '@angular/router';

const TITLE_SUFFIX = 'Onboarding Hub';

export const HIRES_ROUTES: Routes = [
  {
    path: '',
    title: `New hires · ${TITLE_SUFFIX}`,
    loadComponent: () =>
      import('./pages/hire-list-page/hire-list-page.component').then(
        (m) => m.HireListPageComponent,
      ),
  },
  {
    path: 'new',
    title: `Add hire · ${TITLE_SUFFIX}`,
    loadComponent: () =>
      import('./pages/hire-form-page/hire-form-page.component').then(
        (m) => m.HireFormPageComponent,
      ),
  },
  {
    path: ':id/edit',
    title: `Edit hire · ${TITLE_SUFFIX}`,
    loadComponent: () =>
      import('./pages/hire-form-page/hire-form-page.component').then(
        (m) => m.HireFormPageComponent,
      ),
  },
];
