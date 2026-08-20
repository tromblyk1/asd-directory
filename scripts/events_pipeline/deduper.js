// Merge tier1 + tier2 events.
// Match by (normalized title, start date, location similarity).
// Keep the record with the richest description; merge useful fields from the loser.

import { log } from './lib/logger.js';
import { normalizeTitle } from './lib/util.js';

function locKey(ev) {
  // Loose location key — city is the strongest signal that's reliably present.
  return (ev.city || '').toLowerCase().trim();
}

function matchKey(ev) {
  return `${normalizeTitle(ev.title)}|${ev.date}|${locKey(ev)}`;
}

function preferLonger(a, b) {
  return ((a || '').length >= (b || '').length) ? a : b;
}

function mergePair(keep, drop) {
  // Keep the one with the longer description; fill nulls from the other.
  const winner = (keep.description?.length || 0) >= (drop.description?.length || 0) ? keep : drop;
  const loser  = winner === keep ? drop : keep;
  const merged = { ...winner };
  for (const k of Object.keys(loser)) {
    if (merged[k] == null && loser[k] != null) merged[k] = loser[k];
  }
  // Description: prefer longer.
  merged.description = preferLonger(winner.description, loser.description);
  // sourceType: tier1 (real feed) wins over tier2-research for provenance.
  if ([winner.sourceType, loser.sourceType].includes('ical')) merged.sourceType = 'ical';
  else if ([winner.sourceType, loser.sourceType].includes('rss')) merged.sourceType = 'rss';
  return merged;
}

export function dedupe(events) {
  const byKey = new Map();
  for (const ev of events) {
    const key = matchKey(ev);
    if (byKey.has(key)) {
      byKey.set(key, mergePair(byKey.get(key), ev));
    } else {
      byKey.set(key, ev);
    }
  }
  const out = Array.from(byKey.values());
  log.info('deduper: merged', { in: events.length, out: out.length });
  return out;
}
