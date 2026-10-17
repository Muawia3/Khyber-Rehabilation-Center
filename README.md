# Khyber Rehabilitation Center, Peshawar

> **"Restoring Health, Rebuilding Lives"**  
> Professional full-stack web portal and content management system for Khyber Rehabilitation Center, Peshawar.

---

## 🏥 About The Project
Khyber Rehabilitation Center provides dedicated rehabilitation, medical care, skill training, and social reintegration services. This repository contains the scalable full-stack web architecture supporting:
- Public awareness and service exploration (Treatments, Skills Development, Business Units, Products, Success Stories, and Contact).
- Reusable UI component system built with React, Vite, and centralized CSS design tokens (`#019CDC` primary brand color).
- Express.js REST API backend with modular controllers, services, validation, rate limiting, and error handling.
- PostgreSQL database integration managed via Prisma ORM.
- Admin portal architecture for secure content updates and admission inquiry management.

---

## 🛠️ Technology Stack
- **Frontend**: React 18+ (Vite), React Router DOM, Pure CSS Design System
- **Backend**: Node.js, Express.js (v4), Helmet, CORS, Express-Rate-Limit, Bcryptjs
- **Database**: PostgreSQL with Prisma ORM
- **Language**: JavaScript (ES6+ Modules)
- **Brand Palette**:
  - Primary Brand Cyan/Blue: `#019CDC`
  - Secondary Accent Dark: `#017db1`
  - Primary Light: `#e6f6fc`
  - Neutral Base: `#FFFFFF`
  - Dark Charcoal: `#1f2937`

---

## 📁 Repository Structure Overview
```
├── backend/            # Express.js REST API server
│   ├── src/
│   │   ├── config/     # Environment validation, database pool
│   │   ├── controllers/# Route request handlers (health, inquiries, content)
│   │   ├── middleware/ # CORS, Helmet, rate-limiter, validator, error handler
│   │   ├── routes/     # Express route definitions under /api/v1/
│   │   ├── services/   # Prisma query logic & business rules
│   │   ├── utils/      # Response envelope formatters, logger
│   │   ├── validators/ # Request schema validators (XSS sanitization)
│   │   ├── app.js      # Express application setup
│   │   └── server.js   # Server entry point
├── database/           # Database schema & migrations
│   ├── prisma/         # schema.prisma & migrations/
│   └── seed/           # Secure admin seed script (env-based)
├── docs/               # System documentation
│   ├── ARCHITECTURE.md # Architectural design overview
│   ├── API_OVERVIEW.md # Implemented REST endpoints and contracts
│   └── SETUP_GUIDE.md  # Detailed local setup instructions
├── frontend/           # Vite + React single-page app
│   ├── public/         # Static assets
│   └── src/
│       ├── admin/      # Admin dashboard pages and components
│       ├── assets/     # Images, logos, and icons
│       ├── components/ # Reusable UI components
│       ├── context/    # Global context providers
│       ├── hooks/      # Custom reusable React hooks
│       ├── layouts/    # Public and admin layout wrappers
│       ├── pages/      # Public portal views (integrated with API)
│       ├── routes/     # App routing definitions
│       ├── services/   # Frontend API client (apiClient, inquiryService, etc.)
│       ├── styles/     # Global CSS variables & responsive rules
│       ├── utils/      # Helpers and constants
│       ├── App.jsx     # App entry component
│       └── main.jsx    # Vite mount point
├── .env.example        # Environment variable blueprint
├── .gitignore          # Git exclusion rules
├── package.json        # Workspace orchestration scripts
└── README.md           # Project documentation
```

---

## 🚀 Getting Started
Check [docs/SETUP_GUIDE.md](file:///e:/Muawia/Khyber%20Rehabilation%20Center/docs/SETUP_GUIDE.md) for step-by-step setup instructions.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Generate Prisma client & apply migrations (when PostgreSQL is running)
npm run prisma:generate
npm run prisma:migrate

# 4. Start development servers
npm run dev
```

---

## 📋 Project Status
- [x] **Phase 1: Project Architecture & Scaffolding** (Completed)
- [x] **Phase 2: Frontend UI & Layout Design** (Completed)
- [x] **Phase 3: Backend & Database Integration** (Completed)
  - Express.js backend with structured logging, CORS, Helmet & rate-limiting.
  - PostgreSQL schema with 9 Prisma models, migrations, and seed logic.
  - 9 REST API endpoint modules under `/api/v1/`.
  - Frontend services connected with loading, error, empty, and success states.
  - Verification & testing complete.
- [x] **Phase 4: Admin Dashboard & Content Management System** (Completed)
  - Secure Admin authentication (Bcryptjs, JWT tokens, session lifecycle, protected routes).
  - Live Admin Dashboard with real PostgreSQL metrics & recent inquiries feed.
  - Comprehensive Content Management (CMS) for treatments, skills, business initiatives, products, success stories, announcements, and site content.
  - Searchable, filterable patient intake inquiry management with internal clinical notes.
  - Public registration disabled; strict role and token validation enforced server-side.
- [x] **Phase 5: Final Testing, Security & Deployment Readiness** (Completed)
  - End-to-end integration and security audit passed.
  - Dynamic page titles and accessible metadata configured.
  - Production build verified with zero errors or bundle warnings.
  - Complete deployment blueprint and hosting recommendations in [docs/DEPLOYMENT_GUIDE.md](file:///e:/Muawia/Khyber%20Rehabilation%20Center/docs/DEPLOYMENT_GUIDE.md).
