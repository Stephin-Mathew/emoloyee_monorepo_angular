import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeListComponent } from '../../components/employee-list/employee-list.component';

@Component({
  selector: 'app-employee-list-page',
  standalone: true,
  imports: [EmployeeListComponent, RouterOutlet],
  templateUrl: './employee-list-page.component.html',
  styleUrl: './employee-list-page.component.css',
})
export class EmployeeListPageComponent {}