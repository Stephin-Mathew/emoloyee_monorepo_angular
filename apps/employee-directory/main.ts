import { bootstrapApplication } from '@angular/platform-browser';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideEchartsCore({ echarts })],
}).catch((error: unknown) => console.error(error));
