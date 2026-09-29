-- ============================================================================
-- K-Help : Seed data (standalone)
--
-- Loads the reference roles, demo accounts, Korea living guides and sample
-- job / housing listings used for local development and demos.
--
-- Run AFTER database/schema.sql:
--   psql -h localhost -U khelp -d khelp -f database/data.sql
--
-- Equivalent to Flyway migrations V2 (+ the roles rows from V3). Every
-- statement is idempotent (ON CONFLICT DO NOTHING / WHERE NOT EXISTS), so the
-- file can be re-run without creating duplicates.
--
-- Demo credentials (BCrypt cost 10, generated with Spring's BCryptPasswordEncoder):
--   admin   / Admin@123   (ADMIN)
--   ashish  / User@123    (USER)
--   divya   / User@123    (USER)
--   spandan / User@123    (USER)
-- These are development-only accounts; never ship them to production.
-- ============================================================================

SET client_encoding = 'UTF8';

BEGIN;

-- ============================================================================
-- 1. ROLES
-- ============================================================================
INSERT INTO roles (name, description, rank) VALUES
    ('USER',      'Registered member: can post, apply, list and chat',            10),
    ('MODERATOR', 'Community moderator: can resolve reports and lock posts',      50),
    ('ADMIN',     'Platform administrator: full moderation and approval rights',  100)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 2. USERS
-- ============================================================================
INSERT INTO users (username, email, password_hash, full_name, nationality, visa_type,
                   preferred_language, role, enabled, suspended)
VALUES
    ('admin',   'admin@khelp.app',   '$2a$10$fxyyfHtFRhsDQ7TDUJelP./vGb74uVrkck35QItCWsOQCn4GPV3P6',
     'Platform Administrator', 'Korea',  'F-5', 'en', 'ADMIN', TRUE, FALSE),
    ('ashish',  'ashish@khelp.app',  '$2a$10$1ju5u99XWHGH908kUxNnRu/fsNMLG5FrPQTsi4r9yeRzBIvce/jrS',
     'Pokhrel Ashish',  'Nepal',  'D-2', 'en', 'USER',  TRUE, FALSE),
    ('divya',   'divya@khelp.app',   '$2a$10$1ju5u99XWHGH908kUxNnRu/fsNMLG5FrPQTsi4r9yeRzBIvce/jrS',
     'Rai Divya',       'Nepal',  'D-2', 'en', 'USER',  TRUE, FALSE),
    ('spandan', 'spandan@khelp.app', '$2a$10$1ju5u99XWHGH908kUxNnRu/fsNMLG5FrPQTsi4r9yeRzBIvce/jrS',
     'Rai Spandan',     'Nepal',  'D-10','en', 'USER',  TRUE, FALSE)
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- 3. KOREA LIVING GUIDES
-- ============================================================================
INSERT INTO guides (title, summary, content, category, language_code, source_url, published)
SELECT v.title, v.summary, v.content, v.category, v.language_code, v.source_url, v.published
FROM (VALUES
    ('Alien Registration Card (ARC) - First 90 Days',
     'Every foreign resident staying longer than 90 days must apply for an ARC at the local immigration office.',
     E'What it is\n'
     'The Alien Registration Card (외국인등록증) is your official ID in Korea. You need it to open a bank account, '
     'sign a phone contract, and access most public services.\n\n'
     'When to apply\n'
     'Apply within 90 days of arrival. Book an appointment on HiKorea (hikorea.go.kr) before visiting.\n\n'
     'Documents to bring\n'
     '- Passport and visa\n'
     '- Completed application form (Integrated Application Form)\n'
     '- One passport-size photo\n'
     '- Certificate of enrollment or employment\n'
     '- Proof of residence (lease contract or dormitory confirmation)\n'
     '- Application fee (about 30,000 KRW)\n\n'
     'Tips\n'
     'Arrive 15 minutes early. Processing usually takes 2-3 weeks; you will receive a receipt you can use as temporary ID.',
     'VISA_IMMIGRATION', 'en', 'https://www.hikorea.go.kr', TRUE),

    ('Opening a Korean Bank Account',
     'You can open an account at most major banks with your passport and ARC. Some branches require an ARC first.',
     E'Banks that are foreigner-friendly\n'
     '- KB Kookmin Bank\n'
     '- Shinhan Bank\n'
     '- Woori Bank\n'
     '- Hana Bank\n\n'
     'What to bring\n'
     '- Passport\n'
     '- Alien Registration Card (or receipt)\n'
     '- Korean phone number\n'
     '- Proof of address\n\n'
     'Useful to know\n'
     'Ask for a check card (체크카드) so you can pay online. Mobile banking apps often need your ARC number to register. '
     'Transfer fees are lower when using the bank app rather than ATMs.',
     'BANKING', 'en', 'https://www.kbstar.com', TRUE),

    ('Using the Korean Healthcare System',
     'National Health Insurance is mandatory for most long-term residents and makes hospital visits very affordable.',
     E'National Health Insurance (NHIS)\n'
     'Most foreign residents employed in Korea are enrolled automatically. Students on D-2 visas are usually enrolled '
     'after the first semester. Monthly premiums are based on income.\n\n'
     'Visiting a clinic\n'
     '1. Find a clinic (의원) or hospital (병원) near you.\n'
     '2. Bring your ARC and insurance card.\n'
     '3. Pay a small co-payment at the desk.\n'
     '4. Pick up medicine at a pharmacy (약국) next door.\n\n'
     'Emergency\n'
     'Call 119 for an ambulance. Interpretation is available through 1339 (medical hotline, 24 hours).',
     'HEALTHCARE', 'en', 'https://www.nhis.or.kr', TRUE),

    ('Finding Housing in Korea: Jeonse vs Wolse',
     'Understand the deposit and monthly rent structures before signing any lease.',
     E'Two main rental models\n'
     '- Jeonse (전세): a large lump-sum deposit, no monthly rent. The deposit is returned when you move out.\n'
     '- Wolse (월세): a smaller deposit plus monthly rent. This is the most common option for newcomers.\n\n'
     'Typical costs\n'
     'One-room wolse outside central Seoul might be 5,000,000 KRW deposit and 500,000 KRW monthly rent, '
     'plus a maintenance fee (관리비) of 50,000-150,000 KRW.\n\n'
     'Before signing\n'
     '- Confirm the maintenance fee and what it covers.\n'
     '- Check the building for mold, water pressure and heating.\n'
     '- Register your move-in date at the local 주민센터 so your address matches your ARC.\n'
     '- Never pay a deposit without a written contract.',
     'HOUSING', 'en', 'https://www.hikorea.go.kr', TRUE),

    ('Emergency Numbers and Safety in Korea',
     'Save these numbers: 112 police, 119 fire and ambulance, 1339 medical, 1345 immigration.',
     E'Key numbers\n'
     '- 112: Police\n'
     '- 119: Fire and ambulance\n'
     '- 1339: Medical information and interpretation (24h)\n'
     '- 1345: Immigration contact center (foreigner support)\n'
     '- 1330: Korea Travel Hotline with interpretation\n\n'
     'Reporting a crime\n'
     'You can report in English; interpretation support is available. Keep a copy of any police report number.\n\n'
     'Other support\n'
     '- 1366: Women''s emergency hotline\n'
     '- 1391: Child abuse reporting\n'
     '- Danuri Helpline 1577-1366: Multicultural family support',
     'EMERGENCY', 'en', NULL, TRUE),

    ('Working Part-Time on a Student Visa (D-2)',
     'D-2 students may work part-time after receiving permission from the immigration office.',
     E'Permission required\n'
     'You must obtain part-time work permission (시간제 취업 허가) before starting any job. '
     'Working without permission can jeopardize your visa.\n\n'
     'Typical limits\n'
     '- Language proficiency (TOPIK) level affects allowed hours.\n'
     '- Usually up to 20-25 hours per week during semester and unlimited during vacation, subject to your visa conditions.\n'
     '- Certain industries such as manufacturing and construction are restricted.\n\n'
     'How to apply\n'
     'Submit the application form, employer information, and your enrollment certificate to the immigration office or HiKorea.',
     'EMPLOYMENT', 'en', 'https://www.hikorea.go.kr', TRUE),

    ('Getting a Korean Phone Number and SIM Card',
     'Prepaid SIMs are available at airports, but a long-term contract needs an ARC.',
     E'Options\n'
     '- Prepaid SIM: available at Incheon/Gimpo airports and some convenience stores. Passport only.\n'
     '- Postpaid plan: requires an ARC and usually a bank account for automatic payment.\n\n'
     'Recommended carriers\n'
     'SKT, KT and LG U+ are the main carriers. Budget MVNOs (알뜰폰) offer cheaper plans using the same networks.\n\n'
     'Tip\n'
     'Many services (banking, delivery apps, government portals) verify your identity through your phone number, '
     'so set this up early.',
     'DAILY_LIFE', 'en', NULL, TRUE),

    ('Using Public Transport: T-money, Subway and Buses',
     'One rechargeable T-money card works on subways, buses and most taxis nationwide.',
     E'Getting a card\n'
     'Buy a T-money card (2,500-4,000 KRW) at any convenience store or subway station, then top it up with cash at '
     'the machines or at the counter.\n\n'
     'Fares\n'
     'Base subway fare in Seoul is about 1,400 KRW with distance-based increments. Transfers between bus and subway '
     'within 30 minutes are free or discounted when you tap in and out.\n\n'
     'Apps\n'
     'Naver Map and KakaoMap give real-time bus and subway directions in English. Google Maps has limited transit '
     'coverage in Korea.\n\n'
     'Late night\n'
     'Subways stop around midnight. Look for the "owl" (올빼미) night buses in Seoul or use Kakao T for taxis.',
     'TRANSPORTATION', 'en', 'https://www.t-money.co.kr', TRUE),

    ('Korean Language Programs and TOPIK',
     'University language institutes, free community classes and the TOPIK exam explained.',
     E'Where to study\n'
     '- University Korean Language Institutes (KLI): intensive 10-week terms, D-4 visa eligible.\n'
     '- Multicultural Family Support Centers: free or low-cost evening classes.\n'
     '- King Sejong Institute: government-run centers in many cities.\n\n'
     'TOPIK\n'
     'The Test of Proficiency in Korean is held about six times a year. Level 3-4 is commonly required for '
     'part-time work permission and points-based visas. Register early on topik.go.kr; seats fill within hours.',
     'EDUCATION', 'en', 'https://www.topik.go.kr', TRUE)
) AS v(title, summary, content, category, language_code, source_url, published)
WHERE NOT EXISTS (SELECT 1 FROM guides g WHERE g.title = v.title);

-- ============================================================================
-- 4. COMMUNITY
-- ============================================================================
INSERT INTO posts (title, content, category, author_id, view_count, like_count, comment_count)
SELECT
    'Welcome to K-Help - introduce yourself here!',
    E'Hello everyone!\n\n'
    'This is the community space for foreign residents in Korea. Whether you are a student, worker, '
    'or long-term resident, feel free to introduce yourself, ask questions, and share your experience.\n\n'
    'Please keep discussions respectful and helpful.',
    'GENERAL', u.id, 42, 3, 1
FROM users u
WHERE u.username = 'admin'
  AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'Welcome to K-Help - introduce yourself here!');

