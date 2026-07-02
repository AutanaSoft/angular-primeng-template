# `src/app/core/`

Singleton application services that own cross-cutting concerns (HTTP clients,
feature flags, telemetry, theming, anything that MUST exist exactly once for
the lifetime of the app).

## Rule for adding files

- Add a new service here when it is a **singleton** consumed by multiple
  feature areas or the application shell.
- Provide it with `providedIn: 'root'` (or the `@Service` decorator in
  Angular v22+) so the DI tree owns its lifecycle.
- Do NOT add presentational components, directives, or pipes here — those
  belong in `shared/`. Do NOT add route-level features here — those belong in
  `features/`.
- Do NOT add sub-folders preemptively. Create a sub-folder (e.g. `auth/`,
  `theming/`) the moment a second service in the same domain appears; the
  first service lives directly under `core/`.
