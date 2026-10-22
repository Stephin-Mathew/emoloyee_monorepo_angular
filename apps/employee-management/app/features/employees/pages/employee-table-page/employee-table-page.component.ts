import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Subscription } from 'rxjs';
import { MockEmployeeApiService } from '../../../../core/services/mock-employee-api.service';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import { EmployeeModalComponent } from '../../components/employee-modal/employee-modal.component';
import {
  CustomTableComponent,
  InputValue,
  TableActionEvent,
  TableColumn,
  TableSortEvent,
  TableHeaderComponent,
  EmployeeInterface,
} from 'employee-management-shared';
import { EmployeeService } from '../../../../core/services/employee.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-employee-table-page',
  standalone: true,
  imports: [
    TableHeaderComponent,
    EmployeeModalComponent,
    DeleteModalComponent,
    CustomTableComponent
  ],
  templateUrl: './employee-table-page.component.html',
  styleUrls: ['./employee-table-page.component.css'],
})
export class EmployeeTablePageComponent {
  
  public searchTerm = '';
  public readonly displayedEmployees = signal<EmployeeInterface[]>([]);
  public readonly currentPage = signal(1);
  public readonly pageSize = signal(8);
  public readonly totalItems = signal(0);
  public readonly sortField = signal<keyof EmployeeInterface | ''>('');
  public readonly sortDirection = signal<'asc' | 'desc'>('asc');
  public readonly isLoading = signal(false);
  public readonly loadError = signal('');

  public selectedEmployee: EmployeeInterface | null = null;
  public employeeToDelete: EmployeeInterface | null = null;
  public showEmployeeModal = false;
  public showDeleteModal = false;

  public readonly employeeColumns: TableColumn[] = [
  { key: 'employeeId', label: 'ID', sortable: true },
  { key: 'employeeName', label: 'Name' },
  { key: 'employeeAge', label: 'Age', sortable: true },
  { key: 'employeeDepartment', label: 'Department' },
  { key: 'employeeRole', label: 'Role' },
];

private readonly employeeService = inject(EmployeeService);
private readonly authService = inject(AuthService);
private readonly mockEmployeeApi = inject(MockEmployeeApiService);
private readonly destroyRef = inject(DestroyRef);
private pageRequest: Subscription | null = null;
public readonly allEmployees = this.employeeService.employees;

public constructor() {
  this.loadEmployees();
}

  public get canAdd(): boolean {
    return this.authService.hasPermission('add');
  }

  public get canEdit(): boolean {
    return this.authService.hasPermission('edit');
  }

  public get canDelete(): boolean {
    return this.authService.hasPermission('delete');
  }


  public onSearchChange(value: InputValue): void {
    const searchTerm = String(value ?? '').trim();
    if (searchTerm === this.searchTerm) {
      return;
    }

    this.searchTerm = searchTerm;
    this.currentPage.set(1);
    this.loadEmployees();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadEmployees();
  }

  public onPageSizeChange(pageSize: number): void {
    this.pageSize.set(pageSize);
    this.currentPage.set(1);
    this.loadEmployees();
  }

  public onSortChange(sort: TableSortEvent): void {
    this.sortField.set(sort.field);
    this.sortDirection.set(sort.direction);
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.pageRequest?.unsubscribe();
    this.isLoading.set(true);
    this.loadError.set('');

    this.pageRequest = this.mockEmployeeApi
      .getEmployeesPage(
        this.currentPage(),
        this.pageSize(),
        this.searchTerm,
        this.sortField(),
        this.sortDirection(),
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.displayedEmployees.set(response.items);
          this.currentPage.set(response.currentPage);
          this.pageSize.set(response.pageSize);
          this.totalItems.set(response.totalItems);
        },
        error: () => {
          this.loadError.set(
            'Unable to load employees. Please try again.',
          );
        },
      });
  }

  public openAddModal(): void {
    if (!this.canAdd) {
      return;
    }
    this.selectedEmployee = null;
    this.showEmployeeModal = true;
  }

  public openEditModal(employee: EmployeeInterface): void {
    if (!this.canEdit) {
      return;
    }
    this.selectedEmployee = employee;
    this.showEmployeeModal = true;
  }

  public closeEmployeeModal(): void {
    this.selectedEmployee = null;
    this.showEmployeeModal = false;
  }

  public saveEmployee(employee: EmployeeInterface): void {
    if (this.selectedEmployee) {
      if (this.canEdit) {
        this.employeeService.updateEmployee(employee);
        this.loadEmployees();
      }
    } else if (this.canAdd) {
      this.employeeService.addEmployee(employee);
      this.loadEmployees();
    }

    this.closeEmployeeModal();
  }

  public requestDelete(employee: EmployeeInterface): void {
    if (!this.canDelete) {
      return;
    }
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  public confirmDelete(employee: EmployeeInterface | null): void {
    if (!employee || !this.canDelete) {
      this.cancelDelete();
      return;
    }

    this.employeeService.deleteEmployee(employee.employeeId);
    this.cancelDelete();
    this.loadEmployees();
  }

  public cancelDelete(): void {
    this.employeeToDelete = null;
    this.showDeleteModal = false;
  }

  public onTableAction(event: TableActionEvent): void {
   const employee = event.row as EmployeeInterface;

   switch (event.action) {
    case 'edit':
      this.openEditModal(employee);
      break;

    case 'delete':
      this.requestDelete(employee);
      break;
  }
  }
}
