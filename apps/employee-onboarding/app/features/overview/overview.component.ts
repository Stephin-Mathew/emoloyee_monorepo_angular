import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomChartComponent } from 'employee-management-shared';

import { OnboardingService } from '../../core/services/onboarding.service';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { ProgressBarComponent } from '../../shared/ui/progress-bar/progress-bar.component';
import { StatCardComponent } from '../../shared/ui/stat-card/stat-card.component';
import { buildDepartmentChart, buildStatusChart } from './overview-charts';

const ATTENTION_LIMIT = 5;

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    RouterLink,
    CustomChartComponent,
    PageHeaderComponent,
    ProgressBarComponent,
    StatCardComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {
  private readonly onboarding = inject(OnboardingService);

  protected readonly stats = this.onboarding.stats;

  protected readonly statusChart = computed(() => buildStatusChart(this.stats()));

  protected readonly departmentChart = computed(() =>
    buildDepartmentChart(this.onboarding.summaries().map((summary) => summary.hire)),
  );

  /** Hires still onboarding, furthest behind first. */
  protected readonly needsAttention = computed(() =>
    this.onboarding
      .summaries()
      .filter((summary) => summary.status !== 'completed')
      .sort((a, b) => a.percent - b.percent)
      .slice(0, ATTENTION_LIMIT),
  );
}
