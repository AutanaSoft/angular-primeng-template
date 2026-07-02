import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';

/**
 * Reset and configure the Angular TestBed with the project's standard
 * PrimeNG wiring plus any extra providers the spec needs.
 *
 * Usage (AAA):
 * ```ts
 * beforeEach(async () => {
 *   // Arrange
 *   createTestBed();
 *   await TestBed.compileComponents();
 *   // Act
 *   fixture = TestBed.createComponent(MyComponent);
 *   fixture.detectChanges();
 * });
 * afterEach(() => {
 *   TestBed.resetTestingModule();
 * });
 * ```
 *
 * Consumers MUST still call `TestBed.resetTestingModule()` in `afterEach`
 * per the spec-conventions contract; the reset at the start of this helper
 * is so the helper can be reused across `it` blocks within one file.
 *
 * Note: the runtime preset is Tokyo Night (set in `app.config.ts`). The
 * test environment intentionally keeps Aura to avoid leaking theme
 * overrides into specs that probe the rendered DOM — the visual identity is
 * a runtime concern, the structural behavior under test is not.
 */
export function createTestBed(providers: Provider[] = []): typeof TestBed {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [providePrimeNG({ theme: { preset: Aura } }), MessageService, ...providers],
  });
  return TestBed;
}
