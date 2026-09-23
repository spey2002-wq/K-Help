# K-Help Architecture

**Project:** K-Help — Korea Life Platform for Foreign Residents
**Team:** NP Coders · **Phase:** V1 — Project Foundation

## 1. System Overview

K-Help is a containerized, three-tier web application. The Next.js frontend talks to a
Spring Boot REST API for request/response work and to a STOMP WebSocket endpoint for
real-time chat. PostgreSQL is the system of record; Redis provides caching and would
back a distributed rate limiter in production.

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser (Next.js)                        │
│   App Router pages · Tailwind UI · AuthContext · STOMP client    │
└───────────────┬──────────────────────────┬───────────────────────┘
                │ REST + JWT               │ STOMP over WebSocket
                ▼                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Spring Boot 3 (Java 21)                       │
│                                                                  │
│  SecurityConfig → JwtAuthenticationFilter → JwtProvider          │
│                                                                  │
│  auth · community · info · job · housing · chat · ai · admin      │
│                                                                  │
│  GlobalExceptionHandler → ApiResponse<T> envelope                │
└────────┬─────────────────┬──────────────────┬────────────────────┘
         │ JPA             │ Cache            │ HTTPS proxy
         ▼                 ▼                  ▼
   ┌───────────┐    ┌───────────┐     ┌─────────────────┐
   │PostgreSQL │    │   Redis   │     │  External LLM   │
   │  (Flyway) │    │  (cache)  │     │      API        │
   └───────────┘    └───────────┘     └─────────────────┘
