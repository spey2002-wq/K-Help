-- V8: richer job filters (category, work days, contract length, perks, urgency)
-- plus extra demo listings so every filter has something to show.

ALTER TABLE job_listings
    ADD COLUMN IF NOT EXISTS category           VARCHAR(30),
    ADD COLUMN IF NOT EXISTS work_days          VARCHAR(40),
    ADD COLUMN IF NOT EXISTS work_period        VARCHAR(20),
    ADD COLUMN IF NOT EXISTS meals_provided     BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS housing_provided   BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS insurance_provided BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS transport_provided BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS urgent             BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE job_listings
    ADD CONSTRAINT chk_jobs_category CHECK (
        category IS NULL OR category IN (
            'RESTAURANT', 'CAFE', 'CONVENIENCE_STORE', 'RETAIL', 'DELIVERY_DRIVING',
            'EDUCATION', 'OFFICE_ADMIN', 'IT_DESIGN', 'WAREHOUSE_FACTORY', 'CONSTRUCTION',
            'BEAUTY_FITNESS', 'CLEANING', 'HOTEL_TOURISM', 'HEALTHCARE', 'TRANSLATION',
            'EVENT_PROMOTION', 'OTHER')),
    ADD CONSTRAINT chk_jobs_work_period CHECK (
        work_period IS NULL OR work_period IN (
            'ONE_DAY', 'UNDER_1_MONTH', 'ONE_TO_3_MONTHS', 'THREE_TO_6_MONTHS', 'OVER_6_MONTHS')),
    ADD CONSTRAINT chk_jobs_work_days CHECK (
        work_days IS NULL OR work_days ~
        '^(MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))*$');

CREATE INDEX IF NOT EXISTS idx_jobs_category ON job_listings (category);

-- Backfill the original demo listings.
UPDATE job_listings SET category = 'CAFE', work_days = 'FRI,SAT,SUN', work_period = 'OVER_6_MONTHS',
       meals_provided = TRUE, urgent = TRUE
WHERE title = 'English-Speaking Cafe Barista' AND category IS NULL;

UPDATE job_listings SET category = 'IT_DESIGN', work_days = 'MON,TUE,WED,THU,FRI', work_period = 'OVER_6_MONTHS',
       insurance_provided = TRUE
WHERE title = 'Junior Backend Developer (Java)' AND category IS NULL;

UPDATE job_listings SET category = 'WAREHOUSE_FACTORY', work_days = 'MON,TUE,WED,THU,FRI', work_period = 'ONE_TO_3_MONTHS',
       meals_provided = TRUE, transport_provided = TRUE
WHERE title = 'Warehouse Packing Staff' AND category IS NULL;

UPDATE job_listings SET category = 'EDUCATION', work_days = 'MON,TUE,WED,THU,FRI', work_period = 'OVER_6_MONTHS',
       housing_provided = TRUE, insurance_provided = TRUE
WHERE title = 'English Kindergarten Teacher' AND category IS NULL;

UPDATE job_listings SET category = 'IT_DESIGN', work_period = 'THREE_TO_6_MONTHS'
WHERE title LIKE 'Data Annotation Intern%' AND category IS NULL;

-- Extra demo listings (posted by the admin account, already approved).
INSERT INTO job_listings (
    title, company, description, requirements, job_type, location,
    visa_sponsorship, korean_required, salary_min, salary_max, salary_period,
    shift, hours_per_week, experience_level, category, work_days, work_period,
    meals_provided, housing_provided, insurance_provided, transport_provided, urgent,
    contact_email, deadline, posted_by, status, created_at)
SELECT v.title, v.company, v.description, v.requirements, v.job_type, v.location,
       v.visa_sponsorship, v.korean_required, v.salary_min, v.salary_max, v.salary_period,
       v.shift, v.hours_per_week, v.experience_level, v.category, v.work_days, v.work_period,
       v.meals_provided, v.housing_provided, v.insurance_provided, v.transport_provided, v.urgent,
       v.contact_email, v.deadline, u.id, 'APPROVED', NOW() - v.age
