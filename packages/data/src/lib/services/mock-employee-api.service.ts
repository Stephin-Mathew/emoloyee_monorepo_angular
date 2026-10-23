import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { EmployeeInterface } from '../models/employee.interface';
import { EmployeePageResponse } from '../models/employee-page-response.interface';

type EmployeeSortField = keyof EmployeeInterface;

@Injectable({
  providedIn: 'root',
})
export class MockEmployeeApiService {
  private readonly storageKey = 'employees';

  public getEmployeesPage(
    page: number,
    pageSize: number,
    searchTerm = '',
    sortField: EmployeeSortField | '' = '',
    sortDirection: 'asc' | 'desc' = 'asc',
  ): Observable<EmployeePageResponse> {
    return of(null).pipe(
      delay(300),

      map(() => {
        let employees = this.readEmployeesFromStorage();

        // Search
        const term = searchTerm.trim().toLowerCase();

        if (term) {
          employees = employees.filter((employee) =>
            [employee.employeeName, employee.employeeId]
              .some((value) =>
                String(value).toLowerCase().includes(term),
              ),
          );
        }

        // Sort
        if (sortField) {
          employees.sort((a, b) => {
            const left = a[sortField];
            const right = b[sortField];

            const comparison =
              typeof left === 'number' &&
              typeof right === 'number'
                ? left - right
                : String(left ?? '').localeCompare(
                    String(right ?? ''),
                  );

            return sortDirection === 'asc'
              ? comparison
              : -comparison;
          });
        }

        // Calculate the total before slicing
        const totalItems = employees.length;
        const validPageSize =
          Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 8;
        const totalPages = Math.ceil(totalItems / validPageSize);
        const currentPage =
          totalPages === 0
            ? 1
            : Math.min(Math.max(1, Math.trunc(page)), totalPages);

        // Return only the requested page
        const startIndex = (currentPage - 1) * validPageSize;
        const items = employees.slice(
          startIndex,
          startIndex + validPageSize,
        );

        return {
          items,
          totalItems,
          currentPage,
          pageSize: validPageSize,
        };
      }),
    );
  }

  private readEmployeesFromStorage(): EmployeeInterface[] {
    const storedData = localStorage.getItem(this.storageKey);

    if (!storedData) {
      return [];
    }

    try {
      const employees: unknown = JSON.parse(storedData);

      return Array.isArray(employees)
        ? employees as EmployeeInterface[]
        : [];
    } catch {
      return [];
    }
  }
}
