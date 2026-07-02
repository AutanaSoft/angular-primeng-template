import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    // Arrange
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [providePrimeNG({ theme: { preset: Aura } })],
    }).compileComponents();

    // Act
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('creates the root component', () => {
    // Assert
    expect(fixture.componentInstance).toBeInstanceOf(App);
  });

  it('exposes the project title as a signal', () => {
    // Assert — signal-first: read the signal value before touching the DOM
    // (per spec-conventions "Signal check precedes DOM check").
    // App keeps `title` as `protected` to discourage external mutation; the
    // spec reads through a typed cast to avoid widening the production API.
    const title = (fixture.componentInstance as unknown as { title: () => string }).title();
    expect(title).toBe('angular-primeng-template');
  });

  it('renders the router outlet', () => {
    // Arrange
    const compiled = fixture.nativeElement as HTMLElement;

    // Assert
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
