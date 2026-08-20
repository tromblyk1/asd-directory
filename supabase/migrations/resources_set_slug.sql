-- Generate resources.slug on INSERT when it is omitted.
--
-- WHY: `slug` is nullable, has no default, and no trigger generated it. Postgres
-- UNIQUE indexes permit unlimited NULLs, so `resources_slug_key` never blocked a
-- slugless row. Any INSERT that omitted the column succeeded silently and produced
-- a row unreachable by /providers/:slug and absent from the sitemap. Twelve rows
-- reached production that way, from at least two unrelated insert paths.
--
-- CONVENTION: reverse-engineered from the 3,097 provider slugs ending in -fl-{id};
-- the expression below reproduces 3,065 of them byte-for-byte. The 32 residuals are
-- name-or-city drift after the slug was frozen, not a further rule.
--
--   slugify(name) || '-' || slugify(canonical_city) || '-fl-' || id
--
-- slugify = drop every character except [A-Za-z0-9], space and hyphen, inserting NO
-- separator in their place (A&M -> am, CCC/SLP -> cccslp, Dr.MVMNT -> drmvmnt,
-- Deia -> dei); lowercase; collapse space/hyphen runs to a single '-'; trim.
--
-- The historical generator used `city`, not `canonical_city` (it scores 3,065 vs
-- 3,051). That 14-row gap is precisely the legacy drift canonical_city exists to
-- correct — "Saint Petersburg" vs "ST. PETERSBURG", "Mt. Dora" vs "MOUNT DORA" —
-- so new slugs use canonical_city and will differ from what the old script would
-- have produced for those few cities. That is intended.
--
-- ============================================================================
-- ORDERING DEPENDENCY — READ BEFORE RENAMING EITHER TRIGGER
-- ============================================================================
-- Postgres fires triggers of the same timing in ALPHABETICAL ORDER BY TRIGGER NAME.
-- This trigger reads NEW.canonical_city, which is populated by a separate BEFORE
-- INSERT trigger:
--
--   resources_set_canonical_city   BEFORE INSERT OR UPDATE   <-- must fire first
--   resources_set_slug             BEFORE INSERT
--
-- It works only because 'resources_set_c...' sorts before 'resources_set_s...'.
--
-- Renaming either trigger to break that ordering FAILS SILENTLY: canonical_city
-- would still be NULL when this reads it, so slugify() returns '' for the city
-- part, and every new slug comes out as "name-fl-{id}" with the city segment
-- missing. No error, no constraint violation — just permanently wrong slugs, and
-- slugs are permanent once set. If you rename one, rename both and re-verify the
-- sort order.
-- ============================================================================
--
-- NEW.id IS AVAILABLE HERE. Postgres applies column defaults before row-level
-- BEFORE INSERT triggers fire, so NEW.id is already drawn from
-- nextval('resources_id_seq'). No AFTER INSERT pass and no generated column are
-- needed (a generated column could not do this regardless — it may not reference
-- other generated values).
--
-- Because the id is part of every generated slug, collisions are impossible by
-- construction and no retry loop is required.
--
-- SCOPE: providers only. Curation deliberately holds non-provider rows with
-- unusable names — id 9800, resource_type='educational', name 'Physical Therapy'
-- — at NULL slug pending a real name. Auto-slugging those would remove curation's
-- veto over a value that cannot be changed later.

CREATE OR REPLACE FUNCTION public.resources_slugify(txt text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT btrim(
           regexp_replace(
             lower(regexp_replace(coalesce(txt, ''), '[^a-zA-Z0-9[:space:]-]', '', 'g')),
             '[[:space:]-]+', '-', 'g'),
           '-');
$$;

CREATE OR REPLACE FUNCTION public.resources_set_slug()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  parts text[];
BEGIN
  IF NEW.resource_type IS DISTINCT FROM 'provider' THEN
    RETURN NEW;
  END IF;

  IF NEW.slug IS NOT NULL AND btrim(NEW.slug) <> '' THEN
    RETURN NEW;                       -- an explicit slug always wins
  END IF;

  parts := ARRAY(
    SELECT p FROM unnest(ARRAY[
      public.resources_slugify(NEW.name),
      public.resources_slugify(NEW.canonical_city)
    ]) AS p WHERE p <> ''
  );

  IF cardinality(parts) = 0 THEN
    RAISE EXCEPTION
      'resources_set_slug: name and canonical_city both slugify to empty; refusing to create a bare "-fl-%" slug', NEW.id;
  END IF;

  NEW.slug := array_to_string(parts, '-') || '-fl-' || NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER resources_set_slug
  BEFORE INSERT ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.resources_set_slug();
