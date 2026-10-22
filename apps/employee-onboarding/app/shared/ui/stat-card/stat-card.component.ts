import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
})
export class StatCardComponent {
  public readonly label = input.required<string>();
  public readonly value = input.required<string | number>();
  public readonly hint = input('');
}
