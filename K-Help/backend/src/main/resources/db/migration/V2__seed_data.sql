-- ============================================================================
-- V2: Seed data for local development and demos
--
-- Passwords (BCrypt, cost 10):
--   admin  -> Admin@123
--   ashish -> User@123
--   divya  -> User@123
--   spandan-> User@123
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

-- ------------------------------------------------------ Korea living guides --
INSERT INTO guides (title, summary, content, category, language_code, source_url, published)
VALUES
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
     'DAILY_LIFE', 'en', NULL, TRUE)
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------- posts ------
INSERT INTO posts (title, content, category, author_id, view_count, like_count, comment_count)
SELECT
    'Welcome to K-Help - introduce yourself here!',
    E'Hello everyone!\n\n'
    'This is the community space for foreign residents in Korea. Whether you are a student, worker, '
    'or long-term resident, feel free to introduce yourself, ask questions, and share your experience.\n\n'
    'Please keep discussions respectful and helpful.',
    'GENERAL', u.id, 42, 3, 1
FROM users u WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, content, category, author_id, view_count, like_count, comment_count)
SELECT
    'How long did your ARC take to arrive?',
    E'I applied at the Seoul immigration office three weeks ago and I am still waiting.\n\n'
    'Has anyone received theirs faster recently? I need it to open a bank account.',
    'VISA_IMMIGRATION', u.id, 18, 2, 0
FROM users u WHERE u.username = 'ashish'
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, content, category, author_id, view_count, like_count, comment_count)
SELECT
    'Best neighborhoods for students near Hongdae?',
    E'I am starting at a university in Seoul next month and looking for an affordable one-room.\n\n'
    'Any recommendations around Hongdae or Sinchon with reasonable deposits?',
    'HOUSING', u.id, 27, 5, 0
FROM users u WHERE u.username = 'divya'
ON CONFLICT DO NOTHING;

INSERT INTO comments (content, post_id, author_id)
SELECT 'Mine took about 4 weeks. You can use the receipt as temporary ID in the meantime.', p.id, u.id
FROM posts p, users u
WHERE p.title = 'How long did your ARC take to arrive?' AND u.username = 'divya'
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------- job listings ----
INSERT INTO job_listings (title, company, description, requirements, job_type, location,
                          visa_sponsorship, korean_required, salary_min, salary_max,
                          contact_email, posted_by, status)
SELECT
    'English-Speaking Cafe Barista',
    'Seoul Brew House',
    E'We are looking for friendly baristas for our Hongdae branch.\n\n'
    'You will prepare drinks, serve customers and keep the counter clean. Training provided.',
    E'- Basic English required\n'
    '- Korean is helpful but not required\n'
    '- Must be able to work weekends',
    'PART_TIME', 'Seoul, Hongdae', FALSE, FALSE, 10000, 12000,
    'hire@seoulbrew.example', u.id, 'APPROVED'
FROM users u WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO job_listings (title, company, description, requirements, job_type, location,
                          visa_sponsorship, korean_required, salary_min, salary_max,
                          contact_email, posted_by, status)
SELECT
    'Junior Backend Developer (Java)',
    'HanRiver Tech',
    E'Join our platform team building logistics software.\n\n'
    'You will work with Java, Spring Boot and PostgreSQL alongside a senior engineer.',
    E'- 1+ year of Java experience\n'
    '- Familiarity with Spring Boot\n'
    '- Conversational Korean preferred',
    'FULL_TIME', 'Seoul, Gangnam', TRUE, TRUE, 3200000, 4500000,
    'jobs@hanrivertech.example', u.id, 'APPROVED'
FROM users u WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO job_listings (title, company, description, requirements, job_type, location,
                          visa_sponsorship, korean_required, salary_min, salary_max,
                          contact_email, posted_by, status)
SELECT
    'Warehouse Packing Staff',
    'Busan Logistics',
    E'Packing and sorting parcels in a modern warehouse. Shift work available.',
    E'- No Korean required\n'
    '- Able to lift up to 15 kg',
    'TEMPORARY', 'Busan', FALSE, FALSE, 11000, 13000,
    'work@busanlogistics.example', u.id, 'PENDING'
FROM users u WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------- housing listings ----
INSERT INTO housing_listings (title, description, property_type, city, district, neighborhood,
                              deposit_amount, monthly_rent, maintenance_fee, area_sqm,
                              room_count, bathroom_count, floor_number, furnished,
                              pet_friendly, utilities_included, listed_by, status)
SELECT
    'Cozy One-Room near Hongik University',
    E'Bright one-room a 7-minute walk from Hongdae station.\n\n'
    'Includes air conditioning, washing machine and a small kitchen. Convenience store downstairs.',
    'ONE_ROOM', 'Seoul', 'Mapo-gu', 'Seogyo-dong',
    5000000, 550000, 70000, 24.5, 1, 1, 3, TRUE, FALSE, FALSE, u.id, 'AVAILABLE'
FROM users u WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO housing_listings (title, description, property_type, city, district, neighborhood,
                              deposit_amount, monthly_rent, maintenance_fee, area_sqm,
                              room_count, bathroom_count, floor_number, furnished,
                              pet_friendly, utilities_included, listed_by, status)
SELECT
    'Spacious Share House in Sinchon',
    E'Private room in a shared house with three other international students.\n\n'
    'Shared kitchen and living room. Utilities included in the maintenance fee.',
    'SHARE_HOUSE', 'Seoul', 'Seodaemun-gu', 'Sinchon-dong',
    1000000, 450000, 120000, 14.0, 1, 1, 2, TRUE, TRUE, TRUE, u.id, 'AVAILABLE'
FROM users u WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO housing_listings (title, description, property_type, city, district, neighborhood,
                              deposit_amount, monthly_rent, maintenance_fee, area_sqm,
                              room_count, bathroom_count, floor_number, furnished,
                              pet_friendly, utilities_included, listed_by, status)
SELECT
    'Modern Officetel in Busan Centum',
    E'New officetel with a gym and rooftop lounge in the building.',
    'OFFICETEL', 'Busan', 'Haeundae-gu', 'U-dong',
    10000000, 700000, 100000, 33.0, 1, 1, 12, TRUE, FALSE, FALSE, u.id, 'PENDING'
FROM users u WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;
