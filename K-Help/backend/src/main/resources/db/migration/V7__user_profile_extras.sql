-- ============================================================================
-- V7: Member profile extras - skills, experiences and photos
-- Mirrors database/schema.sql.
-- Photos are stored in the database (BYTEA) so they survive container
-- redeployments on hosts with ephemeral disks.
-- ============================================================================

-- --------------------------------------------------------------- skills ----
CREATE TABLE user_skills (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name       VARCHAR(40)  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_user_skills UNIQUE (user_id, name)
);

CREATE INDEX idx_user_skills_user ON user_skills (user_id);

-- ---------------------------------------------------------- experiences ----
CREATE TABLE user_experiences (
    id           BIGSERIAL     PRIMARY KEY,
    user_id      BIGINT        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    kind         VARCHAR(20)   NOT NULL DEFAULT 'WORK',
    title        VARCHAR(120)  NOT NULL,
    organization VARCHAR(120),
    location     VARCHAR(120),
    start_date   DATE,
    end_date     DATE,
    is_current   BOOLEAN       NOT NULL DEFAULT FALSE,
    description  VARCHAR(1000),
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_experiences_kind CHECK (kind IN ('WORK', 'EDUCATION', 'OTHER')),
    CONSTRAINT chk_user_experiences_dates CHECK (
        end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_user_experiences_user ON user_experiences (user_id);

-- --------------------------------------------------------------- photos ----
CREATE TABLE user_photos (
    id           BIGSERIAL    PRIMARY KEY,
    user_id      BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    kind         VARCHAR(10)  NOT NULL,
    content_type VARCHAR(50)  NOT NULL,
    size_bytes   INTEGER      NOT NULL,
    caption      VARCHAR(200),
    data         BYTEA        NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_photos_kind CHECK (kind IN ('AVATAR', 'GALLERY'))
);

CREATE INDEX idx_user_photos_user_kind ON user_photos (user_id, kind);
