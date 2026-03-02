# Backend Auth Implementation Guide (Spring Boot, Java 21)

This guide maps directly to the current frontend behavior in `supportops-admin-fe`.

## 1. FE behavior you must match

- API prefix: `/api/v1`
- FE stores only `accessToken` in session storage.
- FE refreshes automatically on `401` by calling:
  - `POST /api/v1/auth/refresh`
  - no request body
  - cookie-based refresh token
- FE sends `credentials: include` for all API requests.
- FE expects JSON response contract:

```json
{ "data": { ... } }
```

## 2. Required endpoint behavior

### `POST /api/v1/auth/login`
- Validate credentials.
- Return body: `{ data: { accessToken, expiresIn, user } }`
- Set refresh token in `HttpOnly` cookie.

### `POST /api/v1/auth/register`
- Create account + tenant mapping as your domain requires.
- Return body same as login.
- Set refresh token cookie.

### `POST /api/v1/auth/refresh`
- Read refresh token from cookie `supportops_refresh_token`.
- Validate token + check revocation/expiry.
- Rotate refresh token (recommended).
- Return body: `{ data: { accessToken, expiresIn } }`
- Re-set rotated refresh cookie.

### `POST /api/v1/auth/logout`
- Read refresh cookie.
- Revoke token server-side.
- Clear cookie (`Max-Age=0`, same path/domain/samesite config).
- Return `204` or `{ data: true }`.

## 3. Cookie constants

Use one place for cookie config to avoid mismatch bugs.

```java
public final class AuthCookieConstants {
    public static final String REFRESH_COOKIE_NAME = "supportops_refresh_token";
    public static final int REFRESH_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
    public static final String COOKIE_PATH = "/";

    private AuthCookieConstants() {}
}
```

## 4. Cookie helper (recommended)

Use `ResponseCookie` so you can control `SameSite`.

```java
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

public final class AuthCookieUtil {

    private AuthCookieUtil() {}

    public static void addRefreshCookie(HttpServletResponse response, String refreshToken, boolean secure) {
        ResponseCookie cookie = ResponseCookie.from(AuthCookieConstants.REFRESH_COOKIE_NAME, refreshToken)
            .httpOnly(true)
            .secure(secure)
            .path(AuthCookieConstants.COOKIE_PATH)
            .sameSite("Lax")
            .maxAge(AuthCookieConstants.REFRESH_COOKIE_MAX_AGE_SECONDS)
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public static void clearRefreshCookie(HttpServletResponse response, boolean secure) {
        ResponseCookie cookie = ResponseCookie.from(AuthCookieConstants.REFRESH_COOKIE_NAME, "")
            .httpOnly(true)
            .secure(secure)
            .path(AuthCookieConstants.COOKIE_PATH)
            .sameSite("Lax")
            .maxAge(0)
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
```

## 5. Read cookie in controller

```java
private Optional<String> getRefreshTokenFromCookie(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies == null) {
        return Optional.empty();
    }

    return Arrays.stream(cookies)
        .filter(cookie -> AuthCookieConstants.REFRESH_COOKIE_NAME.equals(cookie.getName()))
        .map(Cookie::getValue)
        .findFirst();
}
```

## 6. Auth controller shape

```java
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AppSecurityProperties securityProperties;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResult result = authService.login(request);
        AuthCookieUtil.addRefreshCookie(response, result.refreshToken(), securityProperties.cookieSecure());
        return ApiResponse.of(new LoginResponse(result.accessToken(), result.expiresIn(), result.user()));
    }

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        RegisterResult result = authService.register(request);
        AuthCookieUtil.addRefreshCookie(response, result.refreshToken(), securityProperties.cookieSecure());
        return ApiResponse.of(new RegisterResponse(result.accessToken(), result.expiresIn(), result.user()));
    }

    @PostMapping("/refresh")
    public ApiResponse<RefreshTokenResponse> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = getRefreshTokenFromCookie(request)
            .orElseThrow(() -> new UnauthorizedException("Missing refresh token"));

        RefreshResult result = authService.refresh(refreshToken);
        AuthCookieUtil.addRefreshCookie(response, result.rotatedRefreshToken(), securityProperties.cookieSecure());
        return ApiResponse.of(new RefreshTokenResponse(result.accessToken(), result.expiresIn()));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        getRefreshTokenFromCookie(request).ifPresent(authService::revokeRefreshToken);
        AuthCookieUtil.clearRefreshCookie(response, securityProperties.cookieSecure());
    }
}
```

## 7. CORS config for cookie auth

If frontend and backend are cross-origin in dev:

```java
@Bean
public WebMvcConfigurer corsConfigurer(AppCorsProperties cors) {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins(cors.allowedOrigins().toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        }
    };
}
```

Important:
- With `allowCredentials(true)`, `allowedOrigins` cannot be `*`.

## 8. Security checklist

- Access token TTL: 15 minutes.
- Refresh token TTL: 7 days.
- Refresh token stored hashed in DB (recommended), not plain token.
- Refresh token rotation on every refresh.
- Revoke token on logout.
- Revoke all user refresh tokens on password change (recommended).

## 9. DB checklist (minimum)

`refresh_tokens` table should include:
- `id`
- `user_id`
- `token_hash` (unique)
- `expires_at`
- `revoked_at` (nullable)
- `created_at`
- `user_agent` (optional)
- `ip_address` (optional)

## 10. Quick verification flow

1. Login request returns `Set-Cookie: supportops_refresh_token=...; HttpOnly; Path=/; SameSite=Lax`.
2. Access token expires or is invalid.
3. FE calls `/api/v1/auth/refresh` automatically.
4. Backend returns new access token + rotated refresh cookie.
5. FE retries original request successfully.
6. Logout clears refresh cookie and revokes token.

## 11. Common pitfalls

- Cookie not sent because:
  - missing `credentials: include` on FE (already fixed)
  - missing `allowCredentials(true)` on backend CORS
  - wrong `Secure` flag on local HTTP
- Refresh endpoint expecting JSON body refresh token (not compatible with FE).
- Clearing cookie with different `Path`/`SameSite` than issue cookie.
