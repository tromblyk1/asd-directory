# Recurring events + the 2099 sentinel — approach report

**Date:** 2026-08-20
**Status:** Report only. No schema changes, no file edits, no code written.

---

## Headline — and a correction to yesterday's report

**My earlier claim was wrong.** I wrote that recurring events "silently drop out of the
future set and disappear from the live events page." They do not disappear from the
listing page. `Events.tsx:125` deliberately excludes `is_recurring` rows from the dated
list, and `Events.tsx:151` renders them in a separate **Ongoing Programs** tab that
applies **no date filter at all**. All 12 show up there today. The stale `date` costs
nothing on that page.

The real damage is on the **detail page**, and it is worse than what I described.

`EventDetail.tsx:143` computes `isPast = event.date < today` with no recurrence
awareness. For all 12 recurring events that is `true`, which means every one of them
currently:

| Line | Effect |
|---|---|
| `EventDetail.tsx:212` | publishes JSON-LD **`"eventStatus": "https://schema.org/EventCancelled"`** |
| `EventDetail.tsx:348` | renders a **"Past Event"** badge |
| `EventDetail.tsx:616` | **hides the entire action-button block** |
| `EventDetail.tsx:795` | **hides the registration button** in Quick Actions |
| `EventDetail.tsx:210` | publishes `startDate` as a date in the past |
| `EventDetail.tsx:383` | displays the stale date as the event date |

So twelve programs that are running right now are telling Google they are **cancelled**,
telling parents they are over, and hiding their own registration links. That is the bug
worth fixing, and it does not require a recurrence engine to fix.

---

## 1. What recurrence information the table actually carries

Only two columns: `is_recurring` (boolean, default false) and `recurrence_pattern`
(text). Both added in `supabase/migrations/add_event_recurring_fields.sql`. There is no
`rrule`, no interval, no `next_occurrence`, no series/parent id, no exception list.

### Fill rates across all 139 rows

| Metric | Value |
|---|---:|
| `is_recurring = true` | 12 |
| `is_recurring = false` | 127 |
| `is_recurring` NULL | 0 |
| `recurrence_pattern` non-empty | 12 |
| Pattern present but flag not true | **0** |
| Flag true but pattern missing | **0** |
| `end_date` set (whole table) | 17 |
| `end_date` set on a recurring row | **0** |
| `time` non-empty (whole table) | 69 |

The flag and the pattern are perfectly aligned — 12/12, no orphans in either direction.
That is unusually clean and it means `recurrence_pattern` can be trusted as the single
source of truth for recurrence.

`end_date` is never set on a recurring row, so it is free for use as a series-end marker
if that is ever wanted.

### The 12 rows

All created **2026-07-14**, none ever updated. All `verification_status = 'verified'`.
All have a slug, so all have a live detail page.

