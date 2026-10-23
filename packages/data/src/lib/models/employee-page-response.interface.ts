import { EmployeeInterface } from './employee.interface';

export interface EmployeePageResponse {
  items: EmployeeInterface[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}
