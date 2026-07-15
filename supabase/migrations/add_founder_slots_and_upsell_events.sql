-- Founder slot tracking + upsell event support
INSERT INTO site_stats (key, value) VALUES ('founder_slots_remaining', '9')
ON CONFLICT (key) DO NOTHING;

-- Upsell events fire before any resource row exists
ALTER TABLE listing_events ALTER COLUMN resource_id DROP NOT NULL;

-- Atomic decrement used by the Stripe webhook (service role only)
CREATE OR REPLACE FUNCTION decrement_founder_slots() RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE site_stats
  SET value = GREATEST(0, value::int - 1)::text
  WHERE key = 'founder_slots_remaining';
$$;
REVOKE EXECUTE ON FUNCTION decrement_founder_slots() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION decrement_founder_slots() TO service_role;
