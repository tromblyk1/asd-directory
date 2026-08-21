# Events `category` / `event_type` audit — 2026-08-20

Context: `events.category` was normalized in the DB from underscore to hyphen forms
(`sensory_friendly` → `sensory-friendly`, `support_group` → `support-groups`,
`professional_development` → `professional-development`, `walk_run` → `walk-run`).
This audit reports what in the codebase reads those columns, what is now broken, and
what values 55 pending event inserts should use.

DB snapshot: 139 events, 12 recurring.

---

## 0. Headline

**The category filter on `/events` is hard-broken for 48 of 139 events (35%).**
Selecting Sensory-Friendly, Support Groups, or Professional Development returns zero
results. Badge colors for those three silently fall back to gray. Labels still render
acceptably. No URLs or shared links are affected.

**Correction to the premise: the `walk_run` UPDATE is already done.** There are zero
underscore categories left in the DB and 2 rows already at `walk-run`. Nothing pending.

```sql
SELECT count(*) FILTER (WHERE category LIKE '%\_%') FROM events;  -- 0
```

---

## 1. Every place that reads `events.category`

| File | Lines | What it does |
|---|---|---|
| `src/frontend/src/pages/Events.tsx` | `23` | `EventCategory` union type |
| | `25-34` | `categoryColors` badge color map |
| | `36-45` | `categoryNames` display label map |
| | `48-59` | `formatCategory()` fallback formatter |
| | `139`, `160` | **filter equality** — `event.category === selectedCategory` |
| | `326` | **filter radio values** — built from `Object.entries(categoryNames)` |
| | `568`, `652`, `792` | badge color lookup (upcoming / ongoing / past sections) |
| `src/frontend/src/components/EventCard.tsx` | `20-29` | duplicate `categoryColors` |
| | `49-68` | duplicate `formatCategory` + inline `categoryNames` |
| | `98` | color lookup |
| | `127-130` | badge render |
| `src/frontend/src/pages/EventDetail.tsx` | `48-61` | duplicate `formatCategory` |
| | `340` | badge render |
| `src/frontend/src/components/EventFilters.tsx` | `163-168` | category `<SelectItem>` values |
| `src/frontend/src/types/Event.types.ts` | `6` | `category` union type |
| `scripts/events_pipeline/tier2_research.js` | `49-50` | **writes** category — allowed-values list |
| `scripts/events_pipeline/lib/tier2_prompt.js` | `29` | **writes** category — LLM prompt constraint |
| `scripts/events_pipeline/tier2_manual_prompt.md` | `42` | **writes** category — manual prompt constraint |

### Dead code found

Both of these are unreferenced — no importer anywhere in `src/`:

- `components/EventFilters.tsx` — exported, never imported.
- `components/EventCard.tsx` — exported, never imported. `Events.tsx` renders its own
  cards inline (three copies at `:568`, `:652`, `:792`).

Fixing either changes nothing user-visible. Worth knowing before spending time on them.

---

## 2. Underscore forms are hardcoded — impact by severity

### 2a. BROKEN — the category filter returns zero results

`Events.tsx:326` builds the filter radios from `categoryNames` **keys**, which are the
underscore forms. `Events.tsx:139` and `:160` match with exact string equality against
the DB's hyphen forms.

```tsx
// :326 — option value is `sensory_friendly`
{Object.entries(categoryNames).map(([value, label]) => ( ... ))}

// :139 / :160 — compared against DB value `sensory-friendly`
const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
```

| Filter option | Value emitted | DB value | Events stranded |
|---|---|---|---|
| Sensory-Friendly | `sensory_friendly` | `sensory-friendly` | **30** |
| Support Groups | `support_group` | `support-groups` | **9** |
| Professional Development | `professional_development` | `professional-development` | **9** |
| | | | **48 / 139 (35%)** |

Still matching correctly: `educational`, `social`, `fundraiser`, `recreational`, `other`.

### 2b. DEGRADED — badge colors fall back to gray

`categoryColors[event.category]` misses and falls through to `categoryColors.other`.
Sensory-Friendly loses purple, Support Groups loses blue, Professional Development
loses indigo. Not broken, just wrong.

### 2c. COSMETIC — labels survive

`formatCategory()`'s fallback strips hyphens and title-cases, so nothing renders as a
raw slug:

| DB value | Rendered | Was |
|---|---|---|
| `sensory-friendly` | Sensory Friendly | Sensory-Friendly |
| `support-groups` | Support Groups | Support Groups (unchanged) |
| `professional-development` | Professional Development | (unchanged) |
| `walk-run` | Walk Run | n/a |

### 2d. Categories the code has never known about

Pre-existing, unrelated to the normalization. No filter option, no color, gray badge:

| Category | Events |
|---|---|
| `awareness` | 3 |
| `community` | 1 |
| `conference` | 1 |
| `expo` | 1 |
| `festival` | 1 |
| `walk-run` | 2 |

