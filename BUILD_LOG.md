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

## Round 4 — generative loader flipbook
Request: flip through creatively generated images on the loading screen, in different art styles.
- Loader photos (missing files) replaced by 8 procedurally drawn canvas plates of one scene (sun / hills / sea) in different media: Claymation, Pencil sketch, Risograph, Linocut, Watercolor, Pixel art, Paper cut, Blueprint.
- Seeded RNG, so each plate is stable between loads; no image assets, no libraries.
- Flips every 300ms for 3s; label shows plate number + style name.
- Checked via a contact sheet of all 8 canvases in the preview browser; fixed riso overprint.
Ideas: more subjects per style (e.g. a swimmer, a film camera), slower first plate, animate plates (wobble) for a stop-motion feel.

## Round 5 — UX critique and fixes
Critique: (1) hero was flat gray with one tiny thumbnail; the best art vanished after the loader; (2) fake film titles/"DIRECTOR" on placeholder slides were misleading; (3) justified body text had rivers; (4) header collided with content on scroll; (5) strip squares were empty gradients.
Fixes: generated plates (Pixel art, Blueprint, Linocut) are now the hero backdrops (dimmed only behind text, not the video) and the strip squares; slides honestly labeled "PLATE 0X / 04"; body text left-aligned at 62ch; header turns into a blurred bar after the hero.
Still open: email on Contact; real film slides/videos; mobile pass not yet done; plate generation runs on main thread at load (~brief).

## Round 6 — mobile pass (375×812)
Found: name overflowed (409px on a 375px screen); landscape art cropped badly on portrait; hover-only video trigger; one long facts column; 100vh jump with mobile browser bars; light Linocut slide hurt text contrast.
Fixed: name min size 44px (now 359px wide); portrait-aspect hero art on portrait screens; tap also selects a strip square; facts 2×2; `100svh`; tighter mobile spacing; stronger dim on the Linocut slide + text shadow on hero captions.
Not tested: real iOS/Android devices, landscape phones.

## Round 7 — rebuilt to mimic extrafazant.nl
Studied the reference live: Webflow + GSAP (ScrollTrigger, SplitText) + Lenis smooth scroll; light grey page, condensed heavy sans mixed with a light serif, blue/pink/orange accents.
Replicated (same libraries, installed from npm): blue curtain page-load wipe (kept the art-style flipbook on it); centered pill nav + script logo + contact pill, header turns white over dark sections; hero cursor image trail; masked line reveals on every heading; squiggle "Explore more" link; logo marquee (skills as logos); tilted polaroids with slap-on sticker; dark "Recent work" sticky stacking cards with thick colour frames + rotating badge; fanned service cards that spread on entry and straighten on hover; scattered parallax photos with bubble name stickers; dark footer with giant script logo; blue full-screen mobile menu.
No reference assets copied — imagery is generated plates + Jonathan's own YouTube thumbnail. Footer credits the design inspiration.
Checked: desktop 1440×900 and mobile 375×812 in the preview browser, no console errors, no horizontal overflow.

## Round 8 — hiring focus
Source: resume "Jonathan Tsang Nov 10.pdf" + public GitHub repos.
- Hero: "Turning data into decisions"; kicker "Data scientist, Boston University / Graduating December 2026"; marquee = Amazon (AWS) + core tools.
- Panel 2 is now "Three reasons to hire me": (01) AWS automation — ~8,000 hrs/yr saved, ~90% faster SLA reporting, $100M savings opportunity; (02) end-to-end ML — Rust simulator + PPO self-play RL, multi-agent LLM ranker, Spark/Kafka/TimescaleDB; (03) analysis → results + leadership — TextMarley +50% conversion, −30% cost/user, $5K seed, leading 3 projects / 18 students at BU Spark!, D1 swimmer.
- Projects: RL game agent (links crust-sim), TextMarley, AI news ranker. Reel/film removed.
- What I do: Data engineering / Machine learning / Analytics. Places → Experience (AWS, BU Spark!, Yefa, Azubu, BU Swim) with roles and dates.
- Footer CTA: open to full-time DS/ML/DE roles; LinkedIn + GitHub. Logo now "Jonathan Tsang".
- Not added: email/phone (kept off the public page pending owner approval).
