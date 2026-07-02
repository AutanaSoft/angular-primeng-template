import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { KnobModule } from 'primeng/knob';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { ThemeState } from '../../core/theme/theme-state';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

/**
 * Milestones at which a toast is fired to give the click counter some
 * emotional weight. Keys are the threshold the counter must cross, values
 * are the toast severity and copy. Severity maps to Tokyo Night semantic
 * colors: success -> #9ece6a, info -> #7dcfff, warn -> #ff9e64.
 */
const MILESTONES: ReadonlyArray<{
  threshold: number;
  severity: 'success' | 'info' | 'warn';
  summary: string;
  detail: string;
}> = [
  {
    threshold: 5,
    severity: 'success',
    summary: 'Five clicks',
    detail: 'Halfway to ten. Keep going.',
  },
  { threshold: 10, severity: 'info', summary: 'Ten clicks', detail: 'You have hit double digits.' },
  {
    threshold: 25,
    severity: 'success',
    summary: 'Twenty-five clicks',
    detail: 'Quarter-century. Nice cadence.',
  },
  { threshold: 50, severity: 'warn', summary: 'Fifty clicks', detail: 'You might want to reset.' },
];

const KNOB_MAX = 20;

@Component({
  selector: 'app-showcase',
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    KnobModule,
    TagModule,
    ThemeSwitcher,
    ToastModule,
  ],
  templateUrl: './showcase.html',
})
export class Showcase {
  private readonly messages = inject(MessageService);
  private readonly themeState = inject(ThemeState);

  protected readonly clicks = signal(0);
  protected readonly draft = signal('');

  protected readonly knobMax = KNOB_MAX;

  // Knob value is bridged to the `clicks` signal via a getter/setter pair.
  // PrimeNG's Knob implements ControlValueAccessor, so `[(ngModel)]` requires
  // a plain property — a direct signal binding is not supported in v22.
  protected get knobValue(): number {
    return Math.min(this.clicks(), KNOB_MAX);
  }

  protected set knobValue(v: number) {
    this.clicks.set(Math.max(0, Math.min(KNOB_MAX, Math.round(v))));
  }

  // Knob colors come from the resolved theme. SVG attributes cannot read
  // CSS variables, so we resolve to hex on demand through the shared
  // `ThemeState` signal.
  protected readonly knobValueColor = '#7aa2f7'; // Tokyo Night blue — the signature accent
  protected readonly knobRangeColor = '#414868'; // Tokyo Night border
  protected readonly knobTextColor = computed(() =>
    this.themeState.resolved() === 'dark' ? '#c0caf5' : '#1a1b26',
  );

  protected readonly milestoneLabel = computed(() => `clicks: ${this.clicks()}`);

  // Track the last fired milestone so dragging the knob through several
  // thresholds at once still only fires the highest threshold's toast.
  private lastFiredMilestone = 0;

  protected onClick(): void {
    const next = this.clicks() + 1;
    this.clicks.set(next);
    this.maybeFireMilestone(next);
  }

  protected onReset(): void {
    this.clicks.set(0);
    this.lastFiredMilestone = 0;
    this.messages.add({
      severity: 'info',
      summary: 'Counter reset',
      detail: 'Back to zero.',
      life: 2500,
    });
  }

  protected clearDraft(): void {
    this.draft.set('');
  }

  private maybeFireMilestone(value: number): void {
    // Skip if we already fired for this value (prevents double-fire when
    // the knob is dragged through several thresholds at once).
    if (value <= this.lastFiredMilestone) {
      return;
    }
    const candidates = MILESTONES.filter((m) => value >= m.threshold);
    if (candidates.length === 0) {
      return;
    }
    const milestone = candidates[candidates.length - 1];
    if (milestone.threshold <= this.lastFiredMilestone) {
      return;
    }
    this.lastFiredMilestone = milestone.threshold;
    this.messages.add({
      severity: milestone.severity,
      summary: milestone.summary,
      detail: milestone.detail,
      life: 3000,
    });
  }
}
