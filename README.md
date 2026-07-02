# Angular PrimeNG Template

A modern Angular 22 starter wired with PrimeNG 22, Tailwind CSS 4, signals, and Vitest. Tokyo Night themed out of the box. Every component and asset is MIT-licensed; nothing paid, nothing external beyond the dev tooling.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Angular 22 (standalone, signals, native control flow, Signal Forms ready) |
| UI components | PrimeNG 22.0.0-rc.1 + `@primeuix/themes` 3.0.0-rc.1 |
| Theme | Aura preset extended with the Tokyo Night palette (`definePreset()`) |
| Styling | Tailwind CSS 4 + `tailwindcss-primeui` plugin |
| Icons | PrimeIcons 7 |
| Testing | Vitest 4 via `@angular/build:unit-test`, jsdom 28, axe-core 4 |
| Package manager | pnpm 11 |
| Hooks | Husky 9 + commitlint 21 (Conventional Commits) + lint-staged 17 + Prettier 3.8.1 |

## Scripts

```bash
pnpm start    # ng serve (dev server)
pnpm build    # production build → dist/
pnpm test     # Vitest unit tests (headless, single run)
pnpm watch    # dev build with watch mode
```

## Project structure

```
src/
├── app/
│   ├── app.ts                # root component (standalone)
│   ├── app.html
│   ├── app.css
│   ├── app.config.ts         # providers: PrimeNG, MessageService, router, animations
│   ├── app.routes.ts         # lazy routes via loadComponent
│   ├── app.spec.ts           # root component tests
│   ├── core/                 # singleton services — see src/app/core/README.md
│   │   └── theme/            # Tokyo Night preset + ThemeState signal singleton
│   ├── shared/               # reusable presentational components
│   ├── features/             # lazy route-level areas — see src/app/features/README.md
│   │   ├── showcase/         # the demo page
│   │   └── theme-switcher/   # Light / Dark / Auto control
│   └── test-utils/           # cross-cutting test helpers (createTestBed)
├── environments/
├── main.ts
└── styles.css                # global styles + Tailwind + primeicons imports
```

## Folder policy

Three top-level folders under `src/app/` carry the bulk of new code, plus one cross-cutting helper folder. Sub-folders inside are created only when the **first consumer** of that sub-folder appears — never preemptively.

| Folder | Holds | Add a sub-folder when... |
| --- | --- | --- |
| `src/app/core/` | Singleton services (`providedIn: 'root'`) | The first service needs a home |
| `src/app/shared/` | Reusable presentational components, directives, pipes | The first reusable component appears |
| `src/app/features/` | Lazy route-level feature areas | The first new route needs its own folder |
| `src/app/test-utils/` | Cross-cutting test helpers (e.g. `createTestBed()`) | A spec needs shared providers |

Each folder carries its own `README.md` with the rule for adding to it.

## Theming

PrimeNG's **Aura** preset is the base. The theme layer extends it with the **Tokyo Night** palette via `definePreset()` in `src/app/core/theme/tokyo-night-preset.ts`, covering both light and dark color schemes for the full surface and primary scales.

The `<app-theme-switcher>` exposes Light / Dark / Auto through a `p-selectButton` (with `pi-sun` / `pi-moon` / `pi-desktop` icons) and drives the resolved theme on `<html>` through a shared `ThemeState` signal in `src/app/core/theme/`. Any feature component can read the active mode from `ThemeState.resolved()` without re-parsing the DOM.

The showcase body background tracks `var(--p-content-background)` so it switches with the theme without per-mode branching.

## Accessibility

Every render of the showcase passes `axe-core` with WCAG 2.0 / 2.1 A/AA tags (`src/app/features/showcase/showcase.spec.ts`). The audit runs in CI as part of the showcase spec — zero violations is a hard contract.

## Conventions

- **Standalone components** — no NgModules. Don't set `standalone: true` explicitly (default in v20+).
- **Change detection** — default; do not set `OnPush` explicitly (default in v22+).
- **State** — use signals (`signal`, `computed`). Never `mutate`; prefer `update` / `set`.
- **Forms** — prefer Signal Forms (`@angular/forms/signals`); fall back to Reactive Forms only when needed.
- **Templates** — native control flow (`@if`, `@for`, `@switch`). No `*ngIf`, `*ngFor`, `ngClass`, or `ngStyle`.
- **Tailwind utilities for PrimeNG** — use the `tailwindcss-primeui` first-class utilities (`text-muted-color`, `text-color`, `bg-primary`, `bg-emphasis`, `bg-highlight`, `border-surface`) instead of arbitrary CSS variable syntax.
- **DI** — `inject()` instead of constructor injection.
- **Host bindings** — use the `host` object on `@Component` / `@Directive`. Never `@HostBinding` or `@HostListener`.
- **Accessibility** — must pass AXE checks and meet WCAG AA (focus management, color contrast, ARIA).
- **TypeScript** — strict mode. Avoid `any`; prefer `unknown` when uncertain.

## Quick start

Node is pinned via `.nvmrc` (`22`) and `package.json#engines` (`node >=22.12.0`, `pnpm >=11.9.0`). `pnpm-workspace.yaml` sets `engineStrict: true`, so `pnpm install` fails fast on a wrong runtime — a wrong Node is loud, not silent.

```bash
nvm use 22          # reads .nvmrc
pnpm install
pnpm start          # → http://localhost:4200
```

Verify after switching:

```bash
node --version      # should report v22.x
pnpm --version      # should report >= 11.9.0
```

## Commit messages

Conventional Commits, enforced by `commitlint`. A pre-commit hook (`lint-staged`) formats staged files with Prettier.

```text
feat(button): add loading state to p-button wrapper
fix(router): redirect unknown routes to 404
chore(deps): bump @angular/core to 22.1.0
```

## License

[MIT](./LICENSE)