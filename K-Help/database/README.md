# Database

PostgreSQL schema and seed data for K-Help.

## Contents

```
database/
├── schema.sql    # All tables, indexes, constraints, triggers (re-runnable)
├── data.sql      # Roles, demo users, guides, sample posts/jobs/housing (re-runnable)
└── README.md
```

Both scripts are **idempotent**: `schema.sql` uses `IF NOT EXISTS` / guard blocks and
`data.sql` uses `ON CONFLICT DO NOTHING` / `WHERE NOT EXISTS`, so either file can be
applied repeatedly without duplicating rows or failing.

They are the standalone, human-reviewable copy of the schema. The **authoritative**
runtime source is the Flyway migration set under
`backend/src/main/resources/db/migration`, which is equivalent:

| `database/` file | Flyway equivalents |
| ---------------- | ------------------ |
| `schema.sql`     | `V1__baseline_schema.sql` + `V3__roles_and_domain_constraints.sql` |
| `data.sql`       | `V2__seed_data.sql` + `V4__extended_seed_data.sql` |

Note that `V2`/`V4` are incremental appends, while `data.sql` is the merged
end state of both — the row counts are identical, so the two paths converge.

## How the backend applies the schema

Flyway owns the schema. On backend startup it applies everything in
`backend/src/main/resources/db/migration` in version order:

| Version | File | Purpose |
| ------- | ---- | ------- |
| V1 | `V1__baseline_schema.sql` | All tables, indexes, unique constraints |
| V2 | `V2__seed_data.sql` | Demo users, Korea guides, sample posts/jobs/housing |
| V3 | `V3__roles_and_domain_constraints.sql` | `roles` table, `users.role` FK, enum CHECK constraints, `updated_at` trigger |
| V4 | `V4__extended_seed_data.sql` | Extra guides and listings for search/filter demos |

Hibernate runs with `ddl-auto: validate`, so entity/schema drift fails fast at
startup instead of silently altering tables.

## Running the scripts without the backend

Useful for a DBAs-only setup, a scratch database, or CI fixtures.

```bash
# Create the database once (as a superuser or a role with CREATEDB)
psql -h localhost -U khelp -d postgres -c "CREATE DATABASE khelp;"

# Apply schema, then seed data
psql -h localhost -U khelp -d khelp -f database/schema.sql
psql -h localhost -U khelp -d khelp -f database/data.sql
```

With Docker:

```bash
Get-Content -Raw database/schema.sql | docker exec -i khelp-postgres psql -U khelp -d khelp
Get-Content -Raw database/data.sql   | docker exec -i khelp-postgres psql -U khelp -d khelp
```

> Only use these scripts on a database you intend to manage manually. If the backend
> also runs against the same database, let Flyway create the schema instead — do not
> run `schema.sql` first, or Flyway's `flyway_schema_history` baseline will not match
> what actually exists.

## Connecting

```bash
# Start just the database and cache
docker compose up -d postgres redis

# Open a psql shell
docker exec -it khelp-postgres psql -U khelp -d khelp
```

Connection settings (see `.env.example`):

| Setting  | Default |
| -------- | ------- |
| Host     | localhost |
| Port     | 5432 |
| Database | khelp |
| User     | khelp |
| Password | khelp |

## Demo credentials

Seeded by `data.sql` / `V2`. Development only — never ship these to production.

| Username | Password    | Role  |
| -------- | ----------- | ----- |
| admin    | `Admin@123` | ADMIN |
| ashish   | `User@123`  | USER  |
| divya    | `User@123`  | USER  |
| spandan  | `User@123`  | USER  |

Hashes are BCrypt (cost 10) generated with Spring Security's `BCryptPasswordEncoder`.

## Schema notes

- **`roles`** is a lookup table (`USER` 10, `MODERATOR` 50, `ADMIN` 100) and
  `users.role` has a foreign key to it, so an invalid role cannot be stored.
- **CHECK constraints** pin every enum-backed column to exactly the values in the
  matching Java enum (`PostCategory`, `GuideCategory`, `JobType`, `ListingStatus`,
  `ApplicationStatus`, `PropertyType`, `PropertyStatus`, `InquiryStatus`,
  `ReportTargetType`, `ReportStatus`). Keep them in sync when adding enum values.
- **`set_updated_at()` trigger** bumps `updated_at` on every `UPDATE` so rows changed
  through raw SQL stay consistent with rows changed through JPA auditing.
- **Housing** stores Korean rental economics directly: `deposit_amount` (보증금),
  `monthly_rent` (월세) and `maintenance_fee` (관리비) as separate columns, so jeonse
  and wolse listings share one table.
- **Reports** are polymorphic via `(target_type, target_id)` rather than one table per
  reportable entity.

## Useful queries

```sql
-- Pending moderation queue
SELECT 'job' AS type, id, title FROM job_listings WHERE status = 'PENDING'
UNION ALL
SELECT 'housing', id, title FROM housing_listings WHERE status = 'PENDING';

-- Unread message counts per conversation
SELECT id, unread_count_one, unread_count_two FROM conversations;

-- Reports awaiting action
SELECT id, target_type, target_id, reason FROM reports WHERE status = 'PENDING';

-- Which migrations have been applied
SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;
```

## Resetting

```bash
docker compose down -v          # removes the khelp-pgdata volume (all data)
docker compose up -d postgres
```

Flyway replays V1–V4 on the next backend start.