import { EmployeeInterface } from 'employee-management-shared';

import { OnboardingTask } from '../models/onboarding.model';
import { buildStats, isProgressMap, summariseHire, toPercent, toStatus } from './onboarding-progress';

const hire: EmployeeInterface = {
  employeeId: 1,
  employeeName: 'Test Hire',
  employeeAge: 30,
  employeeDepartment: 'Design',
  employeeRole: 'Designer',
};

const tasks: OnboardingTask[] = ['a', 'b', 'c', 'd'].map((id) => ({
  id,
  title: id,
  description: id,
  category: 'Admin',
}));

describe('onboarding-progress', () => {
  it('derives status from completed count', () => {
    expect(toStatus(0, 4)).toBe('not-started');
    expect(toStatus(2, 4)).toBe('in-progress');
    expect(toStatus(4, 4)).toBe('completed');
  });

  it('rounds percentages and guards against zero tasks', () => {
    expect(toPercent(1, 3)).toBe(33);
    expect(toPercent(0, 0)).toBe(0);
  });

  it('ignores unknown and duplicate task ids', () => {
    const summary = summariseHire(hire, ['a', 'a', 'ghost'], tasks);
    expect(summary.completed).toBe(1);
    expect(summary.percent).toBe(25);
    expect(summary.status).toBe('in-progress');
  });

  it('aggregates stats across hires', () => {
    const stats = buildStats([
      summariseHire(hire, ['a', 'b', 'c', 'd'], tasks),
      summariseHire({ ...hire, employeeId: 2 }, ['a'], tasks),
      summariseHire({ ...hire, employeeId: 3 }, [], tasks),
    ]);

    expect(stats).toEqual({
      totalHires: 3,
      completedHires: 1,
      inProgressHires: 1,
      notStartedHires: 1,
      averagePercent: 42,
      outstandingTasks: 7,
    });
  });

  it('returns zeroed stats when there are no hires', () => {
    expect(buildStats([]).averagePercent).toBe(0);
  });

  it('validates stored progress maps', () => {
    expect(isProgressMap({ 1: ['a'] })).toBe(true);
    expect(isProgressMap({ 1: 'a' })).toBe(false);
    expect(isProgressMap([])).toBe(false);
    expect(isProgressMap(null)).toBe(false);
  });
});
