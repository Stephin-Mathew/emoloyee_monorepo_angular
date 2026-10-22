import { inject, Injectable, signal } from '@angular/core';
import { EmployeeInterface } from 'employee-management-shared';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
   private readonly http = inject(HttpClient);
   private readonly storageKey = 'employees';
   private readonly employeesState = signal<EmployeeInterface[]>([]);
   public readonly employees = this.employeesState.asReadonly();

  // Runs once at startup
  public async initialize(): Promise<void> {
    const storedEmployees = this.readStoredEmployees();
    if (storedEmployees !== null) {
      this.employeesState.set(storedEmployees);
      return;
    }
    const seed = await firstValueFrom(
      this.http.get<EmployeeInterface[]>('assets/employees.json'),
    );
    this.saveEmployees(seed);
  }

  private readStoredEmployees(): EmployeeInterface[] | null {
   const savedEmployees = localStorage.getItem(this.storageKey);
    if (!savedEmployees) {
      return null;
    }

    try {
     const employees: unknown = JSON.parse(savedEmployees);
     return Array.isArray(employees)
       ? employees as EmployeeInterface[]
       : null;
    } catch {
     return null;
    }
  }

  public addEmployee(employee: EmployeeInterface): EmployeeInterface[] {
    const employees = [...this.employees()];
    employees.push(employee);
    this.saveEmployees(employees);
    return employees;
  }

  public updateEmployee(employee: EmployeeInterface): EmployeeInterface[] {
    const employees = this.employees().map((item) =>
      item.employeeId === employee.employeeId ? employee : item,
    );
    this.saveEmployees(employees);
    return employees;
  }

  public deleteEmployee(employeeId: number): EmployeeInterface[] {
    const employees = this.employees().filter(
      (employee) => employee.employeeId !== employeeId,
    );
    this.saveEmployees(employees);
    return employees;
  }

  private saveEmployees(employees: EmployeeInterface[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(employees));
    this.employeesState.set(employees);
  }

  public getEmployeeById(employeeId: number): EmployeeInterface | null {
    return this.employees().find((e) => e.employeeId === employeeId) ?? null;
  }
}