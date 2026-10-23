import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@employee-management/employee-management-shell';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
