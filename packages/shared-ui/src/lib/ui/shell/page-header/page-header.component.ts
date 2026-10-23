import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, SignupDetails } from '@employee-management/data';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {

  private readonly authService = inject(AuthService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);

  public showAccountMenu = false;
  public showSettingsMenu = false;
  public showProfileModal = false;

  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public get currentUser(): SignupDetails | null {
    return this.authService.getLoggedInUser();
  }

  public toggleAccountMenu(): void {
    this.showSettingsMenu = false;
    this.showAccountMenu = !this.showAccountMenu;
  }

  public toggleSettingsMenu(): void {
    this.showAccountMenu = false;
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  public goTo(path: string): void {
    this.showSettingsMenu = false;
    void this.router.navigate([path]);
  }

  public openProfile(): void {
    this.showAccountMenu = false;
    this.showProfileModal = true;
  }

  public closeProfile(): void {
    this.showProfileModal = false;
  }

  public logout(): void {
    this.showAccountMenu = false;
    this.showProfileModal = false;
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  public closeAccountMenuOnOutsideClick(event: MouseEvent): void {
    if (
      event.target instanceof Node &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.showAccountMenu = false;
      this.showSettingsMenu = false;
    }
  }

  @HostListener('document:keydown.escape')
  public closeOverlaysOnEscape(): void {
    this.showAccountMenu = false;
    this.showSettingsMenu = false;
    this.showProfileModal = false;
  }
}