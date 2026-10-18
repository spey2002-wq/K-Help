-- ============================================================================
-- V9: More Korea Living Guides
-- Adds practical guides to every topic (visa, healthcare, banking, housing,
-- employment, education, transport, daily life, emergency).
-- Figures and phone numbers are summaries; each guide points to an official
-- source and the UI reminds readers to confirm current rules.
-- Mirrors database/data.sql.
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
