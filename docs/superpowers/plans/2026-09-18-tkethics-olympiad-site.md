# UWC-TKEthics Olympiad 2026 Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the single-page static landing site for the UWC-TKEthics Olympiad 2026, matching the approved design spec, ready to publish at `uwcethicsolympiad.wetkarma.com`.

**Architecture:** A single-page vanilla HTML/CSS/JS site (no build step, no framework), split into small ES modules for anything with real logic (funnel date-window state, results rendering, gallery rendering, form validation) so that logic is unit-testable with Node's built-in test runner, while content/markup/styling is verified by manual browser QA. Two placeholder-ready sections (Results, Gallery) read from small local data/manifest files so the user's later content drops require no code changes. Sign-up is a two-stage funnel: a custom inline "Express Interest" form posting to a Google Apps Script Web App (Google Sheet backend), and a "Register" CTA linking out to an external Google Form. Hosting is GitHub Pages with a custom domain via CNAME.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, no preprocessor), vanilla JavaScript as native ES modules (no bundler), Node.js ≥18 (`node --test`) for unit-testing pure logic modules only (dev-time only, not shipped/loaded by the page), Google Apps Script (V8 runtime) for the interest-form backend, GitHub Pages for hosting.

**Spec:** `docs/superpowers/specs/2026-09-18-tkethics-olympiad-site-design.md`

## Global Constraints

