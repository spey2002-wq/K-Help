-- ============================================================================
-- V3: Roles lookup table + domain CHECK constraints
--
-- * `roles` is a reference table so the database (not just the Java enum)
--   documents which roles exist. `users.role` now references it.
-- * CHECK constraints pin every enum-backed VARCHAR column to the values the
--   Spring Boot entities know about. Hibernate (`ddl-auto: validate`) does not
--   inspect CHECK constraints, so these are safe to add without entity changes.
--
-- Keep the value lists in sync with:
--   com.khelp.auth.entity.Role
--   com.khelp.community.entity.{PostCategory, ReportTargetType, ReportStatus}
--   com.khelp.info.entity.GuideCategory
--   com.khelp.job.entity.{JobType, ListingStatus, ApplicationStatus}
--   com.khelp.housing.entity.{PropertyType, PropertyStatus, InquiryStatus}
-- ============================================================================

-- ---------------------------------------------------------------- roles ----
CREATE TABLE roles (
    name        VARCHAR(20)  PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    rank        SMALLINT     NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO roles (name, description, rank) VALUES
    ('USER',      'Registered member: can post, apply, list and chat',            10),
    ('MODERATOR', 'Community moderator: can resolve reports and lock posts',      50),
    ('ADMIN',     'Platform administrator: full moderation and approval rights',  100);

ALTER TABLE users
    ADD CONSTRAINT fk_users_role FOREIGN KEY (role) REFERENCES roles (name);

-- ------------------------------------------------------ domain constraints --
ALTER TABLE posts
    ADD CONSTRAINT chk_posts_category CHECK (category IN (
        'GENERAL', 'VISA_IMMIGRATION', 'JOBS', 'HOUSING', 'HEALTHCARE', 'BANKING',
        'EDUCATION', 'LANGUAGE_EXCHANGE', 'MARKETPLACE', 'EMERGENCY'));

ALTER TABLE guides
    ADD CONSTRAINT chk_guides_category CHECK (category IN (
        'VISA_IMMIGRATION', 'HEALTHCARE', 'BANKING', 'HOUSING', 'EMPLOYMENT',
        'EDUCATION', 'EMERGENCY', 'TRANSPORTATION', 'DAILY_LIFE'));

ALTER TABLE job_listings
    ADD CONSTRAINT chk_jobs_type CHECK (job_type IN (
        'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE')),
    ADD CONSTRAINT chk_jobs_status CHECK (status IN (
        'PENDING', 'APPROVED', 'REJECTED', 'CLOSED')),
    ADD CONSTRAINT chk_jobs_salary_range
        CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max);

ALTER TABLE job_applications
    ADD CONSTRAINT chk_applications_status CHECK (status IN (
        'SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'));

ALTER TABLE housing_listings
    ADD CONSTRAINT chk_housing_property_type CHECK (property_type IN (
        'ONE_ROOM', 'TWO_ROOM', 'APARTMENT', 'VILLA', 'OFFICETEL', 'STUDIO',
        'SHARE_HOUSE', 'DORMITORY', 'JEONSE', 'WOLSE')),
    ADD CONSTRAINT chk_housing_status CHECK (status IN (
        'PENDING', 'AVAILABLE', 'RESERVED', 'RENTED', 'REJECTED')),
    ADD CONSTRAINT chk_housing_amounts_non_negative
        CHECK (COALESCE(deposit_amount, 0) >= 0
           AND COALESCE(monthly_rent, 0) >= 0
           AND COALESCE(maintenance_fee, 0) >= 0);

ALTER TABLE housing_inquiries
    ADD CONSTRAINT chk_inquiries_status CHECK (status IN (
        'NEW', 'CONTACTED', 'VIEWING_SCHEDULED', 'COMPLETED', 'DECLINED'));

ALTER TABLE conversations
    ADD CONSTRAINT chk_conversations_distinct_participants
        CHECK (participant_one_id <> participant_two_id),
    ADD CONSTRAINT chk_conversations_context_type
        CHECK (context_type IS NULL OR context_type IN ('JOB', 'HOUSING', 'POST'));

ALTER TABLE reports
    ADD CONSTRAINT chk_reports_target_type CHECK (target_type IN (
        'POST', 'COMMENT', 'JOB', 'HOUSING', 'USER')),
    ADD CONSTRAINT chk_reports_status CHECK (status IN (
        'PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED'));

-- ------------------------------------------------- updated_at maintenance --
-- JPA auditing sets updated_at from the application; this trigger covers rows
-- changed directly through SQL (admin scripts, psql) so the two never disagree.
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
        EXECUTE format(
            'CREATE TRIGGER trg_%1$s_updated_at
             BEFORE UPDATE ON %1$I
             FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
            tbl);
    END LOOP;
END;
$$;
