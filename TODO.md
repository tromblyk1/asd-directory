# TODO — ASD-Directory

Backlog of nice-to-have improvements for floridaautismservices.com.
Add new entries at the bottom. Mark completed ones with `[x]` and a date.

---

## [ ] Switch `.htaccess` from blanket rewrite to auto-generated route whitelist

**Status:** Pending — current setup works but allows typo URLs to load the React shell with HTTP 200 instead of returning a real 404.

**Current state:**
- `src/frontend/public/.htaccess` uses a blanket SPA rewrite:
  ```
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
  ```
- Result: `floridaautismservices.com/random-typo` returns 200 + the React app shell (likely blank or whatever the unmatched-route render is). It does NOT return an HTTP 404.

**Why fix:**
- Better SEO — Google sees real 404s for invalid URLs instead of a soft 200 shell
- Better UX for typos — actual 404 page (browser default or Hostinger's) instead of a broken-looking React load
- Matches the pattern already proven on threkman.com

**How to fix (~15 min):**
1. Copy `C:\Projects\Threkman\code\scripts\generate-htaccess.cjs` to `C:\Projects\ASD-Directory\src\frontend\scripts\generate-htaccess.cjs`.
2. Adjust the path constants at the top if needed (it expects `../src/App.tsx` and `../public/.htaccess` relative to the script — should work as-is if dropped into `src/frontend/scripts/`).
3. Add it as a pre-step in `src/frontend/package.json`:
   ```json
   "build": "node scripts/generate-htaccess.cjs && npm run validate:links && vite build"
   ```
4. Run `npm run build` once to verify the regex captures all real routes (compare the generated whitelist against `src/frontend/src/App.tsx` routes).
5. Deploy via the existing `npm run deploy` flow.
6. Test post-deploy: `curl -s -o /dev/null -w "%{http_code}\n" https://floridaautismservices.com/does-not-exist` should return `404`. Real routes should still return `200`.

**Reference implementation:** Threkman commit `88af4ee` (`Code-split routes + auto-generate .htaccess from App.tsx`).

**Caveat:** if any routes use complex patterns the regex doesn't handle (e.g. nested `:params` or wildcards), inspect the generated `.htaccess` and tweak the converter in the script. The current converter handles `:slug`-style params correctly.

---

## [ ] Consider lazy-loading routes for faster initial paint

**Status:** Worth investigating but lower priority — the autism site already has aggressive code splitting (95 chunks in `/assets/`), so the win is likely smaller than it was on Threkman.

**Notes:**
- Threkman went from 1.6 MB → 200 KB initial bundle via `React.lazy()` + `Suspense`. See Threkman commit `88af4ee` for the pattern.
- Check the autism site's current initial bundle size first: `curl -sI https://floridaautismservices.com/assets/index-*.js | grep -i content-length`. If it's already <300 KB, this is probably not worth the effort.
- If you do this, the `PageLoading` component pattern in Threkman is reusable.
