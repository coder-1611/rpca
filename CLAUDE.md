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
- `gallery.html` — **chaptered photo essay + film room** (rebuilt 2026-07-18). Five acts: 01 In the
  Nets, 02 Match Days, 03 Silverware, 04 Off the Field, 05 The Film Room (`#film`), with a full-bleed
  `.pano` break between 01 and 02. Photos use `.ed-grid`/`.ed` (fixed-row-height mosaic, hand-assigned
  `w3/w4/w6` + `h3` spans so a panorama never lands in a portrait slot); clips use `.vwall`/`.vcard`.
  Everything with `data-lb` feeds one shared lightbox.
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
- **Verified:** all 5 pages `H_OVERFLOW=0` desktop (1440×900) + mobile (390×844), no console errors.
- **Harness note:** `../fable-showcase/node_modules` is iCloud-evicted and its `tools/shot.js` crashes
  with `ERR_MODULE_NOT_FOUND`. Copy the script to a **non-iCloud** dir and `npm i puppeteer-core` there
  (`npm` also needs `--cache /tmp/...`; `~/.npm` has root-owned entries). Serve with
  `python3 -m http.server 8233`. To exercise hover behaviour in headless Chrome you must
  `Emulation.setEmulatedMedia` with `hover:hover`/`pointer:fine`, and scroll **then** measure — reading
  `getBoundingClientRect()` in the same `evaluate()` as `scrollIntoView()` returns pre-scroll coords and
  sends the synthetic mouse off-screen (this looked like a broken feature; it wasn't).
- **RPCA** = "Ranchi Players Cricket Academy", Ranchi/Jharkhand.

### Legacy source (from claude.ai/design)
The old dc-runtime multi-page build (`*.dc.html` + `support.js` + `image-slot.js`) is kept as
reference source. Source project id: **442925a2-95c1-4675-8e94-df3c122b6de6** (Opus 4.8).
The new `index.html` no longer references those files.

## The academy archive (added 2026-07-18) — 14 photos + 12 clips
Owner-supplied media (dropped into `assets/` as camera UUIDs, then sorted into `uploads/`).

### Photos — two-tier, by design
Every archive photo exists twice: `<name>.jpg` (**1500px, q70** — what the grid/pano actually renders)
and `<name>-lg.jpg` (**2200px, q72** — the lightbox master, fetched only when someone opens it).
`.ed` figures carry `data-full="uploads/<name>-lg.jpg"`; the lightbox falls back to the `<img>` src for
the three older Instagram photos that have no master. Full-bleed slots (gallery sub-hero, both `.pano`
bands) point straight at `-lg` since they render at viewport width.
Verified: browsing the whole gallery pulls only the two intentional masters and **zero** video bytes.

### Clips — transcoded, HEVC would not have played
Sources were **HEVC in .mov** (Safari-only; silently dead in Chrome/Firefox). Re-encoded with ffmpeg to
**H.264 MP4** (`-crf 26 -preset slow -profile:v main -movflags +faststart`, capped at 720px wide):
113MB → 25MB. `avconvert` was tried first and rejected — it upscales 478×850 to 720p at a fixed high
bitrate and *tripled* the file sizes. Each clip has a `poster-<name>.jpg` extracted at 1/3 duration.
`session-warmup.mp4` was an Instagram export with baked-in blurred letterbox bars — cropped to its real
content band (`crop=720:768:0:256`) and flagged `.vcard.wide`, since cropdetect can't see blur bars.

### Originals
`uploads/_originals/` (photos) and `uploads/_originals/video/` (the 12 `.mov`) — **gitignored**, never
deployed. Don't re-optimize from the `uploads/` copies; go back to these.

### Home page
Hero was visibly empty above the headline. Now `.hero.has-mosaic` + `.hero-mosaic`: three parallaxing
frames upper-right on desktop (the headline gets its own column via `padding-right`, and h1 drops to
`clamp(58px,8.4vw,132px)` — without that it runs straight under the photos). Below 1100px the same three
frames re-form as a filmstrip above the headline; their staggered parallax is skipped there, since it
would visibly pull an aligned row apart. Also added a `.pano` band after the manifesto and an
"04 — In Motion" four-clip strip before the gallery reel (sections renumbered 04/05/06).

### Video behaviour
Poster JPEG only until intent: hover (fine pointer) creates the `<video>` and plays it muted+looping;
click opens it with sound in the lightbox; `IntersectionObserver` pauses anything scrolled away.
Verified in Chrome: hover → `warm`, `muted`, `loop`, `currentTime` advancing, 478×850 decoded; leave and
scroll-away → paused; lightbox → correct src, playing, Esc empties the stage (stopping playback),
arrows step through all 28 items, scroll lock applied and released.

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
`python3 -m http.server 8233` then open `index.html`.

## Deployed (2026-07-14)
- **GitHub:** https://github.com/coder-1611/rpca (main)
- **Live:** https://rpca-phi.vercel.app — Vercel appended `-phi` (bare `rpca.vercel.app` was reserved),
  so the production domain is NOT `rpca.vercel.app`. Auto-deploys on push to `main` via the Vercel
  GitHub integration ("Other" preset, root `./`, no build). All 5 pages + assets verified 200 and
  rendering live.
