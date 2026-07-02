# `src/app/shared/`

Reusable presentational building blocks: components, directives, and pipes
that have no domain knowledge and can be dropped into any feature area.

## Rule for adding files

- Add a new item here when it is **pure presentation** — no router state, no
  feature-specific business logic, no direct dependency on a singleton service
  owned by `core/`.
- Keep inputs minimal and well-typed (prefer signal inputs via `input()`).
- Emit outputs sparingly; if the consumer needs to react to a state change,
  prefer binding to a signal output (`output()`).
- Do NOT add singleton services here — those belong in `core/`. Do NOT add
  route-level features here — those belong in `features/`.
- Do NOT add sub-folders preemptively. Create a sub-folder (e.g. `ui/`,
  `forms/`) when a second item in the same family appears; the first item
  lives directly under `shared/`.
