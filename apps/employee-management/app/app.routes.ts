import { Routes } from '@angular/router';
import { EmployeeAnalysisComponent } from './features/employees/pages/employee-analysis/employee-analysis.component';
import { LoginComponent } from './features/auth/login/login.component';
import { EmployeeTablePageComponent } from './features/employees/pages/employee-table-page/employee-table-page.component';
import { EmployeeDetailsComponent } from './features/employees/components/employee-details/employee-details.component';
import { EmployeeListPageComponent } from './features/employees/pages/employee-list-page/employee-list-page.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { HelpComponent } from './features/information/help/help.component';
import { AboutComponent } from './features/information/about/about.component';
import { AccessManagementComponent } from './features/access-management/access-management.component';
import { EmployeeLayoutComponent } from './features/employees/pages/employee-layout/employee-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

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