```

## 2. Layer Responsibilities

| Layer          | Package                          | Responsibility                                        |
| -------------- | -------------------------------- | ----------------------------------------------------- |
| Controller     | `com.khelp.<module>.controller`   | HTTP mapping, validation, status codes                |
| Service        | `com.khelp.<module>.service`      | Business rules, transactions, ownership checks        |
| Repository     | `com.khelp.<module>.repository`   | Spring Data JPA queries                               |
| Entity         | `com.khelp.<module>.entity`       | JPA mappings extending `BaseEntity`                   |
| DTO            | `com.khelp.<module>.dto`          | Request/response records; entities never leave the app |
| Security       | `com.khelp.security`              | JWT issuing, validation, filter chain, CORS           |
| Cross-cutting  | `com.khelp.common`                | `ApiResponse`, `PageResponse`, exceptions             |

## 3. Module Map

| Module    | Base path      | Key classes                                            |
| --------- | -------------- | ------------------------------------------------------ |
| auth      | `/api/auth`    | `AuthController`, `AuthService`, `User`, `JwtProvider`  |
| community | `/api/posts`   | `CommunityController`, `Post`, `Comment`, `Report`      |
| info      | `/api/guides`  | `InfoController`, `GuideService`, `Guide`               |
| job       | `/api/jobs`    | `JobController`, `JobListing`, `JobApplication`         |
| housing   | `/api/housing` | `HousingController`, `HousingListing`, `HousingInquiry` |
| chat      | `/api/chat`    | `ChatController`, `MessageController`, `WebSocketConfig`|
| ai        | `/api/ai`      | `AiController`, `AiService`, `LlmClient`                |
| admin     | `/api/admin`   | `AdminController`, `AdminService`                       |

## 4. Security Model

### Token flow

1. `POST /api/auth/login` verifies credentials through `AuthenticationManager` and
   `CustomUserDetailsService` (BCrypt).
2. `JwtProvider` issues an access token (15 min) and a refresh token (7 days), both
   HS256-signed with `app.jwt.secret`.
3. The frontend stores tokens and sends `Authorization: Bearer <token>`.
4. `JwtAuthenticationFilter` validates the signature, expiry and token type, then
   populates the `SecurityContext` with `ROLE_<role>` authorities.
5. On a 401 the frontend calls `POST /api/auth/refresh` once and replays the request.

### Authorization rules

| Rule                            | Enforcement                                      |
| ------------------------------- | ------------------------------------------------ |
| Public reads                    | `permitAll` on guides, jobs, housing, posts      |
| Authenticated writes            | `anyRequest().authenticated()`                   |
| `/api/admin/**`                  | `hasRole("ADMIN")` in the filter chain           |
| Guide authoring                 | `@PreAuthorize("hasRole('ADMIN')")`              |
| Owner-only edits                | Service-level `assertOwnerOrAdmin` checks        |

### WebSocket authentication

`WebSocketAuthInterceptor` inspects the STOMP `CONNECT` frame, validates the same JWT
from the `Authorization` native header, and binds the principal to the session. Anonymous
CONNECT frames are still allowed so public pages can open a socket, but
`MessageController` rejects message sends when `Principal` is null.

## 5. Data Model

```
users ─┬─< posts ─┬─< comments ──< comments (parent_id)
       │          └─< post_likes
       ├─< guides
       ├─< job_listings ──< job_applications
       ├─< housing_listings ──< housing_inquiries
       ├─< conversations ──< chat_messages
       └─< reports
```

Design notes:

- **Soft deletes.** Posts and comments use a `deleted` flag so moderation history and
  reply threads survive.
- **Moderation gates.** New job and housing listings enter as `PENDING` and only become
  public after admin approval. Admins bypass the gate.
- **Denormalized counters.** `like_count`, `comment_count` and the per-participant
  unread counters on `conversations` keep list views to a single query.
- **Korean rental model.** `deposit_amount` and `monthly_rent` are separate columns so
  jeonse and wolse listings share one table.

### Flyway migrations

| Version | Purpose |
| ------- | ------- |
| V1 | Full baseline schema: tables, indexes, unique constraints |
| V2 | Demo users, seven Korea guides, sample posts, jobs, housing |
| V3 | `roles` lookup table (+ FK from `users.role`) and CHECK constraints pinning every enum column to its Java enum |
| V4 | Extended demo seed: transport and education guides, two more jobs, one more housing listing |

Flyway owns the schema and applies migrations on backend startup. A standalone,
idempotent copy of the same schema and seed data lives in `database/` for DBAs who
prefer to review DDL outside the Java project:

```
database/
├── schema.sql   # equivalent of V1 + V3 (re-runnable)
├── data.sql     # equivalent of V2 + V4 (re-runnable)
└── README.md
```

Hibernate runs with `ddl-auto: validate`, so any entity/schema drift fails fast at
startup rather than silently altering tables.

## 6. Real-time Chat

```
Client A                    Spring Boot                     Client B
   │                            │                              │
   │ CONNECT /ws (JWT)          │                              │
   ├───────────────────────────>│  WebSocketAuthInterceptor    │
   │                            │  binds Principal             │
   │                            │                              │
   │ SUBSCRIBE                  │                              │
   │ /topic/conversations/1     │                              │
   ├───────────────────────────>│                              │
   │                            │                              │
   │ SEND /app/chat/1/send      │                              │
   ├───────────────────────────>│  MessageController           │
   │                            │  → ChatService.sendMessage   │
   │                            │    persist + update counters │
   │                            │    SimpMessagingTemplate     │
   │                            ├─────────────────────────────>│
   │  /topic/conversations/1    │                              │
   │<───────────────────────────┤                              │
```

- Broker destinations: `/topic` and `/queue`, application prefix `/app`.
- REST equivalents exist for history and fallback sending when the socket is down.
- Read receipts broadcast to `/topic/conversations/{id}/read` and are persisted as
  `read_at` timestamps.

## 7. AI Middleware

The backend proxies all LLM traffic so the provider key never reaches the browser.

| Endpoint                    | Prompt strategy                                             |
| --------------------------- | ----------------------------------------------------------- |
| `POST /api/ai/translate`     | Faithful translation, preserve names/numbers/addresses      |
| `POST /api/ai/summarize`     | Overview → key points → deadlines/fees/actions              |
| `POST /api/ai/polite-message`| Natural Korean + `EN:` back-translation                     |

`app.ai.mock-mode` defaults to `true`, so the whole stack runs without an API key and
returns deterministic placeholder text. Set `AI_API_KEY` and `AI_MOCK_MODE=false` to
call a real OpenAI-compatible provider.

## 8. Frontend Architecture

- **App Router** with one folder per module under `src/app`.
- **`src/lib/api.ts`** is the single network boundary: an Axios instance with a request
  interceptor that attaches the JWT and a response interceptor that refreshes once on
  401, then replays the original request. Concurrent 401s share one refresh promise.
- **`src/lib/auth-context.tsx`** restores the session from `localStorage` on mount and
  exposes `user`, `isAuthenticated` and `isAdmin`.
- **`src/lib/use-chat-socket.ts`** wraps the STOMP client lifecycle for one conversation.
- **`src/types/index.ts`** mirrors the backend DTOs so drift shows up at compile time.
- **`src/components/ui`** holds the primitives (`Button`, `Input`, `Badge`,
  `Pagination`, feedback states) used across every page.

## 9. Configuration

| Variable | Default | Notes |
| -------- | ------- | ----- |
| `APP_JWT_SECRET` | dev value | Must be ≥ 32 bytes for HS256 |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/khelp` | |
| `SPRING_DATA_REDIS_HOST` | `localhost` | |
| `AI_API_KEY` | empty | Blank keeps mock mode usable |
| `AI_MOCK_MODE` | `true` | Set `false` for live LLM calls |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8080/ws` | |

## 10. Deployment Path

Local development uses Docker Compose. The production target is AWS:

| Concern     | Approach                                                        |
| ----------- | --------------------------------------------------------------- |
| Compute     | ECS Fargate services for backend and frontend, behind an ALB     |
| Database    | RDS for PostgreSQL with automated backups                        |
| Cache       | ElastiCache for Redis                                            |
| Secrets     | AWS Secrets Manager for `APP_JWT_SECRET` and `AI_API_KEY`        |
| Images      | ECR repositories built from the existing Dockerfiles             |
| Observability | CloudWatch logs and the `/actuator/health` endpoint            |

## 11. Known Limitations (V1 baseline)

- Chat is one-to-one only; group conversations are not modelled.
- Images are stored as URLs or comma-separated URL strings, not uploaded to object storage.
- The refresh token is stateless; there is no server-side revocation list yet.
- Rate limiting and request quotas for the AI proxy are planned but not implemented.
- List endpoints are not yet cached in Redis (only guides are), pending query profiling.
