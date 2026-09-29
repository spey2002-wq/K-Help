-- ============================================================================
-- K-Help : PostgreSQL schema (standalone)
-- Korea Life Platform for Foreign Residents
--
-- This file is the consolidated, human-reviewable schema. It is equivalent to
-- the Flyway migrations V1 + V3 under
--   backend/src/main/resources/db/migration
-- which remain the runtime source of truth (the Spring Boot app applies them on
-- startup with `spring.jpa.hibernate.ddl-auto=validate`).
--
-- Use this file when you want a database WITHOUT running the backend, e.g.
--   psql -h localhost -U khelp -d khelp -f database/schema.sql
--   psql -h localhost -U khelp -d khelp -f database/data.sql
--
-- Every statement is idempotent (IF NOT EXISTS / DO-block guards), so the file
-- can be re-run safely against an existing database.
--
-- Requires PostgreSQL 13+ (tested on 16).
-- ============================================================================

SET client_encoding = 'UTF8';
SET timezone = 'UTC';

BEGIN;

-- ============================================================================
-- 1. IDENTITY & ACCESS
-- ============================================================================

-- ---------------------------------------------------------------- roles ----
-- Lookup table for the platform roles. Mirrors com.khelp.auth.entity.Role.
CREATE TABLE IF NOT EXISTS roles (
    name        VARCHAR(20)  PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    rank        SMALLINT     NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  roles      IS 'Platform roles. users.role references roles.name.';
COMMENT ON COLUMN roles.rank IS 'Higher rank = more privileges; used for ordering in admin UI.';

-- ---------------------------------------------------------------- users ----
CREATE TABLE IF NOT EXISTS users (
    id                 BIGSERIAL    PRIMARY KEY,
    username           VARCHAR(50)  NOT NULL,
    email              VARCHAR(120) NOT NULL,
    password_hash      VARCHAR(255) NOT NULL,
    full_name          VARCHAR(120),
    nationality        VARCHAR(60),
    visa_type          VARCHAR(20),
    preferred_language VARCHAR(10)  NOT NULL DEFAULT 'en',
    profile_image_url  VARCHAR(500),
    bio                VARCHAR(500),
    role               VARCHAR(20)  NOT NULL DEFAULT 'USER',
    enabled            BOOLEAN      NOT NULL DEFAULT TRUE,
    suspended          BOOLEAN      NOT NULL DEFAULT FALSE,
    last_login_at      TIMESTAMPTZ,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email    UNIQUE (email),
    CONSTRAINT fk_users_role     FOREIGN KEY (role) REFERENCES roles (name)
);

CREATE INDEX IF NOT EXISTS idx_users_role      ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_suspended ON users (suspended);

COMMENT ON TABLE  users               IS 'Registered K-Help members (foreign residents, employers, landlords, admins).';
COMMENT ON COLUMN users.password_hash IS 'BCrypt hash produced by Spring Security PasswordEncoder.';
COMMENT ON COLUMN users.visa_type     IS 'Korean visa class, e.g. D-2 (student), E-7 (skilled worker), F-5 (permanent).';
COMMENT ON COLUMN users.suspended     IS 'Set by admin moderation; suspended users cannot log in.';

-- ============================================================================
-- 2. COMMUNITY
-- ============================================================================

-- ---------------------------------------------------------------- posts ----
CREATE TABLE IF NOT EXISTS posts (
    id            BIGSERIAL    PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    content       TEXT         NOT NULL,
    category      VARCHAR(30)  NOT NULL DEFAULT 'GENERAL',
    author_id     BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    view_count    BIGINT       NOT NULL DEFAULT 0,
    like_count    BIGINT       NOT NULL DEFAULT 0,
    comment_count BIGINT       NOT NULL DEFAULT 0,
    pinned        BOOLEAN      NOT NULL DEFAULT FALSE,
    locked        BOOLEAN      NOT NULL DEFAULT FALSE,
    deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_posts_category CHECK (category IN (
        'GENERAL', 'VISA_IMMIGRATION', 'JOBS', 'HOUSING', 'HEALTHCARE', 'BANKING',
        'EDUCATION', 'LANGUAGE_EXCHANGE', 'MARKETPLACE', 'EMERGENCY'))
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_author   ON posts (author_id);

COMMENT ON TABLE  posts         IS 'Community forum posts.';
COMMENT ON COLUMN posts.deleted IS 'Soft delete flag; deleted posts are hidden from listings but kept for moderation.';

-- ------------------------------------------------------------- comments ----
CREATE TABLE IF NOT EXISTS comments (
    id         BIGSERIAL   PRIMARY KEY,
    content    TEXT        NOT NULL,
    post_id    BIGINT      NOT NULL REFERENCES posts (id)    ON DELETE CASCADE,
    author_id  BIGINT      NOT NULL REFERENCES users (id)    ON DELETE CASCADE,
    parent_id  BIGINT               REFERENCES comments (id) ON DELETE CASCADE,
    deleted    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments (post_id);

COMMENT ON COLUMN comments.parent_id IS 'Self-reference for one-level threaded replies.';

-- ----------------------------------------------------------- post_likes ----
CREATE TABLE IF NOT EXISTS post_likes (
    id         BIGSERIAL   PRIMARY KEY,
    post_id    BIGINT      NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_post_likes_post_user UNIQUE (post_id, user_id)
);

-- ============================================================================
-- 3. KOREA LIVING INFORMATION
-- ============================================================================

-- --------------------------------------------------------------- guides ----
CREATE TABLE IF NOT EXISTS guides (
    id            BIGSERIAL    PRIMARY KEY,
    title         VARCHAR(250) NOT NULL,
    summary       VARCHAR(500) NOT NULL,
    content       TEXT         NOT NULL,
    category      VARCHAR(30)  NOT NULL,
    language_code VARCHAR(10)  NOT NULL DEFAULT 'en',
    source_url    VARCHAR(500),
    published     BOOLEAN      NOT NULL DEFAULT TRUE,
    view_count    BIGINT       NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_guides_category CHECK (category IN (
        'VISA_IMMIGRATION', 'HEALTHCARE', 'BANKING', 'HOUSING', 'EMPLOYMENT',
        'EDUCATION', 'EMERGENCY', 'TRANSPORTATION', 'DAILY_LIFE'))
);

CREATE INDEX IF NOT EXISTS idx_guides_category ON guides (category);

COMMENT ON TABLE guides IS 'Curated Korea living guides (visa, banking, healthcare, housing...). Served with Redis caching.';

-- ============================================================================
-- 4. JOBS
-- ============================================================================

-- --------------------------------------------------------- job_listings ----
CREATE TABLE IF NOT EXISTS job_listings (
    id                BIGSERIAL      PRIMARY KEY,
    title             VARCHAR(250)   NOT NULL,
    company           VARCHAR(150)   NOT NULL,
    description       TEXT           NOT NULL,
    requirements      TEXT,
    job_type          VARCHAR(20)    NOT NULL,
    location          VARCHAR(100),
    visa_sponsorship  BOOLEAN        NOT NULL DEFAULT FALSE,
    korean_required   BOOLEAN        NOT NULL DEFAULT TRUE,
    salary_min        NUMERIC(12, 2),
    salary_max        NUMERIC(12, 2),
    salary_currency   VARCHAR(10)    DEFAULT 'KRW',
    salary_period     VARCHAR(10),
    shift             VARCHAR(20),
    hours_per_week    INTEGER,
    experience_level  VARCHAR(20),
    contact_email     VARCHAR(150),
    deadline          DATE,
    posted_by         BIGINT         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status            VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    view_count        BIGINT         NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_jobs_type CHECK (job_type IN (
        'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE')),
    CONSTRAINT chk_jobs_status CHECK (status IN (
        'PENDING', 'APPROVED', 'REJECTED', 'CLOSED')),
    CONSTRAINT chk_jobs_salary_range
        CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max),
    CONSTRAINT chk_jobs_salary_period CHECK (
        salary_period IS NULL OR salary_period IN ('HOURLY', 'MONTHLY', 'YEARLY')),
    CONSTRAINT chk_jobs_shift CHECK (
        shift IS NULL OR shift IN ('DAY', 'EVENING', 'NIGHT', 'ROTATING', 'FLEXIBLE')),
    CONSTRAINT chk_jobs_hours_per_week CHECK (
        hours_per_week IS NULL OR hours_per_week BETWEEN 1 AND 80),
    CONSTRAINT chk_jobs_experience CHECK (
        experience_level IS NULL
        OR experience_level IN ('NO_EXPERIENCE', 'JUNIOR', 'MID', 'SENIOR'))
);

CREATE INDEX IF NOT EXISTS idx_jobs_status   ON job_listings (status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON job_listings (location);
CREATE INDEX IF NOT EXISTS idx_jobs_type     ON job_listings (job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_shift    ON job_listings (shift);

COMMENT ON TABLE  job_listings        IS 'Employer job postings. New listings start PENDING until an admin approves them.';
COMMENT ON COLUMN job_listings.salary_min IS 'Lower bound of the pay range, in the unit given by salary_period.';
COMMENT ON COLUMN job_listings.salary_period IS 'Unit of salary_min/salary_max: HOURLY, MONTHLY or YEARLY.';

-- ----------------------------------------------------- job_applications ----
CREATE TABLE IF NOT EXISTS job_applications (
    id             BIGSERIAL    PRIMARY KEY,
    job_listing_id BIGINT       NOT NULL REFERENCES job_listings (id) ON DELETE CASCADE,
    applicant_id   BIGINT       NOT NULL REFERENCES users (id)        ON DELETE CASCADE,
    cover_letter   TEXT,
    resume_url     VARCHAR(500),
    status         VARCHAR(20)  NOT NULL DEFAULT 'SUBMITTED',
    employer_note  VARCHAR(500),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_job_application_listing_user UNIQUE (job_listing_id, applicant_id),
    CONSTRAINT chk_applications_status CHECK (status IN (
        'SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'))
);

-- ============================================================================
-- 5. HOUSING
-- ============================================================================

-- ----------------------------------------------------- housing_listings ----
CREATE TABLE IF NOT EXISTS housing_listings (
    id                 BIGSERIAL      PRIMARY KEY,
    title              VARCHAR(250)   NOT NULL,
    description        TEXT           NOT NULL,
    property_type      VARCHAR(20)    NOT NULL,
    city               VARCHAR(100),
    district           VARCHAR(100),
    neighborhood       VARCHAR(100),
    address_line       VARCHAR(300),
    deposit_amount     NUMERIC(14, 2),
    monthly_rent       NUMERIC(14, 2),
    maintenance_fee    NUMERIC(12, 2),
    currency           VARCHAR(10)    DEFAULT 'KRW',
    area_sqm           NUMERIC(8, 2),
    room_count         INTEGER,
    bathroom_count     INTEGER,
    floor_number       INTEGER,
    available_from     DATE,
    furnished          BOOLEAN        NOT NULL DEFAULT FALSE,
    pet_friendly       BOOLEAN        NOT NULL DEFAULT FALSE,
    utilities_included BOOLEAN        NOT NULL DEFAULT FALSE,
    image_urls         VARCHAR(1000),
    contact_phone      VARCHAR(50),
    contact_email      VARCHAR(150),
    listed_by          BIGINT         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status             VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    view_count         BIGINT         NOT NULL DEFAULT 0,
    created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_housing_property_type CHECK (property_type IN (
        'ONE_ROOM', 'TWO_ROOM', 'APARTMENT', 'VILLA', 'OFFICETEL', 'STUDIO',
        'SHARE_HOUSE', 'DORMITORY', 'JEONSE', 'WOLSE')),
    CONSTRAINT chk_housing_status CHECK (status IN (
        'PENDING', 'AVAILABLE', 'RESERVED', 'RENTED', 'REJECTED')),
    CONSTRAINT chk_housing_amounts_non_negative
        CHECK (COALESCE(deposit_amount, 0) >= 0
           AND COALESCE(monthly_rent, 0) >= 0
           AND COALESCE(maintenance_fee, 0) >= 0)
);

CREATE INDEX IF NOT EXISTS idx_housing_status ON housing_listings (status);
CREATE INDEX IF NOT EXISTS idx_housing_city   ON housing_listings (city);
CREATE INDEX IF NOT EXISTS idx_housing_type   ON housing_listings (property_type);

COMMENT ON TABLE  housing_listings                IS 'Rental listings. New listings start PENDING until an admin approves them (-> AVAILABLE).';
COMMENT ON COLUMN housing_listings.deposit_amount IS 'Key money (보증금). For JEONSE this is the full lump-sum deposit.';
COMMENT ON COLUMN housing_listings.maintenance_fee IS 'Monthly 관리비 covering building upkeep, sometimes utilities.';
COMMENT ON COLUMN housing_listings.image_urls     IS 'Comma-separated list of image URLs.';

-- ---------------------------------------------------- housing_inquiries ----
CREATE TABLE IF NOT EXISTS housing_inquiries (
    id                      BIGSERIAL   PRIMARY KEY,
    housing_listing_id      BIGINT      NOT NULL REFERENCES housing_listings (id) ON DELETE CASCADE,
    inquirer_id             BIGINT      NOT NULL REFERENCES users (id)            ON DELETE CASCADE,
    message                 TEXT        NOT NULL,
    contact_phone           VARCHAR(50),
    preferred_move_in_date  DATE,
    status                  VARCHAR(25) NOT NULL DEFAULT 'NEW',
    owner_reply             TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_inquiries_status CHECK (status IN (
        'NEW', 'CONTACTED', 'VIEWING_SCHEDULED', 'COMPLETED', 'DECLINED'))
);

-- ============================================================================
-- 6. MESSAGING (realtime chat over STOMP/WebSocket)
-- ============================================================================

-- -------------------------------------------------------- conversations ----
CREATE TABLE IF NOT EXISTS conversations (
    id                   BIGSERIAL    PRIMARY KEY,
    participant_one_id   BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    participant_two_id   BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    last_message_preview VARCHAR(300),
    last_message_at      TIMESTAMPTZ,
    unread_count_one     BIGINT       NOT NULL DEFAULT 0,
    unread_count_two     BIGINT       NOT NULL DEFAULT 0,
    context_type         VARCHAR(20),
    context_id           BIGINT,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_conversations_distinct_participants
        CHECK (participant_one_id <> participant_two_id),
    CONSTRAINT chk_conversations_context_type
        CHECK (context_type IS NULL OR context_type IN ('JOB', 'HOUSING', 'POST'))
);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_one ON conversations (participant_one_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_two ON conversations (participant_two_id);

COMMENT ON TABLE  conversations              IS 'One-to-one chat threads. Denormalised unread counters keep the inbox query cheap.';
COMMENT ON COLUMN conversations.context_type IS 'Optional origin of the chat (JOB / HOUSING / POST) together with context_id.';

-- -------------------------------------------------------- chat_messages ----
CREATE TABLE IF NOT EXISTS chat_messages (
    id                 BIGSERIAL   PRIMARY KEY,
    conversation_id    BIGINT      NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
    sender_id          BIGINT      NOT NULL REFERENCES users (id)         ON DELETE CASCADE,
    content            TEXT        NOT NULL,
    read_at            TIMESTAMPTZ,
    translated_content TEXT,
    source_language    VARCHAR(10),
    target_language    VARCHAR(10),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON chat_messages (conversation_id);

COMMENT ON COLUMN chat_messages.translated_content IS 'Optional AI translation cached alongside the original message.';

-- ============================================================================
-- 7. MODERATION
-- ============================================================================

-- -------------------------------------------------------------- reports ----
CREATE TABLE IF NOT EXISTS reports (
    id              BIGSERIAL    PRIMARY KEY,
    target_type     VARCHAR(20)  NOT NULL,
    target_id       BIGINT       NOT NULL,
    reason          VARCHAR(500) NOT NULL,
    details         TEXT,
    reporter_id     BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    resolution_note VARCHAR(500),
    handled_by      BIGINT                REFERENCES users (id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_reports_target_type CHECK (target_type IN (
        'POST', 'COMMENT', 'JOB', 'HOUSING', 'USER')),
    CONSTRAINT chk_reports_status CHECK (status IN (
        'PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED'))
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports (target_type, target_id);

COMMENT ON TABLE reports IS 'User-submitted abuse reports; polymorphic target via (target_type, target_id).';

-- ============================================================================
-- 8. HOUSEKEEPING: automatic updated_at maintenance
--    (Spring Data JPA auditing also sets updated_at; this trigger covers rows
--     changed directly through SQL so the two never disagree.)
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'users', 'posts', 'comments', 'post_likes', 'guides',
        'job_listings', 'job_applications', 'housing_listings', 'housing_inquiries',
        'conversations', 'chat_messages', 'reports'
    ]
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger
            WHERE tgname = 'trg_' || tbl || '_updated_at'
        ) THEN
            EXECUTE format(
                'CREATE TRIGGER trg_%1$s_updated_at
                 BEFORE UPDATE ON %1$I
                 FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
                tbl);
        END IF;
    END LOOP;
END;
$$;

COMMIT;
