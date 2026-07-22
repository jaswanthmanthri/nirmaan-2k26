import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Soft gradient backdrop */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, #F0F6FF 0%, #FFFFFF 60%, #FFF8E7 100%)' }} />

      {/* Decorative floating shapes */}
      <div className="absolute top-24 left-10 w-20 h-20 rounded-2xl bg-blue-100 opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-32 right-16 w-32 h-32 rounded-full bg-amber-100 opacity-50 animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-xl bg-blue-200 opacity-40 rotate-12 animate-pulse" style={{ animationDuration: '6s' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm mb-8 animate-[fadeUp_0.8s_ease]">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
            ANITS Presents · National Level Hackathon
          </span>
        </div>

        <h1 className="font-black leading-[0.95] mb-6 animate-[fadeUp_1s_ease]">
          <span className="block text-slate-900" style={{ fontSize: 'clamp(3rem, 9vw, 7rem)', letterSpacing: '-0.03em' }}>
            NIRMAAN <span style={{ color: '#2563EB' }}>2K26</span>
          </span>
        </h1>

        <p className="text-lg md:text-xl font-bold text-slate-800 mb-3 tracking-wide animate-[fadeUp_1.2s_ease]">
          ACCELERATING. NEW. IDEAS. THROUGH. SMART. SOLUTIONS.
        </p>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto mb-10 animate-[fadeUp_1.4s_ease]">
          A 24-hour national-level hackathon where builders, dreamers, and innovators converge.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-[fadeUp_1.6s_ease]">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">11–12 September 2026</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">ANITS, Visakhapatnam</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">24 Hours Non-Stop</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeUp_1.8s_ease]">
          <a
            href="#domains"
            className="group px-8 py-4 rounded-full font-bold text-sm tracking-wide text-slate-800 bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all hover:shadow-lg flex items-center gap-2"
          >
            Explore Problem Statements
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#register"
            className="group px-8 py-4 rounded-full font-bold text-sm tracking-wide text-white transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 8px 24px rgba(37,99,235,0.35)' }}
          >
            Register Team
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-slate-400" />
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
