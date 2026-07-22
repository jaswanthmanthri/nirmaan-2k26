import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Crown, Gem, Award, Medal, Github, Twitter, Linkedin } from 'lucide-react';

const SPONSOR_TIERS = [
  { tier: 'Title Sponsor', icon: Crown, color: '#F97316', borderColor: 'rgba(249,115,22,0.35)', glowColor: 'rgba(249,115,22,0.15)' },
  { tier: 'Platinum', icon: Gem, color: '#06B6D4', borderColor: 'rgba(6,182,212,0.35)', glowColor: 'rgba(6,182,212,0.15)' },
  { tier: 'Gold Sponsor', icon: Award, color: '#3B82F6', borderColor: 'rgba(59,130,246,0.35)', glowColor: 'rgba(59,130,246,0.15)' },
  { tier: 'Silver Sponsor', icon: Medal, color: '#94A3B8', borderColor: 'rgba(148,163,184,0.25)', glowColor: 'rgba(148,163,184,0.08)' },
];

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Sponsors() {
  const { ref: headRef, visible: headVisible } = useInView(0.3);
  const { ref: tiersRef, visible: tiersVisible } = useInView(0.1);
  const { ref: contactRef, visible: contactVisible } = useInView(0.2);

  return (
    <section id="sponsors" className="relative py-28 px-6">
      {/* Glow bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 80%, rgba(249,115,22,0.05) 0%, transparent 60%)',
      }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={headRef}
          className="text-center mb-16"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-400 text-xs font-mono tracking-[0.35em] uppercase">Partner With Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #60A5FA 50%, #fff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            Sponsorship Tiers
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-mono text-sm">
            Support the next generation of builders. Choose a tier that matches your vision.
          </p>
        </div>

        {/* Tiers */}
        <div ref={tiersRef} className="grid md:grid-cols-4 gap-4 mb-16">
          {SPONSOR_TIERS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.tier}
                data-hover="true"
                className="group relative p-6 rounded-xl overflow-hidden text-center cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: 'rgba(13,21,38,0.7)',
                  border: `1px solid ${s.borderColor}`,
                  backdropFilter: 'blur(12px)',
                  opacity: tiersVisible ? 1 : 0,
                  transform: tiersVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, translate 0.3s`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${s.glowColor}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${s.color}88, transparent)` }} />

                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}44` }}
                >
                  <Icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 font-mono">{s.tier}</h3>
                <div className="text-xs font-mono" style={{ color: s.color }}>Available</div>
              </div>
            );
          })}
        </div>

        {/* Contact Card */}
        <div
          ref={contactRef}
          className="relative p-8 md:p-12 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(13,21,38,0.85)',
            border: '1px solid rgba(249,115,22,0.2)',
            backdropFilter: 'blur(16px)',
            opacity: contactVisible ? 1 : 0,
            transform: contactVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          }}
        >
          {/* Top border accent */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #F97316, #3B82F6, transparent)' }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Glows */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(59,130,246,0.12)' }} />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(249,115,22,0.08)' }} />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Get In Touch</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Have questions about registration, sponsorship, or the event? Reach out —
                we'd love to hear from you.
              </p>
              <div className="space-y-3">
                {[
                  { href: 'mailto:nirmaan2k26@anits.edu.in', icon: Mail, label: 'nirmaan2k26@anits.edu.in', hoverColor: '#3B82F6' },
                  { href: 'tel:+918374699788', icon: Phone, label: '+91 8374699788', hoverColor: '#F97316' },
                  { href: '#', icon: MapPin, label: 'ANITS, Visakhapatnam', hoverColor: '#06B6D4' },
                ].map(({ href, icon: Icon, label, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = `${hoverColor}33`; (e.currentTarget as HTMLDivElement).style.borderColor = `${hoverColor}55`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-mono">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="text-right mb-6">
                <div className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-2">Organizing Department</div>
                <div className="text-lg font-bold text-white leading-tight">Department of CSE</div>
                <div className="text-sm font-semibold" style={{ color: '#F97316' }}>(Data Science)</div>
                <div className="text-sm text-slate-400 mt-1">Anil Neerukonda Institute of Technology & Sciences</div>
              </div>
              <div className="flex gap-3">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <div
                    key={i}
                    data-hover="true"
                    className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(59,130,246,0.25)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(59,130,246,0.4)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  >
                    <Icon className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
          <p className="text-xs text-slate-600 font-mono">
            NIRMAAN 2K26 · National Level 24-Hour Hackathon · Built with passion by the ANITS community
          </p>
        </div>
      </div>
    </section>
  );
}
