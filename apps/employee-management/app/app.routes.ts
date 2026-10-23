import { Routes } from '@angular/router';
import { EmployeeAnalysisComponent } from '@employee-management/feature-analysis';
import {
  AccessManagementComponent,
  LoginComponent,
  SignupComponent,
  adminGuard,
  authGuard,
} from '@employee-management/feature-auth';
import {
  EmployeeDetailsComponent,
  EmployeeLayoutComponent,
  EmployeeListPageComponent,
  EmployeeTablePageComponent,
} from '@employee-management/feature-employees';
import { AboutComponent, HelpComponent } from '@employee-management/feature-information';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: EmployeeLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'analysis',
        component: EmployeeAnalysisComponent,
      },
      {
        path: 'employees/table',
        component: EmployeeTablePageComponent,
      },
      {
        path: 'employees/list',
        component: EmployeeListPageComponent,
        children: [
          { path: '', component: EmployeeDetailsComponent },
          { path: ':employeeId', component: EmployeeDetailsComponent },
        ],
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'access-management',
        component: AccessManagementComponent,
        canActivate: [adminGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