INSERT INTO posts (title, content, category, author_id, view_count, like_count, comment_count)
SELECT
    'How long did your ARC take to arrive?',
    E'I applied at the Seoul immigration office three weeks ago and I am still waiting.\n\n'
    'Has anyone received theirs faster recently? I need it to open a bank account.',
    'VISA_IMMIGRATION', u.id, 18, 2, 0
FROM users u
WHERE u.username = 'ashish'
  AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'How long did your ARC take to arrive?');

INSERT INTO posts (title, content, category, author_id, view_count, like_count, comment_count)
SELECT
    'Best neighborhoods for students near Hongdae?',
    E'I am starting at a university in Seoul next month and looking for an affordable one-room.\n\n'
    'Any recommendations around Hongdae or Sinchon with reasonable deposits?',
    'HOUSING', u.id, 27, 5, 0
FROM users u
WHERE u.username = 'divya'
  AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'Best neighborhoods for students near Hongdae?');

INSERT INTO comments (content, post_id, author_id)
SELECT 'Mine took about 4 weeks. You can use the receipt as temporary ID in the meantime.', p.id, u.id
FROM posts p
JOIN users u ON u.username = 'divya'
WHERE p.title = 'How long did your ARC take to arrive?'
  AND NOT EXISTS (
      SELECT 1 FROM comments c
      WHERE c.post_id = p.id AND c.author_id = u.id
        AND c.content LIKE 'Mine took about 4 weeks%');

