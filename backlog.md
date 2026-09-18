# Backlog

Non-blocking items identified during the final whole-branch review (2026-09-18) and deliberately not fixed, since none affect core functionality or correctness. Grouped by when they're worth picking up.

## Minor code/UX issues

- **`ordinal()` is wrong from 21 onward.** `js/results-render.mjs` — `21 → "21th"`, `22 → "22th"` instead of "21st"/"22nd". Only bites once results include 21+ ranked entries; fix with the standard mod-10/mod-100 rule.
- **`initGallery`/`initResults` don't check `res.ok`.** `js/app.js` — behaviorally fine today (a 404 returns HTML, `res.json()` throws, the `catch` renders the placeholder), but inconsistent with the `initInterestForm`/`initRegistrationCTA` fetch paths, which now explicitly check response status. Worth aligning for consistency.
- **Honeypot rejection is a silent no-op for humans.** `js/interest-form-validate.mjs` sets `errors.website` on rejection, but no `[data-error-for="website"]` element exists in `index.html`, so the error is dropped with zero user feedback. Intentional against bots; would be confusing if a password manager ever autofills the off-screen "Website" field for a real user. Consider surfacing the generic status message on that branch instead.
- **`form.name`/`form.role` rely on HTMLFormElement's named-property override.** `js/app.js` — works correctly (the browser's named getter overrides the built-in properties), but reads as fragile/surprising. Prefer `form.elements.name.value` or `Object.fromEntries(new FormData(form))`.
- **`resources/media/` is a dead/stale drop point.** The design spec names `resources/media/` as where competition photos go; the implementation plan moved the live path to `assets/gallery/` + `assets/gallery/manifest.json`. The unused folder (with its `.gitkeep`) is still tracked and could mislead someone dropping photos in a year. Either delete it or document which folder is authoritative.
- **Unused CSS design tokens.** `style.css` defines ~9 tokens never referenced (`--color-bg-secondary`, `--color-bg-parchment`, `--color-bg-card-hover`, `--shadow-card`, `--transition-normal`, `--font-subhead`, `--color-text-dark`, etc.). Harmless as a system baseline; not accidental cruft to worry about, just noting it's not fully utilized yet.
- **`aria-label` on a plain `<div>` has no effect.** `index.html` — the Format section's video placeholder has an `aria-label` that isn't exposed to assistive tech without a `role`. Add `role="region"` or rely on the visible "Video walkthrough coming soon." text, which already covers most of the gap.
- **No `scroll-margin-top` on sections under the sticky header.** `style.css` — cosmetic today because the 96px section padding happens to be enough clearance; would need attention if that padding is ever reduced.
- **`CASE_PACKAGE_DATE` and `COMPETITION_DATE` config constants are unused.** `js/config.mjs` exports both, but nothing reads them — the actual displayed dates ("21 Nov 2026", "29 Oct", etc.) are hardcoded separately in `index.html`, `js/app.js`, and `js/results-render.mjs`. If the tentative competition date ever moves, it needs correcting in all of those places by hand, and the hardcoded copy in `results-render.mjs` is the one most likely to get missed. Either wire the constants through as the actual source of truth, or drop the two unused ones so `config.mjs` doesn't imply a single source of truth it doesn't provide.

## Plan-vs-spec gap (not an implementation defect)

- **Hero section doesn't deliver the spec's visual ambition.** The design spec asked for "more 'international tournament' scale/gravitas (e.g. a world map or multi-school visual motif)," distinct from the existing club site's tone. The implementation plan's Task 6 specified a plain centered text block instead, and the build matches the plan exactly. This is a gap between the spec and the plan that translated it, not a deviation by whoever built it — worth a design pass if the current hero feels too plain in practice.

## Before deploying the Apps Script backend (Task 10)

- `doPost` in `apps-script/Code.gs` validates email *presence* but not *format*, unlike the client-side `EMAIL_RE` check in `js/interest-form-validate.mjs`. A direct POST to the deployed endpoint (bypassing the site) could write a garbage value like `"x"` to the Email column. Consider mirroring the regex server-side.
- No length caps on any submitted field — a very large "school" value would go straight into a spreadsheet cell. A cheap `.slice(0, 200)` per field is worthwhile insurance on a public endpoint.
- A malformed JSON request body currently throws out of `JSON.parse` uncaught, which Apps Script turns into a 500 HTML error page rather than a clean JSON error response. Wrapping the body parse in try/catch and returning `jsonResponse_({ok:false})` would keep error responses consistent.
- No `doGet` handler exists, so there's no simple way to confirm the deployment is live from a browser without POSTing a real submission. A `doGet` returning a small JSON ping would make smoke-testing the deployment easier.

## Before publishing to GitHub Pages (Task 13)

- No `og:`/`twitter:` meta tags and no favicon in `index.html`. Since this site's entire purpose is being the destination of an email invitation, link previews in Gmail/Slack/etc. will currently render blank. Low effort, high visibility — worth doing before the invitation email goes out.
- `style.css` loads Google Fonts via `@import`, which serializes the font request behind the stylesheet load. Switching to `<link rel="preconnect">` + `<link rel="stylesheet">` in `index.html`'s `<head>` would measurably improve first paint, which matters more than usual given the expected traffic-spike-from-email-blast pattern this site is built for.
- Consider a short `README.md` documenting the three content-drop workflows this build was specifically designed around: editing `data/results.json` for post-competition results, adding files to `assets/gallery/` + updating `manifest.json` for photos, and adding judge bio cards to the `#judges` section. The architecture already satisfies "easy to update later" — it's just not written down anywhere yet.
