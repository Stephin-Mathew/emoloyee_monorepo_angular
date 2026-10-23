import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CustomInputComponent,
} from '@employee-management/shared-ui';
import {
  EmployeeInterface,
  EmployeeService,
  InputValue,
} from '@employee-management/data';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CustomInputComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  public searchTerm = '';

  private employeeService = inject(EmployeeService);

  private router = inject(Router);

  public readonly employees = this.employeeService.employees;

  public get filteredEmployees(): EmployeeInterface[] {
    const term = this.searchTerm.trim().toLowerCase();

    return [...this.employees()].sort(((a,b)=>{
      return Number(a.employeeId) - Number(b.employeeId);
    })).filter(
      (employee) =>
        employee.employeeName.toLowerCase().includes(term) ||
        employee.employeeId.toString().includes(term),
    );
  }

  public onSearchChange(value: InputValue): void {
    this.searchTerm = String(value ?? '').trim();
  }

  public selectEmployee(employeeId: number): void {
    this.router.navigate(['/employees/list', employeeId]);
  }
}