You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Communication

- Keep responses short and direct by default.
- User-facing communication must be in Spanish Neutral Professional (Español Neutro Profesional): neutral, professional Spanish without regional variants or slang.

## Commits and Pushes

- Do not commit unless explicitly requested by the user.
- Do not push unless explicitly requested by the user.

## Verification

- Never assume library behavior, conventions, or APIs from memory. Verify against official documentation before writing or modifying code.
- Cite the source (docs URL, package version) when making non-obvious technical claims.
- When a user flags something as wrong, verify against docs before agreeing or disagreeing. Memory and "probably" are not evidence.
- Verify with real package source under `node_modules/` or by running actual commands. Never invent API surface, selector names, version numbers, or "standard" patterns.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## PrimeNG

This project uses PrimeNG 22 with `@primeuix/themes` 3 (Aura preset, extended via `definePreset()`) and integrates with Tailwind CSS 4 via the official `tailwindcss-primeui` plugin (PrimeTek), which exposes PrimeNG semantic tokens as Tailwind utilities (`text-muted-color`, `text-color`, `bg-primary`, `bg-emphasis`, `bg-highlight`, `border-surface`, etc.). Always verify behavior against official documentation before assuming:

- Documentation: <https://primeng.dev>
- Installation: <https://primeng.dev/installation>
- Configuration: <https://primeng.dev/configuration>
- Theming: <https://primeng.dev/theming/styled>
- Animations: <https://primeng.dev/guides/animations>
- Tailwind CSS integration: <https://primeng.dev/tailwind>
- Official examples: <https://github.com/primefaces/primeng-examples>
- Plugin source: <https://github.com/primefaces/tailwindcss-primeui>

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## Folder policy

Three top-level folders under `src/app/`. Each has its own README that
states what lives there and the rule for adding to it; sub-folders inside
are created only on first consumer, never preemptively.

- `src/app/core/` — singleton application services (`providedIn: 'root'`).
- `src/app/shared/` — reusable presentational components, directives, pipes.
- `src/app/features/` — route-level feature areas, loaded lazily via
  `loadComponent` / `loadChildren` in `app.routes.ts`.
- `src/app/test-utils/` — cross-cutting test helpers (e.g. `createTestBed()`).
