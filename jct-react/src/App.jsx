import { useEffect, useRef, useState } from 'react';

// Swap these gradients for real backgrounds — e.g. bg: "url('/videos/reel-01.jpg')"
// — or render a <video> instead of a plain div in <HeroSlides>.
//
// A slide with a `videoId` (YouTube ID) automatically shows that video's
// real thumbnail as its background/square art, and hovering its square in
// the scrolling strip plays the video live, muted, in the hero — swap in
// your own IDs as you upload films.
const ytThumb = (id) => `url('https://i.ytimg.com/vi/${id}/maxresdefault.jpg') center/cover`;

const heroSlides = [
  { title: 'Below the Surface', sub: 'Short Film',     role: 'DIRECTOR', name: 'Jonathan', bg: 'linear-gradient(135deg, #1c1c1f, #2a2a2e)' },
  { title: 'Meet Day',          sub: 'Documentary',    role: 'DIRECTOR', name: 'Jonathan', bg: 'linear-gradient(135deg, #1a1f24, #262b30)' },
  { title: 'Home, Twice',       sub: 'Personal Essay', role: 'DIRECTOR', name: 'Jonathan', bg: 'linear-gradient(135deg, #201c1a, #2c2622)' },
  {
    title: 'Reel 2026',
    sub: 'Showreel',
    role: 'DIRECTOR',
    name: 'Jonathan',
    videoId: 'P3eojeUc0O4', // TODO: swap for your real reel's YouTube ID
    bg: 'linear-gradient(135deg, #1a1c22, #24262e)', // plain background for the hero — no big thumbnail
    thumbBg: ytThumb('P3eojeUc0O4'), // real thumbnail, only for the small strip square
  },
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
  const [previewOn, setPreviewOn] = useState(false);
  const timerRef = useRef(null);
  // Once true (first thumbnail hover), auto-rotation stops for good — the
  // hero only changes when a different thumbnail is hovered from then on.
  const lockedRef = useRef(false);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    if (lockedRef.current) return;
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
    setPreviewOn(false);
    setCurrent((i + heroSlides.length) % heroSlides.length);
    resetTimer();
  };

  const onThumbEnter = (i) => {
    lockedRef.current = true;
    clearInterval(timerRef.current);
    setCurrent(i);
    setPreviewOn(!!heroSlides[i].videoId);
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
          >
            {i === current && previewOn && s.videoId && (
              <iframe
                className="hero-preview-frame"
                src={`https://www.youtube-nocookie.com/embed/${s.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${s.videoId}&modestbranding=1&rel=0&playsinline=1`}
                title={`${s.title} preview`}
                allow="autoplay; encrypted-media"
              />
            )}
          </div>
        ))}
      </div>

      <div className="hero-mark">
        {/* Solid text run through an SVG dilate-then-subtract filter, so
            the result is a single outline tracing the whole word's outer
            silhouette — not a per-letter stroke, which would show messy
            crossing lines wherever glyphs touch or overlap. */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="bubbleOutline">
            <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dilated" />
            <feComposite in="dilated" in2="SourceAlpha" operator="out" result="ring" />
            <feFlood floodColor="#f2efe9" result="ringColor" />
            <feComposite in="ringColor" in2="ring" operator="in" />
          </filter>
        </svg>
        <div className="hero-name">
          <span>JONATHAN</span>
          <span>TSANG</span>
        </div>
      </div>

      <div className="hero-strip">
        <div className="hero-strip-track">
          {heroSlides.concat(heroSlides).map((s, i) => {
            const idx = i % heroSlides.length;
            return (
              <div
                key={i}
                className={'strip-thumb' + (s.videoId ? ' has-video' : '')}
                style={{ background: s.thumbBg || s.bg }}
                onMouseEnter={() => onThumbEnter(idx)}
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
          I grew up between the Bay Area and Hong Kong, and I&rsquo;m an NCAA Division I swimmer at
          Boston University, graduating in December 2026 with a major in Data Science and minors in
          Mathematics and Film. Outside of the pool and coursework, I spend my free time writing,
          shooting, and editing short films — trying to find the throughline between analytical
          thinking and creative work.
        </p>
      </div>
      <div className="goals-block">
        <h2>CURRENT GOALS</h2>
        <p>
          Right now I&rsquo;m looking for an entry-level, full-time data science / machine learning
          role for after I graduate — something where I can apply modeling and analytics to real
          problems.
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
