# Events Pipeline

Hands-off events aggregator for **floridaautismservices.com**.
Pulls Florida autism-related events from operator-curated iCal/RSS feeds plus weekly Claude-powered web research, validates them, dedupes them, and inserts into the Supabase `events` table. The Events page on the live site reads from Supabase at runtime, so new rows appear immediately — no rebuild, no redeploy.

---

## Tier 2 has two paths — pick whichever you prefer

The pipeline auto-detects which path to use, based on whether `ANTHROPIC_API_KEY` is set in `.env`.

| | **API path** | **Manual path (default)** |
|---|---|---|
| Cost | ~$0.05 / week (Anthropic API) | $0 (uses your claude.ai Max subscription) |
| Operator effort each week | None | ~5 minutes once a week |
| How it works | Scheduled task calls Claude API with web_search tool | You paste a prompt into claude.ai, paste the JSON output into `tier2_manual.json`, scheduled task ingests it |
| Setup | Add `ANTHROPIC_API_KEY` to `.env` | Don't set the key. Use `tier2_manual_prompt.md` instructions. |

Either path runs the same HEAD-validation against every cited URL, so hallucinated events are dropped before they reach Supabase.

---

## What's manual vs. automatic

### Manual (one-time setup)

1. **Add the Supabase service-role key** to `.env` (copy `.env.example` first). Service-role, not anon.
2. **Install dependencies once:** `cd scripts/events_pipeline && npm install`.
3. **Register the scheduled tasks once:** from an elevated PowerShell, `powershell -ExecutionPolicy Bypass -File install_pipeline_tasks.ps1`.
4. **Discover feed URLs** for Tier 1. Visit Florida autism org event pages and look for "Add to calendar," "iCal," "Subscribe," or "RSS" links. Paste candidate URLs into Claude Code (this dev environment) and have it discover/add to `feeds.json` for you.

### Manual (ongoing — only if you're using the manual tier-2 path)

- **Once a week**, paste the prompt from `tier2_manual_prompt.md` into claude.ai, save Claude's JSON reply as `tier2_manual.json`. ~5 minutes.

### Manual (periodic, light)

- **Review new rows in Supabase.** The pipeline marks everything `verification_status = 'unverified'`. When you confirm an event is real and good, set it to `'verified'` (and bump `featured = true` for the homepage if appropriate).

### Automatic (ongoing)

- **Daily at 06:00** — Tier 1 pulls every URL in `feeds.json`, parses iCal/RSS, validates Florida + autism relevance, and inserts new events into Supabase.
- **Sunday at 08:00** — Tier 2 runs. If `ANTHROPIC_API_KEY` is set, it calls Claude API with web search. Otherwise, it reads `tier2_manual.json` if present. Either way, HEAD-validates every URL, dedupes against Tier 1, and inserts.

Both runs append to `events_pipeline.log` next to this README.

---

## Files

| File | Purpose |
|------|---------|
| `pipeline.js` | Orchestrator. `--tier1`, `--tier2`, `--dry-run` flags. |
| `tier1_feeds.js` | Parses iCal + RSS feeds listed in `feeds.json`. |
| `tier2_research.js` | Tier-2 entrypoint. Picks API path or manual-file path automatically. |
| `tier2_manual_prompt.md` | Copy-paste prompt for claude.ai (manual tier-2 path). |
| `tier2_manual.json` | Generated weekly by pasting claude.ai's JSON output into a file (manual path). Gitignored. |
| `lib/tier2_prompt.js` | Shared system prompt used by both tier-2 paths. |
| `validator.js` | Drops past, non-Florida, non-autism events. |
| `deduper.js` | Merges tier1 + tier2 by (title, date, city). |
| `publisher.js` | Inserts into Supabase. Idempotent via deterministic slug. |
| `feeds.json` | Operator-edited list of feed URLs. |
| `.env.example` | Required env vars. Copy to `.env`. |
| `install_pipeline_tasks.ps1` | Registers Tier 1 + Tier 2 in Windows Task Scheduler. |
| `events_pipeline.log` | Append-only run log. |
| `lib/util.js` | Shared helpers: Florida detection, autism keywords, slug. |
| `lib/logger.js` | File + stdout logger. |

---

## `feeds.json` shape

```json
{
  "feeds": [
    { "url": "https://example.org/events.ics",  "type": "ical", "source": "Example Org" },
    { "url": "https://example.org/feed.rss",    "type": "rss",  "source": "Example Org" }
  ]
}
```

`type` is optional — the pipeline sniffs the content if you leave it off. `source` is for log readability.

---

## Idempotency

Every event gets a deterministic slug: `slugify(title) + date + slugify(city)`. Before insert, the publisher SELECTs existing rows with that slug. Matches are **skipped**, not updated, so any operator edits (`featured`, `verification_status`, `verification_notes`, etc.) are preserved across runs. To force a re-pull of a single event, delete the row in Supabase and let the next run insert a fresh copy.

---

## Adding an optional approval step later

Right now every Tier 1 / Tier 2 event lands directly in `events` with `verification_status = 'unverified'`. If you want a human approval gate before events go live, a few options that require only small changes:

1. **Soft gate via the front end** — change `Events.tsx` to filter `verification_status !== 'unverified'`. Pipeline keeps inserting; events are invisible until you flip the status to `'verified'`.
2. **Staging table** — change `publisher.js`'s `from('events')` to `from('events_staging')`. Create that table with the same schema. Add a Supabase view or scheduled SQL job that promotes rows after manual review.
3. **Slack/email notify** — at the end of `pipeline.js`, post the inserted slugs to an outbound channel; you review and edit in place. Lowest-friction option, recommended.

All three are additive — none of them require restructuring the pipeline.

---

## Running it manually

```powershell
cd C:\Projects\ASD-Directory\scripts\events_pipeline

# install once
npm install

# dry run (no DB writes)
node pipeline.js --dry-run

# tier 1 only
node pipeline.js --tier1

# tier 2 only (requires ANTHROPIC_API_KEY)
node pipeline.js --tier2

# both (default if no flags)
node pipeline.js
```

---

## DO NOT

- Do not scrape Eventbrite, Meetup, or Facebook events. ToS prohibits, and those sites also break our HEAD-validation. The Tier 2 prompt explicitly excludes them; if you find a feed URL pointing at one of them, do not add it to `feeds.json`.
- Do not commit `.env`. Only commit `.env.example`.
- Do not bake events into the build. Supabase serves them at runtime.

---

## Seed candidates for `feeds.json`

The pipeline ships with `feeds.json` empty on purpose — you have to manually visit candidate sites to confirm they expose a real iCal/RSS endpoint (most don't advertise it). See the "Suggested orgs to check" section in the project handoff for a starter list.
