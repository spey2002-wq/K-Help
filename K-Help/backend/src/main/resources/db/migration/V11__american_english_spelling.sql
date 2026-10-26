-- V11: Use one spelling convention (American English) in the seeded guides and jobs.
-- Earlier seed files mixed British and American spellings (for example "licence"
-- next to "center"). Those files are already applied, so the fix is a new migration.

CREATE FUNCTION pg_temp.americanize(input TEXT) RETURNS TEXT AS $$
DECLARE
    result TEXT := input;
    pair   TEXT[];
    pairs  TEXT[][] := ARRAY[
        ['travellers', 'travelers'], ['Travellers', 'Travelers'],
        ['traveller',  'traveler'],  ['Traveller',  'Traveler'],
        ['travelling', 'traveling'], ['Travelling', 'Traveling'],
        ['authorised', 'authorized'], ['Authorised', 'Authorized'],
        ['recognised', 'recognized'], ['Recognised', 'Recognized'],
        ['recognise',  'recognize'],  ['Recognise',  'Recognize'],
        ['licences',   'licenses'],   ['Licences',   'Licenses'],
        ['licence',    'license'],    ['Licence',    'License'],
        ['organised',  'organized'],  ['Organised',  'Organized'],
        ['naturalisation', 'naturalization'], ['Naturalisation', 'Naturalization'],
        ['neighbourhoods', 'neighborhoods'], ['neighbourhood', 'neighborhood'],
        ['neighbours', 'neighbors'], ['neighbour', 'neighbor'],
        ['legalisation', 'legalization'], ['Legalisation', 'Legalization'],
        ['legalise',   'legalize'],
        ['colours',    'colors'],     ['colour',     'color'],
        ['enrolment',  'enrollment'], ['enrol',      'enroll'],
        ['Centre',     'Center'],     ['centre',     'center']
    ];
BEGIN
    IF input IS NULL THEN
        RETURN NULL;
    END IF;
    FOREACH pair SLICE 1 IN ARRAY pairs LOOP
        -- \m and \M match word boundaries, so "enroll" is never turned into "enrolll".
        result := regexp_replace(result, '\m' || pair[1] || '\M', pair[2], 'g');
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

UPDATE guides
SET title   = pg_temp.americanize(title),
    summary = pg_temp.americanize(summary),
    content = pg_temp.americanize(content)
WHERE title   <> pg_temp.americanize(title)
   OR summary <> pg_temp.americanize(summary)
   OR content <> pg_temp.americanize(content);

UPDATE job_listings
SET title        = pg_temp.americanize(title),
    description  = pg_temp.americanize(description),
    requirements = pg_temp.americanize(requirements)
WHERE title        <> pg_temp.americanize(title)
   OR description  <> pg_temp.americanize(description)
   OR requirements <> pg_temp.americanize(requirements);