### 2e. The pipeline will reintroduce underscores

`scripts/events_pipeline/` still constrains the LLM to the underscore vocabulary in
three places (`tier2_research.js:49-50`, `lib/tier2_prompt.js:29`,
`tier2_manual_prompt.md:42`). The next scrape run writes `sensory_friendly` again.

---

## 3. `event_type` — free text, rendered verbatim

No DB constraint, no enum. Two consumers only:

- `EventCard.tsx:134` and `EventDetail.tsx` render `event.event_type` **raw and
  unmodified**. Title Case is correct and is what displays.
- `EventCard.tsx:99` normalizes for a color lookup:

```ts
eventTypeColors[event.event_type?.toLowerCase().replace(/\s+/g, '-')] || gray
```

Keys available: `conference`, `workshop`, `sensory-friendly`, `recreational`,
`fundraising`, `celebration`, `athletic`.

**That lookup matches nothing currently in the DB.** `'Sensory-Friendly Experience'`
normalizes to `sensory-friendly-experience`, which is not a key. Every `event_type`
badge is gray today — and it is in a dead component regardless. **Color is not a
consideration for the 55 inserts; only display consistency is.**

### Recommended vocabulary for the 55 inserts

Reuse these existing values verbatim:

| Value | Current count |
|---|---|
| `Sensory-Friendly Experience` | 13 |
| `Educational Workshop` | 9 |
| `Professional Conference` | 8 |
| `Recreational Program` | 8 |
| `Family Celebration` | 7 |
| `Athletic Event` | 6 |
| `Fundraising Gala` | 5 |
| `Community Outing` | 3 |
| `Awareness Walk/Athletic Event` | 3 |
| `Fundraising Event` | 1 |
| `Support Group` | 1 |
| `Expo` | 1 |

**Avoid these existing strays** — lowercase/inconsistent, should not be propagated:
`in-person` (5), `5k`, `ride`, `walk` (2), `Brunch`, `sensory event`, `Surf Festival`,
`luncheon`, `expo` (lowercase).

---

## 4. URL / slug / query parameter exposure — none

- No `useSearchParams` in `Events.tsx`, `EventDetail.tsx`, or `EventCard.tsx`. The only
  pages using query params are `findproviders.tsx` (`county`, `service`, `insurance`,
  `scholarship`) and `FindSchools.tsx` (`county`, `scholarship`, `grade`,
  `denomination`, `accreditation`).
- `name="category"` at `Events.tsx:318`/`:330` is a radio-group HTML attribute, not a
  query string. Category selection is component state only, never serialized to the URL.
- Event slugs are `{title-slug}-{id}` (e.g. `art-on-the-spectrum-60`). No category or
  event_type segment.
- Sitemap emits `/events/{slug}` only.

**No shared links are broken by the rename.**

---

## 5. Changes applied this session (not deployed)

| File | Change |
|---|---|
| `generate-sitemap.js:70,78,284` | `fetchAllSlugs` takes an optional third `filter` arg (defaults `''`, so the other five call sites are byte-identical); `resources` call now passes `resource_type=eq.provider`. Stops the 1 archived row emitting a `/providers/` URL. Provider section 3,177 → 3,176. |
| `src/frontend/src/pages/ProviderDetail.tsx:191` | Not-found branch wrapped in a fragment with `<title>` + `<meta name="robots" content="noindex, follow" />`. Was the only detail page emitting no robots meta — 152 deleted provider URLs had been serving indexable soft-404s. |
| `src/frontend/src/pages/DaycareDetail.tsx:151` | Same fix. |
| `src/frontend/src/pages/EventDetail.tsx:421` | Recurring disclaimer — `<Alert>` amber + `Info` icon (both already imported), gated on `event.is_recurring`, directly under the Key Details panel where the Schedule renders. |
| `src/frontend/src/pages/Events.tsx:645` | Recurring disclaimer — amber bordered note at the top of the Ongoing Programs tab, above the grid. Recurring events render *only* in that tab (`:125` excludes them from the monthly list), so it covers exactly the 12 recurring events and is visible without expanding anything. |

Disclaimer copy (identical in both places):

> Recurring event schedules sometimes change without notice, and venues may skip
> holidays. Please check the event's own website for current dates and details before
> you go.

Nothing built, nothing deployed, sitemap not regenerated.

---

## 6. Outstanding

1. **Fix the category maps** in `Events.tsx` (`:23`, `:25-34`, `:36-45`),
   `EventCard.tsx`, `EventDetail.tsx`, `EventFilters.tsx`, `Event.types.ts` — hyphen
   forms, plus the 6 unknown categories from §2d. This is what unbreaks the filter.
2. **Fix the pipeline prompts** (§2e) so the next scrape does not reintroduce underscores.
3. Decide whether `EventFilters.tsx` and `EventCard.tsx` should be deleted or wired up.
4. Regenerate sitemap, build, deploy.
