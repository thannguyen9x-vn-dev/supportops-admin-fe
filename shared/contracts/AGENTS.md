# AGENTS.md — Shared Contracts (shared/contracts)

## Purpose
This package is the SINGLE SOURCE OF TRUTH for all API communication between
frontend and backend. Both sides MUST conform to these contracts.

## Structure
```text
src/
├── types/                  # TypeScript interfaces (mirror Java DTOs)
│   ├── api-response.ts    # ApiResponse<T>, PaginatedResponse<T>, PageMeta
│   ├── api-error.ts       # ApiErrorDetail, ApiErrorResponse, ErrorCodes
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── product.types.ts
│   ├── message.types.ts
│   ├── dashboard.types.ts
│   ├── kanban.types.ts
│   ├── subscription.types.ts
│   ├── invoice.types.ts
│   └── billing.types.ts
├── schemas/               # Zod schemas for form validation
│   ├── auth.schema.ts
│   ├── user.schema.ts
│   └── product.schema.ts
├── endpoints.ts           # API endpoint path constants
└── index.ts               # Barrel export
```

## Rules

### Adding a New Type
1. Create or update the appropriate `types/[module].types.ts`
2. Use `interface` (not `type`) for object shapes
3. Export from `index.ts`
4. Field names MUST match the JSON keys from Java backend (camelCase)

### Adding a New Endpoint
1. Add to `endpoints.ts` under the appropriate module
2. Use string literal for static paths: `'/products'`
3. Use function for dynamic paths, for example:
   ```ts
   (id: string) => `/products/${id}`
   ```

### Adding a New Schema
1. Create in `schemas/[module].schema.ts`
2. Must validate same constraints as Java `@Valid` annotations
3. Export the schema AND the inferred type:
   ```ts
   export const createProductSchema = z.object({...});
   export type CreateProductFormData = z.infer<typeof createProductSchema>;
   ```

### Type ↔ Java DTO Mapping Convention
| TypeScript | Java |
|---|---|
| `string` | `String` |
| `number` | `int`, `long`, `BigDecimal` |
| `boolean` | `boolean`, `Boolean` |
| `string` (ISO datetime) | `Instant`, `LocalDateTime` |
| `string` (ISO date) | `LocalDate` |
| `string` (UUID) | `UUID` |
| `string \| null` | `String` (nullable) |
| `SomeEnum` (union type) | `enum SomeEnum` |

### Do NOT
- ❌ Import React or any UI library
- ❌ Import backend code
- ❌ Add runtime logic (this is types + schemas + constants only)
- ❌ Use `any`
- ❌ Use `type` for object shapes (use `interface`)
