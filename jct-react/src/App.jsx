import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { plateURL } from './plates';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Typography and palette are modelled on extrafazant.nl (credited in the footer).
// Content comes from Jonathan's resume; project art is generated in plates.js.
const GITHUB = 'https://github.com/jtsang27';
const LINKEDIN = 'https://www.linkedin.com/in/jonathantsang0/';

// Plate indices from plates.js
const P = { riso: 2, pixel: 5, blue: 7 };

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Project art is generated once, after first paint.
function usePlateArt() {
  const [art, setArt] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const wide = {};
      Object.values(P).forEach((i) => { wide[i] = plateURL(i, 960, 600, false); });
      setArt(wide);
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

// Label + separate arrow square; the arrow slides through on hover.
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

function TextLink({ href, children, external }) {
  return (
    <a
      className="text-link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children} <Arrow />
    </a>
  );
}

/* ------------------------------------------------------------- header --- */

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className={`site-header${open ? ' menu-open' : ''}`}>
      <a href="#top" className="logo" aria-label="Jonathan Tsang, home">Jonathan Tsang</a>
      <nav className="nav-pills" aria-label="Main">
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
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
      <div className="mobile-menu" onClick={() => setOpen(false)}>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- hero --- */

const reasons = [
  {
    n: '01', c: 'blue', stat: '8,000 hrs', unit: 'saved a year at Amazon (AWS)',
    t: 'I automate slow, manual work',
    body: 'Built SQL/Python pipelines on AWS Lambda, SES, SNS and CloudWatch that cut vendor SLA reporting turnaround ~90%, and quantified a $100M procurement savings opportunity.',
  },
  {
    n: '02', c: 'pink', stat: 'End to end', unit: 'ML systems I built myself',
    t: 'I build ML from scratch',
    body: 'Wrote a Rust game simulator and trained reinforcement-learning agents on it with PPO and self-play in PyTorch; built a multi-agent LLM system ranking 150–200 articles a day.',
  },
  {
    n: '03', c: 'orange', stat: '+50%', unit: 'conversion from one experiment',
    t: 'I turn analysis into results',
    body: 'Ran growth analytics for TextMarley (Product Hunt Top 10, 1,000+ users). Now leading 3 client data science projects at BU Spark!, while competing as an NCAA Division I swimmer.',
  },
];

function Hero() {
  return (
    <section className="hero" id="top">
      <p className="hero-status" data-fade><i />Open to full-time roles · graduating December 2026</p>
      <p className="kicker" data-split>Jonathan Tsang, data scientist at Boston University</p>
      <h1 className="display hero-title" data-split>
        <b>WHY YOU SHOULD</b> <span className="serif">HIRE ME</span>
      </h1>
      <div className="reasons">
        {reasons.map((r) => (
          <article className={`reason accent-${r.c}`} key={r.n}>
            <span className="reason-n">{r.n}</span>
            <div className="reason-stat">{r.stat}</div>
            <div className="reason-unit">{r.unit}</div>
            <h2>{r.t}</h2>
            <p>{r.body}</p>
          </article>
        ))}
      </div>
      <div className="hero-cta" data-fade>
        <Button href={LINKEDIN} external>View my LinkedIn</Button>
        <TextLink href={GITHUB} external>See my code on GitHub</TextLink>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- projects --- */

function Projects({ art }) {
  const items = [
    {
      title: 'RL Game Agent',
      tag: 'Rust · PyTorch · PPO',
      body: 'A custom game simulator built from scratch, with agents trained via PPO and self-play using CNN state encoders. I designed the environment, reward shaping, training loop and evaluation.',
      p: P.pixel,
      href: 'https://github.com/jtsang27/crust-sim',
    },
    {
      title: 'TextMarley',
      tag: 'Growth analytics · Stripe · PostHog',
      body: 'Growth analytics for an AI assistant that reached Top 10 on Product Hunt. A pricing experiment lifted conversion 50%; rate limiting and prompt templates cut cost per user 30%. $5,000 BU Accelerator seed.',
      p: P.riso,
    },
    {
      title: 'AI News Ranker',
      tag: 'Multi-agent LLMs · Python',
      body: 'A multi-agent system scoring 150–200 articles a day on novelty, impact and audience fit, with ranking quality evaluated against real engagement.',
      p: P.blue,
    },
  ];
  return (
    <section className="projects" id="projects">
      <p className="kicker" data-split>Built end to end</p>
      <h2 className="display section-title" data-split><b>SELECTED</b> <span className="serif">PROJECTS</span></h2>
      <div className="project-grid">
        {items.map((it) => (
          <article className="project" key={it.title} data-fade>
            <div className="project-img" style={bg(art && art[it.p])} />
            <span className="project-tag">{it.tag}</span>
            <h3>{it.title}</h3>
            <p>{it.body}</p>
            {it.href && <TextLink href={it.href} external>View code</TextLink>}
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- skills --- */

function Skills() {
  const groups = [
    { t: 'Data engineering', d: 'Spark, Kafka, PostgreSQL, TimescaleDB, Kubernetes, ETL pipelines, star-schema modeling' },
    { t: 'Machine learning & AI', d: 'PyTorch, reinforcement learning (PPO, self-play), LLM agents, Claude API' },
    { t: 'Analytics & product', d: 'SQL, A/B testing, causal inference, regression, Tableau, PostHog, Stripe' },
    { t: 'Languages & cloud', d: 'Python, SQL, R, Rust, TypeScript/React, AWS (Lambda, SES, SNS, CloudWatch), Git' },
  ];
  return (
    <section className="skills" id="skills">
      <p className="kicker" data-split>What I work with</p>
      <h2 className="display section-title" data-split><b>SKILLS</b></h2>
      <div className="skill-grid">
        {groups.map((g) => (
          <div className="skill" key={g.t} data-fade>
            <h3>{g.t}</h3>
            <p>{g.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- experience --- */

function Experience() {
  const jobs = [
    { role: 'Data Science Project Manager', org: 'BU Spark!', where: 'Boston, MA', when: 'Sep 2026 – Present', d: 'Lead 3 client data science projects across 18 students in 3 teams, owning scope, milestones and client delivery.' },
    { role: 'Data Specialist Intern', org: 'Amazon (AWS)', where: 'Austin, TX', when: 'Jun – Aug 2026', d: 'Automated vendor SLA reporting (~90% faster, ~8,000 hours saved a year), built a should-cost model across 100 global vendors and quantified a $100M savings opportunity.' },
    { role: 'Business Operations Manager', org: 'Yefa Construction', where: 'San Francisco, CA', when: 'Dec 2025 – Apr 2026', d: 'Defined a KPI framework and project-level P&L across 10+ projects; built task tracking for 20+ staff that cut invoice cycle time 20%.' },
    { role: 'Strategist & Research Intern', org: 'Azubu Insights', where: 'Tokyo, Japan', when: 'Jun – Sep 2025', d: 'Sized AI market opportunities in Japan and prototyped Python MVPs for 2 AI products, cutting time to delivery ~50%.' },
    { role: 'B.S. Data Science, minor in Mathematics', org: 'Boston University', where: 'Boston, MA', when: 'Sep 2023 – Dec 2026', d: 'NCAA Division I Swimming & Diving · 3x Student-Athlete Honor Roll · Hong Kong team representative.' },
  ];
  return (
    <section className="experience theme-dark" id="experience" data-theme="dark">
      <p className="kicker" data-split>Where I&rsquo;ve done it</p>
      <h2 className="display section-title" data-split><b>EXPERIENCE</b></h2>
      <ol className="timeline">
        {jobs.map((j) => (
          <li className="job" key={j.org + j.role} data-fade>
            <div className="job-when">{j.when}</div>
            <div className="job-main">
              <h3>{j.role}</h3>
              <div className="job-org">{j.org} · {j.where}</div>
              <p>{j.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------- footer --- */

function Footer() {
  return (
    <footer className="footer theme-dark" id="contact" data-theme="dark">
      <div className="footer-cta">
        <h2 className="display section-title" data-split><b>LET&rsquo;S</b> <span className="serif">TALK</span></h2>
        <p className="body" data-split>Open to full-time data science, machine learning and data engineering roles starting after December 2026.</p>
        <div className="footer-btns" data-fade>
          <Button href={LINKEDIN} color="pink" external>Message me on LinkedIn</Button>
          <Button href={GITHUB} external>GitHub</Button>
        </div>
      </div>
      <div className="footer-base">
        <span>&copy; {new Date().getFullYear()} Jonathan Tsang · Boston, MA</span>
        <span>Design inspired by <a href="https://www.extrafazant.nl/" target="_blank" rel="noopener noreferrer">Extrafazant</a></span>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------- animation --- */

// Smooth scroll, header theme switching and quiet entrance reveals.
function useMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    const still = reducedMotion();
    let lenis;
    let tick;

    if (!still) {
      lenis = new Lenis({ anchors: true, lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      const header = root.querySelector('.site-header');
      root.querySelectorAll('[data-theme="dark"]').forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 44px',
          end: 'bottom 44px',
          onToggle: (self) => header.classList.toggle('on-dark', self.isActive),
        });
      });

      if (still) return;

      root.querySelectorAll('[data-split]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 105,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          }),
        });
      });

      gsap.from('.reason', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.25 });

      gsap.utils.toArray('[data-fade]').forEach((el) => {
        gsap.from(el, { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
      });
    }, root);

    return () => {
      ctx.revert();
      if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); }
    };
  }, [rootRef]);
}

/* ---------------------------------------------------------------- app --- */

export default function App() {
  const rootRef = useRef(null);
  const art = usePlateArt();
  useMotion(rootRef);

  return (
    <div ref={rootRef} className="page">
      <Header />
      <main>
        <Hero />
        <Projects art={art} />
        <Skills />
        <Experience />
      </main>
      <Footer />
    </div>
  );
}
