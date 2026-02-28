# SupportOps API Reference

Base URL: `http://localhost:8080/api/v1`

## Authentication

All endpoints except those marked `[PUBLIC]` require:

```text
Authorization: Bearer <access_token>
```

Optional trace header:

```text
x-trace-id: <uuid>
```

## Auth

### POST `/auth/register` [PUBLIC]
Create tenant + user account.

### POST `/auth/login` [PUBLIC]
Login and return access token; refresh token is rotated via cookie.

### POST `/auth/refresh` [PUBLIC]
Issue new access token from refresh token.

### POST `/auth/logout`
Revoke refresh token.

## Users

### GET `/users/me`
Get current profile.

### PUT `/users/me`
Update profile.

### PUT `/users/me/password`
Change password.

### GET `/users/me/preferences`
### PUT `/users/me/preferences`
Get/update notification preferences.

## Products

### GET `/products?page=1&size=20&search=&category=`
List products (tenant-scoped, paginated).

### GET `/products/{id}`
Get product detail.

### POST `/products`
Create product.

### PUT `/products/{id}`
Update product.

### DELETE `/products/{id}`
Delete product.

### DELETE `/products/bulk`
Bulk delete.

### POST `/products/{id}/images`
Upload images (multipart, `files`).

### DELETE `/products/{id}/images/{imageId}`
Delete image.

### PUT `/products/{id}/images/reorder`
Reorder images.

## Files

### GET `/files/access-url?url=...&expiresInSeconds=300`
Get temporary read URL for storage objects.

## Kanban (Planned)

- `GET /boards`
- `GET /boards/{boardId}`
- `POST /boards`
- `POST /boards/{boardId}/columns`
- `PUT /boards/{boardId}/columns/{colId}`
- `PUT /boards/{boardId}/columns/reorder`
- `DELETE /boards/{boardId}/columns/{colId}`
- `GET /boards/{boardId}/tasks`
- `POST /boards/{boardId}/columns/{colId}/tasks`
- `PUT /tasks/{taskId}`
- `PUT /tasks/{taskId}/move`
- `PUT /tasks/{taskId}/archive`
- `DELETE /tasks/{taskId}`
