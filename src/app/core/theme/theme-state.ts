import { Injectable, Signal, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Singleton state shared by the theme switcher and any component that needs
 * to react to the live theme (e.g. SVG fills that cannot read CSS variables).
 *
 * - `mode` is the user-selected preference (light / dark / auto).
 * - `resolved` is what `<html>` actually reflects right now — derived from
 *   `mode` plus the system preference when mode === 'auto'.
 */
@Injectable({ providedIn: 'root' })
export class ThemeState {
  readonly #mode = signal<ThemeMode>('auto');
  readonly #resolved = signal<ResolvedTheme>('light');

  readonly mode: Signal<ThemeMode> = this.#mode.asReadonly();
  readonly resolved: Signal<ResolvedTheme> = this.#resolved.asReadonly();

  setMode(mode: ThemeMode): void {
    this.#mode.set(mode);
  }

  setResolved(resolved: ResolvedTheme): void {
    this.#resolved.set(resolved);
  }
}
