import { EmployeeInterface } from 'employee-management-shared';

export type SortDirection = 'asc' | 'desc';

export interface TableQuery {
  readonly search: string;
  readonly sortField: keyof EmployeeInterface | '';
  readonly sortDirection: SortDirection;
  readonly page: number;
  readonly pageSize: number;
}

export interface TablePage {
  readonly items: EmployeeInterface[];
  readonly totalItems: number;
  /** The page actually returned, clamped into range (e.g. after deleting the last row). */
  readonly page: number;
}

/** Applies search, sort, and pagination in that order. Pure: never mutates `rows`. */
export function queryEmployees(rows: readonly EmployeeInterface[], query: TableQuery): TablePage {
  const term = query.search.trim().toLowerCase();

  const matches =
    term === ''
      ? [...rows]
      : rows.filter((row) =>
          Object.values(row).some((value) => String(value).toLowerCase().includes(term)),
        );

  const { sortField, sortDirection } = query;
  if (sortField !== '') {
    const direction = sortDirection === 'asc' ? 1 : -1;
    matches.sort((a, b) => {
      const first = a[sortField];
      const second = b[sortField];
      const order =
        typeof first === 'number' && typeof second === 'number'
          ? first - second
          : String(first).localeCompare(String(second));
      return order * direction;
    });
  }

  const totalPages = Math.max(1, Math.ceil(matches.length / query.pageSize));
  const page = Math.min(Math.max(1, query.page), totalPages);
  const start = (page - 1) * query.pageSize;

  return { items: matches.slice(start, start + query.pageSize), totalItems: matches.length, page };
}
