
import { Component, computed, inject } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import type { TooltipComponentFormatterCallbackParams } from 'echarts';

import { EmployeeService } from '../../../../core/services/employee.service';
import { ThemeService } from '../../../../core/services/theme.service';

import { CustomChartComponent } from 'employee-management-shared';

@Component({
  selector: 'app-employee-analysis',
  standalone: true,
  imports: [CustomChartComponent],
  templateUrl: './employee-analysis.component.html',
  styleUrl: './employee-analysis.component.css',
})
export class EmployeeAnalysisComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly themeService = inject(ThemeService);

  public readonly employees = this.employeeService.employees;

  public readonly chartOptions = computed<EChartsCoreOption | null>(() => {
    this.themeService.theme();

    const employees = this.employees();
    if (employees.length === 0) {
      return null;
    }

    const departmentCounts = new Map<string, number>();
    for (const employee of employees) {
      const department = employee.employeeDepartment?.trim() || 'Unassigned';
      departmentCounts.set(
        department,
        (departmentCounts.get(department) ?? 0) + 1,
      );
    }

    const departments = [...departmentCounts.keys()];
    const counts = [...departmentCounts.values()];
    const textColor = this.getToken('--text');
    const mutedColor = this.getToken('--text-muted');
    const borderColor = this.getToken('--border');

    return {
      animationDuration: 500,
      grid: {
        left: 45,
        right: 20,
        top: 25,
        bottom: 65,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: this.getToken('--surface'),
        borderColor,
        textStyle: {
          color: textColor,
        },
      },
      xAxis: {
        type: 'category',
        data: departments,
        axisLabel: {
          color: mutedColor,
          interval: 0,
          rotate: departments.length > 4 ? 25 : 0,
        },
        axisLine: {
          lineStyle: { color: borderColor },
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: mutedColor,
        },
        splitLine: {
          lineStyle: {
            color: borderColor,
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: 'Employees',
          type: 'bar',
          data: counts,
          barMaxWidth: 48,
          itemStyle: {
            color: this.getToken('--chart-department'),
            borderRadius: [5, 5, 0, 0],
          },
        },
      ],
      textStyle: {
        color: textColor,
        fontFamily: 'Segoe UI, Arial, sans-serif',
      },
    };
  });

  public readonly ageChartOptions = computed<EChartsCoreOption | null>(() => {
    this.themeService.theme();

    const employees = this.employees();
    const ageGroups = [
      { name: 'Under 20', value: 0, colorToken: '--chart-age-under-20' },
      { name: '20-29', value: 0, colorToken: '--chart-age-20-29' },
      { name: '30-39', value: 0, colorToken: '--chart-age-30-39' },
      { name: '40-49', value: 0, colorToken: '--chart-age-40-49' },
      { name: '50+', value: 0, colorToken: '--chart-age-50-plus' },
    ];

    for (const employee of employees) {
      const age = employee.employeeAge;
      if (!Number.isFinite(age) || age < 0) {
        continue;
      }

      const groupIndex =
        age < 20 ? 0 : age < 30 ? 1 : age < 40 ? 2 : age < 50 ? 3 : 4;
      ageGroups[groupIndex].value++;
    }

    const data = ageGroups
      .filter((group) => group.value > 0)
      .map((group) => ({
        name: group.name,
        value: group.value,
        itemStyle: {
          color: this.getToken(group.colorToken),
        },
      }));
    if (data.length === 0) {
      return null;
    }

    const textColor = this.getToken('--text');
    const mutedColor = this.getToken('--text-muted');
    const borderColor = this.getToken('--border');

    return {
      animationDuration: 500,
      legend: {
        bottom: 0,
        left: 'center',
        textStyle: {
          color: mutedColor,
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: this.getToken('--surface'),
        borderColor,
        textStyle: {
          color: textColor,
        },
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          const item = Array.isArray(params) ? params[0] : params;
          return item
            ? `${item.marker ?? ''}${item.name}: ${item.value} employees (${item.percent}%)`
            : '';
        },
      },
      series: [
        {
          name: 'Employees by Age',
          type: 'pie',
          radius: '62%',
          center: ['50%', '43%'],
          data,
          label: {
            color: textColor,
            formatter: '{d}%',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetY: 2,
            },
          },
        },
      ],
      textStyle: {
        color: textColor,
        fontFamily: 'Segoe UI, Arial, sans-serif',
      },
    };
  });

  public get totalEmployees(): number {
    return this.employees().length;
  }

  public get totalDepartments(): number {
    return new Set(
      this.employees()
        .map((employee) => employee.employeeDepartment?.trim())
        .filter((department) => !!department),
    ).size;
  }

  private getToken(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }
}
