import { Routes } from '@angular/router';

const TITLE_SUFFIX = 'Onboarding Hub';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: `Overview · ${TITLE_SUFFIX}`,
    loadComponent: () =>
      import('./features/overview/overview.component').then((m) => m.OverviewComponent),
  },
  {
    path: 'hires',
    loadChildren: () => import('./features/hires/hires.routes').then((m) => m.HIRES_ROUTES),
  },
  {
    path: 'checklist',
    loadChildren: () =>
      import('./features/checklist/checklist.routes').then((m) => m.CHECKLIST_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
