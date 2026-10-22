import { TestBed } from '@angular/core/testing';

import { HireService } from './hire.service';
import { OnboardingService } from './onboarding.service';

describe('OnboardingService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('derives summaries and stats from seed progress', () => {
    const service = TestBed.inject(OnboardingService);
    const stats = service.stats();

    expect(stats.totalHires).toBe(8);
    expect(stats.completedHires).toBe(2); // 201 and 205 finished every task
    expect(stats.notStartedHires).toBe(2); // 207 (empty list) and 208 (no entry)
  });

  it('toggles a task and updates derived progress', () => {
    const service = TestBed.inject(OnboardingService);
    const percentFor = (id: number) =>
      service.summaries().find((s) => s.hire.employeeId === id)?.percent;

    expect(service.isCompleted(207, 'paperwork')).toBe(false);
    service.setTaskCompleted(207, 'paperwork', true);
    expect(service.isCompleted(207, 'paperwork')).toBe(true);
    expect(percentFor(207)).toBe(17);

    service.setTaskCompleted(207, 'paperwork', false);
    expect(percentFor(207)).toBe(0);
  });

  it('does not double-count a task ticked twice', () => {
    const service = TestBed.inject(OnboardingService);
    service.setTaskCompleted(207, 'intro', true);
    service.setTaskCompleted(207, 'intro', true);
    expect(service.summaries().find((s) => s.hire.employeeId === 207)?.completed).toBe(1);
  });

  it('drops progress for a deleted hire so a reused id starts clean', () => {
    const hires = TestBed.inject(HireService);
    const service = TestBed.inject(OnboardingService);

    hires.remove(201);
    TestBed.tick(); // flush the pruning effect

    // 201 was the lowest id; delete the highest and re-add to force an id reuse.
    hires.remove(208);
    const reused = hires.add({
      employeeName: 'Replacement',
      employeeAge: 28,
      employeeDepartment: 'Finance',
      employeeRole: 'Analyst',
    });
    TestBed.tick();

    expect(reused.employeeId).toBe(208);
    expect(service.isCompleted(201, 'paperwork')).toBe(false);
    expect(service.summaries().find((s) => s.hire.employeeId === 208)?.completed).toBe(0);
  });
});