-- ============================================================================
-- 5. SAMPLE JOB LISTINGS
-- ============================================================================
INSERT INTO job_listings (title, company, description, requirements, job_type, location,
                          visa_sponsorship, korean_required, salary_min, salary_max,
                          contact_email, posted_by, status)
SELECT v.title, v.company, v.description, v.requirements, v.job_type, v.location,
       v.visa_sponsorship, v.korean_required, v.salary_min, v.salary_max,
       v.contact_email, u.id, v.status
FROM (VALUES
    ('English-Speaking Cafe Barista',
     'Seoul Brew House',
     E'We are looking for friendly baristas for our Hongdae branch.\n\n'
     'You will prepare drinks, serve customers and keep the counter clean. Training provided.',
     E'- Basic English required\n'
     '- Korean is helpful but not required\n'
     '- Must be able to work weekends',
     'PART_TIME', 'Seoul, Hongdae', FALSE, FALSE, 10000::NUMERIC, 12000::NUMERIC,
     'hire@seoulbrew.example', 'APPROVED'),

    ('Junior Backend Developer (Java)',
     'HanRiver Tech',
     E'Join our platform team building logistics software.\n\n'
     'You will work with Java, Spring Boot and PostgreSQL alongside a senior engineer.',
     E'- 1+ year of Java experience\n'
     '- Familiarity with Spring Boot\n'
     '- Conversational Korean preferred',
     'FULL_TIME', 'Seoul, Gangnam', TRUE, TRUE, 3200000::NUMERIC, 4500000::NUMERIC,
     'jobs@hanrivertech.example', 'APPROVED'),

    ('Warehouse Packing Staff',
     'Busan Logistics',
     E'Packing and sorting parcels in a modern warehouse. Shift work available.',
     E'- No Korean required\n'
     '- Able to lift up to 15 kg',
     'TEMPORARY', 'Busan', FALSE, FALSE, 11000::NUMERIC, 13000::NUMERIC,
     'work@busanlogistics.example', 'PENDING'),

    ('English Kindergarten Teacher',
     'Sunshine English Academy',
     E'Teach English to children aged 4-7 in a small-class environment in Daejeon.\n\n'
     'Housing allowance, health insurance and severance pay provided under Korean labour law.',
     E'- Bachelor''s degree from an English-speaking country or equivalent E-2 eligibility\n'
     '- Clean criminal record check\n'
     '- Experience with young learners preferred',
     'FULL_TIME', 'Daejeon', TRUE, FALSE, 2300000::NUMERIC, 2700000::NUMERIC,
     'recruit@sunshine-academy.example', 'APPROVED'),

    ('Data Annotation Intern (Remote-friendly)',
     'Seoul AI Labs',
     E'Support our ML team by labelling multilingual text and audio data.\n\n'
     'Flexible hours; suitable for D-2 students with part-time work permission.',
     E'- Fluent in English plus one of Nepali, Vietnamese or Uzbek\n'
     '- Attention to detail\n'
     '- Own laptop',
     'INTERNSHIP', 'Seoul, Seongsu (hybrid)', FALSE, FALSE, 11000::NUMERIC, 14000::NUMERIC,
     'intern@seoulailabs.example', 'APPROVED')
) AS v(title, company, description, requirements, job_type, location,
       visa_sponsorship, korean_required, salary_min, salary_max, contact_email, status)
