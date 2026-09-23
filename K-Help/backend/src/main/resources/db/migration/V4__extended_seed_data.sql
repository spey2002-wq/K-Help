-- ============================================================================
-- V4: Extended demo seed data
-- Adds two more guides (transport, education), two more job listings and one
-- more housing listing so search/filter screens have enough variety.
-- Mirrors the extra rows in database/data.sql.
-- ============================================================================

INSERT INTO guides (title, summary, content, category, language_code, source_url, published)
SELECT v.title, v.summary, v.content, v.category, v.language_code, v.source_url, v.published
FROM (VALUES
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

INSERT INTO job_listings (title, company, description, requirements, job_type, location,
                          visa_sponsorship, korean_required, salary_min, salary_max,
                          contact_email, posted_by, status)
SELECT v.title, v.company, v.description, v.requirements, v.job_type, v.location,
       v.visa_sponsorship, v.korean_required, v.salary_min, v.salary_max,
       v.contact_email, u.id, v.status
FROM (VALUES
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

INSERT INTO housing_listings (title, description, property_type, city, district, neighborhood,
                              deposit_amount, monthly_rent, maintenance_fee, area_sqm,
                              room_count, bathroom_count, floor_number, furnished,
                              pet_friendly, utilities_included, listed_by, status)
SELECT
    'Two-Room Apartment near Daejeon KAIST',
    E'Quiet two-room flat 10 minutes by bus from KAIST and Chungnam National University.\n\n'
    'South-facing, gas heating (도시가스), dedicated parking spot.',
    'TWO_ROOM', 'Daejeon', 'Yuseong-gu', 'Eoeun-dong',
    8000000, 600000, 80000, 42.0, 2, 1, 4, FALSE, FALSE, FALSE, u.id, 'AVAILABLE'
FROM users u
WHERE u.username = 'admin'
  AND NOT EXISTS (SELECT 1 FROM housing_listings WHERE title = 'Two-Room Apartment near Daejeon KAIST');
