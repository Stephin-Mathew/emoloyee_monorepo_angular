import * as echarts from 'echarts/core';
import { provideEchartsCore } from 'ngx-echarts';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthService, EmployeeService } from '@employee-management/data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideEchartsCore({ echarts }),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      authService.validateSession();

      const emplService = inject(EmployeeService);
      return emplService.initialize();
    }),
  ],
};
