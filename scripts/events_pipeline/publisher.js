// Publish events into the Supabase `events` table.
//
// Idempotency strategy: deterministic slug (title + date + city). Before insert,
// SELECT by slug; if a row exists we SKIP it. This is conservative — once a row
// is in the table the operator may have hand-edited fields like `featured`,
// `verification_status`, `verification_notes`, etc., and we don't want to clobber
// them. To force a refresh, delete the row in Supabase and re-run.

import { createClient } from '@supabase/supabase-js';
import { log } from './lib/logger.js';
import { eventSlug, clampText } from './lib/util.js';

function toRow(ev) {
  const slug = eventSlug({ title: ev.title, date: ev.date, city: ev.city });

  // Build a clean source_references string we can stuff into the existing
  // `source_references` text column for provenance.
  const refs = [
    ev.source ? `source: ${ev.source}` : null,
    ev.sourceType ? `type: ${ev.sourceType}` : null,
    ev.sourceUrl ? `url: ${ev.sourceUrl}` : null,
  ].filter(Boolean).join(' | ');

  return {
    title: clampText(ev.title, 500),
    description: ev.description || null,
    date: ev.date,
    end_date: ev.endDate || null,
    time: ev.time || null,
    city: ev.city || 'Unknown',  // city is NOT NULL — last-resort fallback
    state: ev.state || 'FL',
    zip_code: ev.zipCode || null,
    county: ev.county || null,
    address: ev.address || null,
    venue_name: ev.venueName || null,
    category: ev.category || null,
    age_groups: ev.ageGroups || null,
    cost: ev.cost || null,
    is_free: typeof ev.isFree === 'boolean' ? ev.isFree : null,
    registration_url: ev.registrationUrl || null,
    website_url: ev.websiteUrl || null,
    organizer_name: ev.organizerName || null,
    source_references: refs || null,
    slug,
    verification_status: 'unverified',
    verification_source: ev.sourceUrl || null,
  };
}

export async function publish(events) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    log.error('publisher: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — refusing to publish');
    return { inserted: 0, skipped: 0, failed: events.length };
  }
  if (events.length === 0) {
    log.info('publisher: nothing to publish');
    return { inserted: 0, skipped: 0, failed: 0 };
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let inserted = 0, skipped = 0, failed = 0;

  // Probe existing slugs in one query to minimize round trips.
  const slugs = events.map((e) => eventSlug({ title: e.title, date: e.date, city: e.city }));
  const { data: existingRows, error: selErr } = await supabase
    .from('events')
    .select('slug')
    .in('slug', slugs);

  if (selErr) {
    log.error('publisher: existence check failed', { err: selErr.message });
    return { inserted: 0, skipped: 0, failed: events.length };
  }
  const existing = new Set((existingRows || []).map((r) => r.slug));

  const toInsert = [];
  for (const ev of events) {
    const row = toRow(ev);
    if (existing.has(row.slug)) {
      skipped++;
      continue;
    }
    toInsert.push(row);
  }

  if (toInsert.length === 0) {
    log.info('publisher: all events already present', { skipped });
    return { inserted: 0, skipped, failed: 0 };
  }

  // Insert in a single batch. Supabase will reject the whole batch on error,
  // so we fall back to per-row insert if the batch fails.
  const { data, error } = await supabase.from('events').insert(toInsert).select('id, slug');
  if (error) {
    log.warn('publisher: batch insert failed, falling back to per-row', { err: error.message });
    for (const row of toInsert) {
      const { error: rowErr } = await supabase.from('events').insert(row);
      if (rowErr) {
        failed++;
        log.error('publisher: row insert failed', { slug: row.slug, err: rowErr.message });
      } else {
        inserted++;
      }
    }
  } else {
    inserted = data?.length || toInsert.length;
  }

  log.info('publisher: done', { inserted, skipped, failed });
  return { inserted, skipped, failed };
}
