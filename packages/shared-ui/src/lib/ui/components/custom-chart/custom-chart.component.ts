import { Component, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts/core';

import { BarChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';

echarts.use([
  BarChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-custom-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './custom-chart.component.html',
  styleUrl: './custom-chart.component.css',
})
export class CustomChartComponent {
  public readonly options = input<EChartsCoreOption | null>(null);
}
