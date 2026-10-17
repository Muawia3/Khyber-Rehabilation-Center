# Production Deployment & Hosting Guide

> **Khyber Rehabilitation Center, Peshawar**  
> Comprehensive deployment blueprint and hosting recommendations for the Node.js/Express backend, PostgreSQL database (Prisma ORM), and React (Vite) frontend.

---

## 1. System Architecture Overview

The system consists of three decoupled components designed for scalability, security, and low operational overhead:

1. **Frontend (Client)**:
   - Single-Page Application (SPA) built with React 18 & Vite.
   - Outputs static assets (`dist/`) suitable for high-speed edge distribution (Cloudflare, Vercel, Netlify, or Nginx).
   - Brand Palette: Primary `#019CDC`, Accent `#017db1`, Light Blue `#e6f6fc`, Base `#FFFFFF`.

2. **Backend (REST API)**:
   - Node.js & Express.js (v4) with modular ES modules.
   - Secured with Helmet (CSP, HSTS, XSS protection), CORS, Express-Rate-Limit, and centralized error logging.
   - Versioned API mounted under `/api/v1/`.

3. **Database Layer**:
   - PostgreSQL 14+ managed via Prisma ORM.
   - Strict connection pool management and migration tracking.

---

## 2. Required Production Environment Variables

### Backend (`backend/.env` or Server Environment)
| Variable | Required | Description | Example / Recommendations |
|---|---|---|---|
| `NODE_ENV` | Yes | Runtime environment | `production` |
| `PORT` | Yes | HTTP listening port | `5000` (or injected by hosting platform) |
| `CLIENT_URL` | Yes | Exact domain of the frontend for CORS | `https://khyberrehab.edu.pk` |
| `DATABASE_URL` | Yes | PostgreSQL connection string with SSL | `postgresql://user:password@host:5432/khyber_rehab_db?sslmode=require` |
| `JWT_SECRET` | Yes | 64+ char cryptographically random secret | Generate via `openssl rand -hex 32` |
| `JWT_EXPIRES_IN`| Yes | Session validity period | `7d` (or `24h` for stricter compliance) |
| `RATE_LIMIT_WINDOW_MS`| Optional | Anti-spam window (ms) | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS`| Optional | Max requests per IP in window | `100` |
| `INQUIRY_RATE_LIMIT_MAX`| Optional | Max admission inquiries per IP | `5` |
| `INITIAL_ADMIN_EMAIL` | Only for seeding | Initial admin account email | `admin@khyberrehab.edu.pk` |
| `INITIAL_ADMIN_PASSWORD` | Only for seeding | Strong initial password | `Min 12 chars with symbols` |
| `INITIAL_ADMIN_NAME` | Only for seeding | Admin full name | `System Administrator` |

### Frontend (`frontend/.env` or Build-time Variables)
| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | Public URL of the backend API | `https://api.khyberrehab.edu.pk/api/v1` |

> ⚠️ **Security Rule**: Never check `.env` into Git. Secrets must remain exclusively in the server environment settings.

---

## 3. Database Migration & Initial Admin Setup

Before starting the production server, apply migrations and seed the initial administrator:

```bash
# 1. Apply prepared Prisma migrations in production (non-interactive)
npx prisma migrate deploy --schema=database/prisma/schema.prisma

# 2. Seed initial administrator account (strictly uses INITIAL_ADMIN_* env vars)
npm run db:seed
```

---

## 4. Production Build & Execution

### Option A: Standard Build (Unified Workspace)
```bash
# 1. Install dependencies
npm ci

# 2. Generate Prisma client
npm run prisma:generate

# 3. Build frontend production bundle
npm run build

# 4. Start backend production process
npm run start:backend
```

---

## 5. Recommended Hosting Options

The existing stack is flexible and can be deployed using either a dedicated VPS or modern managed cloud services.

### Recommendation 1: Unified VPS (DigitalOcean / Linode / Hetzner / AWS EC2)
*Best for: Complete control, low cost, data sovereignty, and hosting both frontend and backend on a single virtual server.*

- **Stack**:
  - Ubuntu 22.04 LTS (2 GB RAM, 1-2 vCPUs)
  - Nginx as reverse proxy with Let's Encrypt SSL (`certbot`)
  - PM2 process manager for Node.js clustering and zero-downtime restarts
  - Local or managed PostgreSQL
- **Nginx Configuration Pattern**:
  ```nginx
  server {
      server_name khyberrehab.edu.pk;

      # Serve static React frontend build
      location / {
          root /var/www/khyber-rehab/frontend/dist;
          try_files $uri $uri/ /index.html;
      }

      # Reverse proxy API requests to Express
      location /api/ {
          proxy_pass http://127.0.0.1:5000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```
- **Pros**: Low fixed cost ($6 - $12/month), full data sovereignty, zero platform vendor lock-in.
- **Cons**: Requires Linux server maintenance, backups, and security patching.

---

### Recommendation 2: Managed Cloud Platform (Render / Railway / Fly.io + Supabase)
*Best for: Minimal devops maintenance, automated CI/CD deployments, and managed database backups.*

- **Database**: Managed PostgreSQL on **Supabase** or **Neon** (Includes automated daily backups, SSL, connection pooling).
- **Backend**: **Render** or **Railway** Web Service running Node.js.
- **Frontend**: **Cloudflare Pages** or **Vercel** / **Netlify** for global CDN caching of `frontend/dist`.
- **Pros**: Zero Linux maintenance, automatic SSL, instant rollback, automated Git push deployments.
- **Cons**: Modest monthly tiers after free allowances.

---

## 6. Pre-Launch Security & Verification Checklist

- [x] Passwords hashed with `bcryptjs` (salt rounds 12).
- [x] JWT sessions signed with strict expiration (`7d`).
- [x] All admin management endpoints protected by `authenticateAdmin` middleware.
- [x] Public registration completely disabled.
- [x] Helmet security headers active (Content Security Policy, HSTS, X-Frame-Options).
- [x] CORS restricted to authenticated client domain (`CLIENT_URL`).
- [x] Rate limiting active on all API endpoints + strict inquiry spam limit (5 submissions / 15 min).
- [x] Sensitive patient medical histories are never stored in public website database.
- [x] Success stories published only with verified informed consent (`isConsentGiven`).
- [x] Frontend builds with 0 errors (`npm run build`).
- [x] No secrets or credentials leaked in client bundles or public repositories.
