# AGENTS.md — Frontend (apps/web)

## Tech Stack
- Next.js 15 (App Router)
- TypeScript (strict)
- MUI-based design system (`shared/ui`)
- next-intl for i18n (EN + VI)
- Zod for validation
- pnpm workspace

## Architecture Layers

```text
┌───────────────────────────────────────┐
│  app/ (Routes — Page Components)      │  ← Thin: data fetch + layout only
├───────────────────────────────────────┤
│  features/*/components/               │  ← UI components per feature
├───────────────────────────────────────┤
│  features/*/hooks/                    │  ← Custom hooks (data + logic)
├───────────────────────────────────────┤
│  features/*/services/                 │  ← API calls via apiClient
├───────────────────────────────────────┤
│  lib/api/apiClient.ts                 │  ← HTTP client (fetch wrapper)
├───────────────────────────────────────┤
│  @supportops/contracts                │  ← Types + Schemas + Endpoints
└───────────────────────────────────────┘
```

## Rules for Writing Code

### Route Pages (`app/[locale]/(admin)/*/page.tsx`)
- Keep THIN. Page components should only:
  1. Fetch initial data (if using Server Components)
  2. Compose feature components
  3. Handle layout concerns
- NO business logic in page files.
- Example:
```tsx
// app/[locale]/(admin)/products/page.tsx
import { ProductTable } from '@/features/products/components/ProductTable';
import { ProductSearch } from '@/features/products/components/ProductSearch';

export default function ProductsPage() {
  return (
    <div>
      <ProductSearch />
      <ProductTable />
    </div>
  );
}
```

### Feature Components (`features/*/components/*.tsx`)
- Each component = one clear responsibility
- Use hooks for data, not direct service calls
- Props interface defined above component
- Always handle loading + error + empty states
- Use `useTranslations()` for ALL user-facing text
- Example:
```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useProducts } from '../hooks/useProducts';

interface ProductTableProps {
  initialSearch?: string;
}

export function ProductTable({ initialSearch }: ProductTableProps) {
  const t = useTranslations('products');
  const { data, isLoading, error } = useProducts({ search: initialSearch });

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorDisplay message={error.message} />;
  if (!data?.length) return <EmptyState message={t('noProducts')} />;

  return (/* table JSX */);
}
```

### Custom Hooks (`features/*/hooks/*.ts`)
- Encapsulate data fetching + state management
- Call services (not apiClient directly)
- Handle loading, error, and cache states
- Name: `use[Feature][Action]` — e.g., `useProducts`, `useTaskDetail`
- Example:
```ts
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/product.service';
import type { ProductListItem } from '@supportops/contracts';
import { ApiError } from '@/lib/api';

export function useProducts(params?: { page?: number; search?: string }) {
  const [data, setData] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.list(params);
      setData(response.data);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(0, {
        code: 'UNKNOWN', message: 'Unknown error'
      }));
    } finally {
      setIsLoading(false);
    }
  }, [params?.page, params?.search]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
```

### Services (`features/*/services/*.service.ts`)
- Pure functions that call `apiClient`
- Import endpoints from `@supportops/contracts`
- Import types from `@supportops/contracts`
- NO state, NO hooks, NO React imports
- ONE service file per feature module
- Example:
```ts
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@supportops/contracts';
import type { Product, CreateProductRequest } from '@supportops/contracts';

export const productService = {
  list: (params?: { page?: number; size?: number; search?: string }) =>
    apiClient.get<Product[]>(ENDPOINTS.PRODUCTS.LIST, {
      params: { page: params?.page ?? 1, size: params?.size ?? 20, search: params?.search },
    }),

  create: (data: CreateProductRequest) =>
    apiClient.post<Product>(ENDPOINTS.PRODUCTS.LIST, data),
};
```

### API Client (`lib/api/apiClient.ts`)
- DO NOT MODIFY without explicit instruction.
- Handles: auth headers, token refresh, trace IDs, error normalization, timeouts.
- All HTTP calls MUST go through this client.

### Shared UI (`shared/ui/`)
- DO NOT MODIFY existing components without explicit instruction.
- Use these components in feature components.
- If a component doesn't exist, create it in `features/*/components/` first.
- Promote to `shared/ui` only when used by 3+ features.

### Contracts (`shared/contracts/`)
- When adding a new API endpoint:
  1. Add type to `shared/contracts/src/types/[module].types.ts`
  2. Add endpoint to `shared/contracts/src/endpoints.ts`
  3. Add Zod schema if it's a form (to `shared/contracts/src/schemas/`)
  4. Export from `shared/contracts/src/index.ts`
  5. THEN implement service + hook + component

### i18n
- ALL user-facing text must use `useTranslations()` or `getTranslations()`
- Translation files: `apps/web/src/i18n/messages/{en,vi}.json`
- Namespace by feature: `products.title`, `auth.loginButton`, etc.
- NEVER hardcode English/Vietnamese strings in components

### File Naming Convention
| Type | Convention | Example |
|---|---|---|
| Component | `PascalCase.tsx` | `ProductTable.tsx` |
| Hook | `camelCase.ts` | `useProducts.ts` |
| Service | `kebab-case.service.ts` | `product.service.ts` |
| Type file | `kebab-case.types.ts` | `product.types.ts` |
| Schema file | `kebab-case.schema.ts` | `product.schema.ts` |
| Test file | `*.test.ts(x)` | `ProductTable.test.tsx` |
| Util file | `camelCase.ts` | `formatCurrency.ts` |

### Import Order (enforce via ESLint)
```ts
// 1. React / Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useTranslations } from 'next-intl';

// 3. Internal packages (@supportops/*)
import type { Product } from '@supportops/contracts';

// 4. Internal absolute imports (@/*)
import { apiClient } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthContext';

// 5. Relative imports
import { ProductRow } from './ProductRow';
```

### Error Handling Pattern
```tsx
// In hooks — catch and normalize
try {
  const res = await someService.doThing();
  return res.data;
} catch (err) {
  if (err instanceof ApiError) {
    if (err.code === 'NOT_FOUND') {
      // Handle specific error
    }
    throw err; // Re-throw for component to handle
  }
  throw new ApiError(0, { code: 'UNKNOWN', message: 'Unexpected error' });
}

// In components — display to user
if (error) {
  return <ErrorDisplay code={error.code} message={error.message} />;
}
```

### State Management
- **Server state**: Custom hooks with service calls (no Redux needed for Phase 1)
- **Auth state**: `AuthContext` (`lib/auth/AuthContext.tsx`)
- **UI state**: Local `useState` / `useReducer` in components
- **Form state**: React Hook Form + Zod resolver
- **Future**: Consider TanStack Query if caching complexity grows

### Do NOT
- ❌ Import from `@/lib/api/apiClient` in components (use services → hooks)
- ❌ Use `any` type
- ❌ Hardcode API URLs
- ❌ Hardcode user-facing strings (use i18n)
- ❌ Put business logic in page.tsx files
- ❌ Create global state unless absolutely necessary
- ❌ Use `useEffect` for data fetching without cleanup
- ❌ Skip loading / error / empty states in components
