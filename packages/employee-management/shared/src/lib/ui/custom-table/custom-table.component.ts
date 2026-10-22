import { Component, computed, EventEmitter, input, Output } from '@angular/core';

import {
  TableColumn,
  TableActionEvent,
  TableSortEvent,
} from '../../models/table.interface';
import { EmployeeInterface } from '../../models/employee.interface';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
})
export class CustomTableComponent {
  readonly rows = input<EmployeeInterface[]>([]);
  readonly columns = input<TableColumn[]>([]);
  readonly currentPage = input(1);
  readonly pageSize = input(8);
  readonly totalItems = input(0);
  readonly sortField = input<keyof EmployeeInterface | ''>('');
  readonly sortDirection = input<'asc' | 'desc'>('asc');
  readonly canEdit = input(false);
  readonly canDelete = input(false);
  readonly loading = input(false);
  readonly errorMessage = input('');

  @Output() rowAction = new EventEmitter<TableActionEvent>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<TableSortEvent>();

  public readonly pageSizeOptions = [5, 8, 10, 20, 50];

  public readonly showActions = computed(() =>
    this.canEdit() || this.canDelete(),
  );

  public readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.pageSize()),
  );

  public readonly startItem = computed(() =>
    this.totalItems() === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  public readonly endItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems()),
  );

  public getCellValue(
    row: EmployeeInterface,
    key: keyof EmployeeInterface,
  ): string | number {
    return row[key];
  }

  public toggleSort(column: TableColumn): void {
    if (!column.sortable) {
      return;
    }

    const direction =
      this.sortField() === column.key && this.sortDirection() === 'asc'
        ? 'desc'
        : 'asc';

    this.sortChange.emit({ field: column.key, direction });
  }

  public emitAction(action: 'edit' | 'delete', row: object): void {
    this.rowAction.emit({ action, row });
  }

  public goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    if (page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  public previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  public nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  public onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const pageSize = Number(select.value);
    if (Number.isInteger(pageSize) && pageSize > 0) {
      this.pageSizeChange.emit(pageSize);
    }
  }
}
