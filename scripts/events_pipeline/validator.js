// Drop past events; require Florida; require autism relevance.
//
// Input: a mix of tier1 records ({title, date, time, location, description, sourceUrl, sourceType, source})
//        and tier2 records ({title, date, time, city, address, …, category, sourceUrl, sourceType}).
// Output: normalized records with consistent fields ready for the deduper.

import { log } from './lib/logger.js';
import { looksLikeFlorida, looksLikeAutism, todayIso } from './lib/util.js';

function normalize(ev) {
  // Tier1 events have no city — try to extract it from the location string.
  let city = ev.city || null;
  let address = ev.address || null;
  let state = ev.state || null;
  if (!city && ev.location) {
    // Common iCal location format: "Venue, 123 Street, City, FL 32801"
    address = address || ev.location;
    const parts = ev.location.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      // Look for "FL <zip>" or "Florida <zip>" near the end and grab the part before it as city.
      const stateIdx = parts.findIndex((p) => /^(fl|florida)(\s+\d{5})?$/i.test(p));
      if (stateIdx > 0) {
        city = parts[stateIdx - 1];
        state = 'FL';
      } else {
        // fallback: second-to-last token is often the city
        city = parts[parts.length - 2] || parts[parts.length - 1];
      }
    }
  }

  return {
    title: ev.title,
    date: ev.date,
    endDate: ev.endDate || null,
    time: ev.time || null,
    city: city || null,
    venueName: ev.venueName || null,
    address: address,
    state: state || (looksLikeFlorida({ city, address, location: ev.location, description: ev.description }) ? 'FL' : null),
    zipCode: ev.zipCode || null,
    county: ev.county || null,
    description: ev.description || null,
    category: ev.category || null,
    ageGroups: ev.ageGroups || null,
    cost: ev.cost || null,
    isFree: ev.isFree ?? null,
    registrationUrl: ev.registrationUrl || null,
    websiteUrl: ev.websiteUrl || null,
    organizerName: ev.organizerName || ev.source || null,
    sourceUrl: ev.sourceUrl || null,
    sourceType: ev.sourceType || 'unknown',
    source: ev.source || null,
  };
}

export function validate(events) {
  const today = todayIso();
  const out = [];
  let droppedPast = 0, droppedNotFL = 0, droppedNotAutism = 0, droppedBad = 0;

  for (const raw of events) {
    if (!raw || !raw.title || !raw.date) { droppedBad++; continue; }
    const ev = normalize(raw);

    if (ev.date < today) { droppedPast++; continue; }

    if (!looksLikeFlorida({
      state: ev.state, city: ev.city, address: ev.address,
      description: ev.description, location: raw.location,
    })) { droppedNotFL++; continue; }

    if (!looksLikeAutism({ title: ev.title, description: ev.description, category: ev.category })) {
      droppedNotAutism++; continue;
    }

    // Default state to FL if we made it here without one set.
    if (!ev.state) ev.state = 'FL';

    out.push(ev);
  }

  log.info('validator: results', {
    in: events.length, out: out.length,
    droppedPast, droppedNotFL, droppedNotAutism, droppedBad,
  });
  return out;
}
