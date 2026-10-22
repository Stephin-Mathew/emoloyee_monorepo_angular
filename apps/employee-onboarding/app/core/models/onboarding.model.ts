import { EmployeeInterface } from 'employee-management-shared';

export type OnboardingStatus = 'not-started' | 'in-progress' | 'completed';

export type TaskCategory = 'Admin' | 'IT' | 'Team' | 'Learning';

export interface OnboardingTask {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: TaskCategory;
}

/** Completed task ids, keyed by `employeeId`. */
export type ProgressByHire = Record<number, readonly string[]>;

export interface HireProgress {
  readonly hire: EmployeeInterface;
  readonly completed: number;
  readonly total: number;
  /** Whole number, 0–100. */
  readonly percent: number;
  readonly status: OnboardingStatus;
}

export interface OnboardingStats {
  readonly totalHires: number;
  readonly completedHires: number;
  readonly inProgressHires: number;
  readonly notStartedHires: number;
  /** Mean completion across all hires, whole number 0–100. */
  readonly averagePercent: number;
  readonly outstandingTasks: number;
}
