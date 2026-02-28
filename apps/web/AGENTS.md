# AGENTS.md — Frontend (apps/web)

## Tech Stack
- Next.js 15 (App Router)
- TypeScript 5.7+ (strict mode)
- MUI-based design system (`shared/ui`)
- next-intl for i18n (EN + VI)
- Zod for form validation
- React Hook Form
- pnpm workspace

## Architecture — Layer Diagram

```text
┌──────────────────────────────────────────┐
│  app/[locale]/          (Route Pages)    │  Thin: compose + layout only
├──────────────────────────────────────────┤
│  features/*/components/ (UI Components)  │  Visual + user interaction
├──────────────────────────────────────────┤
│  features/*/hooks/      (Custom Hooks)   │  Data fetching + state logic
├──────────────────────────────────────────┤
│  features/*/services/   (API Services)   │  Call apiClient, return typed data
├──────────────────────────────────────────┤
│  lib/api/apiClient.ts   (HTTP Client)    │  fetch wrapper, auth, errors
├──────────────────────────────────────────┤
│  @supportops/contracts  (Shared Types)   │  Types + Schemas + Endpoints
└──────────────────────────────────────────┘
```

**Data flow**: Page → Component → Hook → Service → apiClient → Backend

## Rules for Each Layer

### Route Pages (`app/[locale]/(admin)/*/page.tsx`)
- Thin only: compose components + route concerns
- No business logic or direct data fetching in page components

### Feature Components (`features/*/components/*.tsx`)
- One clear responsibility per component
- Use hooks for data (never call service directly)
- Always handle loading/error/empty states
- All user-facing text via `useTranslations()`

### Custom Hooks (`features/*/hooks/*.ts`)
- Encapsulate fetch + state logic
- Call services (not `apiClient` directly)
- Return typed state `{ data, isLoading, error, refetch? }`

### Services (`features/*/services/*.service.ts`)
- Pure API functions, no React state/hooks
- Import endpoints/types from `@supportops/contracts`
- Never hardcode API URLs

### Contracts Usage
1. Add/update types in `shared/contracts/src/types/[module].types.ts`
2. Add endpoint in `shared/contracts/src/endpoints.ts`
3. Add schema in `shared/contracts/src/schemas/` if form-based
4. Export from `shared/contracts/src/index.ts`
5. Then implement service → hook → component

### API Client (`lib/api/apiClient.ts`)
- Do not modify without explicit instruction
- Handles auth, refresh, trace-id, timeout, normalized errors

### i18n
- All UI strings use i18n
- Files: `apps/web/src/i18n/messages/en.json`, `vi.json`

### Naming Convention
| Type | Convention | Example |
|---|---|---|
| Component | `PascalCase.tsx` | `ProductTable.tsx` |
| Hook | `camelCase.ts` | `useProducts.ts` |
| Service | `kebab-case.service.ts` | `product.service.ts` |
| Type file | `kebab-case.types.ts` | `product.types.ts` |
| Schema file | `kebab-case.schema.ts` | `product.schema.ts` |
| Test file | `*.test.ts(x)` | `ProductTable.test.tsx` |
| Utility | `camelCase.ts` | `formatCurrency.ts` |

### Import Order
1. React/Next imports
2. Third-party imports
3. `@supportops/*` imports
4. `@/*` absolute imports
5. Relative imports

### Strict DO NOTs
- ❌ Import `apiClient` directly inside components
- ❌ Use `any`
- ❌ Hardcode URLs or UI strings
- ❌ Put business logic in page files
- ❌ Skip loading/error/empty states
- ❌ Modify `shared/ui/` or `lib/api/apiClient.ts` without explicit request
