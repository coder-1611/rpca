# SEOptimer audit (2026-07-21) — what it said and what was done

Source: `~/ranchicricket seo V1.html` (+ `_files/`), audited `ranchicricket.com`, report generated
21 July 18:27 UTC. Overall grade **C+ (52/100)**.

| Section | Score | Note |
|---|---|---|
| Performance | 91 (A+) | Server 0.034s, page loads 0.7s, gzip/brotli on, HTTP/2, minified |
| On-Page SEO | 70 (B+) | Title/meta present but too long; keyword spread uneven |
| Usability | 54 (C+) | Mobile PageSpeed 54, LCP 8.3s, TTI 10.9s |
| GEO (AI search) | 0 (F) | No llms.txt; 26% of content rendered by JS |
| Links | 0 (F) | **0 backlinks, 0 referring domains** — the real bottleneck |

## Fixed in code (deployed 2026-07-21)
- **Mobile hero overlap** — the audit's 320px screenshot showed the eyebrow text overlapping the
  photo strip. Reproduced at 320px, fixed: below 1100px the mosaic is now in normal flow instead of
  absolutely positioned. Verified 0 overlaps at 320px and 390px.
- **Mobile page weight 1342KB → 665KB; images 1055KB → 379KB.** `senior-squad-pano-lg.jpg` alone was
  809KB for a band rendered at viewport width. Added `srcset` + right-sized variants (`-sm`) for the
  three hero frames, both panorama bands and the gallery sub-hero. This is the fix for LCP 8.3s.
- **Titles** cut from 58–69 chars to 38–52 (Google truncates past ~60).
- **Meta descriptions** cut from 182–229 chars into the 139–159 band.
- **3 missing image alts** (hero mosaic) — added, plus `width`/`height` to stop layout shift.
- **"No Local Business Schema"** — `@type` is now `["SportsActivityLocation", "LocalBusiness"]`,
  plus `openingHoursSpecification` taken from the Google Business Profile.
- **"Missing: Address"** — full postal address now in plain text in every footer.
- **llms.txt** added at root (the GEO score was 0 partly for this).

## Deliberately NOT changed
- **Friendly URLs** (`.html` file names). Vercel `cleanUrls` would fix it, but it changes every URL
  days after submitting them to Search Console — churn now outweighs the small gain. Revisit later.
- **Inline styles** — flagged as a performance nit, but they're how this design system does one-off
  spacing. Real cost is negligible.
- **Analytics / Facebook Pixel / FB / X / LinkedIn / YouTube** — need owner accounts and decisions,
  not code. Instagram is the one verified channel.
- **"Thin content" (777 words on home)** — worth expanding, but the FAQ page already added depth and
  a rushed word-count push would dilute the copy.

## What the audit says the real problem is
Links: **0 backlinks, 0 referring domains, domain strength 0**. Every on-page item above is now
green or close to it; a site with zero inbound links will still struggle against Justdial and
academies with years of history. That is exactly what `seo/press-pitch.md` and
`seo/directory-listings.md` are for — those are owner actions, not code.
