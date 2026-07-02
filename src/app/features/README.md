# `src/app/features/`

Route-level feature areas. Each sub-folder here corresponds to one or more
lazy-loaded routes declared in `src/app/app.routes.ts` (or a child routes
file) via `loadComponent` / `loadChildren`.

## Rule for adding files

- Add a new feature here when you are introducing **a navigable area of the
  product** that should ship its code on demand, not in the initial bundle.
- Wire the lazy route in `src/app/app.routes.ts`; do NOT import the feature
  eagerly from the shell.
- Each feature owns its own components, presentational helpers, and specs.
  Cross-feature dependencies are allowed only through `core/` services or
  `shared/` components — never by importing one feature from another.
- Sub-folders here are created **on first consumer**, never preemptively.
  The first feature in a new domain lands as `features/<name>/` with its
  components flat inside. Add deeper nesting only when the feature itself
  grows enough to need it.
