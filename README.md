# Task Manager — Fullstack

A production-style fullstack task management application built for learning modern web development practices.

**Live demo:** [task-manager-virid-eight.vercel.app](https://task-manager-virid-eight.vercel.app)

---

## Tech Stack

**Backend**
- [NestJS](https://nestjs.com/) — Node.js framework
- [Prisma](https://www.prisma.io/) — ORM
- [PostgreSQL](https://www.postgresql.org/) — Database
- [Passport.js](https://www.passportjs.org/) — Authentication (JWT, Google OAuth, GitHub OAuth)
- [Swagger](https://swagger.io/) — API documentation
- [Docker](https://www.docker.com/) — Containerization

**Frontend**
- [Next.js 15](https://nextjs.org/) — React framework
- [TanStack Query](https://tanstack.com/query) — Server state management
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — Form validation
- [Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) — UI components

---

## Project Structure

```
task-manager/
├── backend/          # NestJS REST API
├── frontend/         # Next.js application
├── docker-compose.yml          # Development environment
├── docker-compose.prod.yml     # Production environment
└── Makefile                    # Convenience commands
```

---

## Features

- JWT authentication with access + refresh tokens (httpOnly cookies)
- Google OAuth 2.0 login / register
- GitHub OAuth login / register
- Task management — create, edit, delete, view
- Filter tasks by status (TODO / IN_PROGRESS / DONE)
- Assign tasks to users
- Pagination
- Swagger API docs at `/api/docs`

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) + Docker Compose
- [Node.js LTS](https://nodejs.org/)
- [pnpm](https://pnpm.io/) — `npm i -g pnpm`

### Environment Setup

Copy the example env file and fill in the values:

```bash
cp backend/.env.docker.example backend/.env.docker
```

Required variables:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_PORT=5432
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres"
PORT=3000
JWT_SECRET=your_secret
JWT_EXPIRES=1d
FRONTEND_URL=http://localhost:3001
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
```

### Run with Docker (recommended)

```bash
# Development
make dev-build     # first run
make dev           # subsequent runs

# Production
make prod-build    # first run
make prod          # subsequent runs

# Stop
make down
```

### Database

```bash
make db-push       # push schema changes (dev)
make migrate       # create a new migration
make studio        # open Prisma Studio
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

---

## OAuth Setup

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/auth/google/callback` as an authorized redirect URI
6. Copy `Client ID` and `Client Secret` to `.env.docker`

### GitHub

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set callback URL to `http://localhost:3000/auth/github/callback`
4. Copy `Client ID` and `Client Secret` to `.env.docker`

---

## Deployment

**Frontend** is deployed on [Vercel](https://vercel.com/).

**Backend** is designed to run on AWS EC2 via Docker Compose.

```bash
# On the server
git clone <repo>
cp backend/.env.docker.example backend/.env.prod.docker
# fill in production values
docker compose -f docker-compose.prod.yml up --build -d
```

---

## Current Status

- [x] NestJS backend bootstrap
- [x] PostgreSQL + Prisma ORM
- [x] JWT authentication (register / login / refresh / logout)
- [x] Google OAuth
- [x] GitHub OAuth
- [x] Tasks CRUD API
- [x] Users API
- [x] Swagger documentation
- [x] Docker dev + prod configuration
- [x] Next.js frontend
- [x] Tasks table with pagination and filters
- [x] Create / edit / view task drawers
- [x] Vercel deployment
- [ ] AWS EC2 deployment
- [ ] GitHub Actions CI/CD
- [ ] WebSockets (real-time updates)
- [ ] Redis
