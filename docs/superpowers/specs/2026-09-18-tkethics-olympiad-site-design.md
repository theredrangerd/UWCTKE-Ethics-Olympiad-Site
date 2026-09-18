# UWC-TKEthics Olympiad 2026 Website — Design

## Purpose

MPEO leadership is hosting the **UWC-TKEthics Olympiad 2026**, an international
online (Zoom) ethics tournament open to high school teams from UWC schools
worldwide, run in partnership with TKEthics for judges. This is a separate
project from the existing MPEO club site
(github.com/theredrangerd/ethics-olympiad-site), though it shares the same
parent organization.

The site's job: be the landing page an invitation email points to. A
prospective coach or student clicks the link, is immediately convinced this
is a professional, well-run event worth their school's time and money, and
converts into an "Express Interest" or "Register" action.

## Source material

- `resources/2026 November.pdf` — the "Final Proposal" sent to the school
  activities office. Authoritative source for format, rules, timeline,
  pricing, judges, and eligibility.
- Existing MPEO club site (github.com/theredrangerd/ethics-olympiad-site) —
  visual/brand reference (fonts, color family, crest, "✦" flourish motif),
  not a content source for this event.
- `resources/logos/` — logo assets: `mpeo-omega-crest-transparent.png` /
  `mpeo-omega-crest.svg` (pulled from the existing MPEO repo's `assets/`
  folder — white omega, transparent background, so it reads correctly on
  dark backgrounds only) and `tkethics-logo.png` (pulled from
  tkethics.org — wordmark + mark, transparent background, reads on light
  or dark).
- `resources/media/` (to be created by user) — competition photos, added
  after events happen; folder exists as the drop point but starts empty.
- Second contributor: **Noelle** (another MPEO leader) also reviews/directs
  content for this site, not just the user.

## Additional requirements (from Noelle's review)

Six items Noelle asked to be folded into the plan, incorporated into the
sections below:

1. Results — site must be easy to update post-competition with results/winners.
2. How-the-competition-works content in both word and video form, including
   structure and a basic introduction to ethical theories.
3. Competition photos (gallery).
4. Competition timeline — already covered.
5. Introduction to judges — placeholder section only for now; real judge
   info to follow later.
6. MPEO logo + TKE logo — sourced above, used in header/footer/hero.

## Audience & tone

Dual audience, addressed together on one page: a **supervising
teacher/coach** who needs to trust this enough to greenlight and fund their
school's participation, and a **student** who needs to get excited enough to
ask their coach. Copy should read as legitimate and organized (official
TKEthics partnership, real judging criteria, clear logistics) while staying
warm and energetic, not corporate.

## Information architecture

Single scrolling page, anchor-nav sections (mirrors the existing site's
`index.html#hero` pattern):

1. **Hero** — event name, one-line hook, key date, primary CTA (Express
   Interest / Register depending on which window is currently open). MPEO
   and TKEthics logos both visible near the top (e.g. hero or header), read
   as a joint presentation.
2. **About/Objectives** — what UWC-TKEthics Olympiad is, why it exists
   (global UWC community, ethical reasoning, collaborative not adversarial),
   pulled from the proposal's Objectives section.
