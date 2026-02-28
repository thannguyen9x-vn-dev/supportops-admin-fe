# AGENTS.md — SupportOps Platform

## Project Overview
SupportOps is a multi-tenant SaaS Operations Platform.

- **Frontend**: Next.js 15 (App Router) + TypeScript + MUI-based design system
- **Backend**: Java 21 + Spring Boot 3.4 + Gradle (Kotlin DSL)
- **Database**: PostgreSQL 16 + Flyway migrations
- **Cache**: Redis 7
- **Storage**: MinIO (S3-compatible) for file uploads
- **Monorepo**: pnpm workspaces

**Business model**: Subscription-based with 3 tiers:
- Freelancer ($49/mo) — 1 user
- Company ($299/mo) — 5-10 users
- Enterprise ($2799/mo) — 20+ users

Users can manage tasks (Kanban), products, invoices, billing, and internal messages.

## Monorepo Structure

```text
root/
├── apps/
│   ├── web/                    # Next.js Frontend (port 3000)
│   └── api/                    # Java Spring Boot Backend (port 8080)
├── shared/
│   ├── ui/                     # Shared UI components (React + MUI)
│   └── contracts/              # API types, Zod schemas, endpoint constants
├── docs/                       # Documentation
├── pnpm-workspace.yaml
├── AGENTS.md                   # ← This file
└── .cursorrules                # AI assistant rules
```

## Module Map

```text
┌─────────────────────────────────────────────────────────────┐
│                    SupportOps Platform                       │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   CORE       │   COMMERCE   │  COLLAB      │  PLATFORM      │
├──────────────┼──────────────┼──────────────┼────────────────┤
│ Auth & RBAC  │ Products     │ Kanban       │ Subscription   │
│ User Profile │ Billing      │ Messages     │ Pricing/Plans  │
│ Settings     │ Invoices     │ Calendar*    │ Dashboard      │
│ Team*        │ Payments     │ Comments     │ Notifications  │
└──────────────┴──────────────┴──────────────┴────────────────┘
                                              * = Phase 2
```

## Key Architectural Principles

### 1. Backend-Agnostic Frontend
- Frontend NEVER hardcodes backend URLs
- All API calls: Component → Hook → Service → `apiClient.ts`
- All types come from `@supportops/contracts`
- Changing backend = changing ONE env variable (`NEXT_PUBLIC_API_BASE_URL`)

### 2. Contracts as Single Source of Truth
- `shared/contracts/` defines ALL API types, Zod schemas, and endpoint paths
- Both FE and BE MUST conform to these contracts
- When adding a new API endpoint: update `shared/contracts/` FIRST

### 3. Multi-Tenancy (Shared DB, tenant_id column)
- Every data table has `tenant_id` column
- Tenant resolved from JWT claims on every request
- Backend uses `TenantContext` (ThreadLocal) to scope ALL queries
- NEVER write a query without `tenant_id` filter

### 4. Consistent API Response Format
```json
// Success (single)
{ "data": { ... } }

// Success (paginated)
{
  "data": [ ... ],
  "meta": { "page": 1, "size": 20, "total": 100, "totalPages": 5 }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": ["email: must not be blank"],
    "traceId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 5. Module-Based Architecture
Both FE and BE are organized by feature modules:
`auth`, `user`, `product`, `message`, `dashboard`, `kanban`, `subscription`, `billing`, `invoice`, `file`

## Database ERD

```text
tenants
  │
  ├── users ──── user_preferences
  │     │──── user_sessions
  │     │──── refresh_tokens
  │
  ├── plans
  │     └── subscriptions
  │
  ├── billing_info
  ├── payment_methods
  ├── order_history
  │
  ├── products ──── product_images
  │
  ├── invoices ──── invoice_items
  │
  ├── boards
  │     └── board_columns
  │           └── tasks ──── task_assignees (join table)
  │                    ├── task_comments
  │                    └── task_attachments
  │
  └── messages ──── message_attachments
```

## Implementation Priority

### Phase 1: Foundation
1. Project scaffold (Gradle + Spring Boot + Docker Compose)
2. Common layer (ApiResponse, GlobalExceptionHandler, TraceIdFilter, BaseEntity)
3. Auth module (Register, Login, JWT, Refresh, RBAC)
4. `shared/contracts` package
5. FE `apiClient.ts` + `AuthContext`
6. User Profile CRUD + Settings

### Phase 2: Core Features
7. Products CRUD + image upload
8. Kanban board + tasks + drag & drop
9. Messages (inbox, detail, reply)
10. Dashboard (aggregated data)

### Phase 3: Commerce
11. Plans + Subscription management
12. Billing info + payment methods
13. Invoice CRUD + PDF generation
14. Plan-based feature gating

## Coding Standards

### TypeScript (Frontend)
- Strict mode enabled
- No `any` — use `unknown` then narrow
- Prefer `interface` over `type` for object shapes
- Use barrel exports (`index.ts`) per module
- Components: `PascalCase.tsx`, Utils: `camelCase.ts`, Services: `kebab-case.service.ts`

### Java (Backend)
- Java 21 features: records, pattern matching, sealed classes, text blocks
- Spring Boot conventions
- Lombok: `@Data`, `@Builder`, `@Slf4j`, `@RequiredArgsConstructor`
- MapStruct for DTO ↔ Entity mapping
- Validation: `jakarta.validation` annotations
- All exceptions through `GlobalExceptionHandler`
- Constructor injection ONLY (no `@Autowired` field injection)

### Git Commits
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- Scope by module: `feat(auth): add login endpoint`
- Atomic commits — one logical change per commit

## Important File Locations

| Purpose | Path |
|---|---|
| API Client | `apps/web/src/lib/api/apiClient.ts` |
| Auth Context | `apps/web/src/lib/auth/AuthContext.tsx` |
| Token Manager | `apps/web/src/lib/auth/tokenManager.ts` |
| Environment Config | `apps/web/src/lib/config/env.ts` |
| API Contracts (types) | `shared/contracts/src/types/` |
| API Contracts (schemas) | `shared/contracts/src/schemas/` |
| API Endpoints | `shared/contracts/src/endpoints.ts` |
| Feature Services (FE) | `apps/web/src/features/*/services/` |
| Spring Boot Entry | `apps/api/src/main/java/com/supportops/api/SupportOpsApplication.java` |
| Flyway Migrations | `apps/api/src/main/resources/db/migration/` |
| Global Exception Handler | `apps/api/src/.../common/exception/GlobalExceptionHandler.java` |
| Base Entity | `apps/api/src/.../common/entity/BaseEntity.java` |
| Tenant Context | `apps/api/src/.../common/security/TenantContext.java` |
| Security Config | `apps/api/src/.../config/SecurityConfig.java` |
| Docker Compose | `apps/api/docker-compose.yml` |

## How to Run

```bash
# Infrastructure (PostgreSQL + Redis + MinIO)
cd apps/api && docker compose up -d

# Backend
cd apps/api && ./gradlew bootRun        # http://localhost:8080

# Frontend
cd apps/web && pnpm dev                  # http://localhost:3000

# Type-check contracts
cd shared/contracts && pnpm typecheck
```

## Testing

### Frontend
- Unit: Vitest + React Testing Library
- E2E: Playwright (Phase 2)
- Files: `*.test.ts(x)` colocated with source

### Backend
- Unit: JUnit 5 + Mockito
- Integration: Testcontainers (PostgreSQL)
- Files: mirror `src/main` structure under `src/test`
- Base class: `BaseIntegrationTest.java`
