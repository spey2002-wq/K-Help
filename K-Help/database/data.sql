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

-- -------------------------------------------------- Visa by Country (seed) --
INSERT INTO guides (title, summary, content, category, country, language_code, source_url, published)
SELECT v.title, v.summary, v.content, v.category, v.country, v.language_code, v.source_url, v.published
FROM (VALUES
    -- ---------------------------------------------------------- general ----
    ('How to Come to Korea: Step-by-Step Visa Process (Any Country)',
     'The common path every foreigner follows, from choosing a visa to getting an Alien Registration Card.',
     E'Step 1 - Decide your purpose\n'
     'Study, work, family, tourism or business. Your purpose decides the visa type (see "Korean Visa Types at a Glance").\n\n'
     'Step 2 - Check whether you need a visa\n'
     'Citizens of some countries can enter Korea for a short stay without a visa, but may need an electronic travel '
     'authorization (K-ETA) first. Everyone else must obtain a visa before travelling.\n\n'
     'Step 3 - Get your sponsor documents\n'
     '- Students: an admission letter from the university or language institute.\n'
     '- Workers: a labour contract and a Certificate of Visa Issuance or Visa Issuance Number from your employer or '
     'the government program.\n'
     '- Family: documents from your Korean spouse or relative proving the relationship.\n\n'
     'Step 4 - Apply at the Korean embassy or consulate\n'
     'Apply in the country where you live, at the embassy, consulate or an authorised visa application center. '
     'Bring your passport, photo, application form, fee and the sponsor documents. Some long-stay applicants must '
     'also submit a tuberculosis (TB) test certificate.\n\n'
     'Step 5 - Enter Korea\n'
     'Travel before your visa expires and keep copies of every document.\n\n'
     'Step 6 - Register\n'
     'If you will stay longer than 90 days, register for your Alien Registration Card (ARC) at the local immigration '
     'office within 90 days of arrival. Book through HiKorea.\n\n'
     'Step 7 - Keep your status valid\n'
     'Apply for an extension before your stay period ends. Never work on a visa that does not allow it.\n\n'
     'Rules and fees change. Always confirm with the official sources below or your embassy.',
     'VISA_BY_COUNTRY', NULL, 'en', 'https://www.visa.go.kr', TRUE),

    ('Korean Visa Types at a Glance (C-3, D-2, D-4, E-7, E-9, F-6, H-2, F-4)',
     'A plain-English list of the most common Korean visas and who each one is for.',
     E'Short stay\n'
     '- C-3: short-term visit (tourism, family visit, short business trip), usually up to 90 days. Working is not allowed.\n\n'
     'Study\n'
     '- D-2: degree-seeking student at a university or graduate school.\n'
     '- D-4: general trainee, mostly Korean language institute students (D-4-1).\n\n'
     'Work\n'
     '- E-9: non-professional employment (factories, farms, fishing, construction) through the Employment Permit '
     'System (EPS). Only citizens of countries that signed an agreement with Korea can use it.\n'
     '- E-7: specially designated professional work such as engineering, IT or skilled trades, sponsored by an employer.\n'
     '- E-2: foreign language instructor.\n'
     '- D-10: job seeking for qualified graduates and skilled people.\n\n'
     'Family and long-term residence\n'
     '- F-6: spouse of a Korean citizen (marriage migrant).\n'
     '- F-2: long-term resident, including some points-based applicants.\n'
     '- F-4: overseas Koreans (ethnic Koreans with foreign citizenship).\n'
     '- H-2: working visit for certain ethnic Koreans from specific countries.\n\n'
     'Eligibility details such as age, language level and income change over time. Check HiKorea for the current rules.',
     'VISA_BY_COUNTRY', NULL, 'en', 'https://www.hikorea.go.kr', TRUE),

    ('Visa-Free Entry and K-ETA for Short Stays',
     'Which travellers can enter without a visa and how the K-ETA online travel authorization works.',
     E'Visa-free entry\n'
     'Korea lets citizens of many countries stay for a short period (often 30 to 90 days) without a visa for tourism '
     'or short business. You cannot work, and the stay cannot be converted to a work visa inside Korea.\n\n'
     'K-ETA\n'
     'Most visa-free travellers must apply online for the Korea Electronic Travel Authorization (K-ETA) before boarding. '
     'You enter your passport details, upload a photo and pay a small fee. Approval usually arrives within a few days, '
     'so apply well before travel.\n\n'
     'Temporary exemptions\n'
     'Korea sometimes exempts certain nationalities from K-ETA for a limited period. The list changes, so check the '
     'official K-ETA website before you book a flight.\n\n'
     'Staying longer\n'
     'If you plan to study, work or live in Korea, you need the correct long-stay visa obtained before arrival.',
     'VISA_BY_COUNTRY', NULL, 'en', 'https://www.k-eta.go.kr', TRUE),

    -- ------------------------------------------------------- by country ----
    ('Nepal to Korea: Visa Options and Process',
     'The main routes for Nepali citizens - study, EPS work and short visits - and how each application works.',
     E'Who this is for\n'
     'Nepali citizens planning to study, work or visit South Korea. Nepali passport holders need a visa before travelling.\n\n'
     'Main routes\n'
     '- Study (D-2 degree, D-4 language): get an admission letter from a Korean university or language institute first.\n'
     '- Work (E-9, EPS): Nepal takes part in Korea''s Employment Permit System. Candidates pass the EPS-TOPIK Korean '
     'test, enter a government roster, are selected by a Korean employer and sign a standard labour contract.\n'
     '- Visit (C-3): tourism, family visit or a short business trip.\n\n'
     'Steps\n'
     '1. Choose your route and confirm the school or employer is genuine.\n'
     '2. Collect documents: valid passport, photo, application form, plus route papers (admission letter and bank '
     'balance proof for students; labour contract and visa issuance document for EPS workers).\n'
     '3. Apply through the Embassy of the Republic of Korea in Kathmandu or its authorised channel and pay the fee.\n'
     '4. Some long-stay applicants must submit a tuberculosis (TB) test certificate from an approved clinic. Check '
     'the current requirement.\n'
     '5. After arrival, register for your Alien Registration Card (ARC) within 90 days.\n\n'
     'Stay safe\n'
     'Never pay agents who promise guaranteed visas or jobs. EPS workers are selected through the government system. '
     'Confirm every rule on the official sites because requirements change.',
     'VISA_BY_COUNTRY', 'Nepal', 'en', 'https://www.eps.go.kr', TRUE),

    ('India to Korea: Visa Options and Process',
     'How Indian citizens usually come to Korea - as students, skilled workers or visitors - and how to apply.',
     E'Who this is for\n'
     'Indian citizens planning to study, work or visit South Korea. Indian passport holders need a visa before travelling.\n\n'
     'Main routes\n'
     '- Study (D-2 degree, D-4 language): admission letter from a Korean university or language institute.\n'
     '- Skilled work (E-7, E-3 research, D-7 intra-company transfer): sponsored by a Korean employer or your '
     'company, usually requiring a degree or experience.\n'
     '- Visit (C-3): tourism, family or short business trips.\n'
     'India is not among the countries in the E-9 (EPS) factory-work program, so that route is not generally open.\n\n'
     'Steps\n'
     '1. Choose your route and verify the school or employer.\n'
     '2. Prepare passport, photo, application form and route papers (degree certificates, bank statements, '
     'admission letter or employment contract).\n'
     '3. Apply at the Korean Embassy in New Delhi or an authorised Korea Visa Application Centre and pay the fee.\n'
     '4. Some long-stay applicants must submit a tuberculosis (TB) test certificate. Check the current list.\n'
     '5. Register for your Alien Registration Card (ARC) within 90 days of arrival.\n\n'
     'Tips\n'
     'Check that a university is officially recognised on Study in Korea before paying any deposit. '
     'Always confirm requirements on the official sites because they change.',
     'VISA_BY_COUNTRY', 'India', 'en', 'https://www.visa.go.kr', TRUE),

    ('Vietnam to Korea: Visa Options and Process',
     'Study, EPS work and family routes for Vietnamese citizens, with the key steps and safety tips.',
     E'Who this is for\n'
     'Vietnamese citizens planning to study, work or join family in South Korea. A visa is required before travelling.\n\n'
     'Main routes\n'
     '- Study (D-2 degree, D-4 language): admission letter from a Korean school.\n'
     '- Work (E-9, EPS): Vietnam participates in the Employment Permit System. Applicants pass the EPS-TOPIK '
     'Korean test, join the government roster and are matched with an employer.\n'
     '- Skilled work (E-7) and marriage (F-6) for those who qualify.\n'
     '- Visit (C-3): tourism or short visits.\n\n'
     'Steps\n'
     '1. Pick your route and check the school, employer or program is official.\n'
     '2. Prepare passport, photo, form and route documents (admission letter and bank proof, or labour '
     'contract and visa issuance document).\n'
     '3. Apply at the Korean Embassy in Hanoi or the Consulate General in Ho Chi Minh City, or through an '
     'authorised channel.\n'
     '4. Some long-stay applicants must submit a tuberculosis (TB) test certificate.\n'
     '5. Register for your Alien Registration Card (ARC) within 90 days of arrival.\n\n'
     'Stay safe\n'
     'Avoid brokers who ask for large fees. EPS is a government-to-government program and should not need '
     'illegal payments. Confirm rules on the official sites.',
     'VISA_BY_COUNTRY', 'Vietnam', 'en', 'https://www.eps.go.kr', TRUE),

    ('China to Korea: Visa Options and Process',
     'Visit, study, work and ethnic-Korean routes for Chinese citizens and how to apply.',
     E'Who this is for\n'
     'Chinese citizens planning to visit, study or work in South Korea. Check whether a visa is needed for your '
     'travel purpose and city of entry.\n\n'
     'Main routes\n'
     '- Visit (C-3): tourism or short business trips.\n'
     '- Study (D-2 degree, D-4 language): admission letter from a Korean school.\n'
     '- Skilled work (E-7) or family (F-6) for those who qualify.\n'
     '- Ethnic Koreans (Joseonjok) may qualify for the H-2 working visit or the F-4 overseas Korean visa. The '
     'requirements are specific, so verify them with the Korean mission or HiKorea.\n\n'
     'Steps\n'
     '1. Choose your route and verify the sponsor.\n'
     '2. Prepare passport, photo, form and supporting documents.\n'
     '3. Apply at the Korean Embassy or consulate, or through an authorised Korea Visa Application Center in China.\n'
     '4. Some long-stay applicants must submit a tuberculosis (TB) test certificate.\n'
     '5. Register for your Alien Registration Card (ARC) within 90 days if you stay longer.\n\n'
     'Tip\n'
     'Visa rules for Chinese travellers change often. Always check the latest notice before booking.',
     'VISA_BY_COUNTRY', 'China', 'en', 'https://www.visa.go.kr', TRUE),

    ('Philippines to Korea: Visa Options and Process',
     'EPS work, study and visit routes for Filipino citizens, with the government steps explained.',
     E'Who this is for\n'
     'Filipino citizens planning to work, study or visit South Korea. A visa is required before travelling.\n\n'
     'Main routes\n'
     '- Work (E-9, EPS): the Philippines takes part in Korea''s Employment Permit System through the Department of '
     'Migrant Workers (DMW). Applicants pass the EPS-TOPIK Korean test, join the roster and are selected by an employer.\n'
     '- Study (D-2 degree, D-4 language): admission letter from a Korean school.\n'
     '- Skilled work (E-7) and visit (C-3) for those who qualify.\n\n'
     'Steps\n'
     '1. Register through the official government channel for your route and avoid unlicensed agents.\n'
     '2. Prepare passport, photo, form and route documents (labour contract and visa issuance document, or '
     'admission letter and bank proof).\n'
     '3. Apply at the Korean Embassy in Manila or through an authorised channel.\n'
     '4. Some long-stay applicants must submit a tuberculosis (TB) test certificate.\n'
     '5. Register for your Alien Registration Card (ARC) within 90 days of arrival.\n\n'
     'Stay safe\n'
     'Only deal with licensed recruiters and the official government program. Confirm requirements with the '
     'official sites because they change.',
     'VISA_BY_COUNTRY', 'Philippines', 'en', 'https://www.eps.go.kr', TRUE),

    ('Uzbekistan to Korea: Visa Options and Process',
     'EPS work, study and ethnic-Korean routes for citizens of Uzbekistan and how to apply.',
     E'Who this is for\n'
     'Citizens of Uzbekistan planning to work, study or live in South Korea. A visa is required before travelling.\n\n'
     'Main routes\n'
     '- Work (E-9, EPS): Uzbekistan participates in the Employment Permit System. Applicants pass the EPS-TOPIK '
     'Korean test, join the roster and are selected by an employer.\n'
     '- Study (D-2 degree, D-4 language): admission letter from a Korean school.\n'
     '- Ethnic Koreans (Koryo-saram) may qualify for the F-4 overseas Korean or H-2 visa. Eligibility rules are '
     'specific, so verify them with the Korean mission or HiKorea.\n'
     '- Visit (C-3) and skilled work (E-7) for those who qualify.\n\n'
     'Steps\n'
     '1. Choose your route and confirm the school, employer or program is official.\n'
     '2. Prepare passport, photo, form and route documents.\n'
     '3. Apply at the Korean Embassy in Tashkent or through an authorised channel.\n'
     '4. Some long-stay applicants must submit a tuberculosis (TB) test certificate.\n'
     '5. Register for your Alien Registration Card (ARC) within 90 days of arrival.\n\n'
     'Tip\n'
     'Use only official government channels for EPS. Confirm every rule on the official sites.',
     'VISA_BY_COUNTRY', 'Uzbekistan', 'en', 'https://www.eps.go.kr', TRUE),

    ('Bangladesh to Korea: Visa Options and Process',
     'EPS work and study routes for Bangladeshi citizens, with the main steps and safety tips.',
     E'Who this is for\n'
     'Bangladeshi citizens planning to work or study in South Korea. A visa is required before travelling.\n\n'
     'Main routes\n'
     '- Work (E-9, EPS): Bangladesh takes part in the Employment Permit System through the Bureau of Manpower, '
     'Employment and Training (BMET). Applicants pass the EPS-TOPIK Korean test, join the roster and are selected '
     'by an employer.\n'
     '- Study (D-2 degree, D-4 language): admission letter from a Korean school.\n'
     '- Visit (C-3) and skilled work (E-7) for those who qualify.\n\n'
     'Steps\n'
     '1. Register through the official government channel for your route.\n'
     '2. Prepare passport, photo, form and route documents (labour contract and visa issuance document, or '
     'admission letter and bank proof).\n'
     '3. Apply at the Korean Embassy in Dhaka or through an authorised channel.\n'
     '4. Some long-stay applicants must submit a tuberculosis (TB) test certificate.\n'
     '5. Register for your Alien Registration Card (ARC) within 90 days of arrival.\n\n'
     'Stay safe\n'
     'Do not pay brokers for guaranteed jobs. EPS selection runs through the government system. Confirm all rules '
     'on the official sites.',
     'VISA_BY_COUNTRY', 'Bangladesh', 'en', 'https://www.eps.go.kr', TRUE),

    ('Indonesia to Korea: Visa Options and Process',
     'EPS work, study and visit routes for Indonesian citizens and the main application steps.',
     E'Who this is for\n'
     'Indonesian citizens planning to work, study or visit South Korea. A visa is required before travelling.\n\n'
     'Main routes\n'
     '- Work (E-9, EPS): Indonesia participates in the Employment Permit System. Applicants pass the EPS-TOPIK '
     'Korean test, join the roster and are selected by an employer.\n'
     '- Study (D-2 degree, D-4 language): admission letter from a Korean school.\n'
     '- Skilled work (E-7) and visit (C-3) for those who qualify.\n\n'
     'Steps\n'
     '1. Choose your route and confirm the school, employer or program is official.\n'
     '2. Prepare passport, photo, form and route documents.\n'
     '3. Apply at the Korean Embassy in Jakarta or through an authorised channel.\n'
     '4. Some long-stay applicants must submit a tuberculosis (TB) test certificate.\n'
     '5. Register for your Alien Registration Card (ARC) within 90 days of arrival.\n\n'
     'Stay safe\n'
     'Use only licensed recruiters and the official government program. Always confirm requirements on the '
     'official sites.',
     'VISA_BY_COUNTRY', 'Indonesia', 'en', 'https://www.eps.go.kr', TRUE),

    ('United States to Korea: Visa Options and Process',
     'Short visits, English-teaching (E-2), study and overseas-Korean routes for US citizens.',
     E'Who this is for\n'
     'US citizens planning to visit, teach, study or live in South Korea.\n\n'
     'Short visits\n'
     'US citizens can generally enter for a short stay without a visa, but may need to get a K-ETA first. Korea '
     'sometimes grants temporary K-ETA exemptions, so check the official K-ETA site before you travel.\n\n'
     'Long stay routes\n'
     '- Teaching English (E-2): requires a bachelor''s degree, a criminal background check and a health check. The '
     'documents usually need an apostille. The E-2 visa for English teachers is open to citizens of a small list of '
     'English-speaking countries, including the United States, Canada, the United Kingdom, Ireland, Australia, '
     'New Zealand and South Africa.\n'
     '- Study (D-2 degree, D-4 language): admission letter from a Korean school.\n'
     '- Skilled work (E-7) sponsored by an employer.\n'
     '- Overseas Koreans (F-4): Korean-Americans who meet the conditions can apply for a long-term visa with work '
     'freedom.\n\n'
     'Steps\n'
     '1. Choose your route and confirm your employer or school.\n'
     '2. Prepare passport, photo, form and route documents (including apostilled papers for E-2).\n'
     '3. Apply at the Korean Embassy or a Korean Consulate General in the US.\n'
     '4. After arrival, register for your Alien Registration Card (ARC) within 90 days.\n\n'
     'Confirm requirements on the official sites because they change.',
     'VISA_BY_COUNTRY', 'United States', 'en', 'https://www.hikorea.go.kr', TRUE)
) AS v(title, summary, content, category, country, language_code, source_url, published)
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

