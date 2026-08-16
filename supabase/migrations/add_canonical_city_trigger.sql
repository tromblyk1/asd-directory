-- Keeps resources.canonical_city populated automatically. The Phase 2 backfill
-- (add_canonical_city_to_resources.sql) was one-shot, so rows inserted afterwards had a NULL
-- canonical_city and silently dropped out of city landing pages.

CREATE OR REPLACE FUNCTION public.canonicalize_city(raw text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v text;
BEGIN
  IF raw IS NULL OR btrim(raw) = '' THEN
    RETURN NULL;
  END IF;

  v := upper(btrim(raw));
  v := regexp_replace(v, ',\s*(FLORIDA|FL)$', '');
  v := btrim(v);

  -- Not a municipality. NULL means "no city", which excludes the row from city pages
  -- while leaving it eligible for county and virtual-therapy pages.
  IF v LIKE '% COUNTY'
     OR v IN ('FLORIDA', 'FL', 'REMOTE', 'VIRTUAL', 'ONLINE', 'STATEWIDE',
              'MULTIPLE FL LOCATIONS', 'TAMPA BAY AREA') THEN
    RETURN NULL;
  END IF;

  -- Cities standardize on the "ST." form because the county column already does.
  RETURN CASE v
    WHEN 'SAINT PETERSBURG'  THEN 'ST. PETERSBURG'
    WHEN 'ST PETERSBURG'     THEN 'ST. PETERSBURG'
    WHEN 'SAINT AUGUSTINE'   THEN 'ST. AUGUSTINE'
    WHEN 'ST AUGUSTINE'      THEN 'ST. AUGUSTINE'
    WHEN 'SAINT CLOUD'       THEN 'ST. CLOUD'
    WHEN 'ST CLOUD'          THEN 'ST. CLOUD'
    WHEN 'SAINT JOHNS'       THEN 'ST. JOHNS'
    WHEN 'ST JOHNS'          THEN 'ST. JOHNS'
    WHEN 'PORT SAINT LUCIE'  THEN 'PORT ST. LUCIE'
    WHEN 'PORT ST LUCIE'     THEN 'PORT ST. LUCIE'
    WHEN 'MT. DORA'          THEN 'MOUNT DORA'
    WHEN 'MT DORA'           THEN 'MOUNT DORA'
    WHEN 'SW RANCHES'        THEN 'SOUTHWEST RANCHES'
    WHEN 'APOKA'             THEN 'APOPKA'
    ELSE v
  END;
END;
$$;

-- LAKE WORTH and LAKE WORTH BEACH are deliberately absent above: legally distinct
-- municipalities, both names in live search use.

CREATE OR REPLACE FUNCTION public.resources_set_canonical_city()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- An explicit canonical_city on insert wins.
    IF NEW.canonical_city IS NULL THEN
      NEW.canonical_city := public.canonicalize_city(NEW.city);
    END IF;
  ELSIF NEW.city IS DISTINCT FROM OLD.city
        AND NEW.canonical_city IS NOT DISTINCT FROM OLD.canonical_city THEN
    -- Recompute only when city actually changed. Updating unrelated columns must not
    -- overwrite a hand-corrected value, and must not resurrect a deliberate NULL.
    NEW.canonical_city := public.canonicalize_city(NEW.city);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS resources_set_canonical_city ON resources;

CREATE TRIGGER resources_set_canonical_city
BEFORE INSERT OR UPDATE ON resources
FOR EACH ROW
EXECUTE FUNCTION public.resources_set_canonical_city();
