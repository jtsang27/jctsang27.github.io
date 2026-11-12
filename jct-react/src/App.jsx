import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { plateStyles, paintPlate, plateURL } from './plates';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Layout, motion and vibe are modelled on extrafazant.nl (credited in the footer);
// all imagery here is generated in plates.js or comes from Jonathan's own YouTube.
const REEL_ID = 'P3eojeUc0O4'; // TODO: swap for your real reel's YouTube ID
const REEL_THUMB = `https://i.ytimg.com/vi/${REEL_ID}/maxresdefault.jpg`;
const GITHUB = 'https://github.com/jtsang27';

// Plate indices from plates.js
const P = { clay: 0, pencil: 1, riso: 2, lino: 3, water: 4, pixel: 5, paper: 6, blue: 7 };

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------------------------------------------------------------- art --- */

// Generates every plate image once, after first paint, so the loader shows instantly.
function usePlateArt() {
  const [art, setArt] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const portrait = plateStyles.map((_, i) => plateURL(i, 480, 600, false));
      const wide = plateStyles.map((_, i) => plateURL(i, 1200, 720, false));
      setArt({ portrait, wide });
    }, 60);
    return () => clearTimeout(t);
  }, []);
  return art;
}

const bg = (src) => (src ? { backgroundImage: `url(${src})` } : undefined);

/* ------------------------------------------------------------- pieces --- */

