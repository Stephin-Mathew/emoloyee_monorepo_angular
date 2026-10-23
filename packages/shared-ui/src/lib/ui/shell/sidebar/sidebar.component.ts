import { Component, HostBinding } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @HostBinding('class.expanded') isExpanded = false;

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }
}