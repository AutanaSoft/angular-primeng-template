import { Component, DOCUMENT, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ThemeState, type ThemeMode } from '../../core/theme/theme-state';

interface ThemeOption {
  label: string;
  value: ThemeMode;
  icon: string;
}

@Component({
  selector: 'app-theme-switcher',
  imports: [FormsModule, SelectButtonModule],
  templateUrl: './theme-switcher.html',
  host: {
    role: 'group',
    'aria-label': 'Color theme',
  },
})
export class ThemeSwitcher {
  protected readonly theme = signal<ThemeMode>('auto');

  protected readonly options: ThemeOption[] = [
    { label: 'Light', value: 'light', icon: 'pi pi-sun' },
    { label: 'Dark', value: 'dark', icon: 'pi pi-moon' },
    { label: 'Auto', value: 'auto', icon: 'pi pi-desktop' },
  ];

  private readonly document = inject(DOCUMENT);
  private readonly themeState = inject(ThemeState);

  constructor() {
    // Reflect the resolved theme on <html>. The PrimeNG preset itself is
    // configured once in `app.config.ts`; this component only toggles the
    // `dark` attribute that PrimeNG's `darkModeSelector: '[dark]'` reads.
    //
    // The shared `ThemeState` is kept in sync so other components (e.g. the
    // showcase's `p-knob` SVG fills, which cannot read CSS variables) can
    // react to the live resolved mode.
    //
    // NOTE: this `effect()` runs in the browser only (uses `document`).
    // If a future change introduces SSR (provideServerRendering), guard
    // this block with `isPlatformBrowser(inject(PLATFORM_ID))` so it
    // skips during prerender.
    effect(() => {
      const mode = this.theme();
      const root = this.document.documentElement;

      this.themeState.setMode(mode);

      if (mode === 'dark') {
        root.setAttribute('dark', '');
        this.themeState.setResolved('dark');
        return;
      }

      if (mode === 'light') {
        root.removeAttribute('dark');
        this.themeState.setResolved('light');
        return;
      }

      // mode === 'auto' — follow the system preference
      const view = this.document.defaultView as (Window & typeof globalThis) | null;
      const mql = view?.matchMedia ? view.matchMedia('(prefers-color-scheme: dark)') : null;
      const apply = (matches: boolean) => {
        if (matches) {
          root.setAttribute('dark', '');
          this.themeState.setResolved('dark');
        } else {
          root.removeAttribute('dark');
          this.themeState.setResolved('light');
        }
      };
      if (mql) {
        apply(mql.matches);
        mql.addEventListener('change', (e: MediaQueryListEvent) => apply(e.matches));
      } else {
        // `matchMedia` is unavailable (e.g. jsdom test env without polyfill);
        // resolve auto to light as a safe fallback rather than throwing.
        apply(false);
      }
    });
  }
}
