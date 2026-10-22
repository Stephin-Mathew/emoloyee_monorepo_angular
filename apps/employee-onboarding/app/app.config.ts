import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEchartsCore } from 'ngx-echarts';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Binds route params (e.g. :id) straight to component `input()`s.
    provideRouter(routes, withComponentInputBinding()),
    // Required by the shared <app-custom-chart>. Loaded lazily so ECharts stays out of the
    // initial bundle and is only fetched when a chart is first rendered. The shared component
    // registers the chart types it needs (bar, pie) on this same module instance.
    provideEchartsCore({ echarts: () => import('echarts/core') }),
  ],
};
