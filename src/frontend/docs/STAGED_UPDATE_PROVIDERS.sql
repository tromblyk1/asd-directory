-- Staged update: updates only providers with placeholder city (starts with 'FL ') or NULL/empty city
WITH updates(zip, city) AS (VALUES

)
UPDATE providers p SET city_clean = u.city, zip_text = u.zip FROM updates u WHERE (p.city ILIKE 'FL %' OR p.city IS NULL OR trim(p.city) = '') AND (trim(COALESCE(p.zip::text,'')) = u.zip OR p.zip::text LIKE u.zip || '.%');