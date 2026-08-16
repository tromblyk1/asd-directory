-- Adds resources.canonical_city: a normalized city value safe for slug/landing-page generation.
-- The raw `city` column is left untouched so the original import data stays auditable.
-- Audit that produced this mapping: Research/city_normalization_audit_2026-08-16.md

ALTER TABLE resources ADD COLUMN IF NOT EXISTS canonical_city text;

-- 1. Baseline: canonical mirrors the raw value, trimmed and uppercased.
UPDATE resources
SET canonical_city = upper(btrim(city))
WHERE city IS NOT NULL AND btrim(city) <> '';

-- 2. Merge spelling/abbreviation variants of the same municipality.
--    County values already use the "ST." form, so cities standardize on it too.
UPDATE resources SET canonical_city = 'ST. PETERSBURG'
  WHERE canonical_city IN ('SAINT PETERSBURG', 'ST PETERSBURG');
UPDATE resources SET canonical_city = 'ST. AUGUSTINE'
  WHERE canonical_city IN ('SAINT AUGUSTINE', 'ST AUGUSTINE');
UPDATE resources SET canonical_city = 'ST. CLOUD'
  WHERE canonical_city IN ('SAINT CLOUD', 'ST CLOUD');
UPDATE resources SET canonical_city = 'ST. JOHNS'
  WHERE canonical_city IN ('SAINT JOHNS', 'ST JOHNS');
UPDATE resources SET canonical_city = 'PORT ST. LUCIE'
  WHERE canonical_city IN ('PORT SAINT LUCIE', 'PORT ST LUCIE');
UPDATE resources SET canonical_city = 'MOUNT DORA'
  WHERE canonical_city IN ('MT. DORA', 'MT DORA');
UPDATE resources SET canonical_city = 'MIRAMAR'
  WHERE canonical_city = 'MIRAMAR, FLORIDA';
UPDATE resources SET canonical_city = 'SOUTHWEST RANCHES'
  WHERE canonical_city = 'SW RANCHES';
UPDATE resources SET canonical_city = 'APOPKA'
  WHERE canonical_city = 'APOKA';

-- LAKE WORTH and LAKE WORTH BEACH are deliberately NOT merged: legally distinct
-- municipalities, both names in live search use.

-- 3. Column-offset import damage: an address continuation line landed in `city`.
--    Resolved from the row's own zip/county/address.
UPDATE resources SET canonical_city = 'LAKELAND'            WHERE id = 10161; -- 'B2'
UPDATE resources SET canonical_city = 'TALLAHASSEE'         WHERE id = 8596;  -- 'Bldg. A'
UPDATE resources SET canonical_city = 'PALM BEACH GARDENS'  WHERE id = 10168; -- 'Legacy Pl'
UPDATE resources SET canonical_city = 'MIRAMAR'             WHERE id = 10245; -- 'Room 204'
UPDATE resources SET canonical_city = 'JACKSONVILLE'        WHERE id = 9721;  -- 'Second Floor'
UPDATE resources SET canonical_city = 'JACKSONVILLE'        WHERE id = 9858;  -- 'Second Floor'

-- 4. Other non-city values that resolve to a real city.
UPDATE resources SET canonical_city = 'ORLANDO'     WHERE id = 9794; -- 'Fl 32816' (UCF)
UPDATE resources SET canonical_city = 'MIRAMAR'     WHERE id = 6229; -- 'Miramar, Florida'
UPDATE resources SET canonical_city = 'TALLAHASSEE' WHERE id = 8475; -- 'Psychology Dept Bldg' (FSU)

-- 5. Genuinely statewide / county-wide / virtual providers. NULL is deliberate:
--    these must be excluded from city landing pages.
UPDATE resources SET canonical_city = NULL WHERE id IN (
  10587, -- 'Broward County'
  10473, -- 'Florida'
  10474, -- 'Multiple FL locations'
  10578, -- 'Remote'
  10567  -- 'Tampa Bay Area'
);
