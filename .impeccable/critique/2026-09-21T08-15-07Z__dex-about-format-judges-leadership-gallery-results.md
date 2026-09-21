---
target: whole site (all 7 pages) — coloring and information presentation
total_score: 25
p0_count: 2
p1_count: 2
timestamp: 2026-09-21T08-15-07Z
slug: dex-about-format-judges-leadership-gallery-results
---
Method: dual-agent (A: general-purpose design-review · B: general-purpose detector/browser-evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Countdown + three-state CTA (pending/live/closed) genuinely good; gallery/results have no loading skeleton |
| 2 | Match System / Real World | 3 | Voice is confident and specific; grade-tier gold/silver badges on Leadership read as an odd seniority-as-medal metaphor |
| 3 | User Control and Freedom | 2 | Every page links "Register" back to `index.html#eligibility` — correct but a full reload with no continuity cue |
| 4 | Consistency and Standards | 3 | Nav/header/footer identical across 7 pages; one hand-typed color (`.btn--pending`) breaks the otherwise fully tokenized system |
| 5 | Error Prevention | 2 | Iframe fallback links are good; can't assess form validation since registration is a third-party Google Form |
| 6 | Recognition Rather Than Recall | 3 | Timezone-aware schedule table removes real mental-conversion burden; rubric shows point values inline |
| 7 | Flexibility and Efficiency | 2 | No `:focus-visible`, no skip-to-content, no `prefers-reduced-motion` guard on any hover transform |
| 8 | Aesthetic and Minimalist Design | 2 | Palette itself is confident and minimal; structure is not — nearly every content type reuses one card shell |
| 9 | Error Recovery | 2 | No visible error states to assess beyond iframe fallbacks |
| 10 | Help and Documentation | 3 | FAQ, explainer video, external prep-resource and rubric links are easy to find |
| **Total** | | **25/40** | **Acceptable** |

## Anti-Patterns Verdict

**Start here.** Moderately slop-flavored, but with real craft underneath — not a template dump. Both assessments converged on the same handful of textbook tells, all low-frequency (once each) rather than spammed, which is the difference between "an AI reached for the default" and "an AI built the whole page out of defaults":

- **Numbered section markers (01/02/03/04)** as default process-step scaffolding on `format.html` — confirmed live in the CSS (`.format__step-number`) and independently flagged by the deterministic scanner (`numbered-section-markers` fired on both `index.html` and `format.html`).
- **Side-stripe border** — exactly one instance, `.format__callout` (`style.css:379`, `border-left: 3px solid var(--color-accent-b)`), the canonical "AI highlight box." Grep confirms it's the only `border-left`/`border-right` in the entire file.
- **Glassmorphism** — exactly one instance, `.site-header` (`backdrop-filter: blur(14px)` + translucent bg), a frosted sticky nav. Site-wide by virtue of being the shared header, but a single deliberate-looking use, not decoration sprayed everywhere.
- **No gradient text, no hero-metric template, no stock-photo hero** — genuinely absent. The custom timezone table, state-driven CTA logic, and dotted-leader rubric list are bespoke, content-specific work, not scaffolding.

Deterministic scan (`detect.mjs --json` across all 7 pages, exit 2):

| Rule | Pages | Detail |
|---|---|---|
| `em-dash-overuse` | index.html, format.html | 7 em-dashes each |
| `numbered-section-markers` | index.html, format.html | 01–04/06/07 sequences |

Zero findings on about/judges/leadership/gallery/results.html. **The detector emitted zero `low-contrast` findings — this is a false negative, not a clean bill of health.** Both assessments independently ran manual WCAG contrast checks and converged on the same real defect the scanner missed entirely: `--color-text-muted` (#6B7280) fails AA (4.5:1) against every background tone it's used on:

| Background | Computed ratio |
|---|---|
| `--color-bg-primary` (#0E1013) | 3.94:1 |
| `--color-bg-secondary` (#16191E) | 3.65:1 |
| `--color-bg-card` (#21252C) | 3.18:1 |
| `--color-bg-card-hover` (#2A2F38) | 2.78:1 |

None clear 4.5:1. Confirmed failing usages (13 locations): `.site-footer`, `.tag--tentative/.tag--note`, `.judges__bio-note`, `.judges__criteria-total`, the three `*-placeholder` blocks, `.results-row__place`, `.results-row__school`, `.funnel-step__fallback`, `.countdown__unit dt` (worst offender at 0.62rem), and — most consequential — **`.schedule-table thead th`**, which sits at ~3.18:1 on the header row of the single table every registering team needs to read correctly. (`--color-text-secondary` and `--color-text-primary`, by contrast, both pass AA comfortably everywhere; gold accent text passes too, 6.4–9.1:1.)

Card-recipe reuse (grep-verified by B, independently flagged by A as "card for everything"): the literal triplet `background: var(--color-bg-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md)` is reused verbatim across **7 unrelated selectors** (`.format__theories li`, `.format__step`, `.judges__bio`, `.results-row`, `.eligibility__list li`, `.funnel-step__embed`, `.funnel-step__register`), plus 3 near-variant placeholder blocks and a structurally identical `.leader-card` variant — at minimum 10 distinct content types sharing one visual grammar.

No browser visual injection was available in this session (no browser MCP tool exposed to the evidence agent); no user-visible overlay was generated. All findings above are source/CSS-verified, not screenshot-verified.

## Overall Impression

The gold/dark-academia system has real identity — five fonts assigned by consistent role, a confident restrained palette, genuinely good information architecture in the one component built to solve an actual user problem (the timezone-aware schedule table). But the palette makes a promise it doesn't keep: `--color-silver` and `--color-bronze` are declared in `:root` and never referenced anywhere else in the codebase — dead tokens for a medal hierarchy that `results.html`, the one page that exists to show 1st/2nd/3rd place, doesn't actually render. Combine that with a single card shell doing duty for six-plus unrelated content types and a text color that fails accessibility everywhere it appears, and the site reads as a strong system that was declared but not finished being applied.

## What's Working

1. **Timezone-aware schedule table** (`index.html`) — three timezones per row with day-rollover tags, solving a real problem instead of reaching for the generic card template used everywhere else.
2. **State-driven CTA logic** (`js/app.js`) — the registration button renders three distinct states (pending-with-countdown / live / closed) from config dates rather than being hardcoded; unusually robust for a static event site.
3. **Coherent typographic voice** — five fonts assigned consistently by role (display, subhead, editorial, body, micro-label) across all 7 pages without drift.

## Priority Issues

**[P0] `--color-text-muted` systematically fails WCAG AA sitewide, including the schedule table's header row**
- Why it matters: 13+ confirmed locations render below 4.5:1 contrast — footer copy, table headers, results metadata, countdown labels. The worst case is the header row of the only table on the site, read by every registering team to figure out when to show up.
- Fix: promote `--color-text-muted` usages that carry real information (table headers, results metadata, footer) to `--color-text-secondary` (#A8B0BC, passes AA everywhere at 6.2–8.7:1); reserve the current muted value only for genuinely decorative captions under 3:1's large-text bar.
- Suggested command: `/impeccable harden` (or `/impeccable adapt` for the a11y-specific pass)

**[P0] Medal-tier tokens (`--color-silver`, `--color-bronze`) are declared but never used — results.html can't show 2nd/3rd place distinctly**
- Why it matters: the palette explicitly built a gold/silver/bronze hierarchy (complete with glow variants) for a competition site, but only 1st place (`.results-row:first-child`) gets differentiated styling. 2nd and 3rd render identically to every unranked row. The system promises a hierarchy the results page doesn't deliver.
- Fix: add `.results-row:nth-child(2)` (silver) and `:nth-child(3)` (bronze) treatments using the already-declared tokens.
- Suggested command: `/impeccable colorize`

**[P1] Card-for-everything flattens hierarchy across the whole site**
- Why it matters: at least 10 unrelated content types (process steps, judge bios, theory list items, eligibility items, results rows, leader cards, form embeds, register CTA, three placeholder states) share the identical bg-card + 1px border + radius-md shell. A judge bio, a rubric line, and a leaderboard row are structurally different kinds of information but visually indistinguishable as content types.
- Fix: differentiate at least one axis per content family — e.g. drop card chrome entirely on `.eligibility__list li` (the ✓ glyph already does the job of a border), give leaderboard rows a table-like treatment instead of a card.
- Suggested command: `/impeccable layout`

**[P1] The white Google Form iframe breaks the palette at the highest-intent moment**
- Why it matters: `.funnel-step__embed iframe { color-scheme: light; }` forces a stark 640–900px-tall white rectangle into the middle of the dark page, exactly where the primary "Express Interest" conversion happens — undermining every other color decision right when trust and polish matter most.
- Fix: at minimum frame it in a gold-bordered "letterbox" card so the white block reads as an intentional inset rather than a rendering seam.
- Suggested command: `/impeccable polish`

**[P2] Gold accent color is overloaded to mean five different things at once**
- Why it matters: `--color-gold-primary` marks emphasis text, step numbers, leader-role labels, avatar borders, checkmarks, hover glow, and active-nav-link — with no consistent signal (importance? interactivity? brand? rank?). This directly undercuts the medal-tier logic the palette otherwise implies for results/leadership.
- Fix: reserve gold specifically for rank/achievement contexts; pick a second, distinct token for generic interactive emphasis (links, active nav, checkmarks).
- Suggested command: `/impeccable colorize`

## Persona Red Flags

**Jordan (Confused First-Timer)**: On `format.html`, steps 1–3 show a `.format__step-time` duration badge but step 4 ("Judges' Questions") doesn't — reads as a missed field, not a design choice. On `index.html`, nav "Register" leads to an *Express Interest* form first, with the actual registration CTA nested one card deeper below a 900px iframe — easy to miss on first scroll. Grade-12/11 gold/silver badges on Leadership could easily misread as an achievement ranking, since that's exactly what gold/silver means on Results.

**Casey (Distracted Mobile User)**: The Google Form iframe is 640px tall on mobile (800px under 520px) — multiple full screens of white embedded content to scroll through just to express interest. `.format__steps` collapses to 1 column under 520px and drops the `→` connector entirely (gated to `min-width: 861px`), losing the sequential-flow cue that a 4-step ordered process is, in fact, ordered.

**Sam (Accessibility-Dependent User)**: Confirmed AA failures above hit this persona directly — table headers and results metadata are exactly the content a screen-reader/low-vision user most needs correctly contrasted. No `prefers-reduced-motion` guard exists anywhere despite hover transforms (`translateY`, `scale(1.04)`) on cards across format/leadership/judges pages. No `:focus-visible` styling found in the stylesheet.

## Minor Observations

- `.btn--pending` hardcodes `#C9A24B`/`#1A1405` instead of referencing the existing gold tokens — the only hand-typed color in an otherwise fully tokenized system.
- Grade badges only define `.grade-12`/`.grade-11`; a future Grade 9/10 leader added to `leadership.html` gets an unstyled badge with no background or border.
- `leader-avatar-frame` mixes real photos and initials-placeholder circles inconsistently within the same row (2 of 4 leaders have photos) — reads as unfinished roster prep rather than a design choice.
- Nav places "Leadership" and "FAQ" after "Results," which — pre-event — just says results aren't posted yet; low-value real estate ahead of the event.

## Questions to Consider

- If silver/bronze tokens were built specifically for a medal hierarchy, was `results.html` shipped before the token system, or did the loop just never get closed?
- The site's own copy says "you're judged on how you reason, not on winning" — yet the visual system borrows its entire vocabulary (gold/silver/bronze, "Olympiad" medal framing) from a competitive, ranked aesthetic. Is the color system quietly working against the event's stated philosophy?
- If a visitor screenshotted five random sections with labels removed, could they tell which page they were on by shape alone, or only by reading the words inside?
