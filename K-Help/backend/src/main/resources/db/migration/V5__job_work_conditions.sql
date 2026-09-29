-- V5: work-condition columns for job listings.
-- Powers the salary-period, shift, weekly-hours and experience filters.

ALTER TABLE job_listings
    ADD COLUMN IF NOT EXISTS salary_period    VARCHAR(10),
    ADD COLUMN IF NOT EXISTS shift            VARCHAR(20),
    ADD COLUMN IF NOT EXISTS hours_per_week   INTEGER,
    ADD COLUMN IF NOT EXISTS experience_level VARCHAR(20);

ALTER TABLE job_listings
    ADD CONSTRAINT chk_jobs_salary_period CHECK (
        salary_period IS NULL OR salary_period IN ('HOURLY', 'MONTHLY', 'YEARLY')),
    ADD CONSTRAINT chk_jobs_shift CHECK (
        shift IS NULL OR shift IN ('DAY', 'EVENING', 'NIGHT', 'ROTATING', 'FLEXIBLE')),
    ADD CONSTRAINT chk_jobs_hours_per_week CHECK (
        hours_per_week IS NULL OR hours_per_week BETWEEN 1 AND 80),
    ADD CONSTRAINT chk_jobs_experience CHECK (
        experience_level IS NULL
        OR experience_level IN ('NO_EXPERIENCE', 'JUNIOR', 'MID', 'SENIOR'));

CREATE INDEX IF NOT EXISTS idx_jobs_shift ON job_listings (shift);

-- Backfill existing rows. Before this migration the salary unit was implicit:
-- small numbers were hourly wages, large numbers were monthly salaries.
UPDATE job_listings
SET salary_period = CASE WHEN COALESCE(salary_max, salary_min) < 100000 THEN 'HOURLY' ELSE 'MONTHLY' END
WHERE salary_period IS NULL
  AND (salary_min IS NOT NULL OR salary_max IS NOT NULL);

-- Demo listings: sensible work conditions for the seeded jobs.
UPDATE job_listings SET shift = 'FLEXIBLE', hours_per_week = 20, experience_level = 'NO_EXPERIENCE'
WHERE title = 'English-Speaking Cafe Barista' AND shift IS NULL;

UPDATE job_listings SET shift = 'DAY', hours_per_week = 40, experience_level = 'JUNIOR'
WHERE title = 'Junior Backend Developer (Java)' AND shift IS NULL;

UPDATE job_listings SET shift = 'NIGHT', hours_per_week = 40, experience_level = 'NO_EXPERIENCE'
WHERE title = 'Warehouse Packing Staff' AND shift IS NULL;

UPDATE job_listings SET shift = 'DAY', hours_per_week = 40, experience_level = 'MID'
WHERE title = 'English Kindergarten Teacher' AND shift IS NULL;

UPDATE job_listings SET shift = 'FLEXIBLE', hours_per_week = 20, experience_level = 'NO_EXPERIENCE'
WHERE title LIKE 'Data Annotation Intern%' AND shift IS NULL;
