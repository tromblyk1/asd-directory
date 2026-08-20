// Tier 1: pull events from operator-curated iCal/RSS feeds.
//
// feeds.json shape:
// {
//   "feeds": [
//     { "url": "https://example.org/events.ics", "type": "ical", "source": "Example Org" },
//     { "url": "https://example.org/feed.rss",  "type": "rss",  "source": "Example Org" }
//   ]
// }
//
// "type" is optional — we sniff it from the URL/content if missing.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ical from 'node-ical';
import RssParser from 'rss-parser';
import { log } from './lib/logger.js';
import { toIsoDate, toTimeString, clampText } from './lib/util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEEDS_PATH = path.resolve(__dirname, 'feeds.json');

const rss = new RssParser({
  timeout: 15000,
  headers: { 'User-Agent': 'floridaautismservices.com events bot' },
});

async function loadFeeds() {
  try {
    const raw = await fs.readFile(FEEDS_PATH, 'utf8');
    const cfg = JSON.parse(raw);
    return Array.isArray(cfg) ? cfg : (cfg.feeds || []);
  } catch (err) {
    log.warn('tier1: feeds.json missing or invalid — treating as empty', { err: String(err) });
    return [];
  }
}

function sniffType(url, body) {
  if (/\.ics(\?|$)/i.test(url)) return 'ical';
  if (/\.(rss|atom|xml)(\?|$)/i.test(url)) return 'rss';
  if (body && body.startsWith('BEGIN:VCALENDAR')) return 'ical';
  if (body && /<rss|<feed/i.test(body.slice(0, 400))) return 'rss';
  return null;
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'floridaautismservices.com events bot' },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function parseIcal(body, source, sourceUrl) {
  const data = ical.sync.parseICS(body);
  const events = [];
  for (const k of Object.keys(data)) {
    const ev = data[k];
    if (!ev || ev.type !== 'VEVENT') continue;
    if (!ev.summary || !ev.start) continue;
    events.push({
      title: String(ev.summary).trim(),
      startsAt: ev.start instanceof Date ? ev.start : new Date(ev.start),
      endsAt: ev.end instanceof Date ? ev.end : (ev.end ? new Date(ev.end) : null),
      location: ev.location ? String(ev.location).trim() : null,
      description: ev.description ? clampText(String(ev.description).trim(), 4000) : null,
      sourceUrl: ev.url || sourceUrl,
      source,
      sourceType: 'ical',
    });
  }
  return events;
}

async function parseRss(body, source, sourceUrl) {
  // rss-parser can take a string directly.
  const feed = await rss.parseString(body);
  const events = [];
  for (const item of feed.items || []) {
    if (!item.title) continue;
    const startsAt = item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : null);
    if (!startsAt || isNaN(startsAt.getTime())) continue;
    events.push({
      title: String(item.title).trim(),
      startsAt,
      endsAt: null,
      location: null,
      description: clampText(String(item.contentSnippet || item.content || '').trim(), 4000) || null,
      sourceUrl: item.link || sourceUrl,
      source,
      sourceType: 'rss',
    });
  }
  return events;
}

export async function runTier1() {
  const feeds = await loadFeeds();
  if (feeds.length === 0) {
    log.info('tier1: no feeds configured (feeds.json empty)');
    return [];
  }

  const all = [];
  for (const feed of feeds) {
    const url = feed.url;
    const source = feed.source || feed.name || url;
    if (!url) {
      log.warn('tier1: feed entry missing url', { feed });
      continue;
    }
    try {
      log.info('tier1: fetching', { url, type: feed.type || 'auto' });
      const body = await fetchText(url);
      const type = feed.type || sniffType(url, body);
      let parsed = [];
      if (type === 'ical') parsed = parseIcal(body, source, url);
      else if (type === 'rss') parsed = await parseRss(body, source, url);
      else {
        log.warn('tier1: could not determine feed type', { url });
        continue;
      }
      // Normalize to plain JSON-able shape with ISO date+time strings.
      for (const ev of parsed) {
        all.push({
          title: ev.title,
          startsAt: ev.startsAt.toISOString(),
          endsAt: ev.endsAt ? ev.endsAt.toISOString() : null,
          date: toIsoDate(ev.startsAt),
          time: toTimeString(ev.startsAt),
          location: ev.location,
          description: ev.description,
          sourceUrl: ev.sourceUrl,
          source,
          sourceType: ev.sourceType,
        });
      }
      log.info('tier1: parsed', { url, count: parsed.length });
    } catch (err) {
      log.error('tier1: feed failed', { url, err: String(err && err.message || err) });
    }
  }
  log.info('tier1: total events collected', { count: all.length });
  return all;
}

// Allow running this file directly: `node tier1_feeds.js`
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  runTier1().then((evs) => {
    console.log(JSON.stringify(evs, null, 2));
  });
}
