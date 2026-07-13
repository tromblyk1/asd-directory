-- Adds sponsorship fields to blog_posts so a guide can be marked as a
-- "Partner Guide" — paid placement with prominent attribution to a sponsor.
--
-- Run this once in the Supabase SQL editor before publishing any sponsored
-- guides. Safe to re-run — uses IF NOT EXISTS guards.
--
-- Frontend code already reads these columns; until the columns exist they
-- simply return null/false and the page renders as a regular guide.

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_sponsored boolean DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS sponsor_name text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS sponsor_url  text;

-- Optional: backfill any existing rows so is_sponsored is never NULL.
UPDATE blog_posts SET is_sponsored = false WHERE is_sponsored IS NULL;

-- Optional: a partial index speeds up queries that want only sponsored posts.
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_sponsored
  ON blog_posts (is_sponsored)
  WHERE is_sponsored = true;