-- Search filters: category, work days, contract length, perks (equivalent of migration V8).
-- Needs the columns added in schema.sql; safe to re-run.
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

-- ============================================================================
-- 7. MORE LIVING GUIDES (equivalent of migration V9)
-- ============================================================================
INSERT INTO guides (title, summary, content, category, language_code, source_url, published)
SELECT v.title, v.summary, v.content, v.category, v.language_code, v.source_url, v.published
FROM (VALUES

    -- ============================================================ VISA ====
    ('Extending Your Stay and Changing Visa Status',
     'How to extend your period of stay or switch to another visa without falling out of status.',
     E'When to apply\n'
     'Apply for an extension before your permitted stay ends. Immigration usually accepts applications from about '
     'four months before the expiry date. Applying late can lead to fines and problems with future visas.\n\n'
     'How to apply\n'
     '1. Book a visit on HiKorea (hikorea.go.kr) for your local immigration office.\n'
     '2. Bring your passport, Alien Registration Card (ARC), application form, fee stamp and documents for your '
     'visa type (enrolment certificate, employment contract, proof of address and so on).\n'
     '3. After approval, your ARC is updated or reissued.\n\n'
     'Changing status\n'
     'Moving from student to worker, for example, is a change of status and needs permission before you start the '
     'new activity. Do not begin working on a new visa until it is approved.\n\n'
     'Fees\n'
     'Extension and change-of-status fees are set by the Ministry of Justice and are paid with revenue stamps or by '
     'card at the office. Check the current amount on HiKorea.',
     'VISA_IMMIGRATION', 'en', 'https://www.hikorea.go.kr', TRUE),

    ('Reporting Changes: Address, Workplace and School',
     'The changes you must report to immigration, and how soon.',
     E'Moving house\n'
     'Report a new address to immigration or the local community center (jumin center) within 14 days of moving. '
     'This also keeps your ARC, bank and insurance records correct.\n\n'
     'Changing school or workplace\n'
     'Some visa holders must report a change of school, employer or workplace within 15 days. Work visa holders '
     'such as E-7 and E-9 may need prior permission to change employers. Ask your immigration office before you '
     'resign.\n\n'
     'Other changes\n'
     '- A new passport (number or expiry): report it so the details on file match.\n'
     '- Change of name, nationality or marital status: report it with supporting documents.\n\n'
     'How to report\n'
     'Use HiKorea online, visit the immigration office, or call the 1345 Immigration Contact Center for help in '
     'many languages. Missing a deadline can lead to a fine.',
     'VISA_IMMIGRATION', 'en', 'https://www.hikorea.go.kr', TRUE),

    ('Leaving and Re-entering Korea',
     'Travelling abroad with an ARC, and what to do when you leave for good.',
     E'Short trips\n'
     'Most ARC holders can leave and return within their permitted stay without a separate re-entry permit. '
     'Always carry your passport and ARC. Some statuses and special cases still need a permit, so check before you '
     'travel.\n\n'
     'Long absences\n'
     'Staying abroad for a long time can affect your status and your eligibility for later extensions, residence '
     'or citizenship. Ask immigration if you plan to be away for months.\n\n'
     'Leaving for good - checklist\n'
     '- Tell your landlord and settle the deposit and utility bills.\n'
     '- Cancel your phone plan and gym or subscription contracts.\n'
     '- Check pension refund rules for your nationality at the National Pension Service.\n'
     '- Collect your severance pay and year-end tax refund.\n'
     '- Close or transfer your bank account.\n'
     '- Keep copies of your contract, pay slips and tax records.',
     'VISA_IMMIGRATION', 'en', 'https://www.hikorea.go.kr', TRUE),

    ('Permanent Residence (F-5), KIIP and Citizenship Basics',
     'Long-term settlement paths and the free integration program that helps with them.',
     E'KIIP - Korea Immigration and Integration Program\n'
     'A free government program with Korean language and Korean society classes, organised in levels. Completing '
     'it can count towards some residence and naturalisation requirements. Register at socinet.go.kr.\n\n'
     'Permanent residence (F-5)\n'
     'Typically requires several years of legal residence in a qualifying status, stable income, a clean record '
     'and basic Korean and social knowledge. Some skilled workers and investors have different routes.\n\n'
     'Naturalisation (citizenship)\n'
     'General naturalisation usually needs about five years of continuous legal residence, a clean record, '
     'financial stability and passing the integration test or KIIP completion. Korea limits dual nationality in '
     'most cases.\n\n'
     'Requirements are updated often. Confirm the current rules with immigration before you apply.',
     'VISA_IMMIGRATION', 'en', 'https://www.socinet.go.kr', TRUE),

    ('Free Immigration Help: 1345 and Support Centers',
     'Where to get multilingual answers about visas, ARC and living in Korea.',
     E'1345 Immigration Contact Center\n'
     'Government hotline for visa and stay questions, with interpreters for many languages. From abroad, use the '
     'international number listed on HiKorea.\n\n'
     'Foreign Resident Support Centers and Global Centers\n'
     'Cities such as Seoul, Busan, Incheon and Suwon run support centers that offer free counselling, interpreting '
     'and referrals on visas, labour, housing and daily life.\n\n'
     'Embassies\n'
     'Your own embassy in Korea can help with passports, documents and emergencies.\n\n'
     'Beware of paid agents\n'
     'Immigration services are free to contact. Be careful with anyone who promises a guaranteed visa or asks for '
     'cash. Only certified administrative agents may submit applications on your behalf.',
     'VISA_IMMIGRATION', 'en', 'https://www.hikorea.go.kr', TRUE),

    -- ======================================================== HEALTHCARE ==
    ('National Health Insurance for Foreign Residents',
     'Who must join Korea''s National Health Insurance (NHI) and what it covers.',
     E'Who joins\n'
     'Employees are enrolled through their employer from the first day of work. Other long-stay foreign residents '
     'generally become eligible after living in Korea for six months and are enrolled automatically. Short-stay '
     'visa holders are usually not covered.\n\n'
     'Cost\n'
     'Employee premiums are a percentage of salary, split roughly in half with the employer, plus a small '
     'long-term care contribution. Self-enrolled residents pay a premium based on income, property and a minimum '
     'amount.\n\n'
     'What you pay at the clinic\n'
     'With NHI you pay a share of the bill (often 30 percent at clinics and more at large hospitals). Without it, '
     'you pay the full price.\n\n'
     'Tips\n'
     '- Keep your NHI card or app ready at the reception desk.\n'
     '- Ask the National Health Insurance Service (NHIS) in English on 1577-1000.\n'
     '- Report address changes so your bills reach you.',
     'HEALTHCARE', 'en', 'https://www.nhis.or.kr', TRUE),

    ('Emergency Rooms, Ambulances and Late-Night Pharmacies',
     'What to do when you are sick or hurt outside normal clinic hours.',
     E'Serious emergencies - call 119\n'
     '119 connects you to an ambulance and offers interpreting support. Say your location, what happened and the '
     'patient condition.\n\n'
     'Not sure how serious it is?\n'
     'Call 1339 (Disease Control Hotline) for health advice, or the Seoul Global Center 1688-0120 for help in '
     'English and other languages.\n\n'
     'Emergency room (ER)\n'
     'Go to the emergency room of a large hospital. Bring your passport or ARC and insurance card. ER visits cost '
     'more than clinics, especially for mild problems.\n\n'
     'Pharmacies\n'
     'Look for the green cross sign. Many Seoul pharmacies open late, and apps like Naver Map show late-night '
     'pharmacies. Basic medicines are available without a prescription.\n\n'
     'Night and holiday clinics\n'
     'Some city hospitals run night-time pediatric and holiday clinics. Search on Naver Map or ask your city '
     'health center.',
     'HEALTHCARE', 'en', 'https://www.nhis.or.kr', TRUE),

    ('Dentist, Eye Care and Mental Health Support',
     'Common services that are partly or not covered by insurance, and where to find support.',
     E'Dentists\n'
     'Basic cleaning (scaling) and some treatments are partly covered once a year. Implants, braces and cosmetic '
     'work are paid in full. Ask for a written estimate before any treatment.\n\n'
     'Eye care\n'
     'Opticians sell glasses and lenses quickly and at good prices. Eye exams are available at ophthalmology '
     'clinics.\n\n'
     'Mental health\n'
     'Feeling homesick, stressed or low is common. Options include:\n'
     '- 109 suicide and crisis hotline, 24 hours.\n'
     '- Local mental health welfare centers, which offer free counselling.\n'
     '- International clinics and counsellors in Seoul who work in English.\n'
     '- Your university counselling center if you are a student.\n\n'
     'If you or someone near you is in danger, call 119 or 112 immediately.',
     'HEALTHCARE', 'en', 'https://www.nhis.or.kr', TRUE),

    ('Pregnancy, Childbirth and Children''s Vaccinations',
     'Support for expecting parents and young children living in Korea.',
     E'Prenatal care\n'
     'Insured residents receive vouchers that help pay for prenatal checks and delivery costs. Ask your '
     'obstetrician or the NHIS about the pregnancy voucher.\n\n'
     'Giving birth\n'
     'Both public and private hospitals offer maternity care. After birth, register the baby at the local '
     'community center and with your embassy, and report the birth to immigration within 90 days if the child '
     'will stay in Korea.\n\n'
     'Vaccinations\n'
     'The national immunization program provides free or low-cost standard vaccines for children. Book through '
     'your local public health center or a designated clinic and keep the vaccination record.\n\n'
     'Support\n'
     'Danuri (1577-1366) offers counselling in many languages for multicultural families.',
     'HEALTHCARE', 'en', 'https://www.nhis.or.kr', TRUE),

    -- =========================================================== BANKING ==
    ('Sending Money Home Safely',
     'Banks, remittance apps and what to check before you transfer.',
     E'Options\n'
     '- Bank wire transfer: reliable but fees and exchange margins can be high.\n'
     '- Remittance companies and apps (for example GME Remit, Sentbe, WireBarley): often cheaper and faster.\n'
     '- Money transfer counters at some banks and convenience stores.\n\n'
     'Before you send, compare\n'
     '1. The exchange rate, not just the fee.\n'
     '2. Total cost including receiving-side charges.\n'
     '3. Transfer speed and daily or yearly limits.\n'
     '4. Whether the company is licensed in Korea.\n\n'
     'What you need\n'
     'Your ARC, a Korean bank account, and the recipient bank details. Large amounts may require proof of income '
     'or the purpose of transfer.\n\n'
     'Stay safe\n'
     'Never send money to someone you have not met in person who asks for urgent help. Report suspicious messages '
     'to 112 or the Financial Supervisory Service on 1332.',
     'BANKING', 'en', 'https://www.fss.or.kr', TRUE),

    ('Credit Cards, Check Cards and Building Credit',
     'How cards work for newcomers and how to build a credit history in Korea.',
     E'Check card (debit)\n'
     'Most banks issue a check card with your account. It pays straight from your balance and works for T-money '
     'top-ups and online shopping.\n\n'
     'Credit cards\n'
     'Credit cards usually need a stable income and a certain length of stay. Many newcomers start with a check '
     'card and apply for a credit card after several months of employment or study.\n\n'
     'Building credit\n'
     '- Pay phone and utility bills on time.\n'
     '- Keep your address and workplace information up to date.\n'
     '- Avoid cash advances and high-interest loans.\n\n'
     'Payment apps\n'
     'Kakao Pay, Naver Pay and Toss connect to your account and are accepted widely online and in shops.\n\n'
     'Debt help\n'
     'If bills become hard to manage, contact the Credit Counseling and Recovery Service early.',
     'BANKING', 'en', 'https://www.fss.or.kr', TRUE),

    ('Mobile Banking, KakaoBank and Safe Online Payments',
     'Setting up banking apps and avoiding payment scams.',
     E'Banking apps\n'
     'All major banks have apps with English support. Internet-only banks such as KakaoBank and Toss Bank open '
     'accounts with your ARC and a phone in your name.\n\n'
     'Security tools\n'
     'Korean banks often use a security card, OTP device or phone authentication. Keep these safe and never share '
     'your passwords or OTP codes.\n\n'
     'Everyday payments\n'
     '- Bank transfer to another person needs only their account number or phone number in many apps.\n'
     '- Use QR payments in shops and cafes.\n'
     '- Convenience stores and many ATMs work around the clock.\n\n'
     'Watch out for\n'
     '- Text messages with links claiming a package or a fine. Do not click them.\n'
     '- Callers pretending to be police, banks or prosecutors.\n'
     '- Offers to rent out your account. Doing this is illegal and can lead to deportation.',
     'BANKING', 'en', 'https://www.fss.or.kr', TRUE),

    -- =========================================================== HOUSING ==
    ('Gosiwon, One-Room, Share House: Which Is Right for You?',
     'The main kinds of low-cost housing for newcomers and what to expect from each.',
     E'Gosiwon\n'
     'A very small room with a shared kitchen and bathroom. Very low deposit, short contracts and furniture '
     'included. Good for your first weeks, but check noise, windows and cleanliness before you pay.\n\n'
     'One-room (studio)\n'
     'A private room with its own bath and kitchenette. Usually needs a deposit and monthly rent (wolse). Check '
     'what the maintenance fee covers.\n\n'
     'Share house\n'
     'Private room in a shared home. Often furnished and friendly to foreigners, with flexible contracts.\n\n'
     'Dormitory or university housing\n'
     'Cheap and close to campus for students. Apply early because spaces fill quickly.\n\n'
     'Before you sign\n'
     'Visit the room, take photos, read the contract and ask who to call if something breaks. Prices vary widely by '
     'city and neighbourhood.',
     'HOUSING', 'en', 'https://www.molit.go.kr', TRUE),

    ('Rental Contract Checklist: Avoid Deposit Scams',
     'Seven checks to protect your deposit before and after you sign.',
     E'1. Check the owner\n'
     'Ask for the registered title (deungibu deungbon) and confirm the person you pay is the registered owner or '
     'has written authority.\n\n'
     '2. Check debts on the property\n'
     'Mortgages or tax debts can put your deposit at risk.\n\n'
     '3. Use a licensed real estate agent\n'
     'Look for the registered license on the wall.\n\n'
     '4. Read the contract\n'
     'Make sure the deposit, rent, dates and repair responsibilities are written down. Ask someone who reads '
     'Korean to review it.\n\n'
     '5. Pay the deposit to the owner account\n'
     'Not to a personal account of a third party.\n\n'
     '6. Register your move\n'
     'Report your move-in at the community center and get a confirmed date (hwakjeong ilja) on the contract to '
     'protect your deposit.\n\n'
     '7. Consider deposit insurance\n'
     'Housing and Urban Guarantee Corporation (HUG) offers deposit return guarantees for eligible tenants.\n\n'
     'If something goes wrong, contact the Korea Legal Aid Corporation (132) for free legal help.',
     'HOUSING', 'en', 'https://www.khug.or.kr', TRUE),

    ('Utilities, Maintenance Fees and Moving In',
     'Electricity, gas, water, internet and the monthly bills that surprise newcomers.',
     E'Typical monthly bills\n'
     '- Maintenance fee (gwanlibi): shared building costs, sometimes including water or internet.\n'
     '- Electricity: KEPCO, payable by bank auto-debit or at convenience stores.\n'
     '- Gas: city gas billed by the local company; heating in winter is the biggest cost.\n'
     '- Water: often included in the maintenance fee.\n'
     '- Internet and TV: choose a provider and contract length.\n\n'
     'Moving in\n'
     '1. Take dated photos of damage on day one and send them to the landlord.\n'
     '2. Read the meter readings and keep a copy.\n'
     '3. Set up auto-pay to avoid late fees.\n\n'
     'Heating\n'
     'Many homes use ondol (floor heating). Learn how to use the boiler timer to keep gas bills low.\n\n'
     'Moving out\n'
     'Ask for a final meter reading and make sure the deposit return date is in writing.',
     'HOUSING', 'en', 'https://www.molit.go.kr', TRUE),

    ('Student Housing: Dormitories and University Areas',
     'How international students usually find a place to live near campus.',
     E'University dormitory\n'
     'Usually the easiest first choice. Application windows open before each semester, with shared or double rooms '
     'and a meal plan in many universities.\n\n'
     'Off-campus options\n'
     '- Gosiwon: cheap and flexible for a few months.\n'
     '- One-room near campus: more privacy; students often share the deposit with a friend.\n'
     '- Homestay or share house: friendly and often furnished.\n\n'
     'Money-saving tips\n'
     '- Ask your university international office about housing support.\n'
     '- Look in neighbourhoods one or two subway stops away from campus.\n'
     '- Check monthly cost including maintenance fee, not rent alone.\n\n'
     'Keep your address up to date with immigration and the university.',
     'HOUSING', 'en', 'https://www.studyinkorea.go.kr', TRUE),

    -- ========================================================= EMPLOYMENT ==
    ('Minimum Wage, Overtime and Pay Slips',
     'What every worker in Korea must be paid, including foreign workers.',
     E'Minimum wage\n'
     'Korea sets one national minimum hourly wage each year (10,030 KRW in 2025 and 10,320 KRW in 2026). It '
     'applies to citizens and foreigners alike, including part-time and student workers.\n\n'
     'Overtime and night work\n'
     'The standard limit is 8 hours a day and 40 hours a week. Overtime, night work (10 PM to 6 AM) and holiday '
     'work earn an extra 50 percent.\n\n'
     'Weekly holiday allowance\n'
     'If you work at least 15 hours a week, you are entitled to a paid weekly rest day.\n\n'
     'Pay slip\n'
     'Employers must give a written breakdown of your pay. Keep every pay slip and your contract.\n\n'
     'Unpaid wages\n'
     'Call the Ministry of Employment and Labor Call Center on 1350. Interpretation is available in many '
     'languages and filing a complaint is free.',
     'EMPLOYMENT', 'en', 'https://www.moel.go.kr', TRUE),

    ('Labour Contracts and Your Rights at Work',
     'What a Korean employment contract must say and what to do if the employer breaks it.',
     E'Written contract\n'
     'You must receive a written contract that states pay, working hours, workplace, duties, breaks and rest days. '
     'Ask for a copy in a language you understand.\n\n'
     'Your rights\n'
     '- Wages on time and in full.\n'
     '- Rest days and annual leave.\n'
     '- Protection from unfair dismissal.\n'
     '- A safe workplace and compensation for workplace accidents.\n\n'
     'Not allowed\n'
     'Employers must not keep your passport or ARC, force you to pay a deposit, or deduct fines from wages.\n\n'
     'Help\n'
     '- 1350 Ministry of Employment and Labor Call Center.\n'
     '- Foreign Workers Support Centers in many cities.\n'
     '- Korea Legal Aid Corporation (132).\n\n'
     'Keep chat messages, photos of schedules and pay records as evidence.',
     'EMPLOYMENT', 'en', 'https://www.moel.go.kr', TRUE),

    ('Four Major Insurances, Severance and Year-End Tax',
     'The deductions on your pay slip and the money you can get back.',
     E'Four major insurances\n'
     '- National Pension\n'
     '- National Health Insurance\n'
     '- Employment Insurance\n'
     '- Industrial Accident Compensation Insurance, paid by the employer\n'
     'Employers must enrol employees from the first day. Ask your employer if you are covered.\n\n'
     'Severance pay\n'
     'Workers who stay for at least one year and work an average of 15 hours or more a week are entitled to '
     'severance pay when they leave.\n\n'
     'Year-end tax settlement\n'
     'Each January and February employees file for tax deductions through the employer or the Hometax website. A '
     'refund may follow.\n\n'
     'Pension refund\n'
     'Citizens of some countries can claim back their pension contributions when they leave Korea for good, while '
     'others have social security agreements. Check with the National Pension Service.',
     'EMPLOYMENT', 'en', 'https://www.nps.or.kr', TRUE),

    ('Finding a Job: Resume, Interview and Job Sites',
     'Where to search and how to prepare for hiring in Korea.',
     E'Where to search\n'
     '- General job sites such as Saramin and JobKorea.\n'
     '- Part-time job apps and sites such as Albamon and Alba Heaven.\n'
     '- Work24, the government employment portal.\n'
     '- University career centers and foreign community groups.\n\n'
     'Resume\n'
     'Keep it short and clear. Many companies still like a photo, education, experience and language skills, '
     'including TOPIK level.\n\n'
     'Interview\n'
     '- Arrive early and dress neatly.\n'
     '- Prepare a short self-introduction in Korean or English.\n'
     '- Ask about the contract, working hours and visa support.\n\n'
     'Check the visa first\n'
     'Make sure the job is allowed on your visa. Working in a way your status does not permit can lead to fines '
     'and deportation, for you and for the employer.',
     'EMPLOYMENT', 'en', 'https://www.work24.go.kr', TRUE),

    ('E-9 and EPS: Working in Korea Through the Employment Permit System',
     'How non-professional workers come to Korea under the government EPS program.',
     E'What it is\n'
     'EPS is a government program that matches workers from partner countries with Korean small and medium '
     'businesses in manufacturing, agriculture, fishing, construction and services.\n\n'
     'Steps\n'
     '1. Pass the EPS-TOPIK Korean language test in your home country.\n'
     '2. Pass the skills test if required and get listed on the job seeker roster.\n'
     '3. An employer selects you and a standard labour contract is signed.\n'
     '4. Receive the E-9 visa, travel and take the entry training.\n'
     '5. Register for your ARC within 90 days.\n\n'
     'Good to know\n'
     '- Workers may stay for a limited period and extend under the program rules.\n'
     '- Changing workplaces is only possible for permitted reasons and must be reported.\n'
     '- The program is free. Never pay an agent for placement.\n\n'
     'Official information is on EPS (eps.go.kr).',
     'EMPLOYMENT', 'en', 'https://www.eps.go.kr', TRUE),

    -- ========================================================== EDUCATION ==
    ('Studying in Korea: Admission Steps and the D-2 Visa',
     'From choosing a university to getting a student visa.',
     E'Intake\n'
     'Most universities admit in March (spring) and September (fall). Applications open several months earlier.\n\n'
     'Steps\n'
     '1. Pick a university and program on Study in Korea (studyinkorea.go.kr).\n'
     '2. Check language requirements, usually TOPIK for Korean-taught programs and English scores for '
     'English-taught programs.\n'
     '3. Apply with transcripts, diploma, passport and statement of purpose.\n'
     '4. After admission, receive the Standard Admission Letter.\n'
     '5. Apply for the D-2 (degree) or D-4 (language) visa with proof of funds.\n'
     '6. Arrive, register your ARC and enrol.\n\n'
     'Costs\n'
     'Tuition varies by university and major. Many universities offer scholarships to high-performing '
     'international students.\n\n'
     'Check each university for the latest requirements.',
     'EDUCATION', 'en', 'https://www.studyinkorea.go.kr', TRUE),

    ('Global Korea Scholarship (GKS) and Other Scholarships',
     'Government and university funding for international students.',
     E'GKS\n'
     'The Global Korea Scholarship is a Korean government scholarship for international students. It covers '
     'tuition, a monthly allowance, flights and language training. There are undergraduate and graduate tracks. '
     'Applications open once a year through embassies or selected universities.\n\n'
     'University scholarships\n'
     'Many universities reduce tuition for strong grades, high TOPIK scores or admission test results. Ask the '
     'international office what is available.\n\n'
     'Other sources\n'
     '- Private foundations and companies.\n'
     '- Provincial and city scholarships.\n'
     '- Your home country government scholarships.\n\n'
     'Tips\n'
     'Start early, translate documents officially, and read the eligibility rules carefully, because deadlines '
     'are strict. Details are on Study in Korea.',
     'EDUCATION', 'en', 'https://www.studyinkorea.go.kr', TRUE),

    ('Free and Low-Cost Korean Language Classes',
     'Where to learn Korean without spending much.',
     E'Government programs\n'
     '- KIIP: free classes and a path to residence benefits. Register at socinet.go.kr.\n'
     '- Sejong Hakdang: online lessons and learning materials.\n\n'
     'Local centers\n'
     '- Multicultural Family Support Centers and Danuri.\n'
     '- City Global Centers and Foreign Resident Support Centers.\n'
     '- Community centers and libraries, which often run evening classes for a small fee.\n\n'
     'University language institutes\n'
     'Intensive programs on a quarterly basis. They can lead to a D-4 visa.\n\n'
     'Self-study\n'
     '- Prepare for the TOPIK exam with past papers.\n'
     '- Use language exchange meetups and apps.\n'
     '- Practice with coworkers and neighbours.\n\n'
     'Language classes help with jobs, visas and daily life.',
     'EDUCATION', 'en', 'https://www.nuri-sejonghakdang.kr', TRUE),

    ('Schools and Childcare for Foreign Children',
     'How to enrol children in Korean schools or international programs.',
     E'Public schools\n'
     'Foreign children living in Korea can enrol in public elementary and middle schools through the local '
     'education office and the nearest school. Bring your child''s passport, ARC or proof of residence, and '
     'vaccination records.\n\n'
     'Korean language support\n'
     'Some schools run Korean as a second language classes and after-school programs.\n\n'
     'International and private schools\n'
     'English-medium international schools exist in larger cities. They are costly and have their own '
     'admissions process.\n\n'
     'Childcare\n'
     'Daycare centers and kindergartens accept foreign children. Ask your community center about subsidies, which '
     'may depend on visa type and residency.\n\n'
     'Support\n'
     'Danuri (1577-1366) offers help in many languages for multicultural families.',
     'EDUCATION', 'en', 'https://www.danuri.go.kr', TRUE),

    ('Getting Your Foreign Diploma Recognised',
     'Documents you need to prove your degree to Korean universities and employers.',
     E'Why it matters\n'
     'Universities and work visa applications usually require proof that your degree is genuine.\n\n'
     'Typical documents\n'
     '- Original diploma and transcripts.\n'
     '- An apostille or consular legalisation from the issuing country.\n'
     '- Certified translation if the document is not in Korean or English.\n\n'
     'Apostille\n'
     'If your country is part of the Apostille Convention, the authority in your country can add an apostille '
     'stamp. Otherwise, the Korean embassy can legalise the document.\n\n'
     'Plan ahead\n'
     'Getting documents verified can take weeks. Request several copies, scan everything, and ask your '
     'university or employer which version they accept.',
     'EDUCATION', 'en', 'https://www.studyinkorea.go.kr', TRUE),

    -- ====================================================== TRANSPORTATION ==
    ('KTX, Intercity Buses and the Korail Pass',
     'Travelling between cities by train and express bus.',
     E'KTX and other trains\n'
     'KTX is the high-speed train linking Seoul with Busan, Daegu, Gwangju and other cities. Book on the Korail '
     'website or app. Slower trains such as ITX and Mugunghwa cost less.\n\n'
     'Korail Pass\n'
     'Foreign visitors can buy a Korail Pass for unlimited rides over a set number of days. Check if your status '
     'qualifies.\n\n'
     'Express and intercity buses\n'
     'Buses reach almost every town. Book online at Kobus or Bustago, or buy at the terminal. Premium buses have '
     'larger seats.\n\n'
     'Tips\n'
     '- Seats on weekends and holidays sell out, so book early.\n'
     '- Seoul has several bus terminals. Check which one your bus leaves from.\n'
     '- T-money works on many local buses.',
     'TRANSPORTATION', 'en', 'https://www.letskorail.com', TRUE),

    ('Driving in Korea: International Permit and Licence Exchange',
     'Whether you can drive and how to get a Korean licence.',
     E'International Driving Permit\n'
     'Many visitors can drive with an International Driving Permit together with their home licence for a limited '
     'time after arriving. Check the permitted period for your country.\n\n'
     'Exchanging your licence\n'
     'Residents can often exchange a foreign licence for a Korean one at a driver licence exam center, sometimes '
     'with a short test or medical check, depending on the country. Bring your passport, ARC, original licence '
     'and a translation or consular confirmation.\n\n'
     'Rules to know\n'
     '- Drive on the right.\n'
     '- Seat belts are compulsory.\n'
     '- Drink-driving limits are strict.\n'
     '- Motorbike riders need the correct licence class.\n\n'
     'Car insurance is required. Always check with the Road Traffic Authority for current rules.',
     'TRANSPORTATION', 'en', 'https://www.koroad.or.kr', TRUE),

    ('Airports, Taxis, Bikes and Seoul Climate Card',
     'Getting from the airport and around town cheaply.',
     E'Airports\n'
     'Incheon Airport connects to Seoul by the AREX train, airport limousine buses and taxis. Gimpo Airport is '
     'connected by subway.\n\n'
     'Taxis\n'
     'Use the Kakao T app to call a taxi. Standard taxis use a meter and late-night surcharges apply. Deluxe taxis '
     'cost more but have better service.\n\n'
     'Bikes and scooters\n'
     'Seoul runs a public bicycle rental system called Ttareungyi. Shared e-scooters are available in some '
     'areas and require a valid licence in many cases.\n\n'
     'Climate Card\n'
     'Seoul offers a pass for unlimited subway and bus rides for a fixed monthly price. It can save money if you '
     'commute every day.\n\n'
     'T-money works across the country, and some phones support mobile T-money.',
     'TRANSPORTATION', 'en', 'https://www.letskorail.com', TRUE),

    -- ============================================================ DAILY ====
    ('Essential Apps for Life in Korea',
     'The apps almost every foreign resident ends up installing.',
     E'Messaging\n'
     'KakaoTalk is the main chat app used by friends, schools, landlords and many businesses.\n\n'
     'Maps and travel\n'
     'Naver Map and KakaoMap work best in Korea. Kakao T for taxis, and Subway Korea for train routes.\n\n'
     'Translation\n'
     'Papago is a strong Korean-English translator that supports many languages and photo translation.\n\n'
     'Food and shopping\n'
     'Baemin and Coupang Eats deliver meals. Coupang and Naver Shopping deliver goods quickly.\n\n'
     'Money\n'
     'Toss, KakaoBank and your own bank app.\n\n'
     'Official services\n'
     'HiKorea for immigration, Hometax for taxes, and Safe Korea for disaster alerts.\n\n'
     'Create accounts with your real phone number. Many apps require Korean identity verification.',
     'DAILY_LIFE', 'en', 'https://www.visitkorea.or.kr', TRUE),

    ('Garbage, Recycling and Food Waste Rules',
     'How to dispose of trash correctly so you avoid fines.',
     E'Volume-based garbage bags\n'
     'General waste goes in special bags bought at convenience stores and supermarkets. The bag size and colour '
     'depend on the district.\n\n'
     'Recycling\n'
     'Separate paper, plastic, glass, cans and vinyl. Rinse containers and remove labels. Put recycling out on '
     'the days your building allows.\n\n'
     'Food waste\n'
     'Food scraps go in a separate bin or bag. Bones, shells and some peels are general waste, so check the '
     'poster in your building.\n\n'
     'Large items\n'
     'Furniture and appliances need a paid sticker or a booking with the district office.\n\n'
     'Fines\n'
     'Wrong disposal or leaving rubbish out can lead to fines. If you are unsure, ask your landlord or the '
     'building manager.',
     'DAILY_LIFE', 'en', 'https://www.me.go.kr', TRUE),

    ('Groceries, Halal and Vegetarian Food, and Eating Out',
     'Shopping and eating on a budget, including special diets.',
     E'Where to shop\n'
     '- Large marts and local supermarkets.\n'
     '- Traditional markets for fresh produce at lower prices.\n'
     '- Convenience stores for late-night snacks.\n'
     '- Online grocery delivery.\n\n'
     'Mart holidays\n'
     'Many large marts close on certain Sundays each month. Check the sign or the store website.\n\n'
     'Special diets\n'
     'Halal restaurants and markets exist in Seoul (for example near Itaewon) and in some other cities. '
     'Vegetarian options are growing, but many dishes use fish sauce or meat stock, so ask clearly.\n\n'
     'Eating out\n'
     'Many restaurants serve lunch sets at good prices. Tipping is not expected.\n\n'
     'Cooking at home\n'
     'Rice, eggs, tofu and seasonal vegetables are cheap. Foreign grocery stores sell many home ingredients.',
     'DAILY_LIFE', 'en', 'https://www.visitkorea.or.kr', TRUE),

    ('Korean Holidays, Etiquette and Social Customs',
     'Small habits and big holidays that help you fit in.',
     E'Major holidays\n'
     'Seollal (Lunar New Year) and Chuseok (harvest festival) are the biggest. Many shops close, transport is '
     'crowded and tickets sell out weeks ahead.\n\n'
     'Greetings and respect\n'
     '- A slight bow is a polite greeting.\n'
     '- Use both hands when giving or receiving something from an older person.\n'
     '- Take off your shoes at home and in many restaurants.\n\n'
     'At the table\n'
     'Wait for the eldest to start. Do not stick chopsticks upright in rice. Sharing dishes is common.\n\n'
     'Workplace\n'
     'Hierarchy matters, and team dinners (hoesik) are common. You can politely decline if you cannot attend.\n\n'
     'Noise and neighbours\n'
     'Apartments are close together. Keep noise low at night and greet your neighbours.',
     'DAILY_LIFE', 'en', 'https://www.visitkorea.or.kr', TRUE),

    ('Free Support: Global Centers, Danuri and 120 Dasan Call Center',
     'Phone lines and centers that help foreign residents in many languages.',
     E'Seoul Global Center - 1688-0120\n'
     'Free counselling and interpreting for visas, labour, housing, healthcare and daily life.\n\n'
     '120 Dasan Call Center\n'
     'Seoul city information line with interpretation in several languages.\n\n'
     'Danuri - 1577-1366\n'
     'Support for multicultural families, in many languages, 24 hours.\n\n'
     '1345 Immigration Contact Center\n'
     'Visa and stay questions.\n\n'
     '1350 Labor Call Center\n'
     'Wage and workplace complaints.\n\n'
     '1330 Korea Travel Hotline\n'
     'Tourist information and help, in many languages.\n\n'
     'Local city centers\n'
     'Busan, Incheon, Suwon and other cities run similar centers. Search for your city name plus Global Center.\n\n'
     'Numbers and hours may change, so check the official website if a number does not connect.',
     'DAILY_LIFE', 'en', 'https://seoulglobalcenter.kr', TRUE),

    -- ========================================================= EMERGENCY ===
    ('Natural Disasters, Typhoons and Fine Dust',
     'Weather and air-quality risks and how to stay safe.',
     E'Seasons to watch\n'
     '- Monsoon (jangma) from about late June to July brings heavy rain and flooding.\n'
     '- Typhoons usually arrive from July to October.\n'
     '- Heavy snow and cold waves in winter.\n'
     '- Fine dust and yellow dust, mostly in spring.\n\n'
     'Alerts\n'
     'Emergency alert messages are sent to all phones in the area. Keep your phone on and read them, even if you '
     'do not understand Korean, and use Papago to translate.\n\n'
     'What to do\n'
     '- Avoid basement flats and riverside walks during heavy rain.\n'
     '- Stay indoors during typhoons and secure balcony items.\n'
     '- Wear a KF94 mask and check the air quality app on bad air days.\n\n'
     'In an emergency call 119. Safe Korea and the Korea Meteorological Administration publish warnings.',
     'EMERGENCY', 'en', 'https://www.safekorea.go.kr', TRUE),

    ('Voice Phishing and Common Scams',
     'How to recognise scams targeting foreign residents.',
     E'Voice phishing\n'
     'Callers pretend to be police, prosecutors, banks or immigration officers. They claim you broke the law and '
     'ask you to move money to a safe account. Real officials never do this.\n\n'
     'Other scams\n'
     '- Text messages with links about parcels, fines or banking.\n'
     '- Job offers that ask for a fee or your passport.\n'
     '- Fake rental listings with a deposit paid before viewing.\n'
     '- Offers to rent out your bank account or phone, which is illegal.\n\n'
     'If you are targeted\n'
     '1. Hang up and do not click links.\n'
     '2. Call your bank immediately if money was sent.\n'
     '3. Report to the police on 112 and the Financial Supervisory Service on 1332.\n\n'
     'Never share ID photos, OTP codes or app passwords.',
     'EMERGENCY', 'en', 'https://www.fss.or.kr', TRUE),

    ('Lost Passport, ARC or Belongings',
     'What to do step by step if you lose something important.',
     E'Lost items in general\n'
     'Search the Lost112 website of the national police, and contact the subway, bus or taxi company. Many items '
     'are handed in.\n\n'
     'Lost passport\n'
     '1. Report it at a police station and get a report.\n'
     '2. Contact your embassy for an emergency or new passport.\n'
     '3. Tell immigration so your records are updated.\n\n'
     'Lost ARC\n'
     'Apply for a reissue at the immigration office with your passport, photo and fee. Do this quickly.\n\n'
     'Lost bank card or phone\n'
     'Call the bank or your mobile carrier right away to block the card or the SIM.\n\n'
     'Keep digital copies of your passport, ARC and contract in a safe place such as a private cloud folder.',
     'EMERGENCY', 'en', 'https://www.lost112.go.kr', TRUE),

    ('Abuse, Violence and Workplace Harassment: Where to Get Help',
     'Confidential help lines for people in danger or being mistreated.',
     E'In immediate danger\n'
     'Call 112 for the police or 119 for an ambulance.\n\n'
     'Domestic and sexual violence\n'
     'The 1366 Emergency Call Center offers confidential help in many languages, 24 hours. Danuri (1577-1366) '
     'supports multicultural families.\n\n'
     'Workplace abuse and harassment\n'
     'Call the Ministry of Employment and Labor on 1350 or visit a Foreign Workers Support Center. Keep messages, '
     'photos and records as evidence.\n\n'
     'Your visa\n'
     'Victims of violence or labour abuse may have options to keep their stay valid. Ask immigration or the '
     'support center before leaving your sponsor.\n\n'
     'Mental health\n'
     'Call 109 if you feel unsafe or need to talk.\n\n'
     'You are not alone and these services are free.',
     'EMERGENCY', 'en', 'https://www.moel.go.kr', TRUE)

) AS v(title, summary, content, category, language_code, source_url, published)
WHERE NOT EXISTS (SELECT 1 FROM guides g WHERE g.title = v.title);

-- Keep the demo hourly wages at or above the 2026 minimum wage (10,320 KRW).
UPDATE job_listings
SET salary_min = 10320
WHERE salary_period = 'HOURLY'
  AND salary_min IS NOT NULL AND salary_min < 10320
  AND (salary_max IS NULL OR salary_max >= 10320)
  AND posted_by IN (SELECT id FROM users WHERE username = 'admin');

-- More banks in the bank-account guide (equivalent of migration V10).
UPDATE guides
SET content = REPLACE(
        content,
        E'- Hana Bank\n',
        E'- Hana Bank\n'
        '- NH NongHyup Bank\n'
        '- IBK Industrial Bank of Korea\n'
        '- SC First Bank\n'
        '- Post Office Bank (Korea Post bank)\n'
        '- KakaoBank, Toss Bank and K bank (internet-only, app-based)\n')
WHERE title = 'Opening a Korean Bank Account'
  AND content LIKE E'%- Hana Bank\n%'
  AND content NOT LIKE '%NH NongHyup Bank%';

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
