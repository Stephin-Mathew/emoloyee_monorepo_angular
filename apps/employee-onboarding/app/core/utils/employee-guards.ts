import { EmployeeInterface } from 'employee-management-shared';

export function isEmployee(value: unknown): value is EmployeeInterface {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['employeeId'] === 'number' &&
    typeof candidate['employeeName'] === 'string' &&
    typeof candidate['employeeAge'] === 'number' &&
    typeof candidate['employeeDepartment'] === 'string' &&
    typeof candidate['employeeRole'] === 'string'
  );
}

export function isEmployeeList(value: unknown): value is EmployeeInterface[] {
  return Array.isArray(value) && value.every(isEmployee);
}
