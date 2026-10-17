# System Architecture

## Khyber Rehabilitation Center, Peshawar

### 1. High-Level Overview
The system follows a decoupled, three-tier full-stack architecture designed for high scalability, separation of concerns, and future administrative content management:

```
+-------------------------------------------------------------+
|                     Client Tier (frontend/)                 |
|  - React.js (Vite) Single Page Application                  |
|  - Vanilla CSS Reusable Design System (#019CDC Brand)       |
|  - Public Portal & Admin Management Dashboard Layouts       |
+-------------------------------------------------------------+
                              |
                              | HTTP / REST API (JSON)
                              v
+-------------------------------------------------------------+
|                     Server Tier (backend/)                  |
|  - Node.js & Express.js REST API Architecture               |
|  - Modular Controllers, Services, Middleware, Validators    |
|  - Centralized Error Handling & Security Headers            |
+-------------------------------------------------------------+
                              |
                              | Prisma ORM (Type-Safe Querying)
                              v
+-------------------------------------------------------------+
|                    Database Tier (database/)                |
|  - PostgreSQL Relational Database                           |
|  - Prisma Data Models & Migration Engine                    |
|  - Database Seeders for Initial Datasets                    |
+-------------------------------------------------------------+
```

---

### 2. Layer Responsibilities

#### Frontend (`frontend/`)
- **Presentation & Routing**: Uses React Router to cleanly segment Public Portal views (Home, About, Treatment, Skills, Business, Products, Success Stories, Contact) and future Admin views.
- **Design System (`src/styles/`)**: Centralized CSS tokens defining primary brand `#019CDC`, neutral white `#FFFFFF`, typography, responsive breakpoints, and reusable component classes.
- **State & Service Layer**: Modular API services (`src/services/`) decouple UI components from network transport logic. Global authentication and session state live in `src/context/`.

#### Backend (`backend/`)
- **Routing Layer (`src/routes/`)**: Maps endpoints to controller actions under versioned routes (`/api/v1/`).
- **Controller Layer (`src/controllers/`)**: Handles HTTP requests, extracts parameters, coordinates services, and responds with standardized JSON envelopes.
- **Service Layer (`src/services/`)**: Encapsulates core business rules and database queries.
- **Middleware Layer (`src/middleware/`)**: Provides request security, CORS handling, structured logging, validation checkpoints, and centralized error catching.

#### Database (`database/`)
- **Schema Definition (`prisma/schema.prisma`)**: Defines domain entities (`AdminUser`, `TreatmentService`, `SkillProgram`, `BusinessUnit`, `Product`, `SuccessStory`, `ContactInquiry`, `SiteSetting`).
- **Migrations (`prisma/migrations/`)**: Manages incremental, version-controlled database schema evolutions.
- **Seed Scripts (`seed/`)**: Supplies baseline administrator accounts and starter catalog data during environment bootstrapping.

---

### 3. Scalability & Extensibility Roadmap
- **CMS Ready**: Database models and API services are structured to allow administrators to edit treatment descriptions, success stories, and products dynamically from the admin panel without code updates.
- **Stateless Authentication**: Prepared for future JWT token-based auth with HTTP-only cookies or Bearer headers.
- **Asset Storage Ready**: Configured for local static hosting or seamless transition to cloud object storage (S3 / Cloudinary) for patient gallery and rehabilitation product images.
