import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { SidebarComponent } from '../../../../shared/ui/sidebar/sidebar.component';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [PageHeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css',
})
export class EmployeeLayoutComponent {}
