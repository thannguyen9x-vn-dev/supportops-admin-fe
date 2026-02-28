# AGENTS.md — SupportOps Platform

## Project Overview
SupportOps is a multi-tenant SaaS Operations Platform built with:
- **Frontend**: Next.js 15 (App Router) + TypeScript + MUI-based design system
- **Backend**: Java 21 + Spring Boot 3.4 + Gradle
- **Database**: PostgreSQL 16 + Flyway migrations
- **Monorepo**: pnpm workspaces

Business model: Subscription-based (Freelancer / Company / Enterprise tiers).
Users can manage tasks (Kanban), products, invoices, billing, and internal messages.

## Monorepo Structure

```text
root/
├── apps/
│   ├── web/                    # Next.js Frontend
│   └── api/                    # Java Spring Boot Backend
├── shared/
│   ├── ui/                     # Shared UI components (React + MUI)
│   └── contracts/              # API types, Zod schemas, endpoint constants
├── docs/                       # Documentation
├── pnpm-workspace.yaml
└── AGENTS.md                   # This file
```

## Key Principles

### 1. Backend-Agnostic Frontend
- Frontend NEVER hardcodes backend URLs.
- All API calls go through `apiClient.ts` → `services/*.service.ts`.
- All types come from `@supportops/contracts`.
- Changing backend = changing ONE env variable (`NEXT_PUBLIC_API_BASE_URL`).

### 2. Contracts as Single Source of Truth
- `shared/contracts/` defines ALL API types, Zod schemas, and endpoint paths.
- Both FE and BE MUST conform to these contracts.
- When adding a new API endpoint, update `shared/contracts/` FIRST.

### 3. Multi-Tenancy
- Every data table has `tenant_id` column.
- Tenant is resolved from JWT claims on every request.
- Backend uses `TenantContext` (ThreadLocal) to scope queries.

### 4. Consistent API Response Format
```json
// Success
{
  "data": T,
  "meta": { "page": 1, "size": 20, "total": 100, "totalPages": 5 }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [...],
    "traceId": "uuid"
  }
}
```

### 5. Module-Based Architecture
Both FE and BE are organized by feature modules:
- `auth`, `user`, `product`, `message`, `dashboard`, `kanban`, `subscription`, `billing`, `invoice`

## Coding Standards

### TypeScript (Frontend)
- Strict mode enabled
- No `any` — use `unknown` if truly unknown, then narrow
- Prefer `interface` over `type` for object shapes
- Use barrel exports (`index.ts`) per module
- File naming: `kebab-case.ts` for utils, `PascalCase.tsx` for components

### Java (Backend)
- Java 21 features allowed (records, pattern matching, sealed classes)
- Follow Spring Boot conventions
- Use Lombok (`@Data`, `@Builder`, `@Slf4j`) for boilerplate reduction
- Use MapStruct for DTO ↔ Entity mapping
- Validation via `jakarta.validation` annotations
- All exceptions through `GlobalExceptionHandler`

### Git Commits
- Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- Scope by module: `feat(auth): add login endpoint`
- Keep commits atomic — one logical change per commit

## Important File Locations

| Purpose | Path |
|---|---|
| API Client | `apps/web/src/lib/api/apiClient.ts` |
| Auth Context | `apps/web/src/lib/auth/AuthContext.tsx` |
| Token Manager | `apps/web/src/lib/auth/tokenManager.ts` |
| Environment Config | `apps/web/src/lib/config/env.ts` |
| API Contracts | `shared/contracts/src/` |
| API Endpoints | `shared/contracts/src/endpoints.ts` |
| Zod Schemas | `shared/contracts/src/schemas/` |
| Feature Services | `apps/web/src/features/*/services/` |
| Spring Boot Main | `apps/api/src/main/java/com/supportops/api/` |
| Flyway Migrations | `apps/api/src/main/resources/db/migration/` |
| Global Exception Handler | `apps/api/.../common/exception/GlobalExceptionHandler.java` |

## Testing

### Frontend
- Unit tests: Vitest
- Component tests: React Testing Library
- E2E: Playwright (future)
- Test files: `*.test.ts` / `*.test.tsx` colocated with source

### Backend
- Unit tests: JUnit 5 + Mockito
- Integration tests: Testcontainers (PostgreSQL)
- Test files: mirror `src/main` structure under `src/test`
- Base class: `BaseIntegrationTest.java` with Testcontainers setup

## How to Run

```bash
# Frontend
cd apps/web && pnpm dev           # http://localhost:3000

# Backend
cd apps/api && ./gradlew bootRun  # http://localhost:8080

# Infrastructure
cd apps/api && docker compose up -d  # PostgreSQL + Redis + MinIO
```
