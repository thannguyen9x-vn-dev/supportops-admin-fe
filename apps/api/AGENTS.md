# AGENTS.md — Backend (apps/api)

## Tech Stack
- Java 21 (use modern features: records, pattern matching, text blocks)
- Spring Boot 3.4.x
- Gradle (Kotlin DSL)
- PostgreSQL 16 + Flyway
- Redis (caching + rate limiting)
- MinIO / S3 (file storage)
- JWT (jjwt library)
- MapStruct (DTO mapping)
- Lombok (boilerplate reduction)

## Package Structure

```text
com.supportops.api/
├── config/              # Spring configuration classes
├── common/              # Cross-cutting concerns
│   ├── dto/            # ApiResponse, ApiErrorResponse, PageMeta
│   ├── entity/         # BaseEntity (id, createdAt, updatedAt)
│   ├── exception/      # Custom exceptions + GlobalExceptionHandler
│   ├── filter/         # TraceIdFilter, JwtAuthFilter
│   ├── security/       # JwtUtil, UserPrincipal, TenantContext
│   ├── tenant/         # Multi-tenancy support
│   └── util/           # Utility classes
├── modules/             # Feature modules
│   ├── auth/
│   ├── user/
│   ├── product/
│   ├── message/
│   ├── dashboard/
│   ├── kanban/
│   ├── subscription/
│   ├── billing/
│   ├── invoice/
│   └── file/
└── seed/                # Dev data seeders
```

## Rules for Writing Code

### Module Structure
Every module follows this structure:
```text
modules/[name]/
├── [Name]Controller.java      # REST endpoints
├── [Name]Service.java         # Business logic
├── [Name]Repository.java      # JPA repository
├── [Name]Mapper.java          # MapStruct mapper (if needed)
├── dto/
│   ├── [Name]Response.java    # Outgoing DTO
│   ├── Create[Name]Request.java  # Incoming DTO for create
│   └── Update[Name]Request.java  # Incoming DTO for update
└── entity/
    └── [Name].java            # JPA entity
```

### Controller Rules
- Annotate with `@RestController` and `@RequestMapping("/api/v1/[resource]")`
- Keep THIN — delegate ALL logic to Service
- Return `ApiResponse<T>` for consistency
- Use `@Valid` for request body validation
- Use `@PreAuthorize` for role-based access
- Document with OpenAPI annotations
- Example:
```java
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ApiResponse<List<ProductResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {

        var result = productService.list(page, size, search);
        return ApiResponse.of(result.getContent(), PageMeta.from(result));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<ProductResponse> create(
            @Valid @RequestBody CreateProductRequest request) {
        return ApiResponse.of(productService.create(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getById(@PathVariable UUID id) {
        return ApiResponse.of(productService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<ProductResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequest request) {
        return ApiResponse.of(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public void delete(@PathVariable UUID id) {
        productService.delete(id);
    }
}
```

### Service Rules
- Annotate with `@Service`
- Contains ALL business logic
- Use `@Transactional` for write operations
- Throw custom exceptions (NEVER return null for missing data)
- Access tenant via `TenantContext.getCurrentTenantId()`
- Use MapStruct mapper for entity ↔ DTO conversion
- Example:
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public Page<ProductResponse> list(int page, int size, String search) {
        UUID tenantId = TenantContext.getCurrentTenantId();
        Pageable pageable = PageRequest.of(page - 1, size);

        Page<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository
                .findByTenantIdAndNameContainingIgnoreCase(
                    tenantId, search, pageable);
        } else {
            products = productRepository
                .findByTenantId(tenantId, pageable);
        }

        return products.map(productMapper::toResponse);
    }

    public ProductResponse getById(UUID id) {
        UUID tenantId = TenantContext.getCurrentTenantId();
        Product product = productRepository
            .findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new NotFoundException("Product", id));
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        UUID tenantId = TenantContext.getCurrentTenantId();
        Product product = productMapper.toEntity(request);
        product.setTenantId(tenantId);
        product = productRepository.save(product);
        log.info("Product created: {} for tenant: {}", product.getId(), tenantId);
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse update(UUID id, UpdateProductRequest request) {
        UUID tenantId = TenantContext.getCurrentTenantId();
        Product product = productRepository
            .findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new NotFoundException("Product", id));

        productMapper.updateEntity(request, product);
        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Transactional
    public void delete(UUID id) {
        UUID tenantId = TenantContext.getCurrentTenantId();
        Product product = productRepository
            .findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new NotFoundException("Product", id));
        productRepository.delete(product);
        log.info("Product deleted: {} for tenant: {}", id, tenantId);
    }
}
```

### Entity Rules
- Extend `BaseEntity` (provides id, createdAt, updatedAt)
- Implement `TenantAware` interface (provides tenantId)
- Use `@Entity` and `@Table` annotations
- Define indexes on frequently queried columns
- Use `UUID` for all IDs
- Use `@Enumerated(EnumType.STRING)` for enums
- Example:
```java
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_tenant", columnList = "tenant_id"),
    @Index(name = "idx_products_name", columnList = "tenant_id, name")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product extends BaseEntity implements TenantAware {

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false)
    private String name;

    private String subtitle;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String details;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProductImage> images = new ArrayList<>();
}
```

### Repository Rules
- Extend `JpaRepository<Entity, UUID>`
- ALL queries MUST filter by `tenantId` (multi-tenancy)
- Use Spring Data method naming for simple queries
- Use `@Query` for complex queries
- Example:
```java
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Page<Product> findByTenantId(UUID tenantId, Pageable pageable);

    Page<Product> findByTenantIdAndNameContainingIgnoreCase(
        UUID tenantId, String name, Pageable pageable);

    Optional<Product> findByIdAndTenantId(UUID id, UUID tenantId);

    void deleteByIdAndTenantId(UUID id, UUID tenantId);

    long countByTenantId(UUID tenantId);
}
```

### DTO Rules
- Use Java records for immutable DTOs (requests and responses)
- Use `jakarta.validation` annotations on request DTOs
- DO NOT expose entity classes directly in controllers
- Example:
```java
// Request DTO
public record CreateProductRequest(
    @NotBlank(message = "Name is required")
    String name,

    String subtitle,

    @NotBlank(message = "Category is required")
    String category,

    @NotBlank(message = "Brand is required")
    String brand,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    BigDecimal price,

    String details
) {}

