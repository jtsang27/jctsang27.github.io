import { useEffect, useRef, useState } from 'react';

// Swap these gradients for real backgrounds — e.g. bg: "url('/videos/reel-01.jpg')"
// — or render a <video> instead of a plain div in <HeroSlides>.
const heroSlides = [
  { title: 'Below the Surface', sub: 'Short Film',     role: 'DIRECTOR', name: 'Jonathan', bg: 'linear-gradient(135deg, #1c1c1f, #2a2a2e)' },
  { title: 'Meet Day',          sub: 'Documentary',    role: 'DIRECTOR', name: 'Jonathan', bg: 'linear-gradient(135deg, #1a1f24, #262b30)' },
  { title: 'Home, Twice',       sub: 'Personal Essay', role: 'DIRECTOR', name: 'Jonathan', bg: 'linear-gradient(135deg, #201c1a, #2c2622)' },
  { title: 'Reel 2026',         sub: 'Showreel',       role: 'DIRECTOR', name: 'Jonathan', bg: 'linear-gradient(135deg, #1a1c22, #24262e)' },
];

// Drop your own burst-shot sequence here for the loading screen — the
// more near-identical the frames, the more it reads like a flipbook.
const loaderPhotos = [
  'your-photo-01.jpg',
  'your-photo-02.jpg',
  'your-photo-03.jpg',
  'your-photo-04.jpg',
  'your-photo-05.jpg',
  'your-photo-06.jpg',
];
const placeholderTones = ['#1c1c1f', '#201f22', '#1a1a1d', '#221f1c', '#1e1e21', '#1b1c1e'];

function Loader({ onDone }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [pct, setPct] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(true);

  const cycleSpeed = 90;       // ms between frame swaps
  const totalDuration = 2200;  // ms before reveal

  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setFrameIndex((i) => (i + 1) % loaderPhotos.length);
    }, cycleSpeed);

    const start = Date.now();
    const countTimer = setInterval(() => {
      const next = Math.min(100, Math.round(((Date.now() - start) / totalDuration) * 100));
      setPct(next);
      if (next >= 100) clearInterval(countTimer);
    }, 60);

    const doneTimer = setTimeout(() => {
      clearInterval(cycleTimer);
      setHidden(true);
      onDone();
      setTimeout(() => setMounted(false), 700);
    }, totalDuration);

    return () => {
      clearInterval(cycleTimer);
      clearInterval(countTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div id="loader" className={hidden ? 'hidden' : ''}>
      <div className="loader-frame">
        {loaderPhotos.map((src, i) => (
          <div
            key={i}
            className={'frame' + (i === frameIndex ? ' active' : '')}
            style={{
              backgroundImage: `url('${src}'), linear-gradient(135deg, ${placeholderTones[i % placeholderTones.length]}, #141416)`,
            }}
          />
        ))}
      </div>
      <div className="loader-label">
        <span>Loading</span>
        <span className="count">{pct}%</span>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header>
      <div className="logo">Jonathan</div>
      <nav>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Hero() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i) => {
    setCurrent((i + heroSlides.length) % heroSlides.length);
    resetTimer();
  };

  const showSlide = (i) => {
    clearInterval(timerRef.current);
    setCurrent(i);
  };

  // Swipe support
  const touchStartX = useRef(0);
  const onTouchStart = (e) => { touchStartX.current = e.changedTouches[0].screenX; };
  const onTouchEnd = (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX.current;
    if (Math.abs(delta) > 50) delta < 0 ? goTo(current + 1) : goTo(current - 1);
  };

  const slide = heroSlides[current];

  return (
    <section className="hero" id="hero" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="hero-slides">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={'hero-slide' + (i === current ? ' active' : '')}
            style={{ background: s.bg }}
          />
        ))}
      </div>

      <div className="hero-mark">
        <div className="hero-name">JONATHAN TSANG</div>
      </div>

      <div className="hero-strip">
        <div className="hero-strip-track">
          {heroSlides.concat(heroSlides).map((s, i) => {
            const idx = i % heroSlides.length;
            return (
              <div
                key={i}
                className="strip-thumb"
                style={{ background: s.bg }}
                onMouseEnter={() => showSlide(idx)}
                onMouseLeave={resetTimer}
              />
            );
          })}
        </div>
      </div>

      <div className="hero-info">
        <div className="hero-info-left">
          <div className="title">{slide.title}</div>
          <div className="sub">{slide.sub}</div>
        </div>
        <div className="hero-info-right">
          <div className="hero-role">
            <div className="role-label">{slide.role}</div>
            <div className="role-name">{slide.name}</div>
          </div>
          <div className="hero-dots">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                className={'dot' + (i === current ? ' active' : '')}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Goals() {
  return (
    <section className="goals" id="about">
      <div className="goals-block">
        <h2>BACKGROUND</h2>
        <p>
          I grew up between the Bay Area and Hong Kong, and I&rsquo;m currently a junior at Boston
          University studying data science, with a minor in math. Outside of coursework, I swim on
          BU&rsquo;s Division I team and spend my free time writing, shooting, and editing short films
          — trying to find the throughline between analytical thinking and creative work.
        </p>
      </div>
      <div className="goals-block">
        <h2>CURRENT GOALS</h2>
        <p>
          Right now I&rsquo;m looking for an entry-level, full-time data science role for after I
          graduate in May 2027 — something where I can apply modeling and analytics to real
          problems, ideally at a place that values people who think visually as well as
          quantitatively.
        </p>
      </div>
    </section>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <div className={loading ? 'site loading' : 'site'}>
        <Nav />
        <Hero />
        <Goals />
      </div>
    </>
  );
}
