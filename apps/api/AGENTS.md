# AGENTS.md — Backend (apps/api)

## Tech Stack
- Java 21 + Spring Boot 3.4.x
- Gradle
- PostgreSQL 16 + Flyway
- Redis 7
- MinIO / S3
- JWT (jjwt)
- MapStruct + Lombok

## Core Rules
- Controllers are thin; services own business logic
- Use DTOs/records in API responses (never expose entities)
- Validate request DTOs via `@Valid`
- Use constructor injection (`@RequiredArgsConstructor`)
- Every tenant-scoped query MUST filter by `tenantId`
- All exceptions pass through `GlobalExceptionHandler`
- Do not modify old Flyway migrations; create new files

## Module Structure
```text
modules/[name]/
├── [Name]Controller.java
├── [Name]Service.java
├── [Name]Repository.java
├── [Name]Mapper.java
├── dto/
└── entity/
```

## Security Rules
- Public: login/register/refresh/plans
- Others require JWT
- Resolve tenant from JWT into `TenantContext`
- Role checks via `@PreAuthorize`

## Migration Rules
- File format: `V{number}__{description}.sql`
- Include `tenant_id` on tenant-scoped tables
- Include `created_at`, `updated_at` (TIMESTAMPTZ)
- Add indexes for foreign keys and tenant filters

## Strict DO NOTs
- ❌ Business logic in controllers
- ❌ Tenant-unscoped queries
- ❌ `@Autowired` field injection
- ❌ `System.out.println`
- ❌ Returning `null` for not found (throw exception)