// Response DTO
public record ProductResponse(
    UUID id,
    String name,
    String subtitle,
    String category,
    String brand,
    BigDecimal price,
    String details,
    List<ProductImageResponse> images,
    Instant createdAt,
    Instant updatedAt
) {}
```

### MapStruct Mapper Rules
- Annotate with `@Mapper(componentModel = "spring")`
- Define explicit mappings only when names differ
- Create `updateEntity` methods for partial updates
- Example:
```java
@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductResponse toResponse(Product product);

    Product toEntity(CreateProductRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateProductRequest request, @MappingTarget Product product);
}
```

### Exception Rules
- ALL custom exceptions extend `AppException`
- `AppException` has: `HttpStatus status`, `String code`, `String message`
- Pre-built: `NotFoundException`, `ForbiddenException`, `ConflictException`,
  `ValidationException`, `UnauthorizedException`, `PlanLimitException`
- `GlobalExceptionHandler` catches ALL exceptions and formats them
- NEVER return raw exception details in production
- Example:
```java
// Throwing
throw new NotFoundException("Product", id);
// → { "error": { "code": "NOT_FOUND", "message": "Product not found: {id}", "traceId": "..." } }

throw new ConflictException("EMAIL_ALREADY_EXISTS", "Email already in use");
throw new ForbiddenException("Insufficient permissions");
throw new PlanLimitException("Invoice creation requires Enterprise plan");
```

### Flyway Migration Rules
- File naming: `V{number}__{description}.sql` (double underscore)
- NEVER modify existing migrations — create new ones
- Always include `tenant_id` on data tables
- Always include `created_at` and `updated_at`
- Always create indexes for foreign keys and frequently filtered columns
- Example: `V4__create_products.sql`

### Security Rules
- Public endpoints: login, register, refresh, plans list, pricing
- All other endpoints require valid JWT
- JWT contains: `userId`, `tenantId`, `role`, `email`
- TenantContext is set by TenantFilter after JWT validation
- Use `@PreAuthorize` for role checks:
  ```java
  @PreAuthorize("hasRole('SUPER_ADMIN')")            // Super admin only
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')") // Admin+
  @PreAuthorize("isAuthenticated()")                  // Any logged-in user
  ```

### Logging Rules
- Use `@Slf4j` (Lombok) on service classes
- Log at appropriate levels:
  - `INFO`: Successful create/update/delete operations
  - `WARN`: Business rule violations, deprecated usage
  - `ERROR`: Unexpected exceptions, external service failures
- Include traceId and tenantId in log context
- Example:
```java
log.info("Product created: id={}, tenantId={}", product.getId(), tenantId);
log.warn("Plan limit reached: tenantId={}, feature={}", tenantId, feature);
log.error("Failed to generate PDF: invoiceId={}", invoiceId, exception);
```

### Testing Rules
- Unit tests for Service classes (mock Repository)
- Integration tests for Controller classes (Testcontainers)
- Test file naming: `[Class]Test.java`
- Use `@DisplayName` for readable test names
- Follow AAA pattern: Arrange → Act → Assert
- Example:
```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @Mock private ProductMapper productMapper;
    @InjectMocks private ProductService productService;

    @Test
    @DisplayName("Should throw NotFoundException when product not found")
    void getById_notFound() {
        UUID id = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();

        try (var ctx = mockStatic(TenantContext.class)) {
            ctx.when(TenantContext::getCurrentTenantId).thenReturn(tenantId);
            when(productRepository.findByIdAndTenantId(id, tenantId))
                .thenReturn(Optional.empty());

            assertThrows(NotFoundException.class,
                () -> productService.getById(id));
        }
    }
}
```

### Do NOT
- ❌ Return entities directly from controllers (use DTOs)
- ❌ Put business logic in controllers
- ❌ Write queries without tenant_id filter
- ❌ Modify existing Flyway migrations
- ❌ Catch exceptions in controllers (let GlobalExceptionHandler handle)
- ❌ Use `@Autowired` field injection (use constructor injection via `@RequiredArgsConstructor`)
- ❌ Store secrets in application.yml (use environment variables)
- ❌ Use `System.out.println` (use SLF4J logger)
- ❌ Skip validation annotations on request DTOs
- ❌ Create N+1 query patterns (use `@EntityGraph` or `JOIN FETCH`)
