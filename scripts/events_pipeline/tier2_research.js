// Tier 2: research-quality events with citations.
//
// Two paths — picked automatically:
//
//   A. API path  (used when ANTHROPIC_API_KEY is set)
//      Calls Claude with the web_search tool. Long system prompt is
//      cache_control'd for repeat-run amortization.
//
//   B. Manual path  (used when ANTHROPIC_API_KEY is NOT set)
//      Reads pre-prepared events from `tier2_manual.json`. Operator generates
//      that file once a week by pasting `tier2_manual_prompt.md` into claude.ai
//      (covered by their Max subscription) and saving the JSON output.
//
// Either way: HEAD-validates every sourceUrl before keeping the event.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { log } from './lib/logger.js';
import { headOk, toIsoDate, clampText } from './lib/util.js';
import { TIER2_SYSTEM_PROMPT } from './lib/tier2_prompt.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANUAL_FILE = path.resolve(__dirname, 'tier2_manual.json');

function todayPlusDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toIsoDate(d);
}

function extractJson(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence ? fence[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try { return JSON.parse(candidate.slice(start, end + 1)); } catch { return null; }
}

function joinTextBlocks(blocks) {
  return (blocks || [])
    .filter((b) => b && b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text)
    .join('\n');
}

const VALID_CATEGORIES = new Set([
  'sensory-friendly', 'support-groups', 'educational', 'social',
  'fundraiser', 'professional-development', 'recreational', 'awareness',
  'community', 'conference', 'expo', 'festival', 'walk-run', 'other',
]);

const FORBIDDEN_HOSTS = [
  'eventbrite.', 'meetup.com', 'facebook.com', 'fb.me', 'm.facebook.com',
];

function isForbiddenUrl(u) {
  if (!u) return false;
  const lower = String(u).toLowerCase();
  return FORBIDDEN_HOSTS.some((h) => lower.includes(h));
}

// Validate a parsed events object (from either path) against schema/policy
// and HEAD-check sourceUrls. Returns the kept records.
async function validateAndShape(parsed) {
  if (!parsed || !Array.isArray(parsed.events)) {
    log.warn('tier2: input had no events array');
    return [];
  }
  log.info('tier2: events to validate', { count: parsed.events.length });

  const validated = await Promise.all(parsed.events.map(async (ev) => {
    if (!ev || !ev.title || !ev.date || !ev.sourceUrl) return null;
    if (!VALID_CATEGORIES.has(ev.category)) ev.category = 'other';
    if (isForbiddenUrl(ev.sourceUrl)) {
      log.warn('tier2: dropped forbidden-host sourceUrl', { url: ev.sourceUrl });
      return null;
    }
    const ok = await headOk(ev.sourceUrl);
    if (!ok) {
      log.warn('tier2: dropped event — sourceUrl not reachable', { url: ev.sourceUrl, title: ev.title });
      return null;
    }
    return {
      title: String(ev.title).trim(),
      date: ev.date,
      endDate: ev.endDate || null,
      time: ev.startTime || null,
      city: ev.city ? String(ev.city).trim() : null,
      venueName: ev.venueName || null,
      address: ev.address || null,
      zipCode: ev.zipCode || null,
      county: ev.county || null,
      description: clampText(ev.description || '', 4000) || null,
      category: ev.category,
      ageGroups: Array.isArray(ev.ageGroups) ? ev.ageGroups : null,
      cost: ev.cost || null,
      isFree: typeof ev.isFree === 'boolean' ? ev.isFree : null,
      registrationUrl: isForbiddenUrl(ev.registrationUrl) ? null : (ev.registrationUrl || null),
      websiteUrl: ev.websiteUrl || null,
      organizerName: ev.organizerName || null,
      sourceUrl: ev.sourceUrl,
      sourceType: 'tier2-research',
    };
  }));

  const kept = validated.filter(Boolean);
  log.info('tier2: events kept after URL validation', { count: kept.length });
  return kept;
}

async function runApiPath({ lookaheadDays }) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const days = lookaheadDays || Number(process.env.TIER2_LOOKAHEAD_DAYS) || 30;
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
  const startIso = toIsoDate(new Date());
  const endIso = todayPlusDays(days);

  const userPrompt = `Find autism-relevant events happening in Florida between ${startIso} and ${endIso} (inclusive).

Use web_search aggressively. Aim for 10–25 high-quality, citable events. Output the JSON object as instructed.`;

  log.info('tier2: API path — calling Anthropic', { model, startIso, endIso });

  let resp;
  try {
    resp = await client.messages.create({
      model,
      max_tokens: 8000,
      system: [
        { type: 'text', text: TIER2_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      tools: [
        { type: 'web_search_20250305', name: 'web_search', max_uses: 8 },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    });
  } catch (err) {
    log.error('tier2: Anthropic call failed', { err: String(err && err.message || err) });
    return [];
  }

  log.info('tier2: usage', {
    input_tokens: resp.usage?.input_tokens,
    output_tokens: resp.usage?.output_tokens,
    cache_creation_input_tokens: resp.usage?.cache_creation_input_tokens,
    cache_read_input_tokens: resp.usage?.cache_read_input_tokens,
    stop_reason: resp.stop_reason,
  });

  const text = joinTextBlocks(resp.content);
  const parsed = extractJson(text);
  return validateAndShape(parsed);
}

async function runManualPath() {
  let raw;
  try {
    raw = await fs.readFile(MANUAL_FILE, 'utf8');
  } catch (err) {
    log.warn('tier2: manual path — tier2_manual.json not found, skipping', { path: MANUAL_FILE });
    return [];
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    // Operator may have pasted the entire claude.ai message including ``` fences.
    parsed = extractJson(raw);
    if (!parsed) {
      log.error('tier2: manual path — could not parse tier2_manual.json', { err: String(err && err.message || err) });
      return [];
    }
  }
  log.info('tier2: manual path — loaded tier2_manual.json', {
    generatedAt: parsed.generatedAt || null,
    eventCount: Array.isArray(parsed.events) ? parsed.events.length : 0,
  });
  return validateAndShape(parsed);
}

export async function runTier2({ lookaheadDays } = {}) {
  if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.startsWith('PASTE_')) {
    return runApiPath({ lookaheadDays });
  }
  return runManualPath();
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const dotenv = await import('dotenv');
  dotenv.config();
  runTier2().then((evs) => console.log(JSON.stringify(evs, null, 2)));
}