function Arrow({ dir = 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className={`arrow arrow-${dir}`} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}

// Label + separate arrow square, like the reference's buttons; the arrow slides through on hover.
function Button({ href, children, color = 'blue', external }) {
  return (
    <a
      className={`btn btn-${color}`}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="btn-icon"><Arrow /><Arrow /></span>
      <span className="btn-label">{children}</span>
    </a>
  );
}

// Serif link with a hand-drawn squiggle underline that redraws on hover.
function SquiggleLink({ href, children, dir = 'down' }) {
  return (
    <a className="squiggle-link" href={href}>
      <span className="squiggle-text">
        {children}
        <svg className="squiggle" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 8 C 20 2, 30 13, 48 7 S 78 2, 96 8 S 128 13, 146 7 S 178 2, 198 8" />
        </svg>
      </span>
      <span className="squiggle-arrow"><Arrow dir={dir} /></span>
    </a>
  );
}

function Sticker({ children, color = 'pink', tilt = -8, className = '' }) {
  return (
    <span className={`sticker sticker-${color} ${className}`} style={{ '--tilt': `${tilt}deg` }}>
      {children}
    </span>
  );
}

// Circular rotating text badge.
function SpinBadge({ text }) {
  return (
    <div className="spin-badge" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs>
          <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text><textPath href="#badge-circle">{text}</textPath></text>
      </svg>
      <span className="spin-badge-core">JT</span>
    </div>
  );
}

/* ------------------------------------------------------------- loader --- */

// Blue screen with the generative flipbook; leaves with an upward curtain wipe.
function Loader({ onReveal }) {
  const [frame, setFrame] = useState(0);
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const canvases = useRef([]);

  useEffect(() => {
    canvases.current.forEach((c, i) => c && paintPlate(c, i));
    const quick = reducedMotion();
    const total = quick ? 600 : 2600;
    const flip = setInterval(() => setFrame((f) => (f + 1) % plateStyles.length), 260);
    const start = Date.now();
    const count = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - start) / total) * 100));
      setPct(p);
      if (p >= 100) clearInterval(count);
    }, 50);
    const done = setTimeout(() => {
      clearInterval(flip);
      setLeaving(true);
      onReveal();
      setTimeout(() => setGone(true), 1100);
    }, total);
    return () => { clearInterval(flip); clearInterval(count); clearTimeout(done); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div className={`loader${leaving ? ' leaving' : ''}`}>
      <div className="loader-card">
        {plateStyles.map((_, i) => (
          <canvas
            key={i}
            ref={(el) => { canvases.current[i] = el; }}
            width={420}
            height={525}
            className={i === frame ? 'on' : ''}
          />
        ))}
      </div>
      <div className="loader-meta">
        <span>{plateStyles[frame].name}</span>
        <span>{String(pct).padStart(3, '0')}%</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- header --- */

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className={`site-header${open ? ' menu-open' : ''}`}>
      <a href="#top" className="logo" aria-label="Jonathan Tsang, home">Jonathan</a>
      <nav className="nav-pills" aria-label="Main">
        <a href="#who">Who</a>
        <a href="#work">Work</a>
        <a href="#services">What I do</a>
      </nav>
      <a href="#contact" className="contact-pill"><i />Contact</a>
      <button
        className="burger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span />
      </button>
      <div className="mobile-menu" onClick={close}>
        <a href="#who">Who</a>
        <a href="#work">Work</a>
        <a href="#services">What I do</a>
        <a href="#contact">Contact</a>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- hero --- */

const skills = [
  { t: 'Python', f: 'sans' },
  { t: 'PyTorch', f: 'serif' },
  { t: 'SQL', f: 'bubble' },
  { t: 'pandas', f: 'script' },
  { t: 'scikit-learn', f: 'sans' },
  { t: 'Boston University', f: 'serif' },
  { t: 'NCAA D1', f: 'bubble' },
  { t: 'Premiere Pro', f: 'sans' },
  { t: 'DaVinci', f: 'script' },
  { t: 'Tableau', f: 'serif' },
];

function Hero({ art }) {
  const [mobileFrame, setMobileFrame] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMobileFrame((f) => (f + 1) % plateStyles.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero" id="top" data-hero>
      <div className="trail" aria-hidden="true" />
      <div className="hero-mobile-card" style={bg(art && art.portrait[mobileFrame])} aria-hidden="true" />
      <div className="hero-content">
        <p className="kicker" data-split>Data science,<br />film &amp; swimming</p>
        <h1 className="display hero-title" data-hero-title>
          <span className="line"><span className="lt">TURNING</span> <b>DATA</b></span>
          <span className="line"><b>INTO</b> <span className="serif">STORIES</span></span>
        </h1>
        <div className="hero-cta" data-fade>
          <SquiggleLink href="#who">Explore more</SquiggleLink>
        </div>
      </div>
      <div className="logo-marquee" aria-label="Tools and affiliations">
        <div className="logo-track">
          {[0, 1].map((k) => (
            <div className="logo-set" key={k} aria-hidden={k === 1}>
              {skills.map((s) => <span key={s.t} className={`logo-item f-${s.f}`}>{s.t}</span>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- intro --- */

function Intro({ art }) {
  return (
    <section className="intro" id="who">
      <div className="intro-photos">
        <figure className="polaroid polaroid-a" data-speed="0.12">
          <div className="polaroid-img" style={bg(REEL_THUMB)} />
        </figure>
        <figure className="polaroid polaroid-b" data-speed="-0.08">
          <div className="polaroid-img" style={bg(art && art.portrait[P.riso])} />
        </figure>
        <Sticker color="pink" tilt={-10} className="intro-sticker">D1<br />SWIM</Sticker>
      </div>
      <div className="intro-text">
        <p className="kicker" data-split>Who I am</p>
        <h2 className="display" data-split>
          <b>THE DATA SCIENTIST</b><br /><span className="serif">WHO FILMS</span>
        </h2>
        <p className="body" data-split>
          NCAA Division I swimmer at Boston University, graduating December 2026 in Data Science
          with minors in Mathematics and Film. Grew up between the Bay Area and Hong Kong. I build
          models, then cut the story around them.
        </p>
        <div data-fade><Button href="#work">See my work</Button></div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- work --- */

function ReelCard() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="work-media">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${REEL_ID}?autoplay=1&rel=0&playsinline=1`}
          title="Reel 2026"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button className="work-play" style={bg(REEL_THUMB)} onClick={() => setPlaying(true)} aria-label="Play Reel 2026">
          <span className="play-dot"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
        </button>
      )}
    </div>
  );
}

function Work({ art }) {
  const cards = [
    { title: 'REEL 2026', tag: 'Film · Showreel', color: 'red', media: <ReelCard /> },
    {
      title: 'GENERATIVE PLATES',
      tag: 'Code · Canvas',
      color: 'blue',
      media: <div className="work-media" style={bg(art && art.wide[P.blue])} />,
    },
    {
      title: 'DATA PROJECTS',
      tag: 'Python · ML · GitHub',
      color: 'pink',
      href: GITHUB,
      media: <div className="work-media" style={bg(art && art.wide[P.pencil])} />,
    },
  ];
  return (
    <section className="work theme-dark" id="work" data-theme="dark">
      <div className="work-head">
        <p className="kicker" data-split>Worth a look. Worth a share.<br />Here&rsquo;s some of what I make.</p>
        <h2 className="display" data-split><b>RECENT</b> <span className="serif">WORK</span></h2>
      </div>
      <div className="work-stack">
        {cards.map((c) => (
          <article className={`work-card frame-${c.color}`} key={c.title}>
            {c.media}
            <div className="work-caption">
              <h3>{c.href ? <a href={c.href} target="_blank" rel="noopener noreferrer">{c.title}</a> : c.title}</h3>
              <span>{c.tag}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="work-foot" data-fade>
        <Button href={GITHUB} color="pink" external>See more on GitHub</Button>
      </div>
      <SpinBadge text="JONATHAN TSANG ✦ DATA ✦ FILM ✦ SWIM ✦ " />
    </section>
  );
}

/* ----------------------------------------------------------- services --- */

function Services({ art }) {
  const items = [
    { t: 'DATA SCIENCE', d: 'Models, analysis & ML that hold up', c: 'blue', p: P.blue },
    { t: 'FILM', d: 'Stories, shot & cut', c: 'pink', p: P.lino },
    { t: 'SWIM', d: 'NCAA Division I at Boston University', c: 'orange', p: P.water },
  ];
  return (
    <section className="services" id="services">
      <p className="kicker" data-split>What I do</p>
      <h2 className="display" data-split><b>WHAT I</b> <span className="serif">DO</span></h2>
      <div className="fan">
        {items.map((it) => (
          <article className={`fan-card frame-${it.c}`} key={it.t}>
            <div className="fan-img" style={bg(art && art.portrait[it.p])} />
            <div className="fan-text">
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="services-cta" data-fade>
        <SquiggleLink href="#contact" dir="right">Get in touch</SquiggleLink>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- places --- */

function Places({ art }) {
  const spots = [
    { label: 'Bay Area', p: P.paper, c: 'orange', pos: 'a', speed: 0.15 },
    { label: 'Hong Kong', p: P.pixel, c: 'pink', pos: 'b', speed: -0.1 },
    { label: 'Boston', p: P.clay, c: 'blue', pos: 'c', speed: 0.25 },
    { label: 'The Pool', p: P.water, c: 'yellow', pos: 'd', speed: -0.05 },
    { label: 'Edit Bay', p: P.riso, c: 'red', pos: 'e', speed: 0.2 },
  ];
  return (
    <section className="places">
      <div className="places-head">
        <span className="oval-logo" data-pop>JT</span>
        <p className="kicker" data-split>Where I&rsquo;ve lived &amp; trained</p>
        <h2 className="display" data-split>BAY-HK-<b>BOS</b></h2>
      </div>
      <div className="places-field">
        {spots.map((s) => (
          <figure className={`place place-${s.pos}`} key={s.label} data-speed={s.speed}>
            <div className="place-img" style={bg(art && art.portrait[s.p])} />
            <Sticker color={s.c} tilt={s.speed > 0 ? -7 : 6} className="place-sticker">{s.label}</Sticker>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- footer --- */

function Footer() {
  return (
    <footer className="footer theme-dark" id="contact" data-theme="dark">
      <div className="footer-cta">
        <h2 className="display" data-split>
          <b>WANT TO SET</b><br /><span className="serif">SOMETHING IN MOTION?</span>
        </h2>
        <p className="body" data-split>Tell me what you&rsquo;re working on. I&rsquo;ll help make it visible.</p>
        <div data-fade><Button href={GITHUB} color="pink" external>Say hi on GitHub</Button></div>
      </div>
      <div className="footer-grid">
        <div className="footer-logo">Jonathan</div>
        <div className="footer-col">
          <h4>Navigation</h4>
          <a href="#who">Who</a><a href="#work">Work</a><a href="#services">What I do</a><a href="#top">Back to top</a>
        </div>
        <div className="footer-col">
          <h4>Based</h4>
          <span>Boston University</span><span>Boston, MA</span>
        </div>
        <div className="footer-col">
          <h4>Socials</h4>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
      <div className="footer-base">
        <span>&copy; {new Date().getFullYear()} Jonathan Tsang</span>
        <span>Design inspired by <a href="https://www.extrafazant.nl/" target="_blank" rel="noopener noreferrer">Extrafazant</a></span>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------- animation --- */

// All scroll/motion wiring lives here, scoped to the page root and reverted on unmount.
function useMotion(rootRef, revealed, art) {
  const artRef = useRef(art);
  artRef.current = art;

  useEffect(() => {
    if (!revealed) return undefined;
    const root = rootRef.current;
    const still = reducedMotion();
    let lenis;
    let tick;

    if (!still) {
      lenis = new Lenis({ anchors: true, lerp: 0.09 });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      const header = root.querySelector('.site-header');

      // Header flips to light-on-dark over dark sections.
      root.querySelectorAll('[data-theme="dark"]').forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 44px',
          end: 'bottom 44px',
          onToggle: (self) => header.classList.toggle('on-dark', self.isActive),
        });
      });

      if (still) return;

      // Hero title: masked line reveal right as the curtain lifts.
      gsap.from(root.querySelectorAll('[data-hero-title] .line > *'), {
        yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.07, delay: 0.3,
      });
      gsap.from('.site-header > :not(.mobile-menu)', { y: -30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.5 });
      gsap.from('.logo-marquee', { opacity: 0, y: 30, duration: 1, ease: 'expo.out', delay: 0.8 });

      // Masked line reveals for kickers, headings and paragraphs.
      root.querySelectorAll('[data-split]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }),
        });
      });

      gsap.utils.toArray('[data-fade]').forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });

      // Parallax drift at different speeds.
      gsap.utils.toArray('[data-speed]').forEach((el) => {
        const s = parseFloat(el.dataset.speed);
        gsap.fromTo(el, { yPercent: s * 60 }, {
          yPercent: -s * 60, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // Polaroids drop in tilted; sticker slaps on.
      gsap.from('.polaroid', {
        rotation: 0, y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '.intro', start: 'top 75%', once: true },
      });
      gsap.utils.toArray('.intro-sticker, [data-pop], .place-sticker').forEach((st) => {
        gsap.from(st, {
          scale: 0, rotation: -50, duration: 0.8, ease: 'back.out(2.4)',
          scrollTrigger: { trigger: st, start: 'top 88%', once: true },
        });
      });

      // Work: sticky stack — each card shrinks and dims as the next one slides over it.
      const workCards = gsap.utils.toArray('.work-card');
      workCards.forEach((card, i) => {
        const next = workCards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.88, rotation: i % 2 ? 2.5 : -2.5, filter: 'brightness(0.55)', ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 14%', scrub: true },
        });
      });

      // Services: cards start stacked, fan out on entry; hover straightens and lifts.
      const fan = gsap.utils.toArray('.fan-card');
      const wide = window.matchMedia('(min-width: 800px)').matches;
      const spread = wide ? [-7, 1.5, 8] : [-3, 2.5, -2];
      gsap.set(fan, { rotation: (i) => spread[i] });
      if (wide) {
        gsap.from(fan, {
          xPercent: (i) => (1 - i) * 100, rotation: 0, y: 140, duration: 1.4, ease: 'expo.out', stagger: 0.05,
          scrollTrigger: { trigger: '.fan', start: 'top 80%', once: true },
        });
      } else {
        fan.forEach((c) => gsap.from(c, { y: 90, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%', once: true } }));
      }
      fan.forEach((c, i) => {
        c.addEventListener('mouseenter', () => gsap.to(c, { rotation: 0, y: -24, scale: 1.04, zIndex: 5, duration: 0.6, ease: 'expo.out' }));
        c.addEventListener('mouseleave', () => gsap.to(c, { rotation: spread[i], y: 0, scale: 1, zIndex: 1, duration: 0.8, ease: 'expo.out' }));
      });

      // Places: photos unmask upward.
      gsap.utils.toArray('.place-img').forEach((img) => {
        gsap.from(img, {
          clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut',
          scrollTrigger: { trigger: img, start: 'top 90%', once: true },
        });
      });
    }, root);

    // Hero cursor image trail (desktop): tilted cards pop in where the mouse goes.
    let offTrail = () => {};
    if (!still && finePointer()) {
      const hero = root.querySelector('[data-hero]');
      const layer = hero.querySelector('.trail');
      let last = { x: -999, y: -999 };
      let n = 0;
      const onMove = (e) => {
        const a = artRef.current;
        if (!a) return;
        const r = hero.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (Math.hypot(x - last.x, y - last.y) < 120) return;
        last = { x, y };
        const pool = [...a.portrait, REEL_THUMB];
        const el = document.createElement('div');
        el.className = 'trail-card';
        el.style.backgroundImage = `url(${pool[n++ % pool.length]})`;
        layer.appendChild(el);
        gsap.set(el, { x, y, xPercent: -50, yPercent: -50, rotation: gsap.utils.random(-14, 14) });
        gsap.timeline({ onComplete: () => el.remove() })
          .from(el, { scale: 0.2, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' })
          .to(el, { scale: 0.5, opacity: 0, y: '+=40', duration: 0.5, ease: 'power2.in' }, '+=0.6');
      };
      hero.addEventListener('mousemove', onMove);
      offTrail = () => hero.removeEventListener('mousemove', onMove);
    }

    return () => {
      offTrail();
      ctx.revert();
      if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); }
    };
  }, [revealed, rootRef]);

  // Generated images change layout slightly once they land; re-measure triggers.
  useEffect(() => {
    if (art && revealed) ScrollTrigger.refresh();
  }, [art, revealed]);
}

/* ---------------------------------------------------------------- app --- */

export default function App() {
  const [revealed, setRevealed] = useState(false);
  const rootRef = useRef(null);
  const art = usePlateArt();
  useMotion(rootRef, revealed, art);

  return (
    <>
      <Loader onReveal={() => setRevealed(true)} />
      <div ref={rootRef} className={`page${revealed ? ' is-revealed' : ''}`}>
        <Header />
        <main>
          <Hero art={art} />
          <Intro art={art} />
          <Work art={art} />
          <Services art={art} />
          <Places art={art} />
        </main>
        <Footer />
      </div>
    </>
  );
}