JOIN users u ON u.username = 'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM job_listings j WHERE j.title = v.title AND j.company = v.company);

-- Work conditions used by the salary-period, shift, hours and experience filters
-- (equivalent of migration V5). Safe to re-run: only fills columns that are empty.
UPDATE job_listings
SET salary_period = CASE WHEN COALESCE(salary_max, salary_min) < 100000 THEN 'HOURLY' ELSE 'MONTHLY' END
WHERE salary_period IS NULL
  AND (salary_min IS NOT NULL OR salary_max IS NOT NULL);

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

-- ============================================================================
-- 6. SAMPLE HOUSING LISTINGS
-- ============================================================================
INSERT INTO housing_listings (title, description, property_type, city, district, neighborhood,
                              deposit_amount, monthly_rent, maintenance_fee, area_sqm,
                              room_count, bathroom_count, floor_number, furnished,
                              pet_friendly, utilities_included, listed_by, status)
SELECT v.title, v.description, v.property_type, v.city, v.district, v.neighborhood,
       v.deposit_amount, v.monthly_rent, v.maintenance_fee, v.area_sqm,
       v.room_count, v.bathroom_count, v.floor_number, v.furnished,
       v.pet_friendly, v.utilities_included, u.id, v.status
FROM (VALUES
    ('Cozy One-Room near Hongik University',
     E'Bright one-room a 7-minute walk from Hongdae station.\n\n'
     'Includes air conditioning, washing machine and a small kitchen. Convenience store downstairs.',
     'ONE_ROOM', 'Seoul', 'Mapo-gu', 'Seogyo-dong',
     5000000::NUMERIC, 550000::NUMERIC, 70000::NUMERIC, 24.5::NUMERIC, 1, 1, 3,
     TRUE, FALSE, FALSE, 'AVAILABLE'),

    ('Spacious Share House in Sinchon',
     E'Private room in a shared house with three other international students.\n\n'
     'Shared kitchen and living room. Utilities included in the maintenance fee.',
     'SHARE_HOUSE', 'Seoul', 'Seodaemun-gu', 'Sinchon-dong',
     1000000::NUMERIC, 450000::NUMERIC, 120000::NUMERIC, 14.0::NUMERIC, 1, 1, 2,
     TRUE, TRUE, TRUE, 'AVAILABLE'),

    ('Modern Officetel in Busan Centum',
     E'New officetel with a gym and rooftop lounge in the building.',
     'OFFICETEL', 'Busan', 'Haeundae-gu', 'U-dong',
     10000000::NUMERIC, 700000::NUMERIC, 100000::NUMERIC, 33.0::NUMERIC, 1, 1, 12,
     TRUE, FALSE, FALSE, 'PENDING'),

    ('Two-Room Apartment near Daejeon KAIST',
     E'Quiet two-room flat 10 minutes by bus from KAIST and Chungnam National University.\n\n'
     'South-facing, gas heating (도시가스), dedicated parking spot.',
     'TWO_ROOM', 'Daejeon', 'Yuseong-gu', 'Eoeun-dong',
     8000000::NUMERIC, 600000::NUMERIC, 80000::NUMERIC, 42.0::NUMERIC, 2, 1, 4,
     FALSE, FALSE, FALSE, 'AVAILABLE')
) AS v(title, description, property_type, city, district, neighborhood,
       deposit_amount, monthly_rent, maintenance_fee, area_sqm,
       room_count, bathroom_count, floor_number, furnished,
       pet_friendly, utilities_included, status)
JOIN users u ON u.username = 'admin'
WHERE NOT EXISTS (SELECT 1 FROM housing_listings h WHERE h.title = v.title);

COMMIT;

-- ============================================================================
-- Quick verification
-- ============================================================================
SELECT 'roles'            AS table_name, COUNT(*) AS rows FROM roles
UNION ALL SELECT 'users',            COUNT(*) FROM users
UNION ALL SELECT 'guides',           COUNT(*) FROM guides
UNION ALL SELECT 'posts',            COUNT(*) FROM posts
UNION ALL SELECT 'comments',         COUNT(*) FROM comments
UNION ALL SELECT 'job_listings',     COUNT(*) FROM job_listings
UNION ALL SELECT 'housing_listings', COUNT(*) FROM housing_listings
ORDER BY table_name;
