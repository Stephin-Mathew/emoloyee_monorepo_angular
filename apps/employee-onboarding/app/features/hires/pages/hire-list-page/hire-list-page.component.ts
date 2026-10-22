import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CustomCheckboxComponent,
  CustomTableComponent,
  EmployeeInterface,
  InputValue,
  TableActionEvent,
  TableColumn,
  TableHeaderComponent,
  TableSortEvent,
} from 'employee-management-shared';

import { HireService } from '../../../../core/services/hire.service';
import { OnboardingService } from '../../../../core/services/onboarding.service';
import { isEmployee } from '../../../../core/utils/employee-guards';
import { queryEmployees, SortDirection } from '../../../../core/utils/table-query';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-hire-list-page',
  standalone: true,
  imports: [
    CustomCheckboxComponent,
    CustomTableComponent,
    TableHeaderComponent,
    ConfirmDialogComponent,
    PageHeaderComponent,
  ],
  templateUrl: './hire-list-page.component.html',
  styleUrl: './hire-list-page.component.css',
})
export class HireListPageComponent {
  private readonly router = inject(Router);
  private readonly hireService = inject(HireService);
  private readonly onboarding = inject(OnboardingService);

  protected readonly columns: TableColumn[] = [
    { key: 'employeeId', label: 'ID', sortable: true },
    { key: 'employeeName', label: 'Name', sortable: true },
    { key: 'employeeDepartment', label: 'Department', sortable: true },
    { key: 'employeeRole', label: 'Role', sortable: true },
    { key: 'employeeAge', label: 'Age', sortable: true },
  ];

  protected readonly search = signal('');
  protected readonly hideCompleted = signal(false);
  protected readonly sortField = signal<keyof EmployeeInterface | ''>('');
  protected readonly sortDirection = signal<SortDirection>('asc');
  protected readonly requestedPage = signal(1);
  protected readonly pageSize = signal(8);
  protected readonly pendingDelete = signal<EmployeeInterface | null>(null);

  private readonly completedIds = computed(
    () =>
      new Set(
        this.onboarding
          .summaries()
          .filter((summary) => summary.status === 'completed')
          .map((summary) => summary.hire.employeeId),
      ),
  );

  private readonly candidates = computed(() =>
    this.hideCompleted()
      ? this.hireService.hires().filter((hire) => !this.completedIds().has(hire.employeeId))
      : this.hireService.hires(),
  );

  protected readonly result = computed(() =>
    queryEmployees(this.candidates(), {
      search: this.search(),
      sortField: this.sortField(),
      sortDirection: this.sortDirection(),
      page: this.requestedPage(),
      pageSize: this.pageSize(),
    }),
  );

  protected onSearch(value: InputValue): void {
    this.search.set(String(value ?? ''));
    this.requestedPage.set(1);
  }

  protected onHideCompletedChange(checked: boolean): void {
    this.hideCompleted.set(checked);
    this.requestedPage.set(1);
  }

  protected onSortChange(event: TableSortEvent): void {
    this.sortField.set(event.field);
    this.sortDirection.set(event.direction);
    this.requestedPage.set(1);
  }

  protected onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.requestedPage.set(1);
  }

  protected addHire(): void {
    void this.router.navigate(['/hires', 'new']);
  }

  protected onRowAction(event: TableActionEvent): void {
    if (!isEmployee(event.row)) {
      return;
    }
    if (event.action === 'edit') {
      void this.router.navigate(['/hires', event.row.employeeId, 'edit']);
    } else {
      this.pendingDelete.set(event.row);
    }
  }

  protected confirmDelete(): void {
    const hire = this.pendingDelete();
    if (hire) {
      this.hireService.remove(hire.employeeId);
    }
    this.pendingDelete.set(null);
  }
}
