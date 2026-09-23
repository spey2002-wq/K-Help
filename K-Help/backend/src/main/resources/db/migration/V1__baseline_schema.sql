-- ============================================================================
-- V1: K-Help baseline schema
-- Korea Life Platform for Foreign Residents
-- ============================================================================

-- ---------------------------------------------------------------- users ----
CREATE TABLE users (
    id                 BIGSERIAL PRIMARY KEY,
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
    CONSTRAINT uk_users_email    UNIQUE (email)
);

CREATE INDEX idx_users_role      ON users (role);
CREATE INDEX idx_users_suspended ON users (suspended);

-- --------------------------------------------------------------- posts -----
CREATE TABLE posts (
    id            BIGSERIAL PRIMARY KEY,
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
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_category ON posts (category);
CREATE INDEX idx_posts_author   ON posts (author_id);

-- ------------------------------------------------------------ comments -----
CREATE TABLE comments (
    id         BIGSERIAL PRIMARY KEY,
    content    TEXT        NOT NULL,
    post_id    BIGINT      NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    author_id  BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    parent_id  BIGINT      REFERENCES comments (id) ON DELETE CASCADE,
    deleted    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments (post_id);

-- ---------------------------------------------------------- post_likes -----
CREATE TABLE post_likes (
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT      NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_post_likes_post_user UNIQUE (post_id, user_id)
);

-- -------------------------------------------------------------- guides -----
CREATE TABLE guides (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(250) NOT NULL,
    summary       VARCHAR(500) NOT NULL,
    content       TEXT         NOT NULL,
    category      VARCHAR(30)  NOT NULL,
    language_code VARCHAR(10)  NOT NULL DEFAULT 'en',
    source_url    VARCHAR(500),
    published     BOOLEAN      NOT NULL DEFAULT TRUE,
    view_count    BIGINT       NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guides_category ON guides (category);

-- --------------------------------------------------------- job_listings ----
CREATE TABLE job_listings (
    id                BIGSERIAL PRIMARY KEY,
    title             VARCHAR(250) NOT NULL,
    company           VARCHAR(150) NOT NULL,
    description       TEXT         NOT NULL,
    requirements      TEXT,
    job_type          VARCHAR(20)  NOT NULL,
    location          VARCHAR(100),
    visa_sponsorship  BOOLEAN      NOT NULL DEFAULT FALSE,
    korean_required   BOOLEAN      NOT NULL DEFAULT TRUE,
    salary_min        NUMERIC(12, 2),
    salary_max        NUMERIC(12, 2),
    salary_currency   VARCHAR(10)  DEFAULT 'KRW',
    contact_email     VARCHAR(150),
    deadline          DATE,
    posted_by         BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status            VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    view_count        BIGINT       NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_status   ON job_listings (status);
CREATE INDEX idx_jobs_location ON job_listings (location);
CREATE INDEX idx_jobs_type     ON job_listings (job_type);

-- ------------------------------------------------------ job_applications --
CREATE TABLE job_applications (
    id             BIGSERIAL PRIMARY KEY,
    job_listing_id BIGINT      NOT NULL REFERENCES job_listings (id) ON DELETE CASCADE,
    applicant_id   BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    cover_letter   TEXT,
    resume_url     VARCHAR(500),
    status         VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    employer_note  VARCHAR(500),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_job_application_listing_user UNIQUE (job_listing_id, applicant_id)
);

-- ----------------------------------------------------- housing_listings ----
CREATE TABLE housing_listings (
    id                 BIGSERIAL PRIMARY KEY,
    title              VARCHAR(250) NOT NULL,
    description        TEXT         NOT NULL,
    property_type      VARCHAR(20)  NOT NULL,
    city               VARCHAR(100),
    district           VARCHAR(100),
    neighborhood       VARCHAR(100),
    address_line       VARCHAR(300),
    deposit_amount     NUMERIC(14, 2),
    monthly_rent       NUMERIC(14, 2),
    maintenance_fee    NUMERIC(12, 2),
    currency           VARCHAR(10)  DEFAULT 'KRW',
    area_sqm           NUMERIC(8, 2),
    room_count         INTEGER,
    bathroom_count     INTEGER,
    floor_number       INTEGER,
    available_from     DATE,
    furnished          BOOLEAN      NOT NULL DEFAULT FALSE,
    pet_friendly       BOOLEAN      NOT NULL DEFAULT FALSE,
    utilities_included BOOLEAN      NOT NULL DEFAULT FALSE,
    image_urls         VARCHAR(1000),
    contact_phone      VARCHAR(50),
    contact_email      VARCHAR(150),
    listed_by          BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status             VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    view_count         BIGINT       NOT NULL DEFAULT 0,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_housing_status ON housing_listings (status);
CREATE INDEX idx_housing_city   ON housing_listings (city);
CREATE INDEX idx_housing_type   ON housing_listings (property_type);

-- ----------------------------------------------------- housing_inquiries --
CREATE TABLE housing_inquiries (
    id                      BIGSERIAL PRIMARY KEY,
    housing_listing_id      BIGINT      NOT NULL REFERENCES housing_listings (id) ON DELETE CASCADE,
    inquirer_id             BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    message                 TEXT        NOT NULL,
    contact_phone           VARCHAR(50),
    preferred_move_in_date  DATE,
    status                  VARCHAR(25) NOT NULL DEFAULT 'NEW',
    owner_reply             TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------- conversations ----
CREATE TABLE conversations (
    id                   BIGSERIAL PRIMARY KEY,
    participant_one_id   BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    participant_two_id   BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    last_message_preview VARCHAR(300),
    last_message_at      TIMESTAMPTZ,
    unread_count_one     BIGINT      NOT NULL DEFAULT 0,
    unread_count_two     BIGINT      NOT NULL DEFAULT 0,
    context_type         VARCHAR(20),
    context_id           BIGINT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_participant_one ON conversations (participant_one_id);
CREATE INDEX idx_conversations_participant_two ON conversations (participant_two_id);

-- --------------------------------------------------------- chat_messages ---
CREATE TABLE chat_messages (
    id                 BIGSERIAL PRIMARY KEY,
    conversation_id    BIGINT      NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
    sender_id          BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    content            TEXT        NOT NULL,
    read_at            TIMESTAMPTZ,
    translated_content TEXT,
    source_language    VARCHAR(10),
    target_language    VARCHAR(10),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON chat_messages (conversation_id);

-- -------------------------------------------------------------- reports ----
CREATE TABLE reports (
    id              BIGSERIAL PRIMARY KEY,
    target_type     VARCHAR(20)  NOT NULL,
    target_id       BIGINT       NOT NULL,
    reason          VARCHAR(500) NOT NULL,
    details         TEXT,
    reporter_id     BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    resolution_note VARCHAR(500),
    handled_by      BIGINT       REFERENCES users (id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports (status);
CREATE INDEX idx_reports_target ON reports (target_type, target_id);
