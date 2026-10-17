# Local Setup & Development Guide

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher (Installed locally, in Docker, or hosted via Supabase / Neon / AWS RDS)

---

## 1. Initial Setup & Environment Configuration

1. Copy `.env.example` to create `.env` in the root and in `backend/`:
   ```bash
   # In root directory
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

2. Open `backend/.env` (and root `.env`) and configure your PostgreSQL connection:
   ```env
   # PostgreSQL Connection String
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/khyber_rehab_db?schema=public"

   # Initial Admin Seed Credentials (Optional: required only if running npm run db:seed)
   INITIAL_ADMIN_EMAIL=admin@khyberrehab.edu.pk
   INITIAL_ADMIN_PASSWORD=SecurePassword123!
   INITIAL_ADMIN_NAME="System Administrator"

   # Client URL for CORS
   CLIENT_URL=http://localhost:5173
   PORT=5000
   ```

3. In `frontend/.env` (optional, default fallback is already configured):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

---

## 2. Installing Dependencies

Run standard installs in workspaces from the root directory:
```bash
# Install root orchestration tools & dev dependencies
npm install
```

---

## 3. Database Initialization (Prisma + PostgreSQL)

### Step 3.1: Ensure PostgreSQL Service is Running
Make sure PostgreSQL is active on port `5432` and the target database exists (e.g. `khyber_rehab_db`).
You can create the database in PostgreSQL CLI (psql):
```sql
CREATE DATABASE khyber_rehab_db;
```

### Step 3.2: Generate the Prisma Client
Generates Prisma types for both root and backend workspaces:
```bash
npm run prisma:generate
```

### Step 3.3: Apply Migrations
Apply the initial schema migration (`20261013000000_init`):
```bash
npm run prisma:migrate
# OR for production / non-interactive deployment:
npm run prisma:migrate:deploy
```

### Step 3.4: Seed Initial Admin Account (Optional)
Seeds the initial administrator user strictly using the environment credentials (`INITIAL_ADMIN_*`):
```bash
npm run db:seed
```
> **Security Notice**: No hardcoded passwords, fake patient records, or fabricated medical histories are seeded.

---

## 4. Running Development Servers

### Option A: Run Both Frontend and Backend Concurrently
```bash
npm run dev
```

### Option B: Run Individually in Separate Terminals
- **Backend API (Port 5000)**:
  ```bash
  npm run dev:backend
  ```
  Health check is available at: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

- **Frontend Application (Port 5173)**:
  ```bash
  npm run dev:frontend
  ```
  Portal is available at: [http://localhost:5173](http://localhost:5173)

---

## 5. Verifying the API Endpoints

You can verify the backend endpoints using `curl` or Postman:

1. **System Health Check**:
   ```bash
   curl http://localhost:5000/api/v1/health
   ```

2. **Submit Public Inquiry (POST)**:
   ```bash
   curl -X POST http://localhost:5000/api/v1/inquiries \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "Ahmad Khan",
       "email": "ahmad@example.com",
       "phone": "+92 300 0000000",
       "inquiryType": "admission",
       "subject": "Admission Process Details",
       "message": "I would like to inquire about the rehabilitation admission process and program requirements."
     }'
   ```

3. **Public Content Endpoints**:
   ```bash
   curl http://localhost:5000/api/v1/treatments
   curl http://localhost:5000/api/v1/skills
   curl http://localhost:5000/api/v1/business
   curl http://localhost:5000/api/v1/products
   curl http://localhost:5000/api/v1/stories
   curl http://localhost:5000/api/v1/content
   curl http://localhost:5000/api/v1/announcements
   ```

---

## 6. Accessing the Admin Management Portal
- Open [http://localhost:5173/admin/login](http://localhost:5173/admin/login) in your browser.
- Sign in with the credentials configured in `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` (after running `npm run db:seed`).
- Unauthorized requests to `/admin`, `/admin/inquiries`, and `/admin/content` are automatically redirected to the login screen.
- All management endpoints enforce JWT Bearer tokens server-side.

---

## 7. External Setup Still Required
- **Local / Hosted PostgreSQL Database**: Install PostgreSQL on the development machine (or use a cloud provider like Neon / Supabase) and update the `DATABASE_URL` in `backend/.env`.
- Once connected, run `npm run prisma:migrate` followed by `npm run db:seed` to complete database population.