3. **Format & How It Works** — the 4-round structure (presentation →
   commentary → response → judges' questions), explained simply; note
   "this is not a debate, teams can agree." Two content forms per Noelle's
   request:
   - **Written explainer**: the round-by-round breakdown, plus a short,
     accessible primer on the major ethical theories participants will
     encounter/use (e.g. utilitarianism, deontology, virtue ethics) —
     written for someone with zero prior philosophy background, matching
     the proposal's "students do not have to be familiar with ethical
     theories" stance.
   - **Video explainer**: an embedded video slot (e.g. YouTube/Vimeo embed)
     walking through the format. Video itself does not exist yet — ship
     the section with a placeholder/"coming soon" state that degrades
     gracefully (no broken embed) until the user supplies a video URL.
4. **Eligibility & How to Register** — team size (3–5), Grade 7+, cost
   (~$120/team, marked tentative/estimated), the two-step funnel (Express
   Interest → Registration), Zoom logistics requirements.
5. **Timeline** — the dated funnel: interest form window, registration
   window, case package release, competition day, all from the proposal's
   timeline page. Dates marked tentative where the proposal says so.
6. **Judges & TKEthics** — credibility section: TKEthics partnership,
   judging criteria (official Ethics Olympiad score sheet basis). The
   "Introduction to Judges" subsection ships as a placeholder only —
   e.g. "Judge bios coming soon" — structured so individual judge bio
   cards can be dropped in later without restructuring the section. Not
   populated with the two sample bios from the proposal PDF yet, since
   Noelle's ask is explicitly to hold this open for real info later.
7. **Gallery** — competition photos. Ships as a placeholder/"photos coming
   soon" state (empty `resources/media/` folder exists as the drop point);
   built so that dropping image files into that folder and referencing
   them is the entire update process — no code restructuring needed later.
8. **Results & Winners** — ships empty/placeholder ("Results will be
   posted here after the competition") but structured now so it's a
   trivial post-competition edit: a single clearly-marked block (e.g. one
   HTML section or one small JSON/data block the page reads from) that
   the user fills in with winning teams/standings after 21 Nov, not a
   redesign.
9. **FAQ** — pulled from the official competition rules (mic etiquette,
   ties, complaints, team conferences, timers, etc.), phrased as actual
   questions a coach/student would ask.
10. **Contact/Leadership** — who's organizing (MPEO leadership), how to
    reach them.

All tentative figures (exact Nov date, $120/team, judge roster) are shown
now, clearly labeled "tentative"/"estimated"/"TBC" rather than withheld,
since momentum matters before the interest-form window opens.

## Visual identity

Related-but-distinct from the existing MPEO site: same type family, color
family, and crest/flourish motifs for brand recognition, but its own hero
treatment with more "international tournament" scale/gravitas (e.g. a world
map or multi-school visual motif, bigger typographic hero) than the
club-meeting tone of the existing site. Concrete palette/type choices get
finalized during implementation by inspecting the existing site's CSS
first, then deliberately differentiating rather than cloning.

Both organizing logos (MPEO omega crest, TKEthics mark) appear together,
visually presenting this as a joint MPEO × TKEthics event rather than
either party's solo project.

## Data collection

Two-stage funnel, matching the proposal's own timeline (interest form opens
~22 Sept, closes ~6 Oct; registration opens ~6 Oct, closes ~26 Oct):

- **Express Interest** (lightweight, in-page): a custom HTML/CSS form
  matching site styling — name, email, school, role (student/coach) — plus
  a honeypot field for spam. Submits via `fetch()` to a **Google Apps
  Script Web App**, which appends a row to a Google Sheet. No page reload;
  inline success/error state.
- **Registration** (heavier, out-of-page): a prominent CTA button linking
  out to the official Google Form once that window opens. The site does not
  reimplement this form — it stays a Google Form so it can evolve
  independently of the site's code.

The site must gracefully handle "form not open yet" / "form now closed"
states for both funnel stages, driven by simple date comparisons in JS
against the known window boundaries (no backend needed to flip these).

## Hosting & deployment

New GitHub repository, deployed via **GitHub Pages**, with the custom
domain **`uwcethicsolympiad.wetkarma.com`** pointed at it via CNAME. Chosen
over self-hosting on the user's Synology box specifically because GitHub
Pages is CDN-backed and comfortably absorbs a traffic spike from an email
blast to many schools, whereas a home connection's asymmetric bandwidth and
single point of failure make it the wrong host for this specific
traffic-spike-expected event.

Static site, no build step — plain HTML/CSS/JS, same approach as the
existing MPEO site.

## Testing / verification approach

No automated test suite (static content site). Verification is manual:

- Browser QA at desktop and mobile viewport widths for every section.
- All anchor-nav links jump correctly.
- Express Interest form: submit a real test entry, confirm the row lands in
  the target Google Sheet, confirm inline success/error states render
  correctly (including a deliberately-triggered failure case).
- Registration CTA correctly links out, and correctly reflects
  not-yet-open / open / closed states based on the configured dates.
- Content review pass: every date/price/figure pulled from the proposal PDF
  cross-checked against the PDF for accuracy, tentative labels present
  where the source says "flexible"/"estimate"/"possible."
- Placeholder sections (Judges, Gallery, Results, Video) checked for
  graceful empty/coming-soon states — nothing broken-looking (empty boxes,
  broken image icons, dead embeds) before real content lands.
- MPEO logo checked specifically against a light background (it's a white
  PNG/SVG, invisible on white) to confirm it's only placed on dark
  surfaces where it's visible.

## Out of scope

- No CMS or admin dashboard — content changes are direct file edits.
- No user accounts/login.
- No payment collection on the site itself (per proposal, participants pay
  separately; site does not process payments).
- No redesign of the existing MPEO club site.
