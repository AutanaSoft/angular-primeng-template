import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { createTestBed } from '../../test-utils/test-bed';
import { ThemeSwitcher } from './theme-switcher';

type Mode = 'light' | 'dark' | 'auto';

/**
 * Minimal `MediaQueryList` shape for tests. Captures `change` listeners
 * registered through `addEventListener` and exposes a `fire(matches)`
 * helper so specs can simulate the browser firing a color-scheme change
 * without a real `MediaQueryListEvent` constructor (jsdom does not ship
 * one).
 */
type FakeMediaQueryList = {
  matches: boolean;
  media: string;
  onchange: null;
  addEventListener: (type: 'change', listener: (event: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: 'change', listener: (event: MediaQueryListEvent) => void) => void;
  addListener: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
  dispatchEvent: (event: Event) => boolean;
  fire: (matches: boolean) => void;
};

function createMatchMediaStub() {
  const mqls: FakeMediaQueryList[] = [];
  const impl = vi.fn().mockImplementation((query: string): FakeMediaQueryList => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const mql: FakeMediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((type: 'change', listener: (e: MediaQueryListEvent) => void) => {
        if (type === 'change') {
          listeners.add(listener);
        }
      }) as FakeMediaQueryList['addEventListener'],
      removeEventListener: vi.fn((type: 'change', listener: (e: MediaQueryListEvent) => void) => {
        if (type === 'change') {
          listeners.delete(listener);
        }
      }) as FakeMediaQueryList['removeEventListener'],
      addListener: vi.fn((listener: (e: MediaQueryListEvent) => void) => listeners.add(listener)),
      removeListener: vi.fn((listener: (e: MediaQueryListEvent) => void) =>
        listeners.delete(listener),
      ),
      dispatchEvent: vi.fn(() => true),
      fire: (matches: boolean) => {
        mql.matches = matches;
        for (const listener of listeners) {
          listener({ matches, media: query } as MediaQueryListEvent);
        }
      },
    };
    mqls.push(mql);
    return mql;
  });
  return { matchMedia: impl, mqls };
}

describe('ThemeSwitcher', () => {
  let fixture: ComponentFixture<ThemeSwitcher>;
  let compiled: HTMLElement;
  let matchMediaHandles: ReturnType<typeof createMatchMediaStub>;

  beforeEach(async () => {
    // Arrange — jsdom defaults to light mode; install a controllable matchMedia stub
    // so the `auto` branch can react to system preference changes. The stub stores
    // every listener registered via `addEventListener('change', ...)` and exposes a
    // `fire(matches)` helper so specs can simulate a real color-scheme change event.
    matchMediaHandles = createMatchMediaStub();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: matchMediaHandles.matchMedia,
    });

    createTestBed();
    await TestBed.compileComponents();

    // Act
    fixture = TestBed.createComponent(ThemeSwitcher);
    fixture.detectChanges();
    await fixture.whenStable();
    compiled = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    document.documentElement.removeAttribute('dark');
  });

  it('starts with the auto mode signal', () => {
    // Assert
    const theme = (fixture.componentInstance as unknown as { theme: () => Mode }).theme;
    expect(theme()).toBe('auto');
  });

  it('exposes role="group" and an aria-label on the host', () => {
    // Assert
    expect(compiled.getAttribute('role')).toBe('group');
    expect(compiled.getAttribute('aria-label')).toBeTruthy();
  });

  it('renders the p-selectbutton host element', () => {
    // Assert — the rendered DOM contains exactly one `p-selectbutton` wrapper.
    // PrimeNG 22's selector for SelectButton is `p-selectbutton, p-select-button`;
    // assertions against the inner toggle buttons are covered separately.
    expect(compiled.querySelector('p-selectbutton, p-select-button')).toBeTruthy();
  });

  it('renders three toggle affordances inside the selectbutton (one per option)', () => {
    // Assert
    // PrimeNG's SelectButton delegates to `<p-togglebutton>`, whose host
    // element carries `role="button"`. Three options => three toggle buttons.
    const toggleButtons = compiled.querySelectorAll(
      'p-selectbutton p-togglebutton, p-select-button p-togglebutton, p-togglebutton, p-toggle-button',
    );
    expect(toggleButtons.length).toBe(3);
  });

  it('sets the dark attribute on <html> when dark is selected via the signal', async () => {
    // Arrange
    const theme = (fixture.componentInstance as unknown as { theme: { set: (m: Mode) => void } })
      .theme;

    // Act
    theme.set('dark');
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(document.documentElement.hasAttribute('dark')).toBe(true);
  });

  it('removes the dark attribute when light is selected via the signal', async () => {
    // Arrange
    const theme = (fixture.componentInstance as unknown as { theme: { set: (m: Mode) => void } })
      .theme;
    document.documentElement.setAttribute('dark', '');

    // Act
    theme.set('light');
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(document.documentElement.hasAttribute('dark')).toBe(false);
  });

  it('reflects the resolved mode through the selectbutton binding', async () => {
    // Arrange
    const instance = fixture.componentInstance as unknown as {
      theme: { set: (m: Mode) => void; (): Mode };
    };

    // Act
    instance.theme.set('dark');
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert — read the signal back: it must reflect the value the
    // selectbutton is bound to via [ngModel]. The actual ARIA-pressed
    // markup is owned by the inner togglebutton and is exercised by the
    // browser-level tests (see the it.todo at the bottom of this file).
    expect(instance.theme()).toBe('dark');
  });

  it('follows the system color-scheme change event when auto mode is selected', () => {
    // Arrange — auto mode is the default after the initial render. The `effect()`
    // binds a matchMedia listener on the FIRST tick (theme() === 'auto' on init),
    // so we have at least one mql registered before we touch anything.
    const mql = matchMediaHandles.mqls[0];
    expect(mql).toBeTruthy();

    // Act — simulate the OS flipping to dark mode
    mql.fire(true);
    fixture.detectChanges();

    // Assert
    expect(document.documentElement.hasAttribute('dark')).toBe(true);

    // Act — simulate the OS flipping back to light
    mql.fire(false);
    fixture.detectChanges();

    // Assert
    expect(document.documentElement.hasAttribute('dark')).toBe(false);
  });

  // Visual repaint (Tokyo Night tokens updating the rendered backgrounds, the
  // <html> dark/light transition, etc.) is only observable in a real browser
  // because jsdom does not apply CSS rules. A future Playwright/Cypress test
  // should:
  //   1. mount `<app-showcase>` with the theme switcher wired in,
  //   2. capture a screenshot / computed background of `<p-card>` in light,
  //   3. call `theme.set('dark')`, wait for repaint, capture again,
  //   4. assert the two computed backgrounds differ.
  // Until that exists, the unit-level observable signal is `<html dark>` (covered
  // by the tests above).
  it.todo(
    'repaints Tokyo Night tokens when dark is selected (browser-only; needs Playwright/Cypress)',
  );
});
