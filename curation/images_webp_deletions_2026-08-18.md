# The 20 `images/` deletions in the working tree — what they are

**Date:** 2026-08-18
**Status:** read-only investigation. Nothing staged, committed, or restored.

## Bottom line

**These are not deletions. They are the unstaged half of a move into `images/Archive/`**,
byte-for-byte identical — the exact same situation as the `curation/` → `curation/archive/`
move. All 20 blobs in `HEAD` hash-match a file sitting in `images/Archive/` right now.

Nothing in the codebase, the build, or the deployed bundle references any of them. The
repo-root `images/` folder is **outside the Vite root** (`src/frontend/`), so it has never
been part of the site.

## The 20 files

All added in a single commit and never touched again:

**`8053724` — 2026-03-09 — `feat: Add Privacy Policy page, email scraper, research/marketing assets`**

| File | Bytes | Byte-identical copy exists at |
|---|---:|---|
| `images/1.webp` | 54,678 | `images/Archive/1.webp` |
| `images/2.webp` | 57,924 | `images/Archive/2.webp` |
| `images/3.webp` | 107,324 | `images/Archive/3.webp` |
| `images/4.webp` | 61,582 | `images/Archive/4.webp` |
| `images/5.webp` | 77,046 | `images/Archive/5.webp` |
| `images/6.webp` | 76,614 | `images/Archive/6.webp` |
| `images/7.webp` | 85,388 | `images/Archive/7.webp` |
| `images/8.webp` | 77,832 | `images/Archive/8.webp` |
| `images/9.webp` | 86,196 | `images/Archive/9.webp` |
| `images/10.webp` | 75,756 | `images/Archive/10.webp` |
| `images/11.webp` | 76,834 | `images/Archive/11.webp` |
| `images/12.webp` | 73,846 | `images/Archive/12.webp` |
| `images/13.webp` | 78,824 | `images/Archive/13.webp` |
| `images/14.webp` | 71,028 | `images/Archive/14.webp` |
| `images/15.webp` | 56,908 | `images/Archive/15.webp` |
| `images/16.webp` | 5,234 | `images/Archive/16.webp` |
| `images/17.webp` | 5,328 | `images/Archive/17.webp` |
| `images/18.webp` | 1,458 | `images/Archive/18.webp` |
| `images/19.webp` | 1,380 | `images/Archive/19.webp` |
| `images/home_background_orig.jpeg` | 306,526 | `images/Archive/home_background_orig.jpeg` |

Total 1.31 MB.

## What the content actually is

- **`1.webp` – `15.webp`** are **browser screenshots of floridaautismservices.com taken
  2026-01-01**, full window including the Chrome tab strip, bookmarks bar and Windows
  taskbar with the clock reading 11:13 PM. `1.webp` is `/blog/speech-therapy-autism-guide`
  showing a "Coming Soon" placeholder. These are development/QA reference captures, not
  site assets.
- **`16.webp` – `19.webp`** are tiny crops of UI fragments (e.g. `18.webp`, 1,458 bytes, is
  a crop of a table row reading "2016 Voter Turnout"). Snippets from the same screenshot
  session.
- **`home_background_orig.jpeg`** is the **original uncropped homepage hero photograph** —
  a stock-style shot of a toddler covered in finger paint, 306 KB. Superseded: the live hero
  is the ribbon graphic (`src/frontend/src/assets/images/hero-ribbon-background.jpg`,
  `rainbow-ribbon-hero.*`). No visual relationship to the current design.

## Reference check — zero hits

Searched every `.ts .tsx .js .jsx .css .html .json` under `src/frontend/src`,
`src/frontend/public`, and the built `src/frontend/dist` (131 files) for all 20 filenames:
**0 references.**

Why they could not be referenced even in principle:

- The Vite root is `src/frontend/`. Repo-root `images/` is two levels above it, so Vite
  never sees the folder — an unimported asset outside the root cannot enter `dist/`.
- The site's live `/images` path is served from **`src/frontend/public/images`**, which is a
  completely different set of 20 files (`ese-prek-preschool-classroom.jpg`,
  `select-pt-*`, `logo_orig.jpg`, `payer-law-logo.webp`, the traffic-growth PNGs …).
  `src/frontend/dist/images` is a byte-for-byte copy of that folder. Neither contains
  `1.webp`…`19.webp` or `home_background_orig.jpeg`.
- `deploy/` only ever uploads `src/frontend/dist/`. `deploy/clean.mjs:81` lists
  `['assets','images','data']` as the remote subtrees it reconciles — that `images` is
  `dist/images`, i.e. the `public/images` set, not this folder.

## Duplicate scan

Hashed every file repo-wide whose size matched one of the 20 blobs (24 candidates, `.git`
and `node_modules` excluded). Result: the only content matches are the 20 copies in
`images/Archive/`. The other 4 size-collisions are unrelated
(`dist/assets/executive-function-coaching-CckllE8i.js`, two pandas test files, one `.pyc`).
**No equivalent files exist elsewhere in the repo under different names.**

## Options

1. **Commit as a rename** (mirrors `f73ec1a`, the `curation/archive/` commit). Stage the 20
   deletions plus the 20 `images/Archive/` paths; git records 20 × 100% renames, history and
   content are preserved, working tree goes clean. Note that `images/Archive/` also holds 8
   untracked PNGs (Payer Law screenshots, Search Console captures, the
   `driving_with_autism` contrast/learn-more captures) — staging the whole directory would
   pull those in too, so stage by explicit filename.
2. **Commit the deletions and drop the archive copies.** They are QA screenshots from
   January and a superseded hero photo; nothing needs them, and history still has them if
   you ever want them back. Recovers 1.31 MB from the working tree, not from history.
3. **Restore in place** and abandon the move. No reason found to prefer this.

Option 1 is the low-risk default and matches what was just done for `curation/`.
