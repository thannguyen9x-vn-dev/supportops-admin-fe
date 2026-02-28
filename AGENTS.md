## Import and Styling Rules (apps/web)

- In `apps/web`:
  - Use `@/` for cross-feature imports or when relative path depth is 3 levels or more.
  - Use `./` and `../` for local imports in the same feature (typically 2 levels or fewer).
  - Keep workspace package imports as `@supportops/*`.

- Styling:
  - Use a hybrid approach.
  - Use CSS Modules for layout/shell/positioning/responsive structure (for example: Sidebar, Header, Dashboard layout).
  - Use MUI components for interactive UI primitives (for example: Button, Input, Avatar, Menu, Dialog).
  - In CSS Modules, prefer MUI CSS variables (`--mui-*`) over hardcoded hex values.
  - Avoid all-in `sx` for large layout shells unless explicitly requested.

## Preferred import ordering (TS/TSX)

- Group imports in this order, top to bottom:
  - React and framework imports (`react`, `next/*`, `next-intl`).
  - Third-party libraries (`@mui/*`, other npm packages).
  - Workspace packages (`@supportops/*`).
  - App alias imports (`@/*`).
  - Relative imports (`../*`, `./*`).
  - Side-effect/style imports (for example `./file.module.css`) last.

- Keep one blank line between groups.
- Within a group, sort imports alphabetically by module path when practical.
- Prefer `import type { ... }` for type-only imports.
- Avoid deep relative imports (3+ levels) when `@/*` can express intent more clearly.

## Project Guardrails (supportops-admin)

- Scope:
  - `apps/web` is the Next.js App Router application.
  - `shared/ui/*` contains shared packages and must not import from `apps/web`.

- Edit boundaries:
  - When changing theme/form packages, edit source files under `shared/*/src`.
  - Do not edit build outputs under `shared/*/dist` unless explicitly requested.

- TypeScript:
  - Keep strict type-safety and avoid `any` unless explicitly justified.
  - Prefer explicit, narrow types for props, config objects, and helper return values.

- Next.js App Router:
  - Default to Server Components; add `'use client'` only when state/effects/browser APIs are required.
  - Keep app-level providers in `apps/web/src/app/layout.tsx`.
  - Avoid moving heavy client logic into server layouts.

- i18n:
  - Do not hardcode user-facing strings when they belong to translated UI.
  - Add new keys consistently across `apps/web/src/i18n/messages/en.json` and `apps/web/src/i18n/messages/vi.json`.

- Accessibility:
  - Interactive controls must have an accessible name (`aria-label` or visible text).
  - Preserve keyboard and focus behavior for buttons, menus, inputs, and dialogs.
  - Do not replace semantic controls (for example `button`) with generic clickable `div`s.

- Validation before handoff:
  - Run `pnpm --filter web exec tsc --noEmit`.
  - Run `pnpm --filter web lint` when changes affect app code.
  - If any command cannot be run, state the reason clearly in the final report.

- Change discipline:
  - Keep changes scoped to the task.
  - Avoid broad renames/refactors unless explicitly requested.
