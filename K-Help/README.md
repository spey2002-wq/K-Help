# K-Help — Korea Life Platform for Foreign Residents

All-in-one platform for international students, foreign workers, and long-term foreign
residents in South Korea: community, living guides, jobs, housing, real-time chat, and
AI-assisted translation.

**Team:** NP Coders · **Phase:** V1 — Project Foundation

## Tech Stack

| Layer     | Technology                                                        |
| --------- | ----------------------------------------------------------------- |
| Frontend  | Next.js (App Router), TypeScript, React, Tailwind CSS             |
| Backend   | Java 21, Spring Boot 3, Spring Security, JWT, WebSockets, JPA     |
| Database  | PostgreSQL 16 (Spring Data JPA + Flyway migrations)               |
| Cache     | Redis 7                                                           |
| Infra     | Docker, Docker Compose, AWS                                          |

## Repository Layout

```
K-Help/
├── frontend/             # Next.js, React, TypeScript, Tailwind CSS
├── backend/              # Spring Boot 3, Java 21, Spring Security, JWT, WebSockets
├── database/             # schema.sql + data.sql (standalone, reviewable DDL & seeds)
├── docs/                 # Architecture, API, and DB documentation
├── docker-compose.yml    # Container orchestration for local dev
└── README.md
```

## Quick Start (Docker)

```bash
docker compose up --build
```

| Service  | URL                            |
| -------- | ------------------------------ |
| Frontend | http://localhost:3000          |
| Backend  | http://localhost:8080          |
| Swagger  | http://localhost:8080/swagger-ui.html |
| Postgres | localhost:5432 (`khelp`/`khelp`) |
| Redis    | localhost:6379                 |

## Local Development

### Backend

```bash
cd backend
./mvnw spring-boot:run          # Windows: .\mvnw.cmd spring-boot:run
```

Requires Java 21. PostgreSQL and Redis can be started alone with:

```bash
docker compose up -d postgres redis
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

## Deployment (free cloud)

The backend, PostgreSQL and Redis run on **Render**; the frontend runs on **Vercel**.

1. **Backend + database + Redis (Render).** In Render choose *New + > Blueprint*, pick this
   GitHub repository and apply `render.yaml` (it sits at the repository root). When asked,
   set `AI_API_KEY` (your OpenRouter key) and `APP_CORS_ALLOWED_ORIGINS` (use `*.vercel.app`
   for now, then your real Vercel URL). Wait for the service to show *Live*, then open
   `https://<your-service>.onrender.com/actuator/health`; it should say `UP`.
2. **Frontend (Vercel).** Import the same repository, set **Root Directory** to
   `K-Help/frontend`, and add two environment variables **before the first build**:
   - `NEXT_PUBLIC_API_URL` = `https://<your-service>.onrender.com`
   - `NEXT_PUBLIC_WS_URL` = `wss://<your-service>.onrender.com/ws`
3. **Connect them.** Copy the Vercel URL into `APP_CORS_ALLOWED_ORIGINS` on Render and let it
   redeploy.

Notes: `NEXT_PUBLIC_*` values are baked in at build time, so redeploy Vercel after changing
them. Free Render services sleep after about 15 minutes of inactivity (the first request is
slow), and the free database expires after 30 days. Database changes ship as Flyway
migrations in `backend/src/main/resources/db/migration` and run automatically on start.
Never commit `.env` files or API keys.

## Baseline API Surface

| Module    | Base Path        | Highlights                                        |
| --------- | ---------------- | ------------------------------------------------- |
| auth      | `/api/auth`      | register, login, refresh, current profile         |
| community | `/api/posts`     | post CRUD, comments, likes                        |
| info      | `/api/guides`    | Korea living guides, category + keyword search    |
| job       | `/api/jobs`      | job listings, filters, applications               |
| housing   | `/api/housing`   | property listings, price/deposit/location filters |
| chat      | `/api/chat`, `/ws` | conversations, history, STOMP WebSocket         |
| ai        | `/api/ai`        | translate, summarize, polite message generation   |
| admin     | `/api/admin`     | user moderation, listing approval, reports        |

## Seed Accounts

| Username | Password    | Role  |
| -------- | ----------- | ----- |
| admin    | `Admin@123` | ADMIN |
| ashish   | `User@123`  | USER  |
| divya    | `User@123`  | USER  |

## Team Ownership

| Member                    | Area                             |
| ------------------------- | -------------------------------- |
| Pokhrel Ashish            | Architecture, Spring Security + JWT |
| Rai Spandan               | Next.js UI & components          |
| Rai Divya                 | PostgreSQL schema & seeds        |
| Darlami Magar Risipna     | Community & real-time chat       |
| Adhikari Pratigya         | Jobs & housing                   |
| Subedi Anup               | AI services middleware           |
| Kuwar Bibek               | DevOps, Admin portal, QA         |
