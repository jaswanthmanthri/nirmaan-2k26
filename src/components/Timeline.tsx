import { useEffect, useRef, useState } from 'react';
import { Calendar, FileText, Trophy, Users, Flag, CheckCircle2, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  { date: '20 July 2026', title: 'Registrations Open', desc: 'Team registration portal goes live. Form your squad and lock in your spot.', icon: Users, status: 'open', color: '#F97316' },
  { date: '10 August 2026', title: 'Registration Deadline', desc: 'Final day to register your team and submit entry fees.', icon: Flag, status: 'deadline', color: '#3B82F6' },
  { date: '10 August 2026', title: 'PPT Submission', desc: 'Submit your idea presentation (max 10 slides) for Round 1 evaluation.', icon: FileText, status: 'submit', color: '#F97316' },
  { date: '15 August 2026', title: 'Round 1 Results', desc: 'Shortlisted teams announced for the 24-hour offline finale.', icon: CheckCircle2, status: 'results', color: '#06B6D4' },
  { date: '11–12 Sep 2026', title: 'Grand Finale', desc: '24-hour coding marathon at ANITS, Visakhapatnam.', icon: Trophy, status: 'finale', color: '#F97316' },
];

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 1600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      color: ['#F97316', '#FB923C', '#3B82F6', '#06B6D4'][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.45 + 0.15,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-70" />;
}

