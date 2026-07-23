import { useEffect, useRef, useState } from 'react';
import { Wifi, Monitor, Utensils, Trophy, Clock, Users, Flame, Coffee, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── Hooks ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2200, active }: {
  target: number; prefix?: string; suffix?: string; duration?: number; active: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const timer = setInterval(() => {
      frame++;
      const progress = easeOut(Math.min(frame / totalFrames, 1));
      setCount(Math.floor(progress * target));
      if (frame >= totalFrames) { setCount(target); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return <>{prefix}{count.toLocaleString('en-IN')}{suffix}</>;
}

/* ─── Venue Image Carousel ─── */
const SLIDES = [
  { src: '/venue_classroom.jpg', label: 'Smart Classrooms', sub: 'Digital screens · Plugboards at every seat' },
  { src: '/venue_campus.jpg',    label: 'Our Campus',       sub: 'ANITS, Sangivalasa — Visakhapatnam' },
  { src: '/venue_hackathon.jpg', label: 'Hacking Arena',    sub: '800+ coders under one roof, 24 hours straight' },
  { src: '/venue_campfire.jpg',  label: 'Campfire Night',   sub: 'Fun activities · Movie screening · Bonding' },
];

function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const next = () => setCurrent(c => (c + 1) % SLIDES.length);
  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4500);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl group"
      style={{ aspectRatio: '16/9', boxShadow: '0 0 60px rgba(249,115,22,0.15)' }}>
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform: `translateX(${(i - current) * 100}%)`,
            zIndex: i === current ? 2 : 1,
          }}
        >
          <img
            src={slide.src}
            alt={slide.label}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(2,8,23,0.85) 0%, rgba(2,8,23,0.2) 50%, transparent 100%)' }} />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
            <div
              className="text-xl md:text-2xl font-black text-white mb-1"
              style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
            >
              {slide.label}
            </div>
            <div className="text-xs md:text-sm text-slate-300 font-mono">{slide.sub}</div>
          </div>
        </div>
      ))}

      {/* Glowing border frame */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: '1px solid rgba(249,115,22,0.3)' }} />

      {/* Nav arrows */}
      <button onClick={() => { prev(); resetTimer(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500/30 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => { next(); resetTimer(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500/30 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-5 z-10 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); resetTimer(); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? '#F97316' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Glitch 24 ─── */
function Glitch24({ active }: { active: boolean }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (!active) return;
    let t: ReturnType<typeof setTimeout>;

    const cycle = () => {
      // glitch on for 150ms
      setGlitching(true);
      t = setTimeout(() => {
        setGlitching(false);
        // wait 1–2 s then repeat
        t = setTimeout(cycle, 1000 + Math.random() * 1000);
      }, 150);
    };

    // first glitch after 600ms so user sees the number first
    t = setTimeout(cycle, 600);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <span
      className="font-black leading-none select-none"
      style={{
        fontSize: 'clamp(5rem, 18vw, 13rem)',
        letterSpacing: '-0.04em',
        display: 'inline-block',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FB923C 35%, #F97316 55%, #FED7AA 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        // subtle glow normally; chromatic aberration during glitch
        filter: glitching
          ? 'drop-shadow(-4px 0 cyan) drop-shadow(4px 0 red)'
          : 'drop-shadow(0 0 18px rgba(249,115,22,0.55)) drop-shadow(0 0 45px rgba(249,115,22,0.18))',
        animation: glitching ? 'glitch24 0.15s steps(3) forwards' : 'none',
        transition: glitching ? 'none' : 'filter 0.25s ease',
      }}
    >
      24
    </span>
  );
}


/* ─── Main Component ─── */
export default function AboutSection() {
  const { ref: heroRef, visible: heroVisible } = useInView(0.3);
  const { ref: statsRef, visible: statsVisible } = useInView(0.3);
  const { ref: featuresRef, visible: featuresVisible } = useInView(0.15);
  const { ref: carouselRef, visible: carouselVisible } = useInView(0.2);

  const stats = [
    { icon: Trophy, value: 70000, prefix: '₹', suffix: '', label: 'Prize Pool', color: '#F97316', glow: 'rgba(249,115,22,0.4)' },
    { icon: Users, value: 800, prefix: '', suffix: '+', label: 'Participants', color: '#3B82F6', glow: 'rgba(59,130,246,0.4)' },
    { icon: Clock, value: 24, prefix: '', suffix: 'H', label: 'Non-Stop', color: '#06B6D4', glow: 'rgba(6,182,212,0.4)' },
    { icon: Star, value: 12, prefix: '', suffix: '+', label: 'Domains', color: '#A78BFA', glow: 'rgba(167,139,250,0.4)' },
  ];

  const features = [
    { icon: Wifi, title: 'High-Speed Wi-Fi', desc: 'Blazing fast internet throughout the entire venue — no throttling, no limits.', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
    { icon: Monitor, title: 'Smart Classrooms', desc: 'Digital screens, projectors, and plugboards at every workstation — plug in and build.', color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
    { icon: Utensils, title: 'Food & Refreshments', desc: 'Meals, snacks, tea, coffee — fully provided so you can keep your focus on coding.', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
    { icon: Flame, title: 'Campfire Night', desc: 'Unwind at midnight with a campfire, chill music, and your new hacker friends.', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
    { icon: Coffee, title: 'Movie Screening', desc: 'Take a breather — we\'ve got a late-night movie screening planned for the hackathon night.', color: '#A78BFA', bg: 'rgba(167,139,250,0.08)' },
    { icon: Zap, title: 'Mentorship & Support', desc: 'Industry mentors on standby throughout the 24 hours. Never get stuck alone.', color: '#06B6D4', bg: 'rgba(6,182,212,0.08)' },
  ];

  return (
    <section id="about" className="relative py-28 px-4 md:px-6 overflow-hidden">

      {/* BG glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 15% 30%, rgba(249,115,22,0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 70%, rgba(59,130,246,0.07) 0%, transparent 55%)
        `,
      }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-24">

        {/* ── Hero Banner: 24 HOURS ── */}
        <div ref={heroRef} className="text-center relative">

          {/* Giant 24 HOURS slot-machine text */}
          <div className="relative inline-block mb-6">

            <Glitch24 active={heroVisible} />

            <div
              className="block text-center"
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 4.5rem)',
                letterSpacing: '0.4em',
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 800,
                textShadow: '0 0 40px rgba(59,130,246,0.6)',
                color: '#93C5FD',
                marginTop: '-0.1em',
              }}
            >
              HOURS
            </div>
          </div>

          <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            One night. One mission. Endless possibilities.{' '}
            <span className="text-orange-400 font-bold">Build, break, and ship</span> real solutions in a non-stop
            adrenaline-fueled marathon that will push your limits and define your potential.
          </p>
        </div>


        {/* ── Animated Stats ── */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative p-6 md:p-8 rounded-2xl text-center group cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: 'rgba(13,21,38,0.8)',
                  border: `1px solid ${stat.color}40`,
                  backdropFilter: 'blur(12px)',
                  boxShadow: `0 0 30px ${stat.glow}10`,
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center, ${stat.glow}18 0%, transparent 70%)` }} />

                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>

                <div
                  className="text-3xl md:text-4xl font-black mb-1"
                  style={{ color: stat.color, textShadow: `0 0 20px ${stat.glow}` }}
                >
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} active={statsVisible} />
                </div>
                <div className="text-xs text-slate-400 font-mono tracking-widest uppercase font-bold">{stat.label}</div>
              </div>
            );
          })}
        </div>


        {/* ── Features Grid ── */}
        <div ref={featuresRef} className="space-y-8">
          <div className="text-center">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.25em] font-bold">What We Offer</span>
            <h3
              className="text-3xl md:text-4xl font-black text-white mt-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Everything You Need
            </h3>
            <p className="text-slate-400 text-sm mt-2 font-mono">So you can focus on what matters — building.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group relative p-6 rounded-2xl border overflow-hidden transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl cursor-default"
                  style={{
                    background: feat.bg,
                    borderColor: `${feat.color}35`,
                    backdropFilter: 'blur(10px)',
                    opacity: featuresVisible ? 1 : 0,
                    transform: featuresVisible ? 'translateY(0)' : 'translateY(35px)',
                    transition: `opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`,
                  }}
                >
                  {/* Top bar */}
                  <div className="absolute top-0 left-4 right-4 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${feat.color}60, transparent)` }} />

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.04]"
                    style={{ background: `radial-gradient(circle at top right, ${feat.color}, transparent)` }} />

                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}35` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: feat.color }} />
                  </div>

                  <h4 className="text-base font-black text-white mb-2"
                    style={{ fontFamily: "'Raleway', sans-serif" }}>{feat.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>


        {/* ── Image Carousel ── */}
        <div
          ref={carouselRef}
          style={{
            opacity: carouselVisible ? 1 : 0,
            transform: carouselVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-[0.25em] font-bold">Venue & Facilities</span>
            <h3
              className="text-3xl md:text-4xl font-black text-white mt-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The Venue
            </h3>
            <p className="text-slate-400 text-sm mt-2 font-mono">State-of-the-art facilities at ANITS, Visakhapatnam</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ImageCarousel />
          </div>

          {/* Venue tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {['📶 High-Speed WiFi', '🖥️ Digital Screens', '🔌 Plugboards at Every Seat', '🏫 Smart Classrooms', '🌊 Coastal Campus', '🎓 ANITS, Vizag'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full text-xs font-mono font-bold text-slate-300"
                style={{
                  background: 'rgba(13,21,38,0.8)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes glitch24 {
          0%   { transform: translate(0,    0)    skewX(0deg);   }
          25%  { transform: translate(-5px, 0)    skewX(-2deg);  }
          50%  { transform: translate( 5px, 0)    skewX( 2deg);  }
          75%  { transform: translate(-3px, 1px)  skewX(-1deg);  }
          100% { transform: translate( 0,   0)    skewX(0deg);   }
        }
      `}</style>
    </section>
  );
}
