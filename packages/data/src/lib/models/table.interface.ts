import { EmployeeInterface } from './employee.interface';

export interface TableColumn {
  key: keyof EmployeeInterface;
  label: string;
  sortable?: boolean;
}

export interface TableSortEvent {
  field: keyof EmployeeInterface;
  direction: 'asc' | 'desc';
}

export interface TableActionEvent {
  action: 'edit' | 'delete';
  row: object;
}