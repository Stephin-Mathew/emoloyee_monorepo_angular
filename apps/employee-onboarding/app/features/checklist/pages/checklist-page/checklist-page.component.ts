import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomCheckboxComponent } from 'employee-management-shared';

import { OnboardingTask } from '../../../../core/models/onboarding.model';
import { OnboardingService } from '../../../../core/services/onboarding.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';

const STATUS_LABELS = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
} as const;

@Component({
  selector: 'app-checklist-page',
  standalone: true,
  imports: [RouterLink, CustomCheckboxComponent, PageHeaderComponent, ProgressBarComponent],
  templateUrl: './checklist-page.component.html',
  styleUrl: './checklist-page.component.css',
})
export class ChecklistPageComponent {
  private readonly onboarding = inject(OnboardingService);

  /** Bound from the optional `:id` route param. */
  public readonly id = input<string>();

  protected readonly tasks = this.onboarding.tasks;
  protected readonly summaries = this.onboarding.summaries;
  protected readonly statusLabels = STATUS_LABELS;

  /** The requested hire, or the first one when the id is missing or unknown. */
  protected readonly selected = computed(() => {
    const all = this.summaries();
    const requested = Number(this.id());
    return all.find((summary) => summary.hire.employeeId === requested) ?? all[0];
  });

  protected isCompleted(task: OnboardingTask): boolean {
    const current = this.selected();
    return current !== undefined && this.onboarding.isCompleted(current.hire.employeeId, task.id);
  }

  protected toggle(task: OnboardingTask, completed: boolean): void {
    const current = this.selected();
    if (current) {
      this.onboarding.setTaskCompleted(current.hire.employeeId, task.id, completed);
    }
  }
}
