import { Mail, Phone, MapPin, Crown, Gem, Award, Medal, Github, Twitter, Linkedin } from 'lucide-react';

const SPONSOR_TIERS = [
  { tier: 'Title Sponsor', icon: Crown, color: '#F59E0B', bg: 'from-amber-50 to-amber-100', border: 'border-amber-200' },
  { tier: 'Platinum Sponsor', icon: Gem, color: '#0F172A', bg: 'from-slate-50 to-slate-100', border: 'border-slate-200' },
  { tier: 'Gold Sponsor', icon: Award, color: '#2563EB', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200' },
  { tier: 'Silver Sponsor', icon: Medal, color: '#64748B', bg: 'from-slate-50 to-slate-100', border: 'border-slate-200' },
];

export default function Sponsors() {
  return (
    <section id="sponsors" className="relative py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
            Partner With Us
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Sponsorship Tiers
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Support the next generation of builders. Choose a tier that matches your vision.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-20">
          {SPONSOR_TIERS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.tier}
                className={`group p-6 rounded-2xl bg-gradient-to-br ${s.bg} border ${s.border} hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center`}
              >
                <div
                  className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm transition-transform group-hover:scale-110"
                >
                  <Icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{s.tier}</h3>
                <div className="text-xs text-slate-500">Available</div>
              </div>
            );
          })}
        </div>

        {/* Contact Card */}
        <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-500 opacity-10 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Get In Touch</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Have questions about registration, sponsorship, or the event? Reach out —
                we'd love to hear from you.
              </p>
              <div className="space-y-3">
                <a href="mailto:nirmaan2k26@anits.edu.in" className="flex items-center gap-3 text-slate-200 hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">nirmaan2k26@anits.edu.in</span>
                </a>
                <a href="tel:+918374699788" className="flex items-center gap-3 text-slate-200 hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">+91 8374699788</span>
                </a>
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">ANITS, Visakhapatnam</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="text-right mb-6">
                <div className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-2">Organizing Department</div>
                <div className="text-lg font-bold text-white leading-tight">Department of Computer Science & Engineering</div>
                <div className="text-sm text-amber-400 font-semibold">(Data Science)</div>
                <div className="text-sm text-slate-400 mt-1">Anil Neerukonda Institute of Technology & Sciences</div>
              </div>
              <div className="flex gap-3">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-blue-500 flex items-center justify-center cursor-pointer transition-colors">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            NIRMAAN 2K26 · National Level 24-Hour Hackathon · Built with passion by the ANITS community
          </p>
        </div>
      </div>
    </section>
  );
}
