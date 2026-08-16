# eClassroomPro

A **Role-based Assignment & Submission Management System** built with .NET 10 and Next.js 16. It provides a complete classroom management platform for admins, teachers, and students — covering course management, assignment creation, submission tracking, grading, and academic administration.

---

## 🏗️ Architecture

The project follows **Clean Architecture** with clear separation of concerns:

```
├── backend/
│   ├── src/
│   │   ├── API/              # ASP.NET Core Web API (Controllers, Middleware, Program.cs)
│   │   ├── Application/      # Business Logic (Services, DTOs, Interfaces, Exceptions)
│   │   ├── Domain/           # Entities, Enums (no dependencies)
│   │   └── Infrastructure/   # EF Core, Repositories, Auth (JWT, Password Hashing)
│   └── tests/
│       ├── eClassroomPro.Application.UnitTests/
│       └── eClassroomPro.Infrastructure.IntegrationTests/
├── frontend/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # Reusable React components
│   ├── lib/                  # API clients, auth, utilities, schemas
│   └── public/               # Static assets
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| .NET 10 / ASP.NET Core | Web API framework |
| Entity Framework Core 10 | ORM & data access |
| PostgreSQL (Npgsql) | Relational database |
| JWT Bearer Authentication | Secure API authentication |
| Refresh Token Rotation | Session management |
| Swashbuckle (Swagger) | API documentation |
| Rate Limiting | Brute-force protection |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Zod | Runtime schema validation |
| Lucide React | Icons |
| pnpm | Package manager |

### Testing
| Technology | Purpose |
|---|---|
| xUnit | Test framework |
| Moq | Mocking |
| FluentAssertions | Assertion library |
| Testcontainers | Integration testing with real PostgreSQL |

### DevOps
| Technology | Purpose |
|---|---|
| Docker & docker-compose | Containerization & orchestration |
| GitHub Actions | CI/CD (workflows directory) |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT access tokens (15-minute expiry) with refresh token rotation
- Role-based access control: **Admin**, **Teacher**, **Student**
- Rate limiting on authentication endpoints
- Password hashing with PBKDF2 (100k iterations, SHA-256)

### 👨‍💼 Admin
- Dashboard with statistics (users, courses, assignments, submissions)
- Manage Teachers & Students (full CRUD with academic details)
- Manage Courses (assign teachers, enroll students)
- Manage Academics (Programs, Departments, Semesters)
- View all Assignments & Submissions across the system
- Application Settings management

### 👩‍🏫 Teacher
- View assigned courses
- Create, edit, publish, and delete assignments
- View and grade student submissions
- Post announcements to courses
- View course people (teachers & students)

### 👨‍🎓 Student
- View enrolled courses
- Browse classwork (published assignments)
- Submit assignments with text answers
- View submission status and grades
- View announcements
- Calendar & To-do views

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started) & Docker Compose
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) (for local development)
- [Node.js 24+](https://nodejs.org/) & [pnpm](https://pnpm.io/) (for local frontend development)
- [PostgreSQL 16](https://www.postgresql.org/) (or use Docker)

### Option 1: Run with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd eclassroompro

# Start all services (database, API, frontend)
docker-compose up --build
```

Services will be available at:
| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| API (.NET) | http://localhost:5000 |
| Swagger UI | http://localhost:5000/swagger |
| PostgreSQL | localhost:5432 |

### Option 2: Run Locally

**1. Database:**
```bash
# Start PostgreSQL (or use Docker for just the DB)
docker-compose up db
```

**2. Backend:**
```bash
cd backend/src/API
dotnet run
```
The API will start at `http://localhost:5138`.

**3. Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```
The frontend will start at `http://localhost:3000`.

---

## 🔑 Default Credentials

