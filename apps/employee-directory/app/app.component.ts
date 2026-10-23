import { Component, computed, signal } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import {
  CustomChartComponent,
  CustomCheckboxComponent,
  CustomInputComponent,
  CustomTableComponent,
  EmployeeInterface,
  InputValue,
  TableColumn,
  TableSortEvent,
} from '@org/employee-management/shared';

const EMPLOYEES: EmployeeInterface[] = [
  { employeeId: 101, employeeName: 'Ava Patel', employeeAge: 29, employeeDepartment: 'Design', employeeRole: 'Product Designer' },
  { employeeId: 102, employeeName: 'Noah Wilson', employeeAge: 34, employeeDepartment: 'Engineering', employeeRole: 'Frontend Engineer' },
  { employeeId: 103, employeeName: 'Mia Chen', employeeAge: 31, employeeDepartment: 'People', employeeRole: 'People Partner' },
  { employeeId: 104, employeeName: 'Liam Brown', employeeAge: 27, employeeDepartment: 'Engineering', employeeRole: 'Contractor' },
  { employeeId: 105, employeeName: 'Sofia Garcia', employeeAge: 38, employeeDepartment: 'Finance', employeeRole: 'Finance Manager' },
  { employeeId: 106, employeeName: 'Ethan Davis', employeeAge: 25, employeeDepartment: 'Design', employeeRole: 'UX Researcher' },
  { employeeId: 107, employeeName: 'Olivia Martin', employeeAge: 32, employeeDepartment: 'Engineering', employeeRole: 'Backend Engineer' },
  { employeeId: 108, employeeName: 'James Taylor', employeeAge: 41, employeeDepartment: 'Operations', employeeRole: 'Operations Lead' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomInputComponent, CustomCheckboxComponent, CustomTableComponent, CustomChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly searchTerm = signal('');
  readonly includeContractors = signal(true);
  readonly page = signal(1);
  readonly pageSize = signal(5);
  readonly sortField = signal<keyof EmployeeInterface | ''>('');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly columns: TableColumn[] = [
    { key: 'employeeId', label: 'ID', sortable: true },
    { key: 'employeeName', label: 'Name', sortable: true },
    { key: 'employeeDepartment', label: 'Department', sortable: true },
    { key: 'employeeRole', label: 'Role' },
    { key: 'employeeAge', label: 'Age', sortable: true },
  ];

  readonly filteredEmployees = computed(() => {
    const query = this.searchTerm().toLowerCase();
    const filtered = EMPLOYEES.filter((employee) => {
      const matchesSearch = Object.values(employee).some((value) => String(value).toLowerCase().includes(query));
      return matchesSearch && (this.includeContractors() || employee.employeeRole !== 'Contractor');
    });
    const field = this.sortField();
    if (!field) return filtered;
    return [...filtered].sort((a, b) => {
      const first = a[field];
      const second = b[field];
      const comparison = typeof first === 'number' && typeof second === 'number'
        ? first - second
        : String(first).localeCompare(String(second));
      return this.sortDirection() === 'asc' ? comparison : -comparison;
    });
  });

  readonly visibleEmployees = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filteredEmployees().slice(start, start + this.pageSize());
  });

  readonly departmentChart = computed<EChartsCoreOption>(() => {
    const groups = new Map<string, number>();
    this.filteredEmployees().forEach(({ employeeDepartment }) => groups.set(employeeDepartment, (groups.get(employeeDepartment) ?? 0) + 1));
    return {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: [...groups.keys()] },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{ type: 'bar', data: [...groups.values()], itemStyle: { color: '#087e8b', borderRadius: [6, 6, 0, 0] } }],
      grid: { left: 36, right: 12, top: 24, bottom: 30 },
    };
  });

  onSearch(value: InputValue): void { this.searchTerm.set(String(value ?? '').trim()); this.page.set(1); }
  onContractorsChange(checked: boolean): void { this.includeContractors.set(checked); this.page.set(1); }
  onPageChange(page: number): void { this.page.set(page); }
  onPageSizeChange(size: number): void { this.pageSize.set(size); this.page.set(1); }
  onSortChange(event: TableSortEvent): void { this.sortField.set(event.field); this.sortDirection.set(event.direction); this.page.set(1); }
}
