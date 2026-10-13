# Build log — design/artistic-portfolio

Work done autonomously while the owner was away. Branch: `design/artistic-portfolio` (main untouched).

## Decisions about requested tools
- **"jev"**: GitHub search found only decision-model / AI-agent projects, nothing for building websites. Not used.
- **"paperclip"**: `paperclipai/paperclip` is an agent-management app. Not installed, not relevant to a static site, so not used.

## Round 0 — baseline
- Committed the earlier session work (hero hover-to-play YouTube, bubble-outline name, bio rewrite).

## Round 1 — structure and polish
- About section: facts grid (D1 / DS / +2 minors / '26), outlined section title, scroll-reveal animations.
- Added the Contact section (nav linked to `#contact`, which did not exist). GitHub link only; **TODO: add your email mailto**.
- Footer; film-grain overlay; focus-visible styles; `prefers-reduced-motion` support.
- Meta description, theme-color, inline favicon, better `<title>`.
- Assumptions to confirm: footer text "Data Science · Film"; accent color reused from existing palette.

## Round 2 — art direction
- Scrolling outlined marquee band (DATA SCIENCE ✦ FILM ✦ …) between hero and About.
- Staggered entrance of the name after the loader finishes.
- Marquee honors `prefers-reduced-motion`.

## Ideas queued for next rounds
- Re-introduce a films/work section if wanted (it was removed earlier on request).
- Per-slide hero videos once more YouTube IDs exist; add email to Contact.

## Round 3 — research-driven motion (no libraries)
Research: Codrops-style hover displacement, clip-path reveals, CSS scroll-driven animations (`animation-timeline`), award-site trends (micro-interactions, speed first).
- Custom soft-follow cursor; grows on links, bigger "play" blob on video squares (fine pointers only; hidden on touch).
- Liquid ripple (SVG feTurbulence + displacement) and tilt/scale on thumbnail hover.
- Thumbnails reveal with a staggered clip-path wipe after the loader.
- Mouse parallax on the hero name; magnetic Contact button.
- Scroll-progress bar via CSS `animation-timeline: scroll(root)` (progressive enhancement).
- All respect `prefers-reduced-motion`.
Checks: build passes; effects verified wired in the preview browser. Not verified: ripple look under real mouse, Safari/Firefox.
Next ideas: per-letter name wobble, view-timeline parallax on About facts, page-load clip-path curtain, WebGL image distortion if real photos are added.
