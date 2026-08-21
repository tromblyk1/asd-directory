# Floortime redirect on Hostinger — feasibility

**Date:** 2026-08-21
**Scope:** report only. Nothing changed. The collapse itself remains on hold
pending Search Console impressions, per instruction.
**Constraint honoured:** this report does not propose renaming the DB slug.

---

## Verdict

**Trivially feasible, and it survives deploys by construction — not by luck.**

The mechanism is already in production. `.htaccess` is a tracked repo file, Vite
copies it into `dist/` on every build, and the deploy uploads it every run. A
redirect added to it is as durable as any other source file.

The "overwrite without deleting" concern does not apply here, and the reason is
worth stating precisely: overwrite-never-delete is only a hazard for files that
**disappear locally while persisting remotely**. `.htaccess` never disappears
locally — so every deploy overwrites the server copy with the current repo
version. That is the desired behaviour, not a risk.

---

## Evidence, not inference

| Claim | How it was verified |
|---|---|
| `.htaccess` is tracked in git | `git ls-files` → `src/frontend/public/.htaccess` |
| Vite copies it into the build | `src/frontend/dist/.htaccess` exists on disk |
| It reaches the server | `curl -I https://floridaautismservices.com/thank-you` → **`301` → `/featured/thank-you`**. That rule exists only in the repo file, so the live server copy is the deployed copy. |
| The deploy uploads dotfiles | `deploy.mjs:52` calls `sftp.uploadDir(LOCAL_DIST, remotePath)` with **no filter argument**; `ssh2-sftp-client` v10 enumerates all entries when no filter is supplied. Confirmed empirically by the line above. |
| `clean:force` cannot delete it | `clean.mjs:81` — `const subtrees = ['assets', 'images', 'data']`. The cleaner walks only those three directories. The web root itself is never enumerated, so `.htaccess` is out of reach even with `--delete`. |
| No pSEO pages are affected | `sitemap.xml` contains zero `/providers/dir-floortime/*` URLs. 11 providers is below the pSEO threshold. |

There is already a precedent rule in the file — line 6, the Stripe `/thank-you`
301 — so this is a pattern the project has run in production, not a new technique.

---

## The change itself

Current `src/frontend/public/.htaccess`, lines 1–14:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Stripe payment links redirect to /thank-you; the real page is /featured/thank-you
  RewriteRule ^thank-you/?$ /featured/thank-you [R=301,L]

  # Don't rewrite files or directories that exist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite everything else to index.html to allow React Router to handle it
  RewriteRule ^ index.html [L]
</IfModule>
```

One line, inserted after line 6:

```apache
  RewriteRule ^resources/services/dir-floortime/?$ /resources/services/floor-time [R=301,L]
```

**Placement is the only thing that can go wrong.** It must sit *above* the two
`RewriteCond` lines. `RewriteCond` binds to the single `RewriteRule` that
immediately follows it, so a redirect placed below them would be gated by
"file does not exist" — which happens to be true here, so it would appear to work,
and would then break silently the day anything else changes. Match the existing
`thank-you` placement.

`^…/?$` handles the trailing-slash variant. Query strings carry over automatically.
`RewriteBase /` is already set, so the leading slash is correctly omitted from the
match pattern and present in the target.

---

## What else has to change, or the redirect is half-done

A 301 alone leaves the site advertising a URL that redirects. Three places:

| File | Line | Current | Needed |
|---|---|---|---|
| `src/frontend/public/sitemap.xml` | 154 | `…/resources/services/dir-floortime` | remove — Search Console reports sitemap-listed redirects as "Page with redirect," excluded |
| `src/frontend/src/data/resources/validLinks.json` | 196 | `"services/dir-floortime"` key | remove |
| `src/frontend/src/pages/educationalresources.tsx` | 21 | `{ slug: 'dir-floortime', … }` in `servicesList` | change slug to `floor-time` — otherwise the hub page's own link takes a 301 hop |

The sitemap entry regenerates from **filenames**, so removing it from `sitemap.xml`
by hand is temporary: `node generate-sitemap.js` will put it back as long as
`data/resources/services/dir-floortime.json` exists. Deleting that JSON is what
actually removes it — which is the collapse, not the redirect, and is on hold.

Already correct, no change needed:

- `ProviderCard.tsx:72` and `DaycareCard.tsx:85` — both badges already link to
  `/resources/services/floor-time`.
- `ServiceDetail.tsx:36` — `'floor-time': 'dir-floortime'` already maps the page
  slug to the DB filter value, so the "Find providers" CTA on the surviving page
  filters correctly on the unchanged DB slug.

That second point is the important one: **the DB slug never needs to move.** The
translation layer for this exact case already exists and already works.

---

## Failure modes worth knowing before it ships

1. **301s are cached hard by browsers, effectively permanently.** If the direction
   turns out wrong after shipping, you cannot recall it from anyone who already hit
   it. **Ship it as `R=302` first**, confirm behaviour on the live domain, then
   change to `R=301` in a follow-up. Costs one extra deploy and removes the only
   irreversible element.

2. **Direct hPanel edits get clobbered.** If `.htaccess` is ever edited through
   Hostinger's file manager, the next deploy silently overwrites it with the repo
   version. This is correct behaviour, but it means the repo file is the only place
   the rule may live. Do not hand-edit on the server.

3. **`mod_rewrite` gating.** The whole block sits inside `<IfModule mod_rewrite.c>`.
   If the module were unavailable the rule would no-op — but so would the SPA
   fallback, so the site would already be visibly broken. Not a realistic risk.

4. **The redirect fires before React loads.** `/resources/services/dir-floortime`
   will never render regardless of whether `dir-floortime.json` still exists. The
   JSON becomes unreachable-but-harmless. It does not need to be deleted for the
   redirect to work, and leaving it means the change is reversible by deleting one
   line.

---

## Effort

Redirect only: **one line, one build, one deploy.** Under ten minutes.
Adding the three cleanup edits above: still under thirty.

The redirect is genuinely separable from the collapse. It can ship on its own once
Search Console settles the direction, and it does not commit you to the six-edit
merge in `floortime_duplicate_json_collapse_2026-08-21.md`.

---

## Direction, and what Search Console has to answer

The instruction is conditional: redirect `dir-floortime` → `floor-time` **if**
`floor-time` is the impression-earner. Two notes on that:

- Internal linking already favours `floor-time` — both badge maps point there. So
  whatever authority has accrued, the site's own signals have been pushing it at
  `floor-time` for as long as those badges have existed. That biases the expected
  answer but does not settle it; `dir-floortime` is the more searched phrasing and
  may win on query match alone.
- If it comes back the other way, the same one-line change works reversed. The
  mechanism is symmetric; only the badge-map edits differ in volume (two lines
  the other direction vs. three cleanup edits this direction).

Either way the DB slug stays `dir-floortime`. Nothing in this approach requires
touching the 11 provider rows, the manifest, or the permanent-slug convention.
