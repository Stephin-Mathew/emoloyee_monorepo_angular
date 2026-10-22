import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
  readonly exact: boolean;
}

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  protected readonly items: readonly NavItem[] = [
    { label: 'Overview', path: '/', icon: 'icon-dashboard', exact: true },
    { label: 'New hires', path: '/hires', icon: 'icon-table', exact: false },
    { label: 'Checklists', path: '/checklist', icon: 'icon-employee-list', exact: false },
  ];
}
