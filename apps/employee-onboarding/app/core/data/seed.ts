import { EmployeeInterface } from 'employee-management-shared';

import { ProgressByHire } from '../models/onboarding.model';

/** First-run data so the app is useful before anyone adds a hire. */
export const SEED_HIRES: readonly EmployeeInterface[] = [
  { employeeId: 201, employeeName: 'Aarav Nair', employeeAge: 26, employeeDepartment: 'Engineering', employeeRole: 'Frontend Engineer' },
  { employeeId: 202, employeeName: 'Meera Joseph', employeeAge: 29, employeeDepartment: 'Design', employeeRole: 'Product Designer' },
  { employeeId: 203, employeeName: 'Rohan Das', employeeAge: 33, employeeDepartment: 'Finance', employeeRole: 'Financial Analyst' },
  { employeeId: 204, employeeName: 'Anjali Menon', employeeAge: 24, employeeDepartment: 'Marketing', employeeRole: 'Content Strategist' },
  { employeeId: 205, employeeName: 'Kabir Shah', employeeAge: 38, employeeDepartment: 'Engineering', employeeRole: 'Backend Engineer' },
  { employeeId: 206, employeeName: 'Sneha Pillai', employeeAge: 31, employeeDepartment: 'People', employeeRole: 'Talent Partner' },
  { employeeId: 207, employeeName: 'Vikram Rao', employeeAge: 42, employeeDepartment: 'Operations', employeeRole: 'Operations Lead' },
  { employeeId: 208, employeeName: 'Diya Thomas', employeeAge: 27, employeeDepartment: 'Engineering', employeeRole: 'QA Engineer' },
];

export const SEED_PROGRESS: ProgressByHire = {
  201: ['paperwork', 'equipment', 'security', 'intro', 'goals', 'checkin'],
  202: ['paperwork', 'equipment', 'security', 'intro'],
  203: ['paperwork', 'equipment'],
  204: ['paperwork'],
  205: ['paperwork', 'equipment', 'security', 'intro', 'goals', 'checkin'],
  206: ['paperwork', 'equipment', 'intro', 'goals', 'checkin'],
  207: [],
};
