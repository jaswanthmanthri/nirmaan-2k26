import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Radial glow backdrop */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 30% 40%, rgba(249,115,22,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(59,130,246,0.09) 0%, transparent 55%)',
      }} />

      {/* Decorative floating tech shapes */}
      <div className="absolute top-24 left-10 w-20 h-20 rounded-lg opacity-30 animate-pulse"
        style={{ animationDuration: '4s', background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(249,115,22,0.05))', border: '1px solid rgba(249,115,22,0.3)' }} />
      <div className="absolute bottom-32 right-16 w-28 h-28 rounded-full opacity-20 animate-pulse"
        style={{ animationDuration: '5s', background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent)', border: '1px solid rgba(59,130,246,0.3)' }} />
      <div className="absolute top-1/2 left-1/4 w-14 h-14 rounded-md opacity-25 rotate-12 animate-pulse"
        style={{ animationDuration: '6s', background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.05))', border: '1px solid rgba(6,182,212,0.25)' }} />
      <div className="absolute top-1/3 right-1/5 w-10 h-10 rounded-sm opacity-20 animate-pulse"
        style={{ animationDuration: '3.5s', border: '1px solid rgba(249,115,22,0.4)' }} />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-[fadeUp_0.8s_ease]"
          style={{
            background: 'rgba(13,21,38,0.8)',
            border: '1px solid rgba(249,115,22,0.3)',
            boxShadow: '0 0 20px rgba(249,115,22,0.1)',
            backdropFilter: 'blur(12px)',
          }}>
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-semibold text-orange-300 tracking-wider uppercase font-mono">
            ANITS Presents · National Level Hackathon
          </span>
        </div>

        {/* Main title */}
        <h1 className="font-black leading-[0.95] mb-6 animate-[fadeUp_1s_ease]">
          <span
            className="block"
            style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FB923C 35%, #F97316 55%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(249,115,22,0.3))',
            }}
          >
            NIRMAAN{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60A5FA, #3B82F6, #1D4ED8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.4))',
            }}>2K26</span>
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-base font-bold text-orange-300/80 mb-2 tracking-[0.25em] uppercase font-mono animate-[fadeUp_1.2s_ease]">
          ACCELERATING. NEW. IDEAS. THROUGH. SMART. SOLUTIONS.
        </p>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-10 animate-[fadeUp_1.4s_ease]">
          A 24-hour national-level hackathon where builders, dreamers, and innovators converge.
        </p>

        {/* Info chips */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-[fadeUp_1.6s_ease]">
          {[
            { icon: Calendar, text: '11–12 September 2026', color: 'text-blue-400' },
            { icon: MapPin, text: 'ANITS, Visakhapatnam', color: 'text-orange-400' },
            { icon: Clock, text: '24 Hours Non-Stop', color: 'text-blue-400' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
              style={{
                background: 'rgba(13,21,38,0.7)',
                border: '1px solid rgba(59,130,246,0.2)',
                backdropFilter: 'blur(8px)',
              }}>
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-sm font-semibold text-slate-200 font-mono">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeUp_1.8s_ease]">
          <a
            href="#domains"
            className="group px-8 py-4 font-bold text-sm tracking-wide transition-all hover:scale-105 flex items-center gap-2"
            style={{
              background: 'rgba(13,21,38,0.7)',
              border: '1px solid rgba(249,115,22,0.35)',
              color: '#FB923C',
              clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Explore Problem Statements
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/register"
            className="group px-8 py-4 font-bold text-sm tracking-wide text-white transition-all hover:scale-105 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #EA580C, #F97316)',
              clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
              boxShadow: '0 0 30px rgba(249,115,22,0.35)',
            }}
          >
            Register Team
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full flex justify-center pt-2"
          style={{ border: '1px solid rgba(249,115,22,0.4)' }}>
          <div className="w-1 h-2 rounded-full bg-orange-400 opacity-70" />
        </div>
      </div>
    </section>
  );
}
