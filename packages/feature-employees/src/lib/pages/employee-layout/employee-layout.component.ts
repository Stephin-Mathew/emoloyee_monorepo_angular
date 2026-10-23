import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  PageHeaderComponent,
  SidebarComponent,
} from '@employee-management/shared-ui';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [PageHeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css',
})
export class EmployeeLayoutComponent {}
