```markdown
# eClassroomPro

A **Role-based Assignment & Submission Management System** built with a modern full-stack architecture. eClassroomPro provides a complete classroom management experience for **Admins**, **Teachers**, and **Students** — covering course administration, assignment lifecycle, submission tracking, grading, announcements, and academic structure management.

---

## 🏗️ Tech Stack

| Layer       | Technology                                                        |
|-------------|-------------------------------------------------------------------|
| Frontend    | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zod |
| Backend     | ASP.NET Core (.NET 10), Clean Architecture                        |
| Database    | PostgreSQL 16, Entity Framework Core 10                           |
| Auth        | JWT Access Tokens + Rotating Refresh Tokens (PBKDF2 hashing)      |
| Container   | Docker, Docker Compose                                            |
| Testing     | xUnit, Moq, FluentAssertions, Testcontainers                      |
| Package Mgr | pnpm (frontend), NuGet (backend)                                  |

---

## ✨ Features

### 👨‍💼 Admin
- Dashboard with system-wide statistics (users, courses, assignments, submissions)
- Manage **Teachers** and **Students** (CRUD with role-specific detail forms)
- Manage **Courses** (assign teachers, enroll students, group/manual enrollment)
- Manage **Academics** (Programs, Departments, Semesters)
- View all **Assignments** grouped by Program → Department → Session → Course
- Review all **Submissions** with grading status, filtering, and detail views
- Configure **Application Settings** (General, Notifications, Grading, Security)

### 👩‍🏫 Teacher
- View assigned courses and classwork
- **Create / Edit / Delete / Publish** assignments (with topic, kind, deadline, max marks)
- Post and delete **Announcements** per course
- Review student **Submissions**, grade with marks & feedback
- View **Grades** grid per course
- Course **People** view (teachers + enrolled students)

### 🎓 Student
- View enrolled courses on the home page (draggable, hideable cards)
- Browse course **Stream** (announcements), **Classwork**, and **People**
- View assignment details, **submit work** (text answer, file/link attachments)
- Track submission status: Assigned → Submitted → Graded
- **To-do** list and **Calendar** views for upcoming deadlines
- Personal **Settings** (profile, security, notifications)

### 🔐 Authentication & Security
- JWT-based authentication with short-lived access tokens (15 min)
- Rotating refresh tokens with server-side revocation
- Role-based authorization (Admin, Teacher, Student) enforced at API and service layers
- Rate limiting on authentication endpoints
- PBKDF2 password hashing (100,000 iterations, SHA-256)
- Global exception middleware with safe error responses

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── API/                    # ASP.NET Core Web API (Controllers, Middleware, DI)
│   │   ├── Application/            # Services, DTOs, Interfaces, Exceptions
│   │   ├── Domain/                 # Entities, Enums, BaseEntity
│   │   └── Infrastructure/         # EF Core, Repositories, Auth, Migrations
│   ├── tests/
│   │   ├── eClassroomPro.Application.UnitTests/
│   │   └── eClassroomPro.Infrastructure.IntegrationTests/
│   ├── Dockerfile
│   └── eClassroomPro.slnx
├── frontend/
│   ├── app/                        # Next.js App Router pages
│   │   ├── (dashboard)/            # Authenticated layout (admin, class, calendar, etc.)
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── set-password/
│   ├── components/                 # UI components (admin, auth, class, layout, settings…)
│   ├── lib/                        # API clients, auth provider, schemas, mock data
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose
- *(Optional, for local development without Docker)*
  - [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
  - [Node.js ≥ 24](https://nodejs.org/) with [pnpm](https://pnpm.io/) (`npm i -g pnpm@11.21.0`)
  - [PostgreSQL 16](https://www.postgresql.org/)

---

### Run with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/<your-username>/eclassroompro.git
cd eclassroompro

# Start all services (PostgreSQL, API, Frontend)
docker compose up --build
```

| Service    | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:3000       |
| API        | http://localhost:5000       |
| Swagger UI | http://localhost:5000/swagger |
| PostgreSQL | localhost:5432              |

