import { Routes } from '@angular/router';

const TITLE_SUFFIX = 'Onboarding Hub';

const loadChecklistPage = () =>
  import('./pages/checklist-page/checklist-page.component').then((m) => m.ChecklistPageComponent);

export const CHECKLIST_ROUTES: Routes = [
  { path: '', title: `Checklists · ${TITLE_SUFFIX}`, loadComponent: loadChecklistPage },
  { path: ':id', title: `Checklists · ${TITLE_SUFFIX}`, loadComponent: loadChecklistPage },
];
