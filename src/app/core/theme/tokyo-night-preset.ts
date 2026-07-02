import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Tokyo Night preset — extends the Aura base tokens with the Tokyo Night
 * color palette. Both the light and dark color schemes are mapped from
 * canonical Tokyo Night values:
 *
 *   Dark  — https://github.com/enkia/tokyo-night-vscode
 *   Light — https://github.com/enkia/tokyo-night-light-vscode
 *
 * The Aura base semantics are kept intact; only the surface scale, the
 * primary scale, and a handful of component-level overrides (card,
 * content, formField, text) are remapped.
 *
 * Token names follow the standard Aura schema. No keys are invented.
 */
export const TokyoNightPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eaf2ff',
      100: '#d5e2ff',
      200: '#abc4ff',
      300: '#82a7fc',
      400: '#7aa2f7',
      500: '#34548a',
      600: '#2c4674',
      700: '#24395e',
      800: '#1c2b48',
      900: '#141e32',
      950: '#0a1220',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#34548a',
          contrastColor: '#ffffff',
          hoverColor: '#2c4674',
          activeColor: '#24395e',
        },
        surface: {
          0: '#ffffff',
          50: '#e1e2e7',
          100: '#d0d4dc',
          200: '#c4c8d2',
          300: '#a8aebe',
          400: '#8c93a8',
          500: '#617386',
          600: '#4d5468',
          700: '#1a1b26',
          800: '#16182a',
          900: '#0f1119',
          950: '#0a0c14',
        },
      },
      dark: {
        primary: {
          color: '#7aa2f7',
          contrastColor: '#1a1b26',
          hoverColor: '#82a7fc',
          activeColor: '#abc4ff',
        },
        surface: {
          0: '#c0caf5',
          50: '#a9b1d6',
          100: '#9aa0c0',
          200: '#7c83b0',
          300: '#737aa2',
          400: '#5a608a',
          500: '#414868',
          600: '#3b4263',
          700: '#2f3447',
          800: '#24283b',
          900: '#1a1b26',
          950: '#0a0c14',
        },
      },
    },
  },
  // Override the card surface so it sits one shade above the page background
  // in both modes. Without this override the card inherits `content.background`
  // which equals the page background in Tokyo Night and makes the card visually
  // flat.
  card: {
    root: {
      background: 'light-dark({surface.50}, {surface.800})',
    },
  },
  // Align `content.borderColor` with the Tokyo Night border palette (#a8aebe
  // / #414868) instead of the Aura defaults that would otherwise pull from
  // surface.200 / surface.700 and miss the brand-specific hex values.
  content: {
    borderColor: 'light-dark({surface.300}, {surface.500})',
  },
  // Form fields stay white in light mode (so they read as inputs on top of the
  // card) and stay on the darkest surface in dark mode.
  formField: {
    background: 'light-dark(#ffffff, {surface.900})',
    borderColor: 'light-dark({surface.300}, {surface.500})',
  },
  // Surface.400 is too dim for the muted text Tokyo Night uses in dark mode.
  // Re-route mutedColor to surface.300 (#737aa2) to land on the canonical
  // Tokyo Night comment color.
  text: {
    mutedColor: 'light-dark({surface.500}, {surface.300})',
  },
});
