import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';

import { ONBOARDING_TASKS } from '../constants/onboarding-tasks';
import { SEED_PROGRESS } from '../data/seed';
import { HireProgress, ProgressByHire } from '../models/onboarding.model';
import { buildStats, isProgressMap, summariseHire } from '../utils/onboarding-progress';
import { readJson, writeJson } from '../utils/safe-storage';
import { HireService } from './hire.service';

const STORAGE_KEY = 'employee-onboarding.progress';

/** Tracks which checklist tasks each hire has completed, and derives progress from that. */
@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly hireService = inject(HireService);

  private readonly progress = signal<ProgressByHire>(
    readJson(STORAGE_KEY, isProgressMap) ?? SEED_PROGRESS,
  );

  public readonly tasks = ONBOARDING_TASKS;

  public readonly summaries = computed<HireProgress[]>(() =>
    this.hireService
      .hires()
      .map((hire) => summariseHire(hire, this.progress()[hire.employeeId] ?? [], this.tasks)),
  );

  public readonly stats = computed(() => buildStats(this.summaries()));

  public constructor() {
    // When a hire is deleted, drop their progress so a reused id can't inherit it.
    effect(() => {
      const knownIds = new Set(this.hireService.hires().map((hire) => hire.employeeId));
      const current = untracked(() => this.progress());
      const staleIds = Object.keys(current)
        .map(Number)
        .filter((id) => !knownIds.has(id));

      if (staleIds.length > 0) {
        const next = { ...current };
        staleIds.forEach((id) => delete next[id]);
        this.commit(next);
      }
    });
  }

  public isCompleted(employeeId: number, taskId: string): boolean {
    return (this.progress()[employeeId] ?? []).includes(taskId);
  }

  public setTaskCompleted(employeeId: number, taskId: string, completed: boolean): void {
    const without = (this.progress()[employeeId] ?? []).filter((id) => id !== taskId);
    const updated = completed ? [...without, taskId] : without;
    this.commit({ ...this.progress(), [employeeId]: updated });
  }

  private commit(progress: ProgressByHire): void {
    this.progress.set(progress);
    writeJson(STORAGE_KEY, progress);
  }
}
