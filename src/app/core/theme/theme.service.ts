import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';

const THEME_KEY = 'beaconn.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<Theme>(this.initialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    this.applyTheme(nextTheme);
  }

  private initialTheme(): Theme {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return globalThis.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.dataset['theme'] = theme;
  }
}
