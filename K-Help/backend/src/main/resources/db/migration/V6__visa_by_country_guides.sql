-- ============================================================================
-- V6: "Visa by Country" guides
-- Adds a nullable guides.country column, the VISA_BY_COUNTRY topic, and seed
-- guides explaining how citizens of different countries come to Korea.
-- Mirrors database/schema.sql and database/data.sql.
-- ============================================================================

ALTER TABLE guides ADD COLUMN IF NOT EXISTS country VARCHAR(60);

ALTER TABLE guides DROP CONSTRAINT IF EXISTS chk_guides_category;
ALTER TABLE guides
    ADD CONSTRAINT chk_guides_category CHECK (category IN (
        'VISA_IMMIGRATION', 'VISA_BY_COUNTRY', 'HEALTHCARE', 'BANKING', 'HOUSING',
        'EMPLOYMENT', 'EDUCATION', 'EMERGENCY', 'TRANSPORTATION', 'DAILY_LIFE'));

CREATE INDEX IF NOT EXISTS idx_guides_country ON guides (country);

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