The database is auto-seeded on first startup:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@eclassroompro.com` | `Admin@123` |
| Teacher | `teacher@eclassroompro.com` | `Teacher@123` |
| Student | `student@eclassroompro.com` | `Student@123` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login (rate-limited) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Revoke all refresh tokens |
| GET | `/api/auth/me` | Get current user info |

### Users (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/my` | Get courses for current user |
| GET | `/api/courses/{id}` | Get course details |
| GET | `/api/courses/{id}/people` | Get course teachers & students |
| POST | `/api/courses` | Create course (Admin) |
| PUT | `/api/courses/{id}` | Update course (Admin) |
| DELETE | `/api/courses/{id}` | Delete course (Admin) |

### Assignments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/assignments` | List assignments (role-aware) |
| GET | `/api/courses/{courseId}/assignments` | Get assignments for a course |
| GET | `/api/assignments/{id}` | Get assignment by ID |
| POST | `/api/assignments` | Create assignment (Teacher/Admin) |
| PUT | `/api/assignments/{id}` | Update assignment (Teacher/Admin) |
| DELETE | `/api/assignments/{id}` | Delete assignment (Teacher/Admin) |
| POST | `/api/assignments/{id}/publish` | Publish draft assignment |

### Submissions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/submissions` | Submit assignment (Student) |
| GET | `/api/submissions/my` | Get my submissions (Student) |
| GET | `/api/submissions` | List all submissions (Teacher/Admin) |
| GET | `/api/submissions/{id}` | Get submission detail |
| GET | `/api/assignments/{id}/submissions` | Get submissions for assignment |
| POST | `/api/submissions/{id}/grade` | Grade submission (Teacher/Admin) |
| POST | `/api/submissions/{id}/status` | Change status (Teacher/Admin) |

### Academics (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/academics/programs` | List/Create programs |
| PUT/DELETE | `/api/academics/programs/{id}` | Update/Delete program |
| GET/POST | `/api/academics/departments` | List/Create departments |
| PUT/DELETE | `/api/academics/departments/{id}` | Update/Delete department |
| GET/POST | `/api/academics/semesters` | List/Create semesters |
| PUT/DELETE | `/api/academics/semesters/{id}` | Update/Delete semester |

### Announcements
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses/{courseId}/announcements` | Get course announcements |
| POST | `/api/courses/{courseId}/announcements` | Post announcement (Teacher/Admin) |
| DELETE | `/api/announcements/{id}` | Delete announcement |

### Dashboard & Settings (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| GET | `/api/app-settings` | Get all app settings |
| PUT | `/api/app-settings` | Upsert app setting |

### Health Checks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/health/ready` | Readiness check (database) |

---

## 🧪 Running Tests

```bash
cd backend

# Run all tests
dotnet test

# Run unit tests only
dotnet test tests/eClassroomPro.Application.UnitTests

# Run integration tests (requires Docker for Testcontainers)
dotnet test tests/eClassroomPro.Infrastructure.IntegrationTests
```

---

## 📁 Environment Configuration

### Backend (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=eClassroomPro;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Secret": "<min-64-character-secret>",
    "Issuer": "eClassroomPro.API",
    "Audience": "eClassroomPro.Client",
    "ExpiresMinutes": 15,
    "RefreshTokenExpirationDays": 7
  }
}
```

### Frontend
Set the API URL via environment variable:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Docker Compose Environment Variables
| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | Development secret | JWT signing key (min 64 chars) |
| `JWT_ISSUER` | `eClassroomPro.API` | Token issuer |
| `JWT_AUDIENCE` | `eClassroomPro.Client` | Token audience |
| `JWT_EXPIRES_MINUTES` | `15` | Access token lifetime |
| `JWT_REFRESH_DAYS` | `7` | Refresh token lifetime |

---

## 🗄️ Database

- **Engine**: PostgreSQL 16
- **ORM**: Entity Framework Core with Code-First Migrations
- **Auto-migration**: The API runs `MigrateAsync()` and seeds data on startup
- **Seed Data**: Includes demo users, academic programs, departments, semesters, a sample course, assignment, and submission

---

## 📄 License

This project is licensed under the [LICENSE](./LICENSE) file included in the repository.