> The API automatically runs EF Core migrations and seeds demo data on startup.

---

### Run Locally (Without Docker)

#### 1. Database

```bash
# Create the database
createdb eClassroomPro
```

Or update the connection string in `backend/src/API/appsettings.json`.

#### 2. Backend

```bash
cd backend
dotnet restore src/API/eClassroomPro.API.csproj
dotnet run --project src/API
```

The API starts at **http://localhost:5138** (or **https://localhost:7149**).

#### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend starts at **http://localhost:3000**.

---

## 🔑 Default Credentials (Seeded)

| Role    | Email                      | Password      |
|---------|----------------------------|---------------|
| Admin   | admin@eclassroompro.com    | Admin@123     |
| Teacher | teacher@eclassroompro.com  | Teacher@123   |
| Student | student@eclassroompro.com  | Student@123   |

---

## ⚙️ Environment Variables

### Backend (`appsettings.json` / environment overrides)

| Variable                                    | Description                          | Default                                  |
|---------------------------------------------|--------------------------------------|------------------------------------------|
| `ConnectionStrings__DefaultConnection`      | PostgreSQL connection string         | `Host=localhost;Port=5432;...`           |
| `Jwt__Secret`                               | HMAC signing key (≥ 64 chars)        | *(dev-only value in appsettings.json)*   |
| `Jwt__Issuer`                               | Token issuer                         | `eClassroomPro.API`                      |
| `Jwt__Audience`                             | Token audience                       | `eClassroomPro.Client`                   |
| `Jwt__ExpiresMinutes`                       | Access token lifetime (minutes)      | `15`                                     |
| `Jwt__RefreshTokenExpirationDays`           | Refresh token lifetime (days)        | `7`                                      |

### Frontend (`.env.local`)

| Variable               | Description                              | Default                  |
|------------------------|------------------------------------------|--------------------------|
| `NEXT_PUBLIC_API_URL`  | API base URL (browser-side)              | `http://localhost:5000`  |

---

## 🧪 Testing

### Unit Tests (Application Layer)

```bash
cd backend
dotnet test tests/eClassroomPro.Application.UnitTests
```

Covers:
- `AuthServiceTests` — login, refresh-token rotation, revocation, disabled accounts
- `AssignmentServiceTests` — validation, authorization, draft creation
- `SubmissionServiceTests` — submission rules, grading validation
- `RoleAccessTests` — cross-role access denial

### Integration Tests (Infrastructure Layer)

```bash
cd backend
dotnet test tests/eClassroomPro.Infrastructure.IntegrationTests
```

Uses **Testcontainers** to spin up a real PostgreSQL instance for repository tests.

---

## 📡 API Endpoints Overview

