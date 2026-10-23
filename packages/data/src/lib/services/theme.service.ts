import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly document = inject(DOCUMENT);

  public readonly theme = signal<Theme>(this.getInitialTheme());
  public readonly isDark = computed(() => this.theme() === 'dark');

  public constructor() {
    effect(() => {
      this.document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  public toggle(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  public setTheme(theme: Theme): void {
    this.theme.set(theme);
      localStorage.setItem(STORAGE_KEY, theme);
  }

  private getInitialTheme(): Theme {
    const applied = this.document.documentElement.getAttribute('data-theme');
    if (applied === 'light' || applied === 'dark') {
      return applied;
    }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      else{
        return 'light';
      }
  }
}
