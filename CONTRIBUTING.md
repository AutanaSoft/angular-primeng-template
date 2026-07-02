# Contributing

Thanks for your interest in `angular-primeng-template`. This is a starter template, so contributions fall mostly into: bug fixes, doc improvements, or extending the showcase with new components.

## Before opening a Pull Request

1. Read [`AGENTS.md`](./AGENTS.md) — it codifies the project conventions (signals, standalone components, native control flow, `tailwindcss-primeui` utilities, etc.).
2. Read [`README.md`](./README.md) — understand the stack and the Tokyo Night theming model.

## Local setup

```bash
nvm use 22
pnpm install
pnpm start    # dev server on http://localhost:4200
pnpm test     # unit tests (Vitest, headless)
pnpm build    # production build
```

## Commit messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/), enforced by `commitlint`. The pre-commit hook runs Prettier on staged files.

```text
feat(theme-switcher): add system-preference listener
fix(showcase): reset counter signal on Reset click
docs(readme): update theming section
```

## Pull Request checklist

- [ ] `pnpm test` passes locally
- [ ] `pnpm build` passes locally
- [ ] Changes follow the conventions in `AGENTS.md`
- [ ] Commit message follows Conventional Commits

## Reporting bugs

Open a GitHub issue using the **Bug Report** template. Include reproduction steps, expected vs actual behavior, and your Node / pnpm versions.