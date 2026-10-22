import { EmployeeInterface } from 'employee-management-shared';

import { queryEmployees, TableQuery } from './table-query';

const rows: EmployeeInterface[] = [
  { employeeId: 1, employeeName: 'Charlie', employeeAge: 40, employeeDepartment: 'IT', employeeRole: 'Dev' },
  { employeeId: 2, employeeName: 'Alice', employeeAge: 25, employeeDepartment: 'HR', employeeRole: 'Lead' },
  { employeeId: 3, employeeName: 'Bob', employeeAge: 31, employeeDepartment: 'IT', employeeRole: 'QA' },
];

const base: TableQuery = { search: '', sortField: '', sortDirection: 'asc', page: 1, pageSize: 2 };

describe('queryEmployees', () => {
  it('paginates and reports the unpaginated total', () => {
    const result = queryEmployees(rows, base);
    expect(result.items.map((r) => r.employeeId)).toEqual([1, 2]);
    expect(result.totalItems).toBe(3);
  });

  it('searches across every field, case-insensitively', () => {
    const result = queryEmployees(rows, { ...base, search: ' it ' });
    expect(result.items.map((r) => r.employeeName)).toEqual(['Charlie', 'Bob']);
  });

  it('sorts numbers numerically and strings alphabetically, in either direction', () => {
    expect(queryEmployees(rows, { ...base, sortField: 'employeeAge' }).items[0].employeeName).toBe('Alice');
    const desc = queryEmployees(rows, { ...base, sortField: 'employeeName', sortDirection: 'desc' });
    expect(desc.items[0].employeeName).toBe('Charlie');
  });

  it('clamps an out-of-range page', () => {
    const result = queryEmployees(rows, { ...base, page: 9 });
    expect(result.page).toBe(2);
    expect(result.items).toHaveLength(1);
  });

  it('does not mutate the input rows', () => {
    const snapshot = [...rows];
    queryEmployees(rows, { ...base, sortField: 'employeeName' });
    expect(rows).toEqual(snapshot);
  });

  it('handles no matches', () => {
    const result = queryEmployees(rows, { ...base, search: 'zzz' });
    expect(result).toEqual({ items: [], totalItems: 0, page: 1 });
  });
});
