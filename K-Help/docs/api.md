# K-Help API Reference

Base URL: `http://localhost:8080` · Interactive docs: `/swagger-ui.html`

Every response uses the same envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": { },
  "timestamp": "2026-09-22T03:00:00Z"
}
```

Paginated endpoints return a `PageResponse` inside `data`:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0,
  "first": true,
  "last": true
}
```

Authenticated requests send `Authorization: Bearer <accessToken>`.

---

## Auth — `/api/auth`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/register` | — | Create an account, returns tokens |
| POST | `/login` | — | Sign in with username or email |
| POST | `/refresh` | — | Exchange a refresh token |
| GET | `/me` | ✅ | Current member profile |
| PUT | `/me` | ✅ | Update profile |

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

---

## Community — `/api/posts`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/` | — | List posts (`category`, `q`, `page`, `size`) |
| GET | `/{id}` | — | Post detail, increments views |
| POST | `/` | ✅ | Create a post |
| PUT | `/{id}` | ✅ owner/admin | Update a post |
| DELETE | `/{id}` | ✅ owner/admin | Soft-delete a post |
| POST | `/{id}/like` | ✅ | Toggle like |
| GET | `/{id}/comments` | — | Comments with nested replies |
| POST | `/{id}/comments` | ✅ | Add a comment or reply |
| DELETE | `/comments/{commentId}` | ✅ owner/admin | Delete a comment |
| POST | `/reports` | ✅ | Report content |

Post categories: `GENERAL`, `VISA_IMMIGRATION`, `JOBS`, `HOUSING`, `HEALTHCARE`,
`BANKING`, `EDUCATION`, `LANGUAGE_EXCHANGE`, `MARKETPLACE`, `EMERGENCY`.

---

## Korea Info — `/api/guides`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/` | — | Search guides (`category`, `language`, `q`, paging) |
| GET | `/{id}` | — | Full guide article |
| POST | `/` | ✅ admin | Create a guide |
| PUT | `/{id}` | ✅ admin | Update a guide |
| DELETE | `/{id}` | ✅ admin | Unpublish a guide |

Guide categories: `VISA_IMMIGRATION`, `HEALTHCARE`, `BANKING`, `HOUSING`,
`EMPLOYMENT`, `EDUCATION`, `EMERGENCY`, `TRANSPORTATION`, `DAILY_LIFE`.

List responses omit the `content` body; fetch by id for the full article. Results are
cached in Redis for 30 minutes.

---

## Jobs — `/api/jobs`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/` | — | Search listings (`q`, `jobType`, `location`, `visaSponsorship`, `koreanRequired`, `minSalary`) |
| GET | `/{id}` | — | Listing detail |
| POST | `/` | ✅ | Create a listing (enters `PENDING`) |
| PUT | `/{id}` | ✅ owner/admin | Update a listing |
| DELETE | `/{id}` | ✅ owner/admin | Close a listing |
| POST | `/{id}/applications` | ✅ | Apply to a listing |
| GET | `/{id}/applications` | ✅ owner/admin | Applications for a listing |
| GET | `/applications/me` | ✅ | My applications |
| PUT | `/applications/{applicationId}` | ✅ owner/admin | Update application status |
| DELETE | `/applications/{applicationId}` | ✅ applicant | Withdraw an application |

Job types: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `TEMPORARY`, `FREELANCE`.
Application statuses: `SUBMITTED`, `REVIEWING`, `SHORTLISTED`, `INTERVIEW`, `ACCEPTED`,
`REJECTED`, `WITHDRAWN`.

```bash
curl "http://localhost:8080/api/jobs?jobType=PART_TIME&visaSponsorship=true"
```

---

## Housing — `/api/housing`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/` | — | Search properties (`q`, `propertyType`, `city`, `district`, `maxDeposit`, `maxRent`, `minArea`, `furnished`, `petFriendly`) |
| GET | `/{id}` | — | Listing detail |
| POST | `/` | ✅ | Create a listing (enters `PENDING`) |
| PUT | `/{id}` | ✅ owner/admin | Update a listing |
| DELETE | `/{id}` | ✅ owner/admin | Mark as rented |
| POST | `/{id}/inquiries` | ✅ | Send an inquiry |
| GET | `/{id}/inquiries` | ✅ owner/admin | Inquiries for a property |
| GET | `/inquiries/me` | ✅ | My inquiries |
| PUT | `/inquiries/{inquiryId}` | ✅ owner/admin | Reply to an inquiry |

Property types: `ONE_ROOM`, `TWO_ROOM`, `APARTMENT`, `VILLA`, `OFFICETEL`, `STUDIO`,
`SHARE_HOUSE`, `DORMITORY`, `JEONSE`, `WOLSE`.

```bash
curl "http://localhost:8080/api/housing?city=Seoul&maxDeposit=5000000&maxRent=600000"
```

---

## Chat — `/api/chat` and WebSocket

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/conversations` | ✅ | Start or reuse a conversation |
| GET | `/conversations` | ✅ | My conversations |
| GET | `/conversations/{id}/messages` | ✅ | Message history |
| POST | `/conversations/{id}/messages` | ✅ | Send over REST |
| POST | `/conversations/{id}/read` | ✅ | Mark conversation read |

### WebSocket (STOMP)

Connect to `/ws` (SockJS supported). Pass the JWT on CONNECT:

```
CONNECT
Authorization: Bearer <accessToken>

SUBSCRIBE /topic/conversations/{id}
SUBSCRIBE /topic/conversations/{id}/read
SEND /app/chat/{id}/send   {"content":"Hello","targetLanguage":"ko"}
SEND /app/chat/{id}/read   {}
```

---

## AI — `/api/ai`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/translate` | — | Translate text |
| POST | `/summarize` | — | Summarize a Korean document |
| POST | `/polite-message` | — | Rewrite as polite Korean |

```bash
curl -X POST http://localhost:8080/api/ai/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"안녕하세요","targetLanguage":"en"}'
```

Responses include `mock: true` when `app.ai.mock-mode` is enabled (no API key set).

---

## Admin — `/api/admin` (ADMIN role required)

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/stats` | Dashboard counters |
| GET | `/users` | List/search members (`q`) |
| PUT | `/users/{id}` | Suspend, re-enable or change role |
| GET | `/jobs/pending` | Job listings awaiting approval |
| PUT | `/jobs/{id}/approval` | Approve or reject a job listing |
| GET | `/housing/pending` | Housing listings awaiting approval |
| PUT | `/housing/{id}/approval` | Approve or reject a housing listing |
| GET | `/reports` | Reports (`status`) |
| PUT | `/reports/{id}` | Resolve or reject a report |

---

## Error Codes

| Status | Meaning |
| ------ | ------- |
| 400 | Validation failed or bad request |
| 401 | Missing, expired or invalid token |
| 403 | Authenticated but not permitted |
| 404 | Resource not found |
| 409 | Conflict (duplicate username, email, or application) |
| 500 | Unexpected server error |

Validation failures return per-field messages in `data`:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": { "email": "Email must be valid" },
  "timestamp": "2026-09-22T03:00:00Z"
}
```