// 3D Tilt Hook for interactive cards
function use3dTilt() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px) translateY(-6px)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
    });
  };

  return { cardRef, tiltStyle, handleMouseMove, handleMouseLeave };
}

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  
  // Track maximum scroll progress reached (monotonic: once reached, STAYS activated permanently when scrolling back up!)
  const [maxProgress, setMaxProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Curved S-curve SVG path (ViewBox 0 0 1000 1500)
  // Well spaced vertical nodes at y: 80, 380, 680, 980, 1280 (300px spacing eliminates overlaps)
  const svgPathD = isMobile
    ? "M 28 80 L 28 1280" // Straight left vertical line on mobile
    : "M 500 80 C 200 230, 200 380, 500 380 C 800 530, 800 680, 500 680 C 200 830, 200 980, 500 980 C 800 1130, 800 1280, 500 1280";

  // Node coordinates along the SVG viewBox (0 0 1000 1500)
  const nodeCoords = [
    { x: 500, xPercent: 50, y: 80, side: 'right' },
    { x: 280, xPercent: 28, y: 380, side: 'right' },
    { x: 720, xPercent: 72, y: 680, side: 'left' },
    { x: 280, xPercent: 28, y: 980, side: 'right' },
    { x: 500, xPercent: 50, y: 1280, side: 'left' },
  ];

  // Butter-smooth 60fps liquid scroll animation via GSAP
  useEffect(() => {
    if (!sectionRef.current || !pathRef.current || !headRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const totalLen = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${totalLen}`;
    pathRef.current.style.strokeDashoffset = `${totalLen}`;

    if (prefersReducedMotion) {
      pathRef.current.style.strokeDashoffset = '0';
      setMaxProgress(1);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 65%',
      end: 'bottom 75%',
      scrub: 0.4,
      onUpdate: (self) => {
        const prog = self.progress;

        // Direct hardware-accelerated DOM updates for 60fps liquid movement
        if (pathRef.current) {
          pathRef.current.style.strokeDashoffset = `${totalLen * (1 - prog)}`;
        }

        if (headRef.current && pathRef.current && totalLen > 0) {
          const pt = pathRef.current.getPointAtLength(prog * totalLen);
          headRef.current.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
          headRef.current.style.opacity = prog > 0.005 ? '1' : '0';
        }

        // Monotonically increase maxProgress so completed milestones STAY activated when scrolling back up!
        setMaxProgress((prev) => Math.max(prev, prog));
      },
    });

    return () => trigger.kill();
  }, [isMobile]);

  return (
    <section id="timeline" ref={sectionRef} className="relative py-28 px-4 md:px-8 overflow-hidden min-h-screen">
      {/* Background Floating Particles */}
      <FloatingParticles />

      {/* NIRMAAN Warm Orange & Blue Background Blobs */}
      <div
        className="absolute top-1/5 left-5 w-[500px] h-[500px] rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #F97316 0%, transparent 70%)',
          animation: 'floatBlob 12s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute bottom-1/5 right-5 w-[500px] h-[500px] rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
          animation: 'floatBlob 14s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Radial Depth Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(249,115,22,0.06) 0%, transparent 60%)',
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24 relative">

          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FB923C 35%, #F97316 65%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 35px rgba(249,115,22,0.3))',
            }}>
            THE BUILDERS' CHRONICLES
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-mono text-sm md:text-base">
            Mark your calendars. Step-by-step milestones on the road to NIRMAAN 2K26.
          </p>
        </div>

        {/* Curved Dotted Road Map Container */}
        <div className="relative w-full min-h-[1450px]">
          {/* Background SVG Winding Road Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 1450"
            preserveAspectRatio="none"
          >
            <defs>
              {/* NIRMAAN Core Theme Gradient: Orange → Amber → Electric Blue → Cyan */}
              <linearGradient id="nirmaanRoadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="30%" stopColor="#F97316" />
                <stop offset="65%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>

              <filter id="nirmaanNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dotted Road Underlay Track */}
            <path
              d={svgPathD}
              fill="none"
              stroke="rgba(249,115,22,0.2)"
              strokeWidth="6"
              strokeDasharray="10 10"
              strokeLinecap="round"
            />

            {/* Glowing Animated Liquid Progress Path */}
            <path
              ref={pathRef}
              d={svgPathD}
              fill="none"
              stroke="url(#nirmaanRoadGradient)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#nirmaanNeonGlow)"
              style={{
                willChange: 'stroke-dashoffset',
              }}
            />
          </svg>

          {/* Moving Light Streak Head travelling along the curved roadmap */}
          <div
            ref={headRef}
            className="absolute top-0 left-0 pointer-events-none z-30 transition-opacity duration-300"
            style={{
              transform: 'translate3d(500px, 80px, 0)',
              marginLeft: '-12px',
              marginTop: '-12px',
              willChange: 'transform',
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background: '#FFFFFF',
                boxShadow: '0 0 20px 6px #F97316, 0 0 35px 10px #EA580C, 0 0 50px 14px #3B82F6',
              }}
            >
              <div className="w-full h-full rounded-full animate-ping bg-orange-400 opacity-90" />
            </div>
          </div>

          {/* Milestone Items Rendered with Zero Overlaps & Pop Animations */}
          {TIMELINE.map((item, index) => {
            const fractions = [0.02, 0.22, 0.48, 0.73, 0.95];
            const threshold = fractions[index];

            // Monotonic activation: once reached, STAYS activated forever when scrolling back up!
            const activated = maxProgress >= threshold;
            const coord = nodeCoords[index];
            const Icon = item.icon;

            return (
              <TimelineMilestoneNode
                key={index}
                item={item}
                index={index}
                coord={coord}
                activated={activated}
                isMobile={isMobile}
                Icon={Icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineMilestoneNode({
  item,
  index,
  coord,
  activated,
  isMobile,
  Icon,
}: {
  item: typeof TIMELINE[0];
  index: number;
  coord: { x: number; xPercent: number; y: number; side: string };
  activated: boolean;
  isMobile: boolean;
  Icon: any;
}) {
  const { cardRef, tiltStyle, handleMouseMove, handleMouseLeave } = use3dTilt();
  const isRight = coord.side === 'right';

  return (
    <div
      className="absolute w-full flex items-center"
      style={{
        top: `${coord.y}px`,
        left: 0,
      }}
    >
      {/* Node Tick Badge sitting directly on the SVG Path */}
      <div
        className="absolute z-20 pointer-events-auto"
        style={{
          left: isMobile ? '28px' : `${coord.xPercent}%`,
          top: 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center cursor-pointer"
          style={{
            background: activated
              ? 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #3B82F6 100%)'
              : 'rgba(13,21,38,0.95)',
            border: `2px solid ${activated ? '#F97316' : 'rgba(249,115,22,0.3)'}`,
            boxShadow: activated
              ? '0 0 30px rgba(249, 115, 22, 0.75), 0 0 50px rgba(59, 130, 246, 0.45)'
              : '0 0 12px rgba(0,0,0,0.6)',
            transform: activated ? 'scale(1.15) rotate(0deg)' : 'scale(0.85) rotate(-5deg)',
            animation: activated ? 'popTick 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
            transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
          }}
        >
          {/* Animated checkmark or icon */}
          {activated ? (
            <div className="relative flex items-center justify-center animate-[scaleIn_0.4s_ease-out]">
              <Check className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[3] drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            </div>
          ) : (
            <Icon className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-300" style={{ color: 'rgba(148,163,184,0.5)' }} />
          )}

          {/* Glowing pulse/ripple aura */}
          {activated && (
            <>
              <div
                className="absolute inset-0 rounded-2xl animate-ping opacity-80"
                style={{ background: 'rgba(249, 115, 22, 0.35)', animationDuration: '2s' }}
              />
              <div
                className="absolute -inset-2.5 rounded-3xl border border-orange-400/50 animate-pulse pointer-events-none"
                style={{ animationDuration: '1.5s' }}
              />
            </>
          )}
        </div>
      </div>

      {/* 
        Milestone Text Box / Card with 100% Guaranteed ZERO Overlap:
        Mobile (< md): Node center is at 28px (width 48px, right edge 52px). Card starts at left: 72px. Gap = 20px!
        Desktop (md+):
        - If isRight: Node is at coord.xPercent%. Card left edge is at calc(coord.xPercent% + 50px). Gap = 22px!
        - If isLeft: Node is at coord.xPercent%. Card right edge is at calc((100% - coord.xPercent%) + 50px). Gap = 22px!
      */}
      <div
        className="absolute z-10 pointer-events-auto transition-opacity duration-500"
        style={{
          top: '-35px',
          opacity: activated ? 1 : 0.35,
          animation: activated ? 'popCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          ...(isMobile
            ? { left: '72px', right: 'auto' }
            : isRight
            ? { left: `calc(${coord.xPercent}% + 50px)`, right: 'auto' }
            : { right: `calc(${100 - coord.xPercent}% + 50px)`, left: 'auto' }),
        }}
      >
        <div
          className="w-[calc(100vw-100px)] max-w-[320px] sm:max-w-[380px] md:max-w-[420px]"
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative p-5 md:p-6 rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: activated
                ? 'linear-gradient(135deg, rgba(15, 29, 53, 0.94) 0%, rgba(13, 21, 38, 0.88) 100%)'
                : 'rgba(13,21,38,0.5)',
              border: `1px solid ${activated ? 'rgba(249, 115, 22, 0.5)' : 'rgba(59,130,246,0.18)'}`,
              backdropFilter: 'blur(20px)',
              boxShadow: activated
                ? '0 16px 40px -6px rgba(249, 115, 22, 0.3), 0 0 25px rgba(59, 130, 246, 0.22)'
                : '0 4px 20px rgba(0,0,0,0.3)',
              ...tiltStyle,
              transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease',
            }}
          >
            {/* NIRMAAN Top Shimmer Line */}
            <div
              className="absolute top-0 left-0 right-0 h-px transition-all duration-300"
              style={{
                background: activated
                  ? 'linear-gradient(90deg, transparent, #F97316, #3B82F6, transparent)'
                  : `linear-gradient(90deg, transparent, ${item.color}44, transparent)`,
              }}
            />

            {/* Corner bracket */}
            <div className="absolute top-3 right-3 opacity-40 group-hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M14 0 H8 V2 H12 V6 H14 Z" fill={activated ? '#F97316' : item.color} />
              </svg>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3.5 h-3.5 transition-colors duration-300" style={{ color: activated ? '#FB923C' : item.color }} />
              <span className="text-xs font-mono tracking-wider uppercase font-bold transition-colors duration-300" style={{ color: activated ? '#FB923C' : item.color }}>
                {item.date}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-extrabold text-white mb-1.5 group-hover:text-orange-300 transition-colors">
              {item.title}
            </h3>
            <p className={`text-xs md:text-sm leading-relaxed transition-colors ${activated ? 'text-slate-200' : 'text-slate-400'}`}>
              {item.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
