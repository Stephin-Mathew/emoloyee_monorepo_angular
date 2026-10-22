import { EmployeeInterface } from 'employee-management-shared';

/** A new hire before an id has been assigned. */
export type HireDraft = Omit<EmployeeInterface, 'employeeId'>;