FROM (VALUES
    ('Convenience Store Night Staff', 'Sunrise Mart',
     'Run the register, restock shelves and keep the store tidy during the night shift. A senior colleague trains you in the first week.',
     E'- Basic Korean for talking to customers\n- Able to work nights',
     'PART_TIME', 'Seoul, Sinchon', FALSE, TRUE, 10030::NUMERIC, 11500::NUMERIC, 'HOURLY',
     'NIGHT', 25, 'NO_EXPERIENCE', 'CONVENIENCE_STORE', 'MON,TUE,WED', 'OVER_6_MONTHS',
     TRUE, FALSE, FALSE, FALSE, TRUE,
     'hire@sunrisemart.example', NULL::DATE, INTERVAL '2 days'),

    ('Weekend Kitchen Helper', 'Haeundae Seafood House',
     'Prep ingredients, wash dishes and help the cooks on busy weekends. A free meal is included every shift.',
     E'- No Korean needed\n- Comfortable standing for long hours',
     'PART_TIME', 'Busan, Haeundae', FALSE, FALSE, 11000::NUMERIC, 13000::NUMERIC, 'HOURLY',
     'EVENING', 16, 'NO_EXPERIENCE', 'RESTAURANT', 'SAT,SUN', 'THREE_TO_6_MONTHS',
     TRUE, FALSE, FALSE, FALSE, FALSE,
     'jobs@haeundaeseafood.example', NULL, INTERVAL '5 days'),

    ('Food Delivery Rider (Motorbike)', 'Quick Bite Delivery',
     'Deliver restaurant orders in your area. Choose your own hours and keep every tip.',
     E'- Valid motorbike licence and eligible visa\n- Smartphone',
     'FREELANCE', 'Seoul, Mapo', FALSE, FALSE, 15000::NUMERIC, 22000::NUMERIC, 'HOURLY',
     'FLEXIBLE', 30, 'JUNIOR', 'DELIVERY_DRIVING', NULL, 'OVER_6_MONTHS',
     FALSE, FALSE, TRUE, FALSE, FALSE,
     'riders@quickbite.example', NULL, INTERVAL '1 day'),

    ('One-Day Event Staff (K-Culture Expo)', 'Seoul Expo Staffing',
     'Welcome visitors, hand out leaflets and guide international guests at a one-day expo. Lunch and transport money included.',
     E'- English or Chinese conversation\n- Friendly and punctual',
     'TEMPORARY', 'Seoul, Gangnam (COEX)', FALSE, FALSE, 13000::NUMERIC, 15000::NUMERIC, 'HOURLY',
     'DAY', 8, 'NO_EXPERIENCE', 'EVENT_PROMOTION', 'SAT', 'ONE_DAY',
     TRUE, FALSE, FALSE, TRUE, TRUE,
     'staff@seoulexpo.example', (CURRENT_DATE + 14), INTERVAL '3 hours'),

    ('Hotel Front Desk (English / Chinese)', 'Jeju Ocean Hotel',
     'Check guests in and out, answer questions and arrange tours. Staff housing and meals are provided.',
     E'- Fluent English; Chinese or Japanese is a plus\n- Hotel or customer-service experience',
     'FULL_TIME', 'Jeju, Jeju City', TRUE, FALSE, 2300000::NUMERIC, 2700000::NUMERIC, 'MONTHLY',
     'ROTATING', 40, 'JUNIOR', 'HOTEL_TOURISM', 'MON,TUE,WED,THU,FRI,SAT', 'OVER_6_MONTHS',
     TRUE, TRUE, TRUE, FALSE, FALSE,
     'hr@jejuoceanhotel.example', (CURRENT_DATE + 30), INTERVAL '6 days'),

    ('Early Morning Office Cleaner', 'CleanCo Incheon',
     'Clean offices before staff arrive. Work ends by 9 AM, so it combines well with study.',
     E'- No experience needed\n- Reliable and punctual',
     'PART_TIME', 'Incheon', FALSE, FALSE, 11000::NUMERIC, 12000::NUMERIC, 'HOURLY',
     'DAY', 15, 'NO_EXPERIENCE', 'CLEANING', 'MON,TUE,WED,THU,FRI', 'OVER_6_MONTHS',
     FALSE, FALSE, TRUE, TRUE, FALSE,
     'work@cleanco.example', NULL, INTERVAL '8 days'),

    ('English Conversation Tutor', 'Talk Academy Daegu',
     'Lead small evening conversation classes for adults and teenagers.',
     E'- Native or near-native English\n- Patient and well organised',
     'PART_TIME', 'Daegu', FALSE, FALSE, 25000::NUMERIC, 40000::NUMERIC, 'HOURLY',
     'EVENING', 10, 'JUNIOR', 'EDUCATION', 'TUE,THU', 'THREE_TO_6_MONTHS',
     FALSE, FALSE, FALSE, FALSE, FALSE,
     'teach@talkacademy.example', NULL, INTERVAL '4 days'),

    ('Nepali / Korean Interpreter (Part-time)', 'Hope Migrant Support Center',
     'Interpret at counselling sessions and help workers fill in forms and visit clinics.',
     E'- Fluent Nepali and Korean (TOPIK 4+)\n- Kind and discreet',
     'PART_TIME', 'Suwon', FALSE, TRUE, 14000::NUMERIC, 16000::NUMERIC, 'HOURLY',
     'DAY', 20, 'JUNIOR', 'TRANSLATION', 'TUE,WED,THU', 'OVER_6_MONTHS',
     TRUE, FALSE, FALSE, TRUE, FALSE,
     'info@hopecenter.example', NULL, INTERVAL '9 days'),

    ('Hair Salon Assistant', 'Studio Mimi',
     'Shampoo clients, keep the salon clean and learn from senior stylists. Good first job if you want a beauty career.',
     E'- Interest in hair and beauty\n- Some Korean helps',
     'PART_TIME', 'Seoul, Hongdae', FALSE, FALSE, 10500::NUMERIC, 12000::NUMERIC, 'HOURLY',
     'DAY', 28, 'NO_EXPERIENCE', 'BEAUTY_FITNESS', 'WED,THU,FRI,SAT', 'THREE_TO_6_MONTHS',
     TRUE, FALSE, FALSE, FALSE, FALSE,
     'hello@studiomimi.example', NULL, INTERVAL '12 days'),

    ('Production Line Worker (E-9 welcome)', 'Ansan Precision Parts',
     'Assemble and inspect small metal parts on a day/night rotating line. Dormitory, meals and shuttle bus provided.',
     E'- No experience needed; training provided\n- Able to work rotating shifts',
     'FULL_TIME', 'Ansan', TRUE, FALSE, 2200000::NUMERIC, 2500000::NUMERIC, 'MONTHLY',
     'ROTATING', 48, 'NO_EXPERIENCE', 'WAREHOUSE_FACTORY', 'MON,TUE,WED,THU,FRI,SAT', 'OVER_6_MONTHS',
     TRUE, TRUE, TRUE, TRUE, TRUE,
     'recruit@ansanparts.example', NULL, INTERVAL '2 days'),

    ('Construction Site Helper', 'Gwangju Build Co.',
     'Carry materials, clean the site and assist skilled workers. Safety gear and lunch provided.',
     E'- Physically fit\n- Safety training completed or willing to complete',
     'TEMPORARY', 'Gwangju', FALSE, FALSE, 14000::NUMERIC, 18000::NUMERIC, 'HOURLY',
     'DAY', 40, 'NO_EXPERIENCE', 'CONSTRUCTION', 'MON,TUE,WED,THU,FRI,SAT', 'UNDER_1_MONTH',
     TRUE, FALSE, FALSE, TRUE, FALSE,
     'site@gwangjubuild.example', NULL, INTERVAL '7 days'),

    ('Duty-Free Sales Assistant', 'Myeongdong Beauty Mall',
     'Help international shoppers find cosmetics and process tax-free purchases.',
     E'- English plus Chinese, Japanese or Vietnamese\n- Retail experience preferred',
     'PART_TIME', 'Seoul, Myeongdong', FALSE, FALSE, 11000::NUMERIC, 13000::NUMERIC, 'HOURLY',
     'ROTATING', 30, 'JUNIOR', 'RETAIL', 'FRI,SAT,SUN', 'THREE_TO_6_MONTHS',
     FALSE, FALSE, FALSE, TRUE, FALSE,
     'jobs@mdbeauty.example', NULL, INTERVAL '10 days'),

    ('Freelance Web Designer', 'Pixel Bridge Studio',
     'Design landing pages and social media banners for small Korean businesses. Work remotely at your own pace.',
     E'- Portfolio in Figma or similar\n- English communication',
     'FREELANCE', 'Remote', FALSE, FALSE, 2500000::NUMERIC, 3500000::NUMERIC, 'MONTHLY',
     'FLEXIBLE', 20, 'MID', 'IT_DESIGN', NULL, 'ONE_TO_3_MONTHS',
     FALSE, FALSE, FALSE, FALSE, FALSE,
     'design@pixelbridge.example', (CURRENT_DATE + 20), INTERVAL '15 days'),

    ('Caregiver Assistant (Nursing Home)', 'Daejeon Silver Care',
     'Support elderly residents with meals, walks and daily activities under nurse supervision.',
     E'- Caring and patient\n- Basic Korean needed',
     'FULL_TIME', 'Daejeon', TRUE, TRUE, 2200000::NUMERIC, 2600000::NUMERIC, 'MONTHLY',
     'ROTATING', 40, 'NO_EXPERIENCE', 'HEALTHCARE', 'MON,TUE,WED,THU,FRI', 'OVER_6_MONTHS',
     TRUE, TRUE, TRUE, FALSE, FALSE,
     'care@silvercare.example', NULL, INTERVAL '11 days')
) AS v(title, company, description, requirements, job_type, location,
       visa_sponsorship, korean_required, salary_min, salary_max, salary_period,
       shift, hours_per_week, experience_level, category, work_days, work_period,
       meals_provided, housing_provided, insurance_provided, transport_provided, urgent,
       contact_email, deadline, age)
JOIN users u ON u.username = 'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM job_listings j WHERE j.title = v.title AND j.company = v.company);
