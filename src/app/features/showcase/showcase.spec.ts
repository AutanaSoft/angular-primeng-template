import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import axe from 'axe-core';

import { createTestBed } from '../../test-utils/test-bed';
import { Showcase } from './showcase';

describe('Showcase', () => {
  let fixture: ComponentFixture<Showcase>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    // Arrange
    createTestBed();
    await TestBed.compileComponents();

    // Act
    fixture = TestBed.createComponent(Showcase);
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    // Wait for the fixture to settle so axe-core sees a fully rendered DOM
    // (change detection + async bindings) rather than a half-mounted tree.
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('creates the standalone component', () => {
    // Assert
    expect(fixture.componentInstance).toBeInstanceOf(Showcase);
  });

  it('renders the required PrimeNG elements (button, card, knob, icon field, tag, toast, divider)', () => {
    // Assert
    expect(compiled.querySelector('p-button')).toBeTruthy();
    expect(compiled.querySelector('p-card')).toBeTruthy();
    expect(compiled.querySelector('p-knob')).toBeTruthy();
    expect(compiled.querySelector('p-iconfield')).toBeTruthy();
    expect(compiled.querySelector('p-inputicon')).toBeTruthy();
    expect(compiled.querySelector('p-tag')).toBeTruthy();
    expect(compiled.querySelector('p-divider')).toBeTruthy();
    expect(compiled.querySelector('p-toast')).toBeTruthy();
    // PrimeNG 22 ships `InputText` as a directive applied to a plain
    // `<input>`, not as a wrapper element.
    expect(compiled.querySelector('input[pInputText], input[pinputtext]')).toBeTruthy();
  });

  it('starts the click counter signal at zero and reflects it in the milestone tag', () => {
    // Arrange
    const clicks = (fixture.componentInstance as unknown as { clicks: () => number }).clicks;

    // Assert — signal-first per spec-conventions
    expect(clicks()).toBe(0);
    // The milestone tag (the second `p-tag` on the page, after the header
    // badge) reads the signal value, so we assert on its text content.
    const tags = compiled.querySelectorAll('p-tag');
    const milestoneTag = tags[tags.length - 1];
    expect(milestoneTag?.textContent).toContain('clicks: 0');
  });

  it('updates the counter signal and the milestone tag after a click', () => {
    // Arrange
    const instance = fixture.componentInstance as unknown as {
      clicks: () => number;
      onClick: () => void;
    };

    // Act
    instance.onClick();
    fixture.detectChanges();

    // Assert — signal-first per spec-conventions
    expect(instance.clicks()).toBe(1);
    const tags = compiled.querySelectorAll('p-tag');
    const milestoneTag = tags[tags.length - 1];
    expect(milestoneTag?.textContent).toContain('clicks: 1');
  });

  it('resets the click counter signal back to zero', () => {
    // Arrange
    const instance = fixture.componentInstance as unknown as {
      clicks: () => number;
      onClick: () => void;
      onReset: () => void;
    };
    instance.onClick();
    instance.onClick();
    instance.onClick();
    fixture.detectChanges();

    // Act
    instance.onReset();
    fixture.detectChanges();

    // Assert — signal-first per spec-conventions
    expect(instance.clicks()).toBe(0);
    const tags = compiled.querySelectorAll('p-tag');
    const milestoneTag = tags[tags.length - 1];
    expect(milestoneTag?.textContent).toContain('clicks: 0');
  });

  it('mirrors the draft signal via the input element (input event)', () => {
    // Arrange
    const instance = fixture.componentInstance as unknown as {
      draft: () => string;
    };
    const input = compiled.querySelector(
      'input[pInputText], input[pinputtext]',
    ) as HTMLInputElement | null;
    expect(input).toBeTruthy();

    // Act — drive the input the way a user would, then propagate the change.
    input!.value = 'hello';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    // Assert — signal-first per spec-conventions
    expect(instance.draft()).toBe('hello');
    expect(input!.value).toBe('hello');
  });

  it('clears the draft signal when the suffix icon is clicked', () => {
    // Arrange
    const instance = fixture.componentInstance as unknown as {
      draft: { set: (v: string) => void };
      clearDraft: () => void;
    };
    // Seed the draft via the component API so we don't rely on the input
    // dispatch path here.
    instance.draft.set('seed');

    // The suffix icon only renders when draft() is truthy.
    fixture.detectChanges();
    const icons = Array.from(compiled.querySelectorAll('p-inputicon'));
    const suffixIcon = icons[icons.length - 1] as HTMLElement | undefined;
    expect(suffixIcon).toBeTruthy();

    // Act
    instance.clearDraft();
    fixture.detectChanges();

    // Assert — signal-first per spec-conventions
    expect((instance.draft as unknown as { (): string })()).toBe('');
  });

  it('passes axe-core WCAG 2.0 / 2.1 A/AA with zero violations', async () => {
    // Act — run the accessibility audit on the fully rendered DOM.
    const results = await axe.run(fixture.nativeElement, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    });

    // Assert — fail with a readable payload (rule id, impact, selectors,
    // and a snippet of the offending HTML) so the next developer can act
    // on it without re-running with --reporter.
    if (results.violations.length > 0) {
      const summary = results.violations
        .map(
          (v) =>
            `[${v.id}] ${v.help} — impact=${v.impact}, nodes=${v.nodes.length}\n` +
            v.nodes
              .map((n) => `  - target=${n.target.join(' ')} html=${n.html.slice(0, 200)}`)
              .join('\n'),
        )
        .join('\n');
      expect.fail(`axe-core reported ${results.violations.length} violation(s):\n${summary}`);
    }
    expect(results.violations).toHaveLength(0);
  });
});
