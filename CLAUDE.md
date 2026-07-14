# RPCA Cricket Academy — project notes

## Current: hand-built MULTI-PAGE site ("The Floodlit Innings")
A **complete design overhaul** of the old dc-runtime site — now a real multi-page site with a
shared design system. **Concept:** dark night-cricket editorial; the signature moment is a
delivery-arc "spine" — a dotted ball-flight trajectory (fixed SVG, `vector-effect:non-scaling-stroke`)
with a glowing HTML cricket ball that flies down the path as you scroll (on every page).

### Pages (5 pages; each links `assets/site.css` + `assets/site.js`)
- `index.html` — Home. Canvas ambient-glow hero (`#field`), overview of all sections (incl. a
  "The Ground" block: two turf & matting nets at DIG Ground, Bariatu), links out.
- `programs.html` — The Pathway. 3 stages (Foundation/Development/Elite) as alternating `.split`
  features + a 2-up "Pick your format" (Group Batches, One-on-One) + stats.
- `coaches.html` — Ashutosh Mishra and Yuvraj Kumar as **equal, same-age coaches** (no head coach/
  founder; AM has a styled placeholder, no photo/stats). Yuvraj: verified photo + real Jharkhand
  T20 / Ranchi Titans / JSCA facts (38 off 23).
- `gallery.html` — `.gal-masonry` (CSS columns, **crop-free** — images keep natural aspect).
- `contact.html` — `.form-grid`: static `#trialForm` (site.js intercepts submit → reveals `#formOk`)
  + `.ccard` cards. Instagram @rpca_cricket_academy_ranchi is the ONE real channel; no fabricated
  phone/email/street address.

### Content constraints locked in (per owner)
- **No founding date** anywhere (no "Est. 2013" / "founded in…" / "N years").
- **No floodlight claims** — floodlights are rare, not a feature. (Filenames like `nets-floodlights.jpg`
  and a couple of code comments still contain the word; those are not user-facing.)
- Ground = **DIG Ground, Bariatu (Ranchi), two turf & matting nets**. Facilities page was removed and
  its info merged into Home + Contact.
- Ashutosh & Yuvraj are **equals, same age**; "100+" cricketers (not 500).
- `uploads/yuvraj-highlighted.jpg` = `match-heroes.jpg` with the two side players Gaussian-blurred so
  **only Yuvraj (centre) is sharp** (generated via PIL). Used wherever the poster appears.

### Shared design system
- `assets/site.css` — all design tokens + components (nav w/ `aria-current` active state, `.subhero`
  photo hero for sub-pages vs canvas `.hero` on home, `.split`/`.feat`, `.fac-list`, `.tiers`,
  `.stats`, `.coach`, `.reel` + `.gal-grid`, `.form`/`.ccard`, `.cta`, footer, atmosphere, spine).
- `assets/site.js` — one null-safe IIFE: only runs what a page contains (canvas hero guarded by
  `#field`, ticker/reel/form/spine all guarded). Handles reveal + count-up, cursor, nav, mobile menu.
- To add/edit a page: copy the boilerplate from `programs.html`, set `<title>`/meta + the nav
  `aria-current`, and assemble content from existing `site.css` classes. Don't fork the CSS/JS.

- **Palette:** night-green (`#05130c`/`#0a2015`), cream `#f4efe1`, floodlight amber `#f2a71b`,
  leather-red `#c9432a` (the ball, used sparingly). Type: **Anton** (display), **Fraunces**
  (editorial italics), **Space Grotesk** (body), **Space Mono** (labels/eyebrows).
- **Techniques:** canvas floodlit-dust hero (light cones + drifting motes, `screen` blend,
  paused off-screen via IO, reduced-motion fallback), scroll-driven ball spine, IntersectionObserver
  staggered reveals, count-up stats, marquee ticker + gallery reel, custom cursor, grain/vignette,
  custom scrollbar/selection, sticky-blur nav + mobile drawer.
- **Verified:** all 6 pages `MOBILE_H_OVERFLOW_PX=0`, no console errors (harness `tools/shot.js`
  in `../fable-showcase`, served via `python3 -m http.server 8233`).
- **RPCA** = "Ranchi Players Cricket Academy", Ranchi/Jharkhand.

### Legacy source (from claude.ai/design)
The old dc-runtime multi-page build (`*.dc.html` + `support.js` + `image-slot.js`) is kept as
reference source. Source project id: **442925a2-95c1-4675-8e94-df3c122b6de6** (Opus 4.8).
The new `index.html` no longer references those files.

## Real photos (from Instagram)
`uploads/` holds real photos scraped from the academy's Instagram **@rpca_cricket_academy_ranchi**
(via `~/.claude/skills/claude-design/scripts/ig-scrape.mjs`), wired into `<image-slot src="uploads/…">`
across Home, Programs, Facilities, Coaches and Gallery. **Yuvraj Kumar**'s coach photo is verified
(his name is on the source graphic). **Ashutosh Mishra**'s slot is intentionally left as the styled
placeholder — no verified photo of him. Contact details are editable placeholders; the Instagram
handle is the one real channel.

**Rights:** these are the business's own Instagram uploads — fine for the mockup/pitch; the owner
should confirm rights before publishing.

## Coaches — no fabricated stats
Ashutosh Mishra = founder/head coach; Yuvraj Kumar = young Jharkhand all-rounder registered with the
Jharkhand State Cricket Association (JSCA). Bios are role/philosophy-based; **no invented Ranji/
first-class statistics** (none are public).

## Serve / verify
Static dc-runtime — must be served over HTTP (self-loads React + fetches components), not file://.
`python3 -m http.server 8233` then open `index.html`. Not yet deployed; not mobile-passed.
