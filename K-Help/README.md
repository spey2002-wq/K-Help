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

## Deployment (free cloud, Render only)

Everything runs on **Render**'s free plan: PostgreSQL, Redis, the Spring Boot API and the
Next.js website, all defined in `render.yaml` at the repository root.

1. Sign in at render.com with GitHub, then choose **New + > Blueprint** and pick this repository.
2. Render lists `khelp-db`, `khelp-redis`, `khelp-backend` and `khelp-frontend`. When asked for
   `AI_API_KEY`, paste your OpenRouter key, then click **Apply**.
3. Wait for both web services to show **Live** (the first build takes about 10 minutes).
4. Open `https://khelp-backend.onrender.com/actuator/health` (it should say `UP`), then open
   `https://khelp-frontend.onrender.com` for the website.

**If your URLs differ.** The blueprint assumes the services get the URLs above. If Render adds a
random suffix because a name was taken, change these values and redeploy:
`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` on `khelp-frontend` (they are baked in at build
time, so use *Manual Deploy > Clear build cache & deploy*), and `APP_CORS_ALLOWED_ORIGINS` on
`khelp-backend` (set it to the frontend URL).

Notes: free Render services sleep after about 15 minutes of inactivity (the first request takes
30-60 seconds), and the free database expires after 30 days. Database changes ship as Flyway
migrations in `backend/src/main/resources/db/migration` and run automatically on start. Change
the demo account passwords after the first deploy, and never commit `.env` files or API keys.
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

These passwords are for local development only. On a public deployment set
`APP_ADMIN_PASSWORD` (and optionally `APP_ADMIN_USERNAME`) so the administrator
account gets a private password at startup.

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
