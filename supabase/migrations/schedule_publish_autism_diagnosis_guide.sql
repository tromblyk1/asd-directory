-- Schedules the Florida autism diagnosis guide to go live on Mon Aug 17, 2026 at 12:05 UTC (8:05am ET).
--
-- The guide row is inserted unpublished by write_florida_autism_diagnosis_guide.sql. Site content is
-- fetched from Supabase at runtime, so flipping `published` is all that's needed — no rebuild/deploy.
--
-- Schedule is '5 12 17 8 *' (Aug 17, annually) rather than a true one-shot. The `published = false`
-- guard makes every firing after the first a no-op, so the annual repeat is harmless and the job
-- never re-stamps updated_at. Safe to `SELECT cron.unschedule('publish-autism-diagnosis-guide');`
-- once the guide is live.

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'publish-autism-diagnosis-guide',
  '5 12 17 8 *',
  $job$
    UPDATE blog_posts
    SET published = true
    WHERE slug = 'florida-autism-diagnosis-guide'
      AND published = false;
  $job$
);
