## Shared UI Package Standards

These rules apply to all packages under `shared/ui/*`.

## Package boundaries

- `shared/ui/*` must not import from `apps/web`.
- Keep components framework-agnostic and reusable across apps.

## Component package structure

```
shared/ui/[package]/
  src/
    [Component].tsx
    [Component].types.ts
    [component].constants.ts (optional)
    index.ts
  package.json
  tsconfig.json
  tsup.config.ts
```

## Rules

- Public API only through `src/index.ts`.
- Avoid business/domain logic in shared UI components.
- Support accessibility by default (`aria-*`, semantic controls).
- Export types alongside components/hooks.
- Clean up object URLs/timers/subscriptions in client hooks/components.
- Do not edit `dist/` manually unless explicitly requested.
