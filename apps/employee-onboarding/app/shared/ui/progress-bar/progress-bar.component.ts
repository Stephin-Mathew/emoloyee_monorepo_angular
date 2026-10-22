import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class ProgressBarComponent {
  /** Whole number, 0–100. */
  public readonly value = input.required<number>();
  public readonly label = input('Progress');

  protected readonly clamped = computed(() => Math.min(100, Math.max(0, this.value())));
}