- No build step, no framework, no CMS — plain static files served as-is by GitHub Pages.
- No user accounts/login, no payment processing on the site.
- Single scrolling page with anchor-nav sections (`index.html#<section-id>` pattern), matching the existing MPEO site's convention.
- Hosting: GitHub Pages, custom domain `uwcethicsolympiad.wetkarma.com` via a `CNAME` file at repo root.
- Placeholder sections (Judges, Gallery, Results, Video) must render a graceful "coming soon" state — never a broken image, empty box, or dead embed — until real content is supplied.
- The MPEO omega crest logo (`resources/logos/mpeo-omega-crest-transparent.png` / `.svg`) is white-on-transparent — it must only be placed on dark surfaces, never directly on a light/white background.
- Both organizing logos (MPEO crest, TKEthics mark) must appear together near the top of the page, presenting this as a joint MPEO × TKEthics event.
- All tentative figures (exact Nov date, ~$120/team cost, judge roster) must display with an explicit "tentative"/"estimated"/"TBC" label — never presented as final/confirmed.
- Content facts (dates, pricing, rules, leadership contacts) must be copied verbatim/faithfully from `resources/2026 November.pdf` or the existing MPEO site's published leadership page — never invented.
- Visual identity: reuse the existing MPEO site's font stack (`Cinzel`, `Playfair Display`, `Cormorant Garamond`, `Inter`) and dark academia background tokens for brand recognition, but use a distinct accent (indigo/teal, echoing the TKEthics logo's gradient) instead of MPEO's gold, so this event reads as related-but-distinct.
- Funnel dates (Singapore time, UTC+8, per UWC SEA's timezone): Express Interest open `2026-09-22T00:00:00+08:00` → close `2026-10-06T23:59:59+08:00`; Registration open `2026-10-06T00:00:00+08:00` → close `2026-10-26T23:59:59+08:00`; case packages sent `2026-10-29` (informational only); competition day `2026-11-21` (tentative).

---

## File Structure

```
index.html                      # the entire single-page site
style.css                       # all styling, design tokens as CSS custom properties
js/
  config.mjs                    # funnel dates, external URLs (Apps Script, Google Form)
  funnel-state.mjs              # pure: computes before/open/after for a date window
  funnel-state.test.mjs
  results-render.mjs            # pure: results.json -> HTML string
  results-render.test.mjs
  gallery-render.mjs            # pure: gallery manifest -> HTML string
  gallery-render.test.mjs
  interest-form-validate.mjs    # pure: form field object -> {valid, errors}
  interest-form-validate.test.mjs
  app.js                        # DOM wiring: imports the above, renders sections, binds form
data/
  results.json                  # [] until populated after the competition
assets/
  logos/
    mpeo-omega-crest.svg
    mpeo-omega-crest-transparent.png
    tkethics-logo.png
  gallery/
    manifest.json               # [] until photos are added
    .gitkeep
apps-script/
  Code.gs                       # Apps Script Web App source (deployed manually by user)
CNAME                            # "uwcethicsolympiad.wetkarma.com"
```

`resources/` (already in the repo) stays as raw reference material (the proposal PDF, the originally-downloaded logo files) — `assets/` is what the live page actually serves, copied over intentionally in Task 1 so the two don't get confused later.

---

### Task 1: Project scaffold, design tokens, header/nav/footer, CNAME

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `CNAME`
- Create: `assets/logos/mpeo-omega-crest.svg` (copy of `resources/logos/mpeo-omega-crest.svg`)
- Create: `assets/logos/mpeo-omega-crest-transparent.png` (copy of `resources/logos/mpeo-omega-crest-transparent.png`)
- Create: `assets/logos/tkethics-logo.png` (copy of `resources/logos/tkethics-logo.png`)

**Interfaces:**
- Produces: the page skeleton every later task appends sections into — a `<nav>` with anchor links, and ten empty `<section id="...">` containers (`hero`, `about`, `format`, `eligibility`, `timeline`, `judges`, `gallery`, `results`, `faq`, `contact`) that later tasks fill in. Produces CSS custom properties (`--color-bg-primary`, `--color-accent-a`, `--color-accent-b`, `--font-display`, `--font-body`, etc.) that every later task's CSS relies on.

- [ ] **Step 1: Copy the three logo files into `assets/logos/`**

```bash
mkdir -p assets/logos assets/gallery js data apps-script
cp resources/logos/mpeo-omega-crest.svg assets/logos/mpeo-omega-crest.svg
cp resources/logos/mpeo-omega-crest-transparent.png assets/logos/mpeo-omega-crest-transparent.png
cp resources/logos/tkethics-logo.png assets/logos/tkethics-logo.png
```

- [ ] **Step 2: Create `CNAME`**

```
uwcethicsolympiad.wetkarma.com
```

- [ ] **Step 3: Create `style.css` with design tokens and base reset**

```css
/* ==========================================================================
   UWC-TKETHICS OLYMPIAD 2026 — DESIGN SYSTEM
   Related to MPEO's dark-academia system, distinct accent (indigo/teal,
   echoing the TKEthics mark) for this event specifically.
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

:root {
  --color-bg-primary: #0E1013;
  --color-bg-secondary: #16191E;
  --color-bg-card: #21252C;
  --color-bg-card-hover: #2A2F38;
  --color-bg-parchment: #F6F4ED;

  --color-border-subtle: rgba(255, 255, 255, 0.09);
  --color-border-accent: rgba(79, 182, 176, 0.4);

  /* Event accent: indigo -> teal, echoes the TKEthics logo gradient */
  --color-accent-a: #4B4FA6;
  --color-accent-b: #38B6B0;
  --color-accent-gradient: linear-gradient(120deg, var(--color-accent-a), var(--color-accent-b));
  --color-accent-glow: rgba(56, 182, 176, 0.28);

  --color-text-primary: #F5F6F8;
  --color-text-secondary: #A8B0BC;
  --color-text-muted: #6B7280;
  --color-text-dark: #1A1D20;

  --font-display: 'Cinzel', Georgia, serif;
  --font-subhead: 'Playfair Display', Georgia, serif;
  --font-editorial: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  --max-width-container: 1240px;
  --max-width-narrow: 920px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-card: 0 16px 36px -10px rgba(0, 0, 0, 0.6);
  --transition-fast: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-normal: 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  color-scheme: dark;
  background-color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.65;
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}

body {
  overflow-x: hidden;
  background: radial-gradient(circle at 50% 0%, #171A21 0%, #0E1013 70%);
  min-height: 100vh;
}

a { color: inherit; text-decoration: none; transition: var(--transition-fast); }
button { cursor: pointer; border: none; font-family: inherit; }
img { max-width: 100%; height: auto; display: block; }

.container { max-width: var(--max-width-container); margin: 0 auto; padding: 0 24px; }
.container--narrow { max-width: var(--max-width-narrow); }

section { padding: 96px 0; }

h1, h2, h3 { font-family: var(--font-display); font-weight: 700; letter-spacing: 0.01em; }
h2 { font-size: clamp(1.8rem, 3vw, 2.6rem); margin-bottom: 32px; }

.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.95rem;
}
.btn--primary {
  background: var(--color-accent-gradient);
  color: #08090B;
}
.btn--primary:hover { box-shadow: 0 10px 30px -5px var(--color-accent-glow); }
.btn--disabled {
  background: var(--color-bg-card);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

/* --- Header / nav --- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(14, 16, 19, 0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border-subtle);
}
.site-header__logos { display: flex; align-items: center; gap: 16px; }
.site-header__logos img { height: 32px; width: auto; }
.site-header__nav { display: flex; gap: 20px; flex-wrap: wrap; }
.site-header__nav a { font-size: 0.85rem; color: var(--color-text-secondary); }
.site-header__nav a:hover { color: var(--color-text-primary); }

/* --- Footer --- */
.site-footer {
  padding: 48px 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--color-border-subtle);
}

.tag--tentative {
  display: inline-block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-full);
  padding: 2px 10px;
  margin-left: 8px;
  vertical-align: middle;
}
```

- [ ] **Step 4: Create `index.html` skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UWC-TKEthics Olympiad 2026</title>
  <meta name="description" content="An international online ethics tournament for UWC high school teams worldwide, hosted by MPEO in partnership with TKEthics.">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="site-header__logos">
      <img src="assets/logos/mpeo-omega-crest-transparent.png" alt="Model Philosophy Ethics Olympiad crest">
      <img src="assets/logos/tkethics-logo.png" alt="TKEthics logo">
    </div>
    <nav class="site-header__nav">
      <a href="#about">About</a>
      <a href="#format">Format</a>
      <a href="#eligibility">Register</a>
      <a href="#timeline">Timeline</a>
      <a href="#judges">Judges</a>
      <a href="#gallery">Gallery</a>
      <a href="#results">Results</a>
      <a href="#faq">FAQ</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <section id="hero"></section>
    <section id="about"></section>
    <section id="format"></section>
    <section id="eligibility"></section>
    <section id="timeline"></section>
    <section id="judges"></section>
    <section id="gallery"></section>
    <section id="results"></section>
    <section id="faq"></section>
    <section id="contact"></section>
  </main>

  <footer class="site-footer">
    <p>Organized by MPEO in partnership with TKEthics · UWC-TKEthics Olympiad 2026</p>
  </footer>

  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 5: Manual verification — serve locally and check the shell renders**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/index.html`. Expected: dark background, header shows both logos side by side (MPEO crest visible against the dark header — confirms the white-on-transparent logo constraint is respected), nav links present, all ten empty sections exist (inspect via dev tools), no console errors, no 404s in the Network tab for the three logo images or `style.css`.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css CNAME assets/logos
git commit -m "Add site scaffold: shell HTML, design tokens, header/nav/footer, CNAME"
```

---

### Task 2: Funnel date-window logic (pure, unit-tested)

**Files:**
- Create: `js/funnel-state.mjs`
- Create: `js/funnel-state.test.mjs`

**Interfaces:**
- Produces: `getStageState(nowISO, openISO, closeISO)` returning `'before' | 'open' | 'after'` — used by Task 4 (Eligibility/CTA wiring) for both the interest-form and registration windows.

- [ ] **Step 1: Write the failing tests**

```javascript
// js/funnel-state.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getStageState } from './funnel-state.mjs';

const OPEN = '2026-09-22T00:00:00+08:00';
const CLOSE = '2026-10-06T23:59:59+08:00';

test('returns "before" when now is earlier than the open date', () => {
  assert.equal(getStageState('2026-09-01T00:00:00+08:00', OPEN, CLOSE), 'before');
});

test('returns "open" when now is exactly the open instant', () => {
  assert.equal(getStageState(OPEN, OPEN, CLOSE), 'open');
});

test('returns "open" when now is between open and close', () => {
  assert.equal(getStageState('2026-09-25T12:00:00+08:00', OPEN, CLOSE), 'open');
});

test('returns "open" when now is exactly the close instant', () => {
  assert.equal(getStageState(CLOSE, OPEN, CLOSE), 'open');
});

test('returns "after" when now is later than the close date', () => {
  assert.equal(getStageState('2026-11-01T00:00:00+08:00', OPEN, CLOSE), 'after');
});

test('throws on an unparseable date string', () => {
  assert.throws(() => getStageState('not-a-date', OPEN, CLOSE), /Invalid date/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test js/funnel-state.test.mjs`
Expected: FAIL — `Cannot find module './funnel-state.mjs'` (module doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```javascript
// js/funnel-state.mjs

/**
 * @param {string} nowISO
 * @param {string} openISO
 * @param {string} closeISO
 * @returns {'before' | 'open' | 'after'}
 */
export function getStageState(nowISO, openISO, closeISO) {
  const now = new Date(nowISO);
  const open = new Date(openISO);
  const close = new Date(closeISO);

  for (const [label, d] of [['now', now], ['open', open], ['close', close]]) {
    if (Number.isNaN(d.getTime())) {
      throw new Error(`Invalid date: ${label}`);
    }
  }

  if (now < open) return 'before';
  if (now > close) return 'after';
  return 'open';
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test js/funnel-state.test.mjs`
Expected: PASS — all 6 tests green.

- [ ] **Step 5: Commit**

```bash
git add js/funnel-state.mjs js/funnel-state.test.mjs
git commit -m "Add funnel-state module: date-window logic for interest/registration CTAs"
```

---

### Task 3: Results and Gallery render logic (pure, unit-tested)

**Files:**
- Create: `js/results-render.mjs`
- Create: `js/results-render.test.mjs`
- Create: `js/gallery-render.mjs`
- Create: `js/gallery-render.test.mjs`
- Create: `data/results.json`
- Create: `assets/gallery/manifest.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `renderResultsHTML(results)` and `renderGalleryHTML(images)`, both pure functions returning an HTML string, used by Task 8 (Results section) and Task 7 (Gallery section) respectively. `results` shape: `Array<{ placement: number, team: string, school: string }>`. `images` shape: `Array<{ src: string, alt: string }>`.

- [ ] **Step 1: Write the failing tests**

```javascript
// js/results-render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderResultsHTML } from './results-render.mjs';

test('renders a "coming soon" placeholder when results is empty', () => {
  const html = renderResultsHTML([]);
  assert.match(html, /Results will be posted here after the competition/);
});

test('renders a ranked list when results is populated', () => {
  const html = renderResultsHTML([
    { placement: 1, team: 'Team Socrates', school: 'UWC South East Asia' },
    { placement: 2, team: 'Team Kant', school: 'UWC Atlantic' },
  ]);
  assert.match(html, /1st/);
  assert.match(html, /Team Socrates/);
  assert.match(html, /UWC South East Asia/);
  assert.match(html, /2nd/);
  assert.match(html, /Team Kant/);
});

test('escapes HTML in team/school names to prevent injection', () => {
  const html = renderResultsHTML([
    { placement: 1, team: '<script>alert(1)</script>', school: 'X' },
  ]);
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.match(html, /&lt;script&gt;/);
});
```

```javascript
// js/gallery-render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderGalleryHTML } from './gallery-render.mjs';

test('renders a "coming soon" placeholder when images is empty', () => {
  const html = renderGalleryHTML([]);
  assert.match(html, /Photos from the competition will appear here soon/);
});

test('renders an img tag per image when populated', () => {
  const html = renderGalleryHTML([
    { src: 'assets/gallery/round1.jpg', alt: 'Round 1 teams presenting' },
  ]);
  assert.match(html, /<img[^>]*src="assets\/gallery\/round1\.jpg"/);
  assert.match(html, /alt="Round 1 teams presenting"/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test js/results-render.test.mjs js/gallery-render.test.mjs`
Expected: FAIL — modules don't exist yet.

- [ ] **Step 3: Write the implementations**

```javascript
// js/results-render.mjs

const ORDINALS = { 1: '1st', 2: '2nd', 3: '3rd' };

function ordinal(n) {
  return ORDINALS[n] || `${n}th`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * @param {Array<{placement: number, team: string, school: string}>} results
 * @returns {string}
 */
export function renderResultsHTML(results) {
  if (!results || results.length === 0) {
    return `<p class="results-placeholder">Results will be posted here after the competition on 21 Nov 2026 (tentative).</p>`;
  }

  const rows = results
    .slice()
    .sort((a, b) => a.placement - b.placement)
    .map(
      (r) => `
      <li class="results-row">
        <span class="results-row__place">${ordinal(r.placement)}</span>
        <span class="results-row__team">${escapeHTML(r.team)}</span>
        <span class="results-row__school">${escapeHTML(r.school)}</span>
      </li>`
    )
    .join('');

  return `<ul class="results-list">${rows}</ul>`;
}
```

```javascript
// js/gallery-render.mjs

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * @param {Array<{src: string, alt: string}>} images
 * @returns {string}
 */
export function renderGalleryHTML(images) {
  if (!images || images.length === 0) {
    return `<p class="gallery-placeholder">Photos from the competition will appear here soon.</p>`;
  }

  const items = images
    .map(
      (img) => `<img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.alt)}" loading="lazy">`
    )
    .join('');

  return `<div class="gallery-grid">${items}</div>`;
}
```

```json
// data/results.json
[]
```

```json
// assets/gallery/manifest.json
[]
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test js/results-render.test.mjs js/gallery-render.test.mjs`
Expected: PASS — all 6 tests green.

- [ ] **Step 5: Commit**

```bash
git add js/results-render.mjs js/results-render.test.mjs js/gallery-render.mjs js/gallery-render.test.mjs data/results.json assets/gallery/manifest.json
git commit -m "Add results/gallery render modules with empty-state placeholders"
```

---

### Task 4: Express Interest form validation logic (pure, unit-tested)

**Files:**
- Create: `js/interest-form-validate.mjs`
- Create: `js/interest-form-validate.test.mjs`

**Interfaces:**
- Produces: `validateInterestForm(fields)` returning `{ valid: boolean, errors: Record<string,string> }`, used by Task 9's form submit handler. `fields` shape: `{ name: string, email: string, school: string, role: 'student'|'coach', website: string }` (`website` is the honeypot field — must always be empty).

- [ ] **Step 1: Write the failing tests**

```javascript
// js/interest-form-validate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateInterestForm } from './interest-form-validate.mjs';

const validFields = {
  name: 'Ada Lovelace',
  email: 'ada@example.edu',
  school: 'UWC South East Asia',
  role: 'student',
  website: '',
};

test('accepts a fully valid submission', () => {
  const result = validateInterestForm(validFields);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('rejects a missing name', () => {
  const result = validateInterestForm({ ...validFields, name: '  ' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.name, 'Please enter your name.');
});

test('rejects an invalid email', () => {
  const result = validateInterestForm({ ...validFields, email: 'not-an-email' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.email, 'Please enter a valid email address.');
});

test('rejects a missing school', () => {
  const result = validateInterestForm({ ...validFields, school: '' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.school, 'Please enter your school.');
});

test('rejects a role outside student/coach', () => {
  const result = validateInterestForm({ ...validFields, role: 'alien' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.role, 'Please select whether you are a student or a coach/teacher.');
});

test('rejects a filled-in honeypot field as a bot submission', () => {
  const result = validateInterestForm({ ...validFields, website: 'http://spam.example' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.website, 'Submission rejected.');
});

test('reports multiple errors at once', () => {
  const result = validateInterestForm({ name: '', email: '', school: '', role: '', website: '' });
  assert.equal(result.valid, false);
  assert.equal(Object.keys(result.errors).length, 4);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test js/interest-form-validate.test.mjs`
Expected: FAIL — module doesn't exist yet.

- [ ] **Step 3: Write the implementation**

```javascript
// js/interest-form-validate.mjs

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = new Set(['student', 'coach']);

/**
 * @param {{name: string, email: string, school: string, role: string, website: string}} fields
 * @returns {{valid: boolean, errors: Record<string,string>}}
 */
export function validateInterestForm(fields) {
  const errors = {};

  if (fields.website && fields.website.trim() !== '') {
    errors.website = 'Submission rejected.';
    return { valid: false, errors };
  }

  if (!fields.name || fields.name.trim() === '') {
    errors.name = 'Please enter your name.';
  }

  if (!fields.email || !EMAIL_RE.test(fields.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!fields.school || fields.school.trim() === '') {
    errors.school = 'Please enter your school.';
  }

  if (!VALID_ROLES.has(fields.role)) {
    errors.role = 'Please select whether you are a student or a coach/teacher.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test js/interest-form-validate.test.mjs`
Expected: PASS — all 7 tests green.

- [ ] **Step 5: Commit**

```bash
git add js/interest-form-validate.mjs js/interest-form-validate.test.mjs
git commit -m "Add Express Interest form validation module with honeypot check"
```

---

### Task 5: Config module (dates + external URLs)

**Files:**
- Create: `js/config.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `Config` object with `INTEREST_OPEN`, `INTEREST_CLOSE`, `REGISTRATION_OPEN`, `REGISTRATION_CLOSE`, `CASE_PACKAGE_DATE`, `COMPETITION_DATE`, `APPS_SCRIPT_URL`, `REGISTRATION_FORM_URL` — consumed by Task 6 (Eligibility CTA wiring) and Task 9 (form submit handler).

- [ ] **Step 1: Write `js/config.mjs`**

```javascript
// js/config.mjs

export const Config = {
  // Funnel windows — Singapore time (UTC+8), per the proposal timeline.
  INTEREST_OPEN: '2026-09-22T00:00:00+08:00',
  INTEREST_CLOSE: '2026-10-06T23:59:59+08:00',
  REGISTRATION_OPEN: '2026-10-06T00:00:00+08:00',
  REGISTRATION_CLOSE: '2026-10-26T23:59:59+08:00',
  CASE_PACKAGE_DATE: '2026-10-29',
  COMPETITION_DATE: '2026-11-21', // tentative, per proposal

  // REPLACE after deploying the Apps Script Web App in Task 10 —
  // see apps-script/Code.gs deployment steps.
  APPS_SCRIPT_URL: 'REPLACE_WITH_DEPLOYED_APPS_SCRIPT_WEB_APP_URL',

  // REPLACE with the real registration Google Form link once it exists.
  REGISTRATION_FORM_URL: 'REPLACE_WITH_REGISTRATION_GOOGLE_FORM_URL',
};
```

- [ ] **Step 2: Manual verification**

Run: `node -e "import('./js/config.mjs').then(m => console.log(m.Config.INTEREST_OPEN))"`
Expected: prints `2026-09-22T00:00:00+08:00` with no errors.

- [ ] **Step 3: Commit**

```bash
git add js/config.mjs
git commit -m "Add config module for funnel dates and external form URLs"
```

---

### Task 6: Hero, About, and Format sections (content + styling)

**Files:**
- Modify: `index.html` (fill `#hero`, `#about`, `#format` sections)
- Modify: `style.css` (append section-specific styles)

**Interfaces:**
- Consumes: nothing (static content only in this task).
- Produces: DOM structure with class hooks (`.hero`, `.about`, `.format`, `.format__video-slot`) that Task 11 (responsive QA) and no other task depend on structurally.

- [ ] **Step 1: Fill in the `#hero` section in `index.html`**

```html
<section id="hero" class="hero">
  <div class="container hero__inner">
    <p class="hero__eyebrow">MPEO × TKEthics present</p>
    <h1 class="hero__title">UWC-TKEthics Olympiad 2026</h1>
    <p class="hero__subtitle">
      An international, online ethics tournament for high school teams from
      UWC schools worldwide — collaborative reasoning over combative debate,
      judged by professional ethicists.
    </p>
    <p class="hero__date">
      21 November 2026 <span class="tag--tentative">Tentative</span> · Hosted on Zoom
    </p>
    <div class="hero__ctas">
      <a href="#eligibility" class="btn btn--primary">Express Interest</a>
      <a href="#format" class="btn btn--ghost">See how it works</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Fill in the `#about` section**

```html
<section id="about" class="about">
  <div class="container container--narrow">
    <h2>What is the UWC-TKEthics Olympiad?</h2>
    <p>
      The UWC-TKEthics Olympiad is a new international competition, organized
      by the Model Philosophy Ethics Olympiad (MPEO) leadership team, that
      brings high school students from UWC schools around the world together
      to reason through real-world ethical dilemmas — collaboratively, not
      combatively. Unlike a traditional debate, teams are free to agree with
      each other's positions; what's being tested is the quality and honesty
      of the reasoning, not who "wins" an argument.
    </p>
    <p>
      The tournament is designed to build critical thinking and ethical
      reasoning skills in a supportive environment, connect students across
      UWC's global network through a shared interest in philosophy, and
      strengthen intercultural dialogue and understanding between schools
      that might otherwise never compete together.
    </p>
  </div>
</section>
```

- [ ] **Step 3: Fill in the `#format` section**

```html
<section id="format" class="format">
  <div class="container container--narrow">
    <h2>How the competition works</h2>

    <div class="format__video-slot" aria-label="Format explainer video">
      <p>Video walkthrough coming soon.</p>
    </div>

    <h3>The round structure</h3>
    <p>
      Each match runs through four parts. Team A or Team B opens with a
      <strong>5-minute presentation</strong> of their main arguments on an
      assigned ethical case. The opposing team then gives
      <strong>2 minutes of commentary</strong> — constructive suggestions,
      not rebuttal. The presenting team gets <strong>3 minutes to respond</strong>
      to that commentary, followed by a <strong>judges' questions</strong>
      segment. Teams then swap roles for a second case. Four rounds are
      played in total across the day.
    </p>
    <p>
      <strong>This is not a debate.</strong> Teams can agree with each
      other's position. You are not scored on winning an argument — you're
      scored on how clearly, honestly, and thoughtfully you engage with the
      ethical dimensions of the case.
    </p>

    <h3>A quick primer on ethical theories</h3>
    <p>
      You do <strong>not</strong> need a philosophy background to compete —
      but it helps to know the major lenses judges will listen for:
    </p>
    <ul class="format__theories">
      <li>
        <strong>Utilitarianism</strong> — judges an action by its
        consequences: does it produce the greatest good (or least harm) for
        the greatest number of people?
      </li>
      <li>
        <strong>Deontology</strong> — judges an action by whether it follows
        a moral duty or rule, regardless of its outcome (for example,
        "honesty is required even when a lie would help").
      </li>
      <li>
        <strong>Virtue ethics</strong> — asks what a genuinely
        <em>good</em> person would do in this situation, focusing on
        character rather than rules or outcomes.
      </li>
    </ul>
    <p>
      Strong teams don't just pick one lens — they show they've considered
      multiple viewpoints and can explain why their position holds up
      against the strongest objections to it.
    </p>
  </div>
</section>
```

- [ ] **Step 4: Append styles for these three sections to `style.css`**

```css
/* --- Hero --- */
.hero { padding-top: 140px; padding-bottom: 120px; text-align: center; }
.hero__eyebrow {
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
  color: var(--color-accent-b);
  margin-bottom: 16px;
}
.hero__title { font-size: clamp(2.4rem, 6vw, 4.2rem); margin-bottom: 20px; }
.hero__subtitle {
  font-family: var(--font-editorial);
  font-size: 1.3rem;
  color: var(--color-text-secondary);
  max-width: 700px;
  margin: 0 auto 24px;
}
.hero__date { color: var(--color-text-secondary); margin-bottom: 32px; }
.hero__ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.btn--ghost {
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-primary);
}
.btn--ghost:hover { border-color: var(--color-border-accent); }

/* --- About / Format shared prose styles --- */
.about p, .format p { color: var(--color-text-secondary); margin-bottom: 20px; }
.format h3 { font-size: 1.3rem; margin: 40px 0 16px; }
.format__theories { list-style: none; display: grid; gap: 16px; margin-bottom: 20px; }
.format__theories li {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  color: var(--color-text-secondary);
}
.format__video-slot {
  aspect-ratio: 16 / 9;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  margin-bottom: 32px;
}
```

- [ ] **Step 5: Manual verification**

Serve locally (`python3 -m http.server 8000`), open `http://localhost:8000/index.html#format`. Expected: hero centers with both CTAs visible, the "Tentative" tag renders next to the date, the video slot shows a dashed placeholder box (not a broken embed), the three ethical-theory cards render as a grid, no console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css
git commit -m "Add Hero, About, and Format sections with written explainer and theory primer"
```

---

### Task 7: Judges & TKEthics and Gallery sections

**Files:**
- Modify: `index.html` (fill `#judges`, `#gallery` sections)
- Modify: `style.css`
- Modify: `js/app.js` (create if absent — wires gallery render into the DOM)

**Interfaces:**
- Consumes: `renderGalleryHTML` from `js/gallery-render.mjs` (Task 3), `assets/gallery/manifest.json` (Task 3).
- Produces: `js/app.js` as a growing file later tasks (8, 9) also append to — later tasks append new `import`/init calls to this same file rather than creating competing entry points.

- [ ] **Step 1: Fill in the `#judges` section in `index.html`**

```html
<section id="judges" class="judges">
  <div class="container container--narrow">
    <h2>Judges &amp; the TKEthics partnership</h2>
    <p>
      Matches are judged by professional ethicists and experienced debate
      coaches sourced through our partnership with
      <a href="https://www.tkethics.org/" target="_blank" rel="noopener">TKEthics</a>,
      following the official Ethics Olympiad scoring criteria — teams are
      scored on how clearly they address the case, the depth of ethical
      dimensions they consider, the quality of their response to the
      opposing team's commentary, and their response to judges' questions.
    </p>
    <div class="judges__placeholder">
      <p>Judge bios coming soon.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Fill in the `#gallery` section**

```html
<section id="gallery" class="gallery">
  <div class="container">
    <h2>Gallery</h2>
    <div id="gallery-root"></div>
  </div>
</section>
```

- [ ] **Step 3: Create `js/app.js` and wire the gallery render**

```javascript
// js/app.js
import { renderGalleryHTML } from './gallery-render.mjs';

async function initGallery() {
  const root = document.getElementById('gallery-root');
  if (!root) return;

  try {
    const res = await fetch('assets/gallery/manifest.json');
    const images = await res.json();
    root.innerHTML = renderGalleryHTML(images);
  } catch (err) {
    root.innerHTML = renderGalleryHTML([]);
  }
}

initGallery();
```

- [ ] **Step 4: Append styles for judges and gallery to `style.css`**

```css
.judges p { color: var(--color-text-secondary); margin-bottom: 24px; }
.judges__placeholder, .results-placeholder, .gallery-placeholder {
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  color: var(--color-text-muted);
  text-align: center;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.gallery-grid img { border-radius: var(--radius-md); object-fit: cover; aspect-ratio: 4 / 3; }
```

- [ ] **Step 5: Manual verification**

Serve locally, open `http://localhost:8000/index.html#gallery`. Expected: Judges section shows the placeholder box with "Judge bios coming soon."; Gallery section shows "Photos from the competition will appear here soon." (since `manifest.json` is `[]`); no console errors in Network/Console tabs. Then temporarily edit `assets/gallery/manifest.json` to `[{"src": "assets/logos/tkethics-logo.png", "alt": "test"}]`, refresh, confirm an image grid renders instead — then revert the manifest back to `[]` before committing.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css js/app.js
git commit -m "Add Judges/TKEthics and Gallery sections; wire gallery rendering into app.js"
```

---

### Task 8: Results & Winners section

**Files:**
- Modify: `index.html` (fill `#results` section)
- Modify: `js/app.js` (add results init)
- Modify: `style.css`

**Interfaces:**
- Consumes: `renderResultsHTML` from `js/results-render.mjs` (Task 3), `data/results.json` (Task 3).

- [ ] **Step 1: Fill in the `#results` section in `index.html`**

```html
<section id="results" class="results">
  <div class="container container--narrow">
    <h2>Results &amp; Winners</h2>
    <div id="results-root"></div>
  </div>
</section>
```

- [ ] **Step 2: Add a results init function to `js/app.js`**

```javascript
// js/app.js — add this import at the top alongside the existing one
import { renderResultsHTML } from './results-render.mjs';

// add this function below initGallery, and call it at the bottom
async function initResults() {
  const root = document.getElementById('results-root');
  if (!root) return;

  try {
    const res = await fetch('data/results.json');
    const results = await res.json();
    root.innerHTML = renderResultsHTML(results);
  } catch (err) {
    root.innerHTML = renderResultsHTML([]);
  }
}

initGallery();
initResults();
```

- [ ] **Step 3: Append styles for results to `style.css`**

```css
.results-list { list-style: none; display: grid; gap: 12px; }
.results-row {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: 14px 20px;
}
.results-row__place {
  font-family: var(--font-display);
  color: var(--color-accent-b);
  min-width: 48px;
}
.results-row__team { font-weight: 600; }
.results-row__school { color: var(--color-text-muted); margin-left: auto; font-size: 0.9rem; }
```

- [ ] **Step 4: Manual verification**

Serve locally, open `http://localhost:8000/index.html#results`. Expected: shows "Results will be posted here after the competition on 21 Nov 2026 (tentative)." Then temporarily edit `data/results.json` to `[{"placement":1,"team":"Team Socrates","school":"UWC South East Asia"}]`, refresh, confirm a ranked row renders with "1st", team, and school — then revert `data/results.json` back to `[]` before committing.

**This is the task Noelle's "make results easy to update after the competition" requirement lands on** — confirm that after the real event, updating this section is exactly: edit `data/results.json` with the real standings, commit, push. No HTML/CSS/JS changes needed.

- [ ] **Step 5: Commit**

```bash
git add index.html js/app.js style.css
git commit -m "Add Results & Winners section, data-driven from data/results.json"
```

---

### Task 9: Eligibility & How to Register section, wired to funnel state

**Files:**
- Modify: `index.html` (fill `#eligibility` section)
- Modify: `js/app.js` (add interest-form submit handler + CTA state wiring)
- Modify: `style.css`

**Interfaces:**
- Consumes: `getStageState` from `js/funnel-state.mjs` (Task 2), `validateInterestForm` from `js/interest-form-validate.mjs` (Task 4), `Config` from `js/config.mjs` (Task 5).

- [ ] **Step 1: Fill in the `#eligibility` section in `index.html`**

```html
<section id="eligibility" class="eligibility">
  <div class="container container--narrow">
    <h2>Eligibility &amp; how to register</h2>

    <ul class="eligibility__list">
      <li>Teams of <strong>3–5 students</strong>, Grade 7 or above.</li>
      <li>Members may span different grade levels; cross-school teams are not recommended.</li>
      <li>A background in philosophy or debate helps, but is not required.</li>
      <li>Estimated cost: <strong>~$120 USD per team</strong> <span class="tag--tentative">Estimated</span>, covering tournament operations and judges.</li>
      <li>Stable internet connection and a Zoom-capable device required on the day.</li>
    </ul>

    <div class="eligibility__funnel">
      <div class="funnel-step">
        <h3>Step 1 — Express Interest</h3>
        <p>Tell us you're interested and we'll keep you posted on registration.</p>

        <form id="interest-form" class="interest-form" novalidate>
          <div class="interest-form__row">
            <label for="if-name">Name</label>
            <input id="if-name" name="name" type="text" autocomplete="name" required>
            <p class="interest-form__error" data-error-for="name"></p>
          </div>
          <div class="interest-form__row">
            <label for="if-email">Email</label>
            <input id="if-email" name="email" type="email" autocomplete="email" required>
            <p class="interest-form__error" data-error-for="email"></p>
          </div>
          <div class="interest-form__row">
            <label for="if-school">School</label>
            <input id="if-school" name="school" type="text" required>
            <p class="interest-form__error" data-error-for="school"></p>
          </div>
          <div class="interest-form__row">
            <label for="if-role">I am a</label>
            <select id="if-role" name="role" required>
              <option value="">Select one…</option>
              <option value="student">Student</option>
              <option value="coach">Coach / supervising teacher</option>
            </select>
            <p class="interest-form__error" data-error-for="role"></p>
          </div>
          <div class="interest-form__honeypot" aria-hidden="true">
            <label for="if-website">Website</label>
            <input id="if-website" name="website" type="text" tabindex="-1" autocomplete="off">
          </div>

          <button type="submit" class="btn btn--primary" id="interest-submit">Express Interest</button>
          <p class="interest-form__status" id="interest-status" role="status"></p>
        </form>
      </div>

      <div class="funnel-step">
        <h3>Step 2 — Register your team</h3>
        <p>Once the registration window opens, complete the full team registration form.</p>
        <a id="registration-cta" href="#" class="btn btn--primary">Register</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add CTA-state and form-submit wiring to `js/app.js`**

```javascript
// js/app.js — add these imports at the top alongside the existing ones
import { getStageState } from './funnel-state.mjs';
import { validateInterestForm } from './interest-form-validate.mjs';
import { Config } from './config.mjs';

// add below the existing functions

function nowISO() {
  return new Date().toISOString();
}

function initRegistrationCTA() {
  const cta = document.getElementById('registration-cta');
  if (!cta) return;

  const state = getStageState(nowISO(), Config.REGISTRATION_OPEN, Config.REGISTRATION_CLOSE);

  if (state === 'before') {
    cta.textContent = 'Registration opens 6 Oct 2026';
    cta.classList.add('btn--disabled');
    cta.removeAttribute('href');
  } else if (state === 'after') {
    cta.textContent = 'Registration closed';
    cta.classList.add('btn--disabled');
    cta.removeAttribute('href');
  } else {
    cta.textContent = 'Register your team';
    cta.href = Config.REGISTRATION_FORM_URL;
    cta.target = '_blank';
    cta.rel = 'noopener';
  }
}

function showFieldErrors(errors) {
  document.querySelectorAll('.interest-form__error').forEach((el) => (el.textContent = ''));
  for (const [field, message] of Object.entries(errors)) {
    const el = document.querySelector(`[data-error-for="${field}"]`);
    if (el) el.textContent = message;
  }
}

function initInterestForm() {
  const form = document.getElementById('interest-form');
  const status = document.getElementById('interest-status');
  const submitBtn = document.getElementById('interest-submit');
  if (!form) return;

  const stage = getStageState(nowISO(), Config.INTEREST_OPEN, Config.INTEREST_CLOSE);
  if (stage === 'before') {
    status.textContent = 'The interest form opens 22 Sept 2026.';
    submitBtn.disabled = true;
    return;
  }
  if (stage === 'after') {
    status.textContent = 'The interest window has closed. Watch for the registration window instead.';
    submitBtn.disabled = true;
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fields = {
      name: form.name.value,
      email: form.email.value,
      school: form.school.value,
      role: form.role.value,
      website: form.website.value,
    };

    const { valid, errors } = validateInterestForm(fields);
    showFieldErrors(errors);
    if (!valid) return;

    submitBtn.disabled = true;
    status.textContent = 'Submitting…';

    try {
      await fetch(Config.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(fields),
      });
      status.textContent = "Thanks — we'll be in touch.";
      form.reset();
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again or email us directly.';
      submitBtn.disabled = false;
    }
  });
}

initRegistrationCTA();
initInterestForm();
```

- [ ] **Step 3: Append styles for eligibility/form to `style.css`**

```css
.eligibility__list {
  list-style: none;
  display: grid;
  gap: 12px;
  margin-bottom: 48px;
  color: var(--color-text-secondary);
}
.eligibility__list li {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: 14px 20px;
}

.eligibility__funnel { display: grid; gap: 40px; grid-template-columns: 1fr 1fr; }
@media (max-width: 720px) { .eligibility__funnel { grid-template-columns: 1fr; } }
.funnel-step h3 { font-size: 1.1rem; margin-bottom: 8px; }
.funnel-step p { color: var(--color-text-secondary); margin-bottom: 16px; }

.interest-form__row { display: grid; gap: 6px; margin-bottom: 16px; }
.interest-form__row label { font-size: 0.85rem; color: var(--color-text-secondary); }
.interest-form__row input, .interest-form__row select {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  color: var(--color-text-primary);
  font-family: var(--font-body);
}
.interest-form__error { color: #E5786B; font-size: 0.8rem; min-height: 1em; }
.interest-form__honeypot { position: absolute; left: -9999px; }
.interest-form__status { margin-top: 12px; color: var(--color-text-secondary); font-size: 0.9rem; }
```

- [ ] **Step 4: Manual verification**

Serve locally, open `http://localhost:8000/index.html#eligibility`. Since today's date is before 22 Sept 2026, expected: the interest form shows "The interest form opens 22 Sept 2026." and the submit button is disabled; the Register CTA shows "Registration opens 6 Oct 2026" and is not a clickable link. Then, in dev tools, temporarily monkey-patch by editing `Config.INTEREST_OPEN`/`Config.REGISTRATION_OPEN` in `js/config.mjs` to a past date, refresh, and confirm: the form becomes submittable, submitting with an empty name shows the "Please enter your name." inline error, filling in a syntactically invalid email shows the email error, and filling in all fields validly and submitting shows "Submitting…" then either a success or the network-failure error message (expected to fail at this point since `Config.APPS_SCRIPT_URL` is still the placeholder string — confirms the error path renders correctly). Revert `js/config.mjs` back to the real dates before committing.

- [ ] **Step 5: Commit**

```bash
git add index.html js/app.js style.css
git commit -m "Add Eligibility/Register section: funnel-aware CTAs and Express Interest form"
```

---

### Task 10: Google Apps Script backend for the Express Interest form

**Files:**
- Create: `apps-script/Code.gs`

**Interfaces:**
- Consumes: JSON POST body matching the `fields` shape from Task 9 (`name`, `email`, `school`, `role`, `website`).
- Produces: appends one row per submission to a Google Sheet; this task's deployed URL becomes `Config.APPS_SCRIPT_URL` (Task 5/9).

This task's code cannot be unit-tested locally (it only runs inside Google's Apps Script environment against a real Sheet) — verification is a manual deployment + live-request check.

- [ ] **Step 1: Write `apps-script/Code.gs`**

```javascript
// apps-script/Code.gs
//
// Deploy this as a Web App bound to a Google Sheet (see deployment steps
// below). doPost receives the Express Interest form's JSON body and
// appends one row per submission.

const SHEET_NAME = 'Interest Submissions';

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const data = JSON.parse(e.postData.contents);

  // Reject bot submissions (honeypot field filled in).
  if (data.website && String(data.website).trim() !== '') {
    return jsonResponse_({ ok: false, error: 'rejected' });
  }

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const school = String(data.school || '').trim();
  const role = String(data.role || '').trim();

  if (!name || !email || !school || (role !== 'student' && role !== 'coach')) {
    return jsonResponse_({ ok: false, error: 'invalid submission' });
  }

  sheet.appendRow([new Date(), name, email, school, role]);

  return jsonResponse_({ ok: true });
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'School', 'Role']);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 2: Deploy manually (requires the user's Google account — cannot be done by an assistant)**

1. Create a new Google Sheet (e.g. "UWC-TKEthics Olympiad — Interest Submissions").
2. In the Sheet, open **Extensions → Apps Script**.
3. Delete the default `Code.gs` contents and paste in the file from Step 1.
4. Click **Deploy → New deployment**, type **Web app**, execute as **Me**, access **Anyone**.
5. Copy the deployed Web App URL (ends in `/exec`).

- [ ] **Step 3: Commit the source file**

```bash
git add apps-script/Code.gs
git commit -m "Add Apps Script backend source for the Express Interest form"
```

- [ ] **Step 4: Wire the real URL into config and verify end-to-end (do this once Step 2 is complete)**

Edit `js/config.mjs`, replacing `APPS_SCRIPT_URL`'s placeholder with the real `/exec` URL from Step 2.

Run:
```bash
curl -X POST "<your deployed /exec URL>" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"name":"Test User","email":"test@example.com","school":"Test School","role":"student","website":""}'
```
Expected: `{"ok":true}` response, and a new row appears in the "Interest Submissions" sheet with today's timestamp and the test values. Then open the live page, submit the Express Interest form for real (with the funnel date temporarily patched open, as in Task 9 Step 4), and confirm a second row appears from the browser submission.

- [ ] **Step 5: Commit the real config**

```bash
git add js/config.mjs
git commit -m "Wire deployed Apps Script Web App URL into config"
```

---

### Task 11: Timeline, FAQ, and Contact/Leadership sections

**Files:**
- Modify: `index.html` (fill `#timeline`, `#faq`, `#contact` sections)
- Modify: `style.css`

**Interfaces:**
- Consumes: nothing (static content only).

- [ ] **Step 1: Fill in the `#timeline` section in `index.html`**

```html
<section id="timeline" class="timeline">
  <div class="container container--narrow">
    <h2>Timeline</h2>
    <ul class="timeline__list">
      <li><span class="timeline__date">22 Sept 2026</span><span>Express Interest form opens</span></li>
      <li><span class="timeline__date">6 Oct 2026</span><span>Express Interest form closes; Registration opens</span></li>
      <li><span class="timeline__date">26 Oct 2026</span><span>Registration closes</span></li>
      <li><span class="timeline__date">29 Oct 2026</span><span>Case packages sent to registered teams</span></li>
      <li><span class="timeline__date">21 Nov 2026 <span class="tag--tentative">Tentative</span></span><span>Competition day</span></li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: Fill in the `#faq` section**

```html
<section id="faq" class="faq">
  <div class="container container--narrow">
    <h2>FAQ</h2>

    <details class="faq__item">
      <summary>Is this a debate?</summary>
      <p>No. Teams can agree with each other's position — you're judged on the quality of your reasoning, not on winning an argument.</p>
    </details>

    <details class="faq__item">
      <summary>Do I need to know ethical theory beforehand?</summary>
      <p>No prior experience is required. Read the case package carefully, think through the arguments, and you're ready — see the "How the competition works" section above for a primer.</p>
    </details>

    <details class="faq__item">
      <summary>What are the microphone/conferencing rules on the day?</summary>
      <p>Keep your microphone muted unless invited to speak by the moderator/judge. During your team's private conference time, you may turn your mic off if everyone is in one room; if your team is spread across locations, use a separate call for team discussion and stay silent on it outside your allotted conference times.</p>
    </details>

    <details class="faq__item">
      <summary>What happens if there's a tie?</summary>
      <p>The head judge breaks ties using the highest score in the first heat; if that's still tied, the highest score in the second heat, and so on.</p>
    </details>

    <details class="faq__item">
      <summary>How do I challenge a result?</summary>
      <p>Complaints or challenges to results must be submitted in writing to the organizers. Results are otherwise final and are published within 24 hours of the competition.</p>
    </details>

    <details class="faq__item">
      <summary>Can I use outside research to prepare?</summary>
      <p>Yes — but simply presenting facts won't score well on its own. You need valid, persuasive arguments backed by facts, and if you cite a specific fact not in the case itself, name your source (e.g. "according to a 2011 article in National Geographic…").</p>
    </details>
  </div>
</section>
```

- [ ] **Step 3: Fill in the `#contact` section**

```html
<section id="contact" class="contact">
  <div class="container container--narrow">
    <h2>Contact &amp; leadership</h2>
    <p>The UWC-TKEthics Olympiad 2026 is organized by the MPEO leadership team. Questions? Reach out to any of us:</p>
    <ul class="contact__list">
      <li><strong>Nancy Zhu</strong> — <a href="mailto:zhu138248@gapps.uwcsea.edu.sg">zhu138248@gapps.uwcsea.edu.sg</a></li>
      <li><strong>Noelle Gao</strong> — <a href="mailto:gao131446@gapps.uwcsea.edu.sg">gao131446@gapps.uwcsea.edu.sg</a></li>
      <li><strong>Sophie Laya</strong> — <a href="mailto:laya47962@gapps.uwcsea.edu.sg">laya47962@gapps.uwcsea.edu.sg</a></li>
      <li><strong>Noah Austin</strong> — <a href="mailto:austi118767@gapps.uwcsea.edu.sg">austi118767@gapps.uwcsea.edu.sg</a></li>
      <li><strong>Adela Gao</strong> — <a href="mailto:gao127710@gapps.uwcsea.edu.sg">gao127710@gapps.uwcsea.edu.sg</a></li>
      <li><strong>Loka Qiu</strong> — <a href="mailto:qiu130234@gapps.uwcsea.edu.sg">qiu130234@gapps.uwcsea.edu.sg</a></li>
    </ul>
  </div>
</section>
```

- [ ] **Step 4: Append styles for timeline, FAQ, and contact to `style.css`**

```css
.timeline__list { list-style: none; display: grid; gap: 4px; }
.timeline__list li {
  display: flex;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border-subtle);
}
.timeline__date {
  font-family: var(--font-display);
  color: var(--color-accent-b);
  min-width: 160px;
}

.faq__item {
  border-bottom: 1px solid var(--color-border-subtle);
  padding: 16px 0;
}
.faq__item summary { cursor: pointer; font-weight: 600; }
.faq__item p { color: var(--color-text-secondary); margin-top: 12px; }

.contact__list { list-style: none; display: grid; gap: 10px; margin-top: 20px; }
.contact__list a { color: var(--color-accent-b); }
```

- [ ] **Step 5: Manual verification**

Serve locally, open `http://localhost:8000/index.html#timeline`, `#faq`, and `#contact` in turn. Expected: timeline rows render in date order with the tentative tag on the competition date; each FAQ item expands/collapses on click (native `<details>` behavior — no JS needed); all six mailto links are present and each opens the system mail client with the correct address when clicked; no console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css
git commit -m "Add Timeline, FAQ, and Contact/Leadership sections"
```

---

### Task 12: Full-page responsive and accessibility QA pass

**Files:**
- Modify: `index.html` (only if QA surfaces real defects)
- Modify: `style.css` (only if QA surfaces real defects)

**Interfaces:**
- Consumes: the complete page from Tasks 1–11.

- [ ] **Step 1: Run all unit tests one more time as a regression check**

Run: `node --test js/*.test.mjs`
Expected: PASS — all tests across `funnel-state`, `results-render`, `gallery-render`, and `interest-form-validate` green.

- [ ] **Step 2: Desktop viewport pass**

Serve locally, open at a 1440px-wide window. Walk the page top to bottom via the nav links. Expected: no horizontal scrollbar, no overlapping text, both logos crisp in the header, hero CTAs aligned, eligibility funnel shows as two side-by-side columns.

- [ ] **Step 3: Mobile viewport pass**

Using browser dev tools, set viewport to 375×812 (iPhone-sized). Re-walk the page. Expected: nav links wrap sensibly under the logos, hero text scales down and stays centered, the eligibility funnel stacks to one column, gallery grid collapses to fewer columns, no text overflows its container, all buttons remain tappable (not cut off).

- [ ] **Step 4: Accessibility spot-check**

Confirm every `<img>` has non-empty `alt` text (the three logos, and any gallery images once populated). Confirm every form `<input>`/`<select>` has an associated `<label>` (already wired via `for`/`id` in Task 9). Tab through the page keyboard-only from the top: confirm every link, form field, and button receives a visible focus outline and the tab order follows visual order (nav → hero CTAs → form fields → CTA links).

- [ ] **Step 5: Fix any defects found, then commit**

```bash
git add index.html style.css
git commit -m "Fix responsive/accessibility issues found in full-page QA pass"
```

(If no defects were found, skip the commit — nothing to commit.)

---

### Task 13: Publish to GitHub Pages with the custom domain

**Files:**
- No new files (verifies `CNAME` from Task 1); may modify GitHub repo settings via `gh`.

**Interfaces:**
- Consumes: the complete, QA'd site from Tasks 1–12.

- [ ] **Step 1: Confirm the repo is public (required for GitHub Pages on a free plan)**

Run: `gh repo view theredrangerd/UWCTKE-Ethics-Olympiad-Site --json visibility -q .visibility`
Expected output: `PUBLIC`. If it prints `PRIVATE` instead, this step requires an explicit decision from the project owner before flipping visibility (it makes the source public) — confirm with them, then run:
```bash
gh repo edit theredrangerd/UWCTKE-Ethics-Olympiad-Site --visibility public
```

- [ ] **Step 2: Push all committed work to `main`**

```bash
git push origin main
```

- [ ] **Step 3: Enable GitHub Pages, deploying from the `main` branch root**

```bash
gh api -X POST repos/theredrangerd/UWCTKE-Ethics-Olympiad-Site/pages \
  -f "source[branch]=main" -f "source[path]=/"
```
Expected: JSON response containing a `"status"` field and a `"html_url"` like `https://theredrangerd.github.io/UWCTKE-Ethics-Olympiad-Site/`. (If it returns a 409 "already exists" error, Pages is already enabled — continue to Step 4.)

- [ ] **Step 4: Confirm the custom domain is registered with GitHub Pages**

```bash
gh api repos/theredrangerd/UWCTKE-Ethics-Olympiad-Site/pages -q '.cname, .https_enforced'
```
Expected: first line `uwcethicsolympiad.wetkarma.com` (picked up automatically from the `CNAME` file pushed in Task 1).

- [ ] **Step 5: Add the DNS record (manual — requires the user's domain registrar access, cannot be done by an assistant)**

At the DNS provider for `wetkarma.com`, add a **CNAME record**:
- Host/name: `uwcethicsolympiad`
- Value/target: `theredrangerd.github.io`
- TTL: default (or 3600s)

DNS propagation can take a few minutes to a few hours.

- [ ] **Step 6: Verify the live site**

Once DNS has propagated, run:
```bash
curl -sI https://uwcethicsolympiad.wetkarma.com | head -5
```
Expected: `HTTP/2 200`. Then open `https://uwcethicsolympiad.wetkarma.com` in a browser and re-run the Task 12 desktop and mobile checks against the live URL, confirming the padlock/HTTPS is valid (GitHub Pages provisions this automatically once the CNAME resolves).

- [ ] **Step 7: Nothing to commit in this task** — it's deployment/config, not code. If Steps 1–4 required any repo setting changes, they're already applied directly via the GitHub API and don't produce a git diff.

---

## Post-plan reminders (not implementation tasks)

- Before the interest form actually goes live on 22 Sept 2026, double-check `js/config.mjs`'s `APPS_SCRIPT_URL` and `REGISTRATION_FORM_URL` are the real deployed values, not the placeholders.
- Judge bios (Task 7), competition photos (Task 3/7 — drop files into `assets/gallery/` and add matching entries to `assets/gallery/manifest.json`), and post-competition results (Task 3/8 — edit `data/results.json`) are all designed as pure data/content drops with no code changes required, per Noelle's requirements.
