import { Component, inject } from '@angular/core';

import { ThemeService } from '@employee-management/data';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {

  public readonly theme = inject(ThemeService);

}
