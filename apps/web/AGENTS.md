## Frontend Standards (React + TypeScript + Next.js)

These rules apply to all files under `apps/web`.

## Architecture

- `app/` (routes) should stay thin: compose sections/hooks, avoid heavy business logic.
- `features/` may import from `shared/` but should not import across unrelated features.
- `shared/` should contain reusable app-level constants/utilities only.

## Page/File Splitting

When a page or feature exceeds around 150 lines or has multiple concerns, split it:

```
[feature-or-page]/
  page.tsx (compose/orchestrate only)
  [name].types.ts
  [name].mock.ts or [name].api.ts
  [name].module.css
  components/
  hooks/
  utils/
```

Rules:
- Put scope-specific types in `*.types.ts`.
- Put mock data/API access in `*.mock.ts` or `*.api.ts`.
- Move local UI blocks into `components/`.
- Move stateful logic into focused hooks in `hooks/`.

## Components

- Prefer `export function ComponentName(...)` over `React.FC`.
- Props name must be `ComponentNameProps`.
- Keep one concern per component.
- Use `useTranslations(...)` inside components; avoid passing `t` deeply unless necessary.

## Hooks

- One hook = one concern.
- Hook names: `useXxx`.
- Return objects for readability when returning 3+ values.
- Clean up side effects (timers, object URLs, subscriptions).
- Avoid stale closures in async updates; use functional updates or refs where appropriate.

## TypeScript

- Keep strict typing. Avoid `any`.
- Prefer `type` for unions and computed types.
- Prefer `interface` for prop object shapes.
- Explicitly type exported function signatures.

## Next.js App Router

- Default to Server Components; add `'use client'` only when required.
- Keep route-level components focused on composition.
- Use route handlers in `app/api/*` for internal APIs.

## Styling

- Use CSS Modules for layout/shell structure.
- Use MUI for interactive primitives.
- Prefer theme tokens / `--mui-*` CSS variables over hardcoded values.

## Validation before handoff

- Run `pnpm --filter web exec tsc --noEmit` for app code changes.
- Run `pnpm --filter web lint` for app code changes.
