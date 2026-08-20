# Weekly tier-2 prompt for claude.ai

## How to use this (5 minutes per Sunday)

1. Open https://claude.ai (signed in to your Max account).
2. Start a new chat. Make sure **Web Search is enabled** in the chat settings — without it, Claude can't pull live event citations.
3. Copy **everything below the "--- COPY FROM HERE ---"** line and paste it into claude.ai. Send.
4. Wait for Claude to finish researching — it will return a JSON code block.
5. Copy the entire response (or just the JSON code block — both work).
6. Paste it into a file called `tier2_manual.json` in this directory (`scripts/events_pipeline/`). Save.
7. Done. The pipeline's next scheduled tier-2 run (Sunday 8 AM) — or any manual run — will pick it up.

If you forget a week, no harm: the pipeline will reprocess the old file but everything's already in Supabase, so nothing duplicates and any past events get filtered out automatically.

---

## --- COPY FROM HERE ---

I need you to research autism-relevant events happening in the State of Florida over the next 30 days from today. The output will be ingested by an automated pipeline, so output format matters — read all instructions before responding.

## What counts as relevant
- Sensory-friendly performances, movies, museum hours, sports games, theme park times
- Autism awareness/acceptance walks, runs, fundraisers, fairs
- Support groups for parents, siblings, autistic adults, or caregivers
- IEP, transition, advocacy, or legal-rights workshops for parents
- ABA, OT, SLP, or related professional CEU events open to families or providers
- Adaptive recreation: surf clinics, dance classes, special-needs sports leagues
- Resource fairs, transition fairs, expos run by autism orgs, school districts, or DD providers
- Faith-based inclusion ministries hosting autism-specific events

## What does NOT count
- Generic events with no autism / sensory / disability angle
- Events outside Florida
- Events whose date has already passed
- Pages that describe a recurring program in the abstract but have no specific upcoming date
- Anything you cannot back with a real, currently-loadable URL

## How to research
1. Use web search aggressively. Search Florida autism organizations, CARD centers (Centers for Autism and Related Disabilities at FSU, UF, USF, UCF, FAU, FIU, UM/Mailman, NSU), Autism Speaks Florida chapters, The Arc of Florida and county chapters, county school district family support pages, Florida sensory-friendly event listings.
2. Open the actual event page. Confirm the date is in the next-30-days window from today. Confirm the location is in Florida.
3. Capture: title, date (YYYY-MM-DD), startTime if listed (HH:MM 24h), endDate if multi-day, city, venueName, address, description (1–3 sentences), registrationUrl, cost ("Free" or "$X"), category, ageGroups, organizerName, sourceUrl (the page you read it from), websiteUrl (the org's main site).
4. `category` MUST be one of: `sensory-friendly`, `support-groups`, `educational`, `social`, `fundraiser`, `professional-development`, `recreational`, `awareness`, `community`, `conference`, `expo`, `festival`, `walk-run`, `other`.
5. `ageGroups` is an array; valid items: `infants`, `toddlers`, `preschool`, `elementary`, `middle-school`, `teens`, `young-adults`, `adults`, `parents`, `caregivers`, `professionals`, `all-ages`.

## Output format
A single JSON object inside one fenced code block, nothing else outside it:

```json
{
  "generatedAt": "YYYY-MM-DD",
  "events": [
    {
      "title": "string",
      "date": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null",
      "startTime": "HH:MM or null",
      "city": "string",
      "venueName": "string or null",
      "address": "string or null",
      "zipCode": "string or null",
      "county": "string or null",
      "description": "string",
      "category": "one of the enum values above",
      "ageGroups": ["..."],
      "cost": "string or null",
      "isFree": true,
      "registrationUrl": "string or null",
      "websiteUrl": "string or null",
      "organizerName": "string or null",
      "sourceUrl": "string"
    }
  ]
}
```

Set `generatedAt` to today's date.

## Quality rules
- Every event MUST have a `sourceUrl` that points to the live event listing — not a homepage, not a Google search result. The pipeline HEAD-checks every URL and drops anything that 404s.
- If you are not sure an event is real, omit it. 5 confirmed events beat 30 with hallucinations.
- Do not include the same event twice with different titles.
- Do not include Eventbrite, Meetup, or Facebook event URLs (terms-of-service issues for the downstream system). Prefer organization websites.
- Aim for 10–25 events. If you can't find that many real ones, that's fine — return what you have.

Begin.
