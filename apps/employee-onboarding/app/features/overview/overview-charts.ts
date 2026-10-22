import type { EChartsCoreOption } from 'echarts/core';
import { EmployeeInterface } from 'employee-management-shared';

import { OnboardingStats } from '../../core/models/onboarding.model';

const TEXT = '#334155';
const MUTED = '#64748b';
const GRID = '#e2e8f0';

const STATUS_COLOURS = {
  completed: '#2f9e63',
  inProgress: '#d98a1c',
  notStarted: '#94a3b8',
} as const;

/** Donut of hires by onboarding status. Returns null when there is nothing to show. */
export function buildStatusChart(stats: OnboardingStats): EChartsCoreOption | null {
  if (stats.totalHires === 0) {
    return null;
  }

  const data = [
    { name: 'Completed', value: stats.completedHires, itemStyle: { color: STATUS_COLOURS.completed } },
    { name: 'In progress', value: stats.inProgressHires, itemStyle: { color: STATUS_COLOURS.inProgress } },
    { name: 'Not started', value: stats.notStartedHires, itemStyle: { color: STATUS_COLOURS.notStarted } },
  ].filter((slice) => slice.value > 0);

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} hires ({d}%)' },
    legend: { bottom: 0, left: 'center', textStyle: { color: MUTED } },
    series: [
      {
        name: 'Onboarding status',
        type: 'pie',
        radius: ['45%', '68%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        label: { color: TEXT, formatter: '{c}' },
        data,
      },
    ],
    textStyle: { color: TEXT },
  };
}

/** Bar chart of hires per department. Returns null when there are no hires. */
export function buildDepartmentChart(hires: readonly EmployeeInterface[]): EChartsCoreOption | null {
  if (hires.length === 0) {
    return null;
  }

  const counts = new Map<string, number>();
  for (const hire of hires) {
    const department = hire.employeeDepartment.trim() || 'Unassigned';
    counts.set(department, (counts.get(department) ?? 0) + 1);
  }

  const departments = [...counts.keys()].sort();

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 36, right: 16, top: 24, bottom: 48, containLabel: true },
    xAxis: {
      type: 'category',
      data: departments,
      axisLabel: { color: MUTED, interval: 0, rotate: departments.length > 4 ? 25 : 0 },
      axisLine: { lineStyle: { color: GRID } },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: MUTED },
      splitLine: { lineStyle: { color: GRID, type: 'dashed' } },
    },
    series: [
      {
        name: 'New hires',
        type: 'bar',
        data: departments.map((department) => counts.get(department) ?? 0),
        barMaxWidth: 44,
        itemStyle: { color: '#4e79a7', borderRadius: [5, 5, 0, 0] },
      },
    ],
    textStyle: { color: TEXT },
  };
}
