import { EmployeeInterface } from 'employee-management-shared';

import {
  HireProgress,
  OnboardingStats,
  OnboardingStatus,
  OnboardingTask,
  ProgressByHire,
} from '../models/onboarding.model';

export function toStatus(completed: number, total: number): OnboardingStatus {
  if (completed <= 0) {
    return 'not-started';
  }
  return completed >= total ? 'completed' : 'in-progress';
}

export function toPercent(completed: number, total: number): number {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

/** Builds one hire's progress. Ids that aren't part of `tasks` are ignored. */
export function summariseHire(
  hire: EmployeeInterface,
  completedIds: readonly string[],
  tasks: readonly OnboardingTask[],
): HireProgress {
  const known = new Set(tasks.map((task) => task.id));
  const completed = new Set(completedIds.filter((id) => known.has(id))).size;
  const total = tasks.length;

  return {
    hire,
    completed,
    total,
    percent: toPercent(completed, total),
    status: toStatus(completed, total),
  };
}

export function buildStats(summaries: readonly HireProgress[]): OnboardingStats {
  const count = (status: OnboardingStatus): number =>
    summaries.filter((summary) => summary.status === status).length;

  const totalPercent = summaries.reduce((sum, summary) => sum + summary.percent, 0);

  return {
    totalHires: summaries.length,
    completedHires: count('completed'),
    inProgressHires: count('in-progress'),
    notStartedHires: count('not-started'),
    averagePercent: summaries.length === 0 ? 0 : Math.round(totalPercent / summaries.length),
    outstandingTasks: summaries.reduce((sum, summary) => sum + (summary.total - summary.completed), 0),
  };
}

export function isProgressMap(value: unknown): value is ProgressByHire {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every(
    (ids) => Array.isArray(ids) && ids.every((id) => typeof id === 'string'),
  );
}
