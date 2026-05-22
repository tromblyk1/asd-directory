-- Auto-update site_stats.updated_at on every row update.
-- Without this trigger, updated_at only changes when explicitly set
-- (e.g. in the seed upsert), so a bare UPDATE ... SET value = ... leaves
-- the timestamp stale.

CREATE OR REPLACE FUNCTION site_stats_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_stats_set_updated_at ON site_stats;
CREATE TRIGGER site_stats_set_updated_at
  BEFORE UPDATE ON site_stats
  FOR EACH ROW
  EXECUTE FUNCTION site_stats_set_updated_at();
