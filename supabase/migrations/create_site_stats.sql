-- Creates a simple key/value table for editable site stats (e.g., Google
-- Search Console numbers shown on /featured and /featured-daycares).
--
-- Run this once in the Supabase SQL editor. Safe to re-run — uses
-- IF NOT EXISTS guards and ON CONFLICT upserts.
--
-- After this, updating a stat is a one-line SQL — no rebuild needed:
--   UPDATE site_stats SET value = '240K' WHERE key = 'featured_impressions_3mo';

CREATE TABLE IF NOT EXISTS site_stats (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Public read access (anon key). No write policy — updates happen via SQL editor / service role.
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON site_stats;
CREATE POLICY "Public read access" ON site_stats
  FOR SELECT
  USING (true);

-- Seed the current values used on /featured and /featured-daycares.
INSERT INTO site_stats (key, value) VALUES
  ('featured_impressions_3mo',       '230K'),
  ('featured_clicks_3mo',            '4,280'),
  ('featured_ctr_3mo',               '1.9%'),
  ('featured_impressions_per_month', '76K+'),
  ('featured_clicks_per_month',      '1,425+'),
  ('featured_audience_focus',        '100%'),
  ('hero_providers_count',           '3,300+'),
  ('hero_daycares_count',            '250+')
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = now();
