import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { plateStyles, paintPlate, plateURL } from './plates';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Layout, motion and vibe are modelled on extrafazant.nl (credited in the footer);
// all imagery here is generated in plates.js. Content comes from Jonathan's resume.
const GITHUB = 'https://github.com/jtsang27';
const LINKEDIN = 'https://www.linkedin.com/in/jonathantsang0/';

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
      <a href="#top" className="logo" aria-label="Jonathan Tsang, home">Jonathan Tsang</a>
      <nav className="nav-pills" aria-label="Main">
        <a href="#why">Why me</a>
        <a href="#work">Projects</a>
        <a href="#experience">Experience</a>
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
        <a href="#why">Why me</a>
        <a href="#work">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- hero --- */

const skills = [
  { t: 'Amazon (AWS)', f: 'sans' },
  { t: 'Python', f: 'serif' },
  { t: 'Spark', f: 'bubble' },
  { t: 'SQL', f: 'sans' },
  { t: 'PyTorch', f: 'script' },
  { t: 'Boston University', f: 'serif' },
  { t: 'Kafka', f: 'bubble' },
  { t: 'PostgreSQL', f: 'sans' },
  { t: 'Tableau', f: 'script' },
  { t: 'Rust', f: 'bubble' },
  { t: 'NCAA D1', f: 'sans' },
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
        <p className="hero-status" data-fade><i />Open to full-time roles · graduating December 2026</p>
        <p className="kicker hero-kicker" data-split>Hi, I&rsquo;m Jonathan Tsang,<br />a data scientist.</p>
        <h1 className="display hero-title" data-hero-title>
          <span className="line"><span className="lt">TURNING</span> <b>DATA</b></span>
          <span className="line"><b>INTO</b> <span className="serif">DECISIONS</span></span>
        </h1>
        <ul className="hero-proof" data-fade aria-label="Highlights">
          <li><b>Amazon (AWS)</b> Data Specialist Intern</li>
          <li><b>Boston University</b> B.S. Data Science</li>
          <li><b>NCAA Division I</b> swimmer</li>
        </ul>
        <div className="hero-cta" data-fade>
          <Button href={LINKEDIN} external>View my LinkedIn</Button>
          <SquiggleLink href="#why">Why hire me</SquiggleLink>
        </div>
      </div>
      <div className="logo-marquee" aria-label="Experience and tools">
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

const reasons = [
  {
    n: '01', c: 'blue', stat: '8,000', unit: 'manual hours saved a year',
    t: 'I automate the work that slows teams down',
    body: 'As a Data Specialist Intern at Amazon (AWS), I built SQL/Python pipelines on Lambda, SES, SNS and CloudWatch that turn raw vendor milestone data into automated SLA reporting, cutting turnaround ~90%. I also built a should-cost model across 100 global cabling vendors and quantified a $100M savings opportunity in procurement.',
  },
  {
    n: '02', c: 'pink', stat: 'PPO', unit: 'reinforcement learning, built from scratch',
    t: 'I build ML systems end to end',
    body: 'I wrote a Rust game simulator from scratch and trained agents on it with PPO, self-play and CNN state encoders, owning the environment, reward shaping, training loop and evaluation. I also built a multi-agent LLM system that ranks 150–200 articles a day, and data pipelines on Spark, Kafka and TimescaleDB.',
  },
  {
    n: '03', c: 'orange', stat: '+50%', unit: 'conversion from one pricing experiment',
    t: 'I turn analysis into results, and I lead',
    body: 'Running growth analytics for TextMarley (Top 10 on Product Hunt, 1,000+ users), my Stripe pricing experiment lifted conversion 50% and cut cost per user 30%, earning a $5,000 BU Accelerator seed. Now I lead 3 client data science projects with 18 students at BU Spark!, while training as an NCAA Division I swimmer.',
  },
];

function Reasons() {
  return (
    <section className="why" id="why">
      <div className="why-head">
        <p className="kicker" data-split>Why hire me</p>
        <h2 className="display" data-split><b>THREE REASONS</b><br /><span className="serif">TO HIRE ME</span></h2>
        <Sticker color="pink" tilt={8} className="why-sticker">D1<br />ATHLETE</Sticker>
      </div>
      <div className="why-grid">
        {reasons.map((r) => (
          <article className={`reason frame-${r.c}`} key={r.n}>
            <span className="reason-n">{r.n}</span>
            <div className="reason-stat">{r.stat}</div>
            <div className="reason-unit">{r.unit}</div>
            <h3>{r.t}</h3>
            <p>{r.body}</p>
          </article>
        ))}
      </div>
      <div className="why-cta" data-fade>
        <Button href={LINKEDIN} external>View my LinkedIn</Button>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- work --- */

function Work({ art }) {
  const cards = [
    {
      title: 'RL GAME AGENT',
      tag: 'Rust · PyTorch · PPO self-play',
      color: 'red',
      href: 'https://github.com/jtsang27/crust-sim',
      media: <div className="work-media" style={bg(art && art.wide[P.pixel])} />,
    },
    {
      title: 'TEXTMARLEY',
      tag: 'Growth analytics · Product Hunt Top 10',
      color: 'blue',
      media: <div className="work-media" style={bg(art && art.wide[P.riso])} />,
    },
    {
      title: 'AI NEWS RANKER',
      tag: 'Multi-agent LLMs · 150–200 articles/day',
      color: 'pink',
      media: <div className="work-media" style={bg(art && art.wide[P.blue])} />,
    },
  ];
  return (
    <section className="work theme-dark" id="work" data-theme="dark">
      <div className="work-head">
        <p className="kicker" data-split>Built end to end.<br />A few projects I&rsquo;m proud of.</p>
        <h2 className="display" data-split><b>SELECTED</b> <span className="serif">PROJECTS</span></h2>
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
        <Button href={GITHUB} color="pink" external>See the code on GitHub</Button>
      </div>
      <SpinBadge text="JONATHAN TSANG ✦ DATA ✦ ML ✦ OPEN TO WORK ✦ " />
    </section>
  );
}

/* ----------------------------------------------------------- services --- */

function Services({ art }) {
  const items = [
    { t: 'DATA ENGINEERING', d: 'Spark, Kafka, PostgreSQL & ETL pipelines that run themselves', c: 'blue', p: P.blue },
    { t: 'MACHINE LEARNING', d: 'PyTorch, reinforcement learning & LLM agents', c: 'pink', p: P.lino },
    { t: 'ANALYTICS', d: 'A/B tests, causal inference & KPIs leaders act on', c: 'orange', p: P.water },
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
        <SquiggleLink href="#experience" dir="down">See where I&rsquo;ve done it</SquiggleLink>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- places --- */

function Experience({ art }) {
  const jobs = [
    { label: 'Amazon (AWS)', role: 'Data Specialist Intern', when: 'Austin · Jun–Aug 2026', p: P.blue, c: 'blue', pos: 'a', speed: 0.15 },
    { label: 'BU Spark!', role: 'Data Science Project Manager', when: 'Boston · Sep 2026–now', p: P.clay, c: 'pink', pos: 'b', speed: -0.1 },
    { label: 'Yefa', role: 'Business Operations Manager', when: 'San Francisco · Dec 2025–Apr 2026', p: P.paper, c: 'orange', pos: 'c', speed: 0.25 },
    { label: 'Azubu', role: 'Strategist & Research Intern', when: 'Tokyo · Jun–Sep 2025', p: P.pixel, c: 'red', pos: 'd', speed: -0.05 },
    { label: 'BU Swim', role: 'NCAA Division I, 3x Honor Roll', when: 'Boston · 2023–2026', p: P.water, c: 'yellow', pos: 'e', speed: 0.2 },
  ];
  return (
    <section className="places" id="experience">
      <div className="places-head">
        <span className="oval-logo" data-pop>JT</span>
        <p className="kicker" data-split>Where I&rsquo;ve worked</p>
        <h2 className="display" data-split>BOS-AUS-SF-<b>TYO</b></h2>
      </div>
      <div className="places-field">
        {jobs.map((j) => (
          <figure className={`place place-${j.pos}`} key={j.label} data-speed={j.speed}>
            <div className="place-img" style={bg(art && art.portrait[j.p])} />
            <Sticker color={j.c} tilt={j.speed > 0 ? -7 : 6} className="place-sticker">{j.label}</Sticker>
            <figcaption><b>{j.role}</b><span>{j.when}</span></figcaption>
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
          <b>LET&rsquo;S BUILD</b><br /><span className="serif">SOMETHING TOGETHER</span>
        </h2>
        <p className="body" data-split>Graduating December 2026 and open to full-time data science, machine learning and data engineering roles.</p>
        <div className="footer-btns" data-fade>
          <Button href={LINKEDIN} color="pink" external>Message me on LinkedIn</Button>
          <Button href={GITHUB} external>GitHub</Button>
        </div>
      </div>
      <div className="footer-grid">
        <div className="footer-logo">Jonathan</div>
        <div className="footer-col">
          <h4>Navigation</h4>
          <a href="#why">Why me</a><a href="#work">Projects</a><a href="#experience">Experience</a><a href="#top">Back to top</a>
        </div>
        <div className="footer-col">
          <h4>Based</h4>
          <span>Boston University</span><span>Boston, MA</span>
        </div>
        <div className="footer-col">
          <h4>Find me</h4>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
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
      gsap.from('.reason', {
        y: 100, rotation: (i) => [-4, 3, -3][i], opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '.why-grid', start: 'top 80%', once: true },
      });
      gsap.utils.toArray('.why-sticker, [data-pop], .place-sticker').forEach((st) => {
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
        const pool = a.portrait;
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
          <Reasons />
          <Work art={art} />
          <Services art={art} />
          <Experience art={art} />
        </main>
        <Footer />
      </div>
    </>
  );
}