| Method | Endpoint                                  | Auth        | Description                        |
|--------|-------------------------------------------|-------------|------------------------------------|
| POST   | `/api/auth/login`                         | Public      | Authenticate & receive tokens      |
| POST   | `/api/auth/refresh`                       | Public      | Rotate refresh token               |
| POST   | `/api/auth/logout`                        | Authenticated | Revoke all refresh tokens        |
| GET    | `/api/auth/me`                            | Authenticated | Current user profile             |
| GET    | `/api/users`                              | Admin       | List all users                     |
| POST   | `/api/users`                              | Admin       | Create user                        |
| PUT    | `/api/users/{id}`                         | Admin       | Update user                        |
| DELETE | `/api/users/{id}`                         | Admin       | Delete user                        |
| GET    | `/api/courses`                            | Authenticated | List all courses                 |
| GET    | `/api/courses/my`                         | Authenticated | Courses for current user         |
| GET    | `/api/courses/{id}`                       | Authenticated | Course details                   |
| GET    | `/api/courses/{id}/people`                | Authenticated | Teachers & students in course    |
| POST   | `/api/courses`                            | Admin       | Create course                      |
| PUT    | `/api/courses/{id}`                       | Admin       | Update course                      |
| DELETE | `/api/courses/{id}`                       | Admin       | Delete course                      |
| GET    | `/api/assignments`                        | Authenticated | Assignments for current user     |
| GET    | `/api/courses/{id}/assignments`           | Authenticated | Classwork for a course           |
| GET    | `/api/assignments/{id}`                   | Authenticated | Assignment details               |
| POST   | `/api/assignments`                        | Teacher/Admin | Create assignment                |
| PUT    | `/api/assignments/{id}`                   | Teacher/Admin | Update assignment                |
| DELETE | `/api/assignments/{id}`                   | Teacher/Admin | Delete assignment                |
| POST   | `/api/assignments/{id}/publish`           | Teacher/Admin | Publish draft assignment           |
| POST   | `/api/submissions`                        | Student     | Submit assignment                  |
| GET    | `/api/submissions/my`                     | Student     | My submissions                     |
| GET    | `/api/submissions`                        | Teacher/Admin | All submissions (incl. pending)  |
| GET    | `/api/submissions/{id}`                   | Teacher/Admin | Submission detail                |
| GET    | `/api/assignments/{id}/submissions`       | Teacher/Admin | Submissions for an assignment    |
| POST   | `/api/submissions/{id}/grade`             | Teacher/Admin | Grade a submission               |
| POST   | `/api/submissions/{id}/status`            | Teacher/Admin | Change submission status         |
| GET    | `/api/courses/{id}/announcements`         | Authenticated | Announcements for a course       |
| POST   | `/api/courses/{id}/announcements`         | Teacher/Admin | Post announcement                |
| DELETE | `/api/announcements/{id}`                 | Teacher/Admin | Delete announcement              |
| GET    | `/api/academics/programs`                 | Admin       | List programs                      |
| POST   | `/api/academics/programs`                 | Admin       | Create program                     |
| PUT    | `/api/academics/programs/{id}`            | Admin       | Update program                     |
| DELETE | `/api/academics/programs/{id}`            | Admin       | Delete program                     |
| GET    | `/api/academics/departments`              | Admin       | List departments                   |
| POST   | `/api/academics/departments`              | Admin       | Create department                  |
| PUT    | `/api/academics/departments/{id}`         | Admin       | Update department                  |
| DELETE | `/api/academics/departments/{id}`         | Admin       | Delete department                  |
| GET    | `/api/academics/semesters`                | Admin       | List semesters                     |
| POST   | `/api/academics/semesters`                | Admin       | Create semester                    |
| PUT    | `/api/academics/semesters/{id}`           | Admin       | Update semester                    |
| DELETE | `/api/academics/semesters/{id}`           | Admin       | Delete semester                    |
| GET    | `/api/app-settings`                       | Admin       | Get all settings                   |
| PUT    | `/api/app-settings`                       | Admin       | Upsert a setting                   |
| GET    | `/api/dashboard/stats`                    | Admin       | Dashboard statistics               |
| GET    | `/health`                                 | Public      | Liveness check                     |
| GET    | `/health/ready`                           | Public      | Database readiness check           |

---

## 🏛️ Architecture

The backend follows **Clean Architecture** with strict dependency direction:

```
API  →  Application  →  Domain
 ↓          ↓
Infrastructure
```

- **Domain** — Entities, Enums, no external dependencies
- **Application** — Business logic (Services), DTOs, Interfaces, Exceptions
- **Infrastructure** — EF Core DbContext, Repositories, JWT, Password Hashing, Migrations
- **API** — Controllers, Middleware, DI composition root, Health checks

The frontend uses **Next.js App Router** with:
- Route groups `(dashboard)` and `(admin)` for layout separation
- `AuthProvider` context with JWT session management and automatic token refresh
- Typed API client (`lib/api/client.ts`) with 401 → refresh → retry logic
- Zod schemas for shared data validation

---

## 🐳 Docker Services

```yaml
db:        PostgreSQL 16 (health-checked)
api:       .NET 10 API (auto-migrates & seeds on startup)
frontend:  Next.js dev server with hot reload (bind-mounted source)
```

Volumes: `pgdata` (database), `frontend_node_modules`, `frontend_next` (build cache).

---

## 📜 License

This project is licensed under the terms found in the [LICENSE](./LICENSE) file.