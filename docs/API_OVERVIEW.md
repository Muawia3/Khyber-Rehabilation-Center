# API Architecture & Endpoints Overview

All backend endpoints are versioned and mounted under the `/api/v1` prefix.

---

## 1. System & Health Check

| Method | Endpoint | Access | Description | Status Code |
|---|---|---|---|---|
| `GET` | `/api/v1/health` | Public | System status, uptime, and PostgreSQL connectivity check | 200 (OK) / 503 (Degraded) |

### Sample Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "API service health check passed",
  "data": {
    "status": "online",
    "service": "Khyber Rehabilitation Center API",
    "version": "1.0.0",
    "timestamp": "2026-10-13T06:35:09.747Z",
    "uptimeSeconds": 393,
    "database": {
      "status": "connected",
      "latencyMs": 4
    }
  }
}
```

---

## 2. Admin Authentication & Session Management

| Method | Endpoint | Access | Description | Auth Header |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Verify staff credentials and issue JWT session token | None |
| `GET` | `/api/v1/auth/me` | Protected | Retrieve authenticated administrator profile | `Bearer <token>` |
| `POST` | `/api/v1/auth/logout` | Protected | Invalidate current staff session | `Bearer <token>` |

> **Security Guard:** Public admin registration is strictly disabled. Initial admin accounts are provisioned exclusively via explicit environment variables and `npm run db:seed`.

---

## 3. Admin Dashboard & Metrics

| Method | Endpoint | Access | Description | Auth Header |
|---|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Protected | Real-time database metrics: inquiries, programs, products, stories | `Bearer <token>` |

### Sample Metrics Payload:
```json
{
  "metrics": {
    "totalInquiries": 12,
    "pendingInquiries": 4,
    "treatmentPrograms": 6,
    "skillPrograms": 4,
    "businessInitiatives": 3,
    "totalProducts": 8,
    "publishedProducts": 7,
    "activeAnnouncements": 2,
    "successStories": 5
  },
  "recentInquiries": [ ... ]
}
```

---

## 4. Patient Inquiries & Intake Management

| Method | Endpoint | Access | Description | Rate Limit |
|---|---|---|---|---|
| `POST` | `/api/v1/inquiries` | Public | Submit admission or general inquiry (sanitized, validated) | 5 submissions per 15 min |
| `GET` | `/api/v1/inquiries` | Protected | Search and filter inquiries (`?status=`, `?search=`, pagination) | `Bearer <token>` |
| `GET` | `/api/v1/inquiries/:id` | Protected | View single inquiry details | `Bearer <token>` |
| `PATCH` | `/api/v1/inquiries/:id/status`| Protected | Update status (`PENDING`, `IN_REVIEW`, `CONTACTED`, `CLOSED`) & add internal note | `Bearer <token>` |
| `DELETE`| `/api/v1/inquiries/:id` | Protected | Permanently remove confidential inquiry record | `Bearer <token>` |

---

## 5. Protected Content Management (CMS) CRUD Endpoints

All management endpoints require `Authorization: Bearer <token>`:

| Resource | Public Read (Published Only) | Admin Read All (`?all=true`) | Create (`POST`) | Update (`PUT /:id`) | Delete (`DELETE /:id`) |
|---|---|---|---|---|---|
| **Treatments** | `GET /treatments` | `GET /treatments?all=true` | `POST /treatments` | `PUT /treatments/:id` | `DELETE /treatments/:id` |
| **Skills Programs** | `GET /skills` | `GET /skills?all=true` | `POST /skills` | `PUT /skills/:id` | `DELETE /skills/:id` |
| **Business Units** | `GET /business` | `GET /business?all=true` | `POST /business` | `PUT /business/:id` | `DELETE /business/:id` |
| **Products** | `GET /products` | `GET /products?all=true` | `POST /products` | `PUT /products/:id` | `DELETE /products/:id` |
| **Stories** | `GET /stories` | `GET /stories?all=true` | `POST /stories` | `PUT /stories/:id` | `DELETE /stories/:id` |
| **Announcements**| `GET /announcements` | `GET /announcements?all=true` | `POST /announcements` | `PUT /announcements/:id` | `DELETE /announcements/:id` |
| **Site Content** | `GET /content` | `GET /content?raw=true` | `POST /content` | `PUT /content/:key` | `DELETE /content/:key` |

---

## 6. Standard Response Envelopes

### Success Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource retrieved successfully",
  "data": { ... }
}
```

### Unauthorized Envelope (HTTP 401)
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Authentication token required. Please sign in to access management portal.",
  "errors": null
}
```

### Validation Error Envelope (HTTP 422)
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed. Please correct the highlighted errors.",
  "errors": [
    "A valid email address is required",
    "Password must be at least 6 characters"
  ]
}
```

### Database Unreachable Error Envelope (HTTP 503)
```json
{
  "success": false,
  "statusCode": 503,
  "message": "Database service is currently unreachable. Please check PostgreSQL server status and credentials.",
  "errors": null
}
```