| id | Title | City | Stored date | `recurrence_pattern` | Parseable? |
|---:|---|---|---|---|---|
| 147 | FSU CARD Walk It Out Wednesday | Tallahassee | 2026-07-15 | Every Wednesday | **Yes** (weekly) |
| 140 | Superblue Miami Sensory Friendly Sessions | Miami | 2026-07-16 | Monthly - see ticket page for upcoming dates | **No** |
| 144 | MOSH Family Sensory Night | Jacksonville | 2026-07-17 | Third Friday of every month | **Yes** |
| 146 | Art Academy for Autism (Pensacola Museum) | Pensacola | 2026-07-18 | Third Saturday of every month (semester registration) | Yes, but semester-gated |
| 137 | MOSI Sensory Saturday | Tampa | 2026-07-18 | Select Saturday mornings, 8-10 AM before general opening | **No** ("select") |
| 138 | Sunshine Sunday at Glazer Children's Museum | Tampa | 2026-07-26 | Last Sunday of every month, 8-10 AM | **Yes** |
| 136 | MODS Sensory-Friendly Sunday | Fort Lauderdale | 2026-07-26 | Fourth Sunday of every month, 10 AM-1 PM | **Yes** |
| 139 | Art on the Spectrum (Tampa Museum of Art) | Tampa | 2026-07-26 | Last Sunday of every month, 9-11 AM | **Yes** |
| 142 | Sensory Sunday at Surge Adventure Park | Jacksonville | 2026-08-02 | First Sunday of every month, 10 AM-12 PM (confirm with venue) | Yes, but hedged |
| 145 | iFLY All Abilities Night | Jacksonville | 2026-08-03 | First Monday of every month, 5-8 PM | **Yes** |
| 141 | Sensory Friendly Saturdays (Miami Children's Museum) | Miami | 2026-08-08 | Second Saturday of every month | **Yes** |
| 143 | MOCA Autism Creates | Jacksonville | 2026-08-08 | Second Saturday of every month | **Yes** |

**Strictly parseable: 10 of 12.** Two are not — id 140 (`Monthly`, no weekday anchor)
and id 137 (`Select Saturday mornings`, which is explicitly irregular). Two more are
parseable but carry hedges the parser would discard: id 146 is only in session during a
semester, and id 142 says "confirm with venue."

### The stored dates are correct for their patterns

I checked all 12 against a calendar. Every one is a genuine occurrence:

- 144 → 2026-07-17 is the third Friday of July 2026 ✓
- 136 → 2026-07-26 is the fourth Sunday ✓
- 138, 139 → 2026-07-26 is the last Sunday ✓
- 146 → 2026-07-18 is the third Saturday ✓
- 142 → 2026-08-02 is the first Sunday of August ✓
- 145 → 2026-08-03 is the first Monday ✓
- 141, 143 → 2026-08-08 is the second Saturday ✓
- 147 → 2026-07-15 is a Wednesday ✓
- 137 → 2026-07-18 is a Saturday ✓
- 140 → 2026-07-16, no anchor to check against

This matters. It means `date` on these rows is **the last verified occurrence**, and the
pattern text genuinely describes the series. Nothing is corrupt; the data is just not
self-advancing.

---

## 2. The choice: scheduled job vs query-time derivation

### Option A — pg_cron job that UPDATEs `date`

**Cost:** write a pattern parser in PL/pgSQL (ordinal-weekday-of-month arithmetic),
schedule it, and monitor it. pg_cron is already in use on this project for the guide
publish flip, so the infrastructure exists.

**Against it, in order of weight:**

1. **It destroys the only provenance the row has.** `date` is currently "the occurrence
   somebody actually confirmed on 2026-07-14." Overwrite it and there is no record of
   when the series was last verified against reality. `last_verified_date` is NULL on
   these rows, so nothing else carries it.
2. **It happily advances events that have ended.** Nothing tells the job that MOSI
   cancelled Sensory Saturday. A cron job would roll id 137 forward forever, and because
   the row is `verified`, the site would keep asserting a dead program with a confident
   future date. Silent wrongness is worse than visible staleness.
3. **Two of the 12 cannot be parsed at all**, so the job leaves them behind and the
   problem persists in a smaller, less visible form.
4. It writes to the database on a schedule to fix something that is purely a display
   concern.

### Option B — query-time derivation of the next occurrence

**Cost:** the same parser, in TypeScript, plus handling the 2 unparseable rows.

**For it:** no mutation, no provenance loss, no drift. `date` stays the verification
anchor. Wrong output is a render bug, not a corrupted row.

**Against it:** it is still a recurrence engine, built to serve **12 rows**. And it
solves a problem that is only half the actual damage — computing a next-occurrence date
does not by itself stop `EventDetail` from calling these events cancelled, unless
`isPast` is also changed.

### Option C — make `isPast` recurrence-aware. Recommended.

The damage listed in the headline all flows from one expression:

```
EventDetail.tsx:143    const isPast = event.date ? event.date < today : false;
```

An ongoing program is never "past." Guarding that single line on `is_recurring` fixes
the `EventCancelled` structured data, the "Past Event" badge, the hidden action block,
and the hidden registration button — **with no pattern parsing at all**. It also matches
what `Events.tsx` already does, which is treat recurring rows as a category that date
filtering does not apply to.

What it does *not* fix: `EventDetail.tsx:383` still displays the stale date, and
`:210` still publishes a past `startDate`. Those are the parts that genuinely need a
next-occurrence value.

**So the honest sequencing is:**

1. Make `isPast` recurrence-aware. Removes the false-cancellation and restores the
   registration links. No parser.
2. Decide separately whether the detail page should show a computed next occurrence or
   just show `recurrence_pattern` as prose where the date currently sits. The prose is
   already written, already accurate, and already rendered on the listing card at
   `Events.tsx:695-698`. Showing "Third Friday of every month" instead of a stale
   date is honest, costs nothing, and needs no parser.
3. Only build the parser if step 2 proves insufficient — and if it is built, build it as
   Option B (query-time), not Option A.

Option A is the one I would not do. It is the most work, it is the only one that can
silently manufacture false future dates, and it is the only one that destroys data.

---

## 3. The 2099-12-31 sentinel

### Does anything read or write it?

**Nothing writes it.** A repository-wide search for `2099` returns zero hits in any
source file — the only matches are archived CSV data, my own curation output from
earlier today, and unrelated phone numbers and coordinates. `SubmitEvent.tsx:172`
confirms the public form does **not** insert into `events` at all ("no database insert -
you'll add manually after review"), same pattern as `SubmitResource.tsx`. The only
writer of this table is manual SQL. The value was typed by hand.

**Something reads it, implicitly.** `Events.tsx:129-132`:

```
// Filter out events with unrealistic future dates (likely data errors)
if (event.date > maxDateStr) return false;     // maxDateStr = today + 2 years
```

So the listing page already treats far-future dates as errors and hides them. The
comment says "likely data errors" — meaning whoever wrote that guard read the sentinel
as a mistake, not as an intentional "ongoing" marker.

### The consequence

The four rows are `is_recurring = false`, so they are excluded from the Ongoing Programs
tab at `Events.tsx:153`, **and** excluded from the dated list by the two-year guard at
`:130`. They appear **nowhere on the events page**.

| id | Title | City | is_recurring |
|---:|---|---|---|
| 60 | Art on the Spectrum | Tampa | false |
| 61 | Free Autism Screenings | Babcock Ranch, Naples, Fort Myers area | false |
| 62 | Sensory in the Park | Orlando | false |
| 63 | Florida Racquet Sports Programs | Various cities | false |

They still have slugs and therefore live detail pages, which render "December 31, 2099"
as the event date and publish it as JSON-LD `startDate`.

### What they actually are

All four are ongoing programs, not dated events — a museum series, a screening program
across multiple locations, a community park program, and a statewide racquet-sports
program. Note that **id 60 "Art on the Spectrum" (Tampa) is a duplicate concept of id
139 "Art on the Spectrum at Tampa Museum of Art"**, which is correctly modelled as
`is_recurring = true` with pattern "Last Sunday of every month." Row 139 works; row 60
is invisible.

**Read:** the sentinel is a hand-entered workaround for "this has no single date,"
written before or in ignorance of the `is_recurring` mechanism. It is an artifact, not a
convention. The correct representation for all four already exists in the schema.

---

## 4. One adjacent finding, reported not fixed

`Home.tsx:83` calls `base44.entities.Event.list('date', 10)`. In `base44Client.ts:29-40`
a sort field without a `-` prefix means **ascending**, so this fetches the **10 oldest**
events in the table. It then filters `date >= today` at `Home.tsx:92-95`.

The 10 oldest rows are dated 2025-05-03 through 2025-09-07. All ten are in the past, so
`upcomingEventsFiltered` is **always empty**. The homepage upcoming-events section shows
nothing and has shown nothing for some time. `Home.tsx:82` also computes a `today`
variable inside the query function that is never used, which suggests the date filter was
meant to be in the query and ended up outside it.

Not touched. Flagging only.

---

## Summary of what I would change, in order

1. `EventDetail.tsx:143` — do not treat a recurring event as past. Kills the
   `EventCancelled` schema, the Past Event badge, and the hidden registration links.
2. The 4 sentinel rows — set `is_recurring = true` with a real `recurrence_pattern` and
   a real last-known date, so they render in Ongoing Programs like the other 12. Check
   id 60 against id 139 for duplication first.
3. `Home.tsx:83` — sort descending or filter in the query, so the homepage stops
   rendering an empty section.
4. Recurrence parser — only if 1 and 2 prove insufficient, and query-time if so.

Nothing here requires pg_cron.
