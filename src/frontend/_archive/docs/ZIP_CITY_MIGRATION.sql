-- Safe migration to create cleaned zip_text and city_clean columns
-- 1) Add new columns
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS zip_text TEXT;

ALTER TABLE providers
ADD COLUMN IF NOT EXISTS city_clean TEXT;

-- 2) Update zip_text from zip column, stripping decimals when possible
-- If zip is numeric (float), cast to integer then text to remove .0
-- If zip already text, use it trimmed
UPDATE providers
SET zip_text = CASE
  WHEN zip IS NULL THEN NULL
  WHEN zip::text ~ '^\\d+\\.0+$' THEN (CAST(CAST(zip AS INTEGER) AS TEXT))
  ELSE trim(zip::text)
END;

-- 3) Attempt to populate city_clean where city looks valid (not starting with 'FL ')
UPDATE providers
SET city_clean = NULLIF(trim(city), '')
WHERE city IS NOT NULL AND (city NOT ILIKE 'FL %');

-- 4) For rows where city starts with 'FL ' but zip_text maps to a known city, update using a reference table
-- Create a temporary zip->city mapping table (you can populate this from a CSV)
-- CREATE TABLE zip_to_city (zip TEXT PRIMARY KEY, city TEXT);
-- COPY zip_to_city (zip, city) FROM '/path/to/zip_to_city.csv' CSV HEADER;

-- Then run:
-- UPDATE providers p
-- SET city_clean = z.city
-- FROM zip_to_city z
-- WHERE (p.city ILIKE 'FL %' OR p.city IS NULL) AND p.zip_text = z.zip;

-- 5) Review results before dropping old columns:
-- SELECT id, city, city_clean, zip, zip_text FROM providers WHERE city ILIKE 'FL %' OR zip::text LIKE '%.0';

-- 6) When verified, you can drop the old zip column or keep both for backwards compatibility.
-- ALTER TABLE providers DROP COLUMN zip;
-- ALTER TABLE providers RENAME COLUMN zip_text TO zip;
