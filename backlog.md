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

## Aesthetic critique (Impeccable `/impeccable critique`, 2026-09-18) — IN PROGRESS

**Resume point for a fresh session:** this is a live, partially-scoped work item. The user ran `/impeccable critique` against the site, reviewed the findings, and picked a subset to fix. **None of the fixes below have been implemented yet.** If you're picking this up cold: read this whole section, then start on item 1.

**Site basics:** static HTML/CSS/JS, no build step. `index.html` + `style.css` at repo root, JS in `js/`. Serve locally with `python3 -m http.server 8080` from the repo root and view at `http://localhost:8080/index.html`. Full critique detail (all findings, not just the ones selected below) is saved at `.impeccable/critique/2026-09-18T15-31-53Z__index-html.md` — read it if you want more context than what's inlined here. Design Health Score at time of critique: **24/40** (Nielsen heuristics, "Acceptable" band).

**Scope the user chose:** "Top priorities only" — the 3 categories below, in this order. Explicitly **not** in scope for this pass: the format step-card grid readability, heading line-height, and the gallery-section container-width mismatch (those are logged separately above as lower-stakes polish, pick up later if wanted).

### 1. No fallback action while both signup CTAs are closed (P0 — do this first)

The Express Interest form and Registration CTA are both correctly disabled right now (interest opens 22 Sept 2026, registration 6 Oct 2026, per `js/config.mjs`), but the page offers **zero alternative action** in the meantime — no "notify me," no calendar export, nothing. Most invitation-email traffic arrives before those dates and hits a dead end.

- Replace the disabled Express Interest form (in `initInterestForm()`, `js/app.js`) with a lightweight "email me when it opens" capture that posts to the same Apps Script endpoint (`Config.APPS_SCRIPT_URL`) with a `notify-only` flag or similar, so it still lands in the same Sheet for follow-up. (Server-side: `apps-script/Code.gs`'s `doPost` will need to branch on that flag, or just accept the same shape and record it — keep it simple.)
- Add a calendar-export link (`.ics` download or a "Add to Calendar" link) next to the hero date (`#hero`, `index.html`) for 21 Nov 2026.
- Update the hero's primary CTA copy so it doesn't promise an action it can't deliver right now (e.g. "Interest opens 22 Sept" instead of "Express Interest" when the window is closed).

### 2. Remove the side-stripe decorative pattern (banned AI-tell, confirmed independently by both the design review and the deterministic scanner)

A 3px teal `border-left`/`border-top` accent is currently applied identically across 6 unrelated component types in `style.css`, ~20 visible instances on one scroll — the color carries no meaning anywhere, it's pure "make the card look designed."

Selectors currently using the pattern:
- `.format__theories li` — `border-left: 3px`
- `.eligibility__list li` — `border-left: 3px`
- `.timeline__list li` — `border-left: 3px`
- `.results-row` — `border-left: 3px`
- `.format__step` — `border-top: 3px` (same trick, rotated)
- `.format__callout` — `border-left: 3px` (this one is the **defensible exception** — a pull-quote/callout is the canonical use case for a left accent bar; keep it here)

Fix: remove the stripe from the first 5, give each a distinct, purposeful treatment instead (full border, subtle background tint, a leading numeral/icon where a real sequence exists, or nothing at all). Don't just recolor them — the point is that identical treatment on 6 different component types is the tell, not the specific color.

### 3. Broken navigation + accessibility bundle

Four related P1s, bundled because they're all "the site's mechanics don't quite work" issues:

- **Sticky header hides every anchor-jump target.** `style.css` defines no `scroll-padding-top` anywhere. Clicking any of the 9 nav links lands the target heading behind the sticky `.site-header`. Fix: `html { scroll-padding-top: 88px; }` at desktop, with a larger value in the mobile media query (header is ~146px tall when wrapped at narrow widths — check current wrapped height and match it).
- **Real WCAG AA contrast failures** (verified against actual computed backgrounds — ignore the detector's raw low-contrast count, most of those were false positives against a `#ffffff` background that doesn't exist on this dark-theme site):
  - `--color-text-muted: #6B7280` measures ~3.18:1 on `--color-bg-card` and ~3.94:1 on `--color-bg-primary` — both fail the 4.5:1 body-text bar. Affects: `.site-footer`, `.tag--tentative`, `.judges__placeholder`/`.results-placeholder`/`.gallery-placeholder`, `.results-row__school`.
  - `.btn--primary`'s text (`#08090B`) measures ~2.82:1 against the indigo end of its own `linear-gradient(120deg, #4B4FA6, #38B6B0)` background — the left half of "Express Interest" fails AA on the page's single most important button. The teal end is fine (~8:1). Fix by picking a text color that works at both gradient stops, or flattening to a single AA-safe background color.
- **Zero `:focus`/`:focus-visible` rules exist anywhere in `style.css`.** Keyboard users get only the browser default outline, which is invisible against `.btn--primary`'s gradient. Add visible focus styles sitewide.
- **The interest form stays fully fillable while submission is disabled**, and the explanation text renders *after* the button instead of before the fields. Fix in `initInterestForm()` (`js/app.js`): disable the whole fieldset (all 4 inputs, not just the submit button) in the `before`/`after` branches, and move `#interest-status`'s message to render above the first field. While touching this: wire the per-field `.interest-form__error` elements to `aria-describedby` on their inputs, add `aria-live="polite"` so screen readers announce validation errors, and move focus to the first invalid field on a failed submit. Also add a `prefers-reduced-motion` guard around `html { scroll-behavior: smooth; }` while in this file.

**After implementing:** re-run `/impeccable critique` (or ask a fresh session to) to confirm the score improved and nothing new broke. Run `node --test js/*.test.mjs` as a regression check regardless (18 tests currently, all passing) before committing.
