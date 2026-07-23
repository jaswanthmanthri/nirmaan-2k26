import { useEffect, useRef, useState } from 'react';
import { 
  Download, Sparkles, Award, Tv, 
  Eye, Mail, Phone, 
  MapPin, Flame, CheckCircle2, LifeBuoy,
  Navigation, ExternalLink
} from 'lucide-react';

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

export default function Sponsors() {
  const { ref: headRef, visible: headVisible } = useInView(0.2);
  const { ref: benefitsRef, visible: benefitsVisible } = useInView(0.1);
  const { ref: impactRef, visible: impactVisible } = useInView(0.1);
  const { ref: contactRef, visible: contactVisible } = useInView(0.1);
  const { ref: locationRef, visible: locationVisible } = useInView(0.1);
  const [showBrochure, setShowBrochure] = useState(false);

  const brochureUrl = "/NIRMAAN 2K26 BROCHURE - ANITS CSE (Data Science).pdf";
  const gmapsUrl = "https://www.google.com/maps/search/?api=1&query=Anil+Neerukonda+Institute+of+Technology+and+Sciences+Sangivalasa+Visakhapatnam";

  return (
    <section id="sponsors" className="relative py-28 px-4 md:px-6 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 50% 10%, rgba(249,115,22,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 50%)
        `,
      }} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-24">
        
        {/* ── Section Header ── */}
        <div
          ref={headRef}
          className="text-center"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400 text-xs font-mono tracking-[0.35em] uppercase font-bold">Partner With Us</span>
          </div>

          <h2 
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #FB923C 50%, #fff 100%)',
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              backgroundClip: 'text',
            }}
          >
            Sponsor Us
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto font-mono text-sm md:text-base leading-relaxed mb-8">
            <span className="text-orange-400 font-bold">NIRMAAN 2k26</span> is a platform to drive innovation, teamwork, and coding excellence.
            <br />
            <span className="text-slate-400">By sponsoring, you fuel innovation and support the future of engineering talent.</span>
          </p>

          {/* Quotation Highlight Card */}
          <div className="max-w-3xl mx-auto p-6 rounded-2xl relative overflow-hidden text-center border backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(13,21,38,0.85) 0%, rgba(8,12,24,0.95) 100%)',
              borderColor: 'rgba(249,115,22,0.25)',
              boxShadow: '0 0 35px rgba(249,115,22,0.08)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
            <p className="text-base md:text-lg italic font-medium text-slate-200 leading-relaxed">
              "Your sponsorship helps create a stage where raw talent becomes real-world skill. Every rupee fuels a coder’s confidence."
            </p>
            <div className="mt-3 text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
              — Invest in moments that matter.
            </div>
          </div>

          {/* Brochure Preview CTA Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowBrochure(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-mono text-xs md:text-sm font-bold tracking-wider uppercase text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(249,115,22,0.4)]"
              style={{
                background: 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}
            >
              <Eye className="w-5 h-5" />
              <span>Preview Sponsorship Brochure</span>
            </button>
          </div>
        </div>

        {/* ── Brochure Preview Modal ── */}
        {showBrochure && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: 'rgba(2,8,23,0.92)', backdropFilter: 'blur(20px)' }}
            onClick={() => setShowBrochure(false)}
          >
            <div
              className="relative w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: 'rgba(13,21,38,0.98)',
                border: '1px solid rgba(249,115,22,0.4)',
                boxShadow: '0 0 60px rgba(249,115,22,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: 'rgba(249,115,22,0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.15)' }}>
                    <Eye className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white font-mono tracking-wide">NIRMAAN 2K26 — Official Brochure</div>
                    <div className="text-xs text-slate-400 font-mono">Sponsorship Package & Event Details</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={brochureUrl}
                    download="NIRMAAN_2K26_BROCHURE.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                  <button
                    onClick={() => setShowBrochure(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all font-mono text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* PDF Embed */}
              <div className="flex-1 w-full">
                <iframe
                  src={`${brochureUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  title="NIRMAAN 2K26 Sponsorship Brochure"
                />
              </div>
            </div>
          </div>
        )}


        {/* ── Benefits of Sponsoring Us ── */}
        <div ref={benefitsRef} className="space-y-8">
          <div className="text-center">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.25em] font-bold">Why Partner With NIRMAAN 2K26</span>
            <h3 className="text-3xl md:text-4xl font-black text-white mt-1">Sponsorship Benefits</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'BRAND VISIBILITY',
                icon: Eye,
                color: '#F97316',
                accentBg: 'rgba(249,115,22,0.1)',
                points: [
                  'Logo on posters, banners, brochures, certificates',
                  'Featured on all social media posts & promos'
                ]
              },
              {
                title: 'LIVE RECOGNITION',
                icon: Tv,
                color: '#3B82F6',
                accentBg: 'rgba(59,130,246,0.1)',
                points: [
                  'Acknowledgement on stage during opening & closing',
                  'Invitation to attend & present prizes to winning coders'
                ]
              },
              {
                title: 'POST EVENT PROMOTION',
                icon: Award,
                color: '#10B981',
                accentBg: 'rgba(16,185,129,0.1)',
                points: [
                  'Logo in photo/video recap & official social media highlights',
                  'Official Sponsor Appreciation Certificate'
                ]
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group relative p-7 rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background: 'rgba(13,21,38,0.8)',
                    borderColor: `${card.color}40`,
                    backdropFilter: 'blur(16px)',
                    opacity: benefitsVisible ? 1 : 0,
                    transform: benefitsVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: card.color }} />
                  
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: card.accentBg, border: `1px solid ${card.color}44` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>

                  <h4 className="text-lg font-black text-white font-mono tracking-wider mb-4" style={{ color: card.color }}>
                    {card.title}
                  </h4>

                  <ul className="space-y-3">
                    {card.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm text-slate-300 leading-snug">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: card.color }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>


        {/* ── Your Sponsorship Helps Grid ── */}
        <div ref={impactRef} className="p-8 md:p-10 rounded-3xl border relative overflow-hidden bg-slate-950/80 backdrop-blur-xl"
          style={{
            borderColor: 'rgba(249,115,22,0.2)',
            opacity: impactVisible ? 1 : 0,
            transform: impactVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono text-orange-400 uppercase tracking-[0.25em] font-bold">Purpose & Value</span>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-1 mb-4">Your Sponsorship Helps</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                800+ ambitious students from multiple colleges are gathering to tackle real-world problem statements. Your support enables us to provide top-tier infrastructure, rewards, and mentor guidance.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Reward Excellence',
                  'Promote Coding Culture',
                  'Support Youth Talent',
                  'Enhance Event Quality & Reach'
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="text-xs font-mono font-bold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 flex flex-col justify-center text-center space-y-4">
              <Flame className="w-10 h-10 text-orange-500 mx-auto animate-pulse" />
              <h4 className="text-xl font-black text-white font-mono">Ready to Support NIRMAAN 2K26?</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Download the official sponsorship brochure or reach out to our organizing team directly.
              </p>
              <a
                href={brochureUrl}
                download="NIRMAAN_2K26_BROCHURE.pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-orange-400 hover:bg-orange-300 transition-all hover:scale-105 shadow-lg"
              >
                <Download className="w-4 h-4" />
                Get Official Brochure
              </a>
            </div>
          </div>
        </div>


        {/* ── Help & Contact Section ── */}
        <div
          id="contact"
          ref={contactRef}
          className="relative p-8 md:p-12 rounded-3xl overflow-hidden border scroll-mt-24"
          style={{
            background: 'rgba(13,21,38,0.85)',
            borderColor: 'rgba(59,130,246,0.3)',
            backdropFilter: 'blur(16px)',
            opacity: contactVisible ? 1 : 0,
            transform: contactVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            boxShadow: '0 0 50px rgba(59,130,246,0.08)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-4 bg-blue-500/10 border border-blue-500/30">
                <LifeBuoy className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">Support & Assistance</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-3">Help & Contact</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Have questions about NIRMAAN 2K26, registration guidelines, domain problem statements, or sponsorship options? Reach out to our organizing team — we're here to help!
              </p>
              
              <div className="space-y-3">
                {[
                  { href: 'mailto:nirmaan2k26@anits.edu.in', icon: Mail, label: 'nirmaan2k26@anits.edu.in' },
                  { href: 'tel:+918374699788', icon: Phone, label: '+91 8374699788' },
                  { href: '#location', icon: MapPin, label: 'ANITS, Visakhapatnam' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-800/80 border border-slate-700 group-hover:border-blue-400/60 transition-colors">
                      <Icon className="w-4 h-4 text-blue-400" />
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
                <div className="text-sm font-semibold text-orange-400">(Data Science)</div>
                <div className="text-sm text-slate-400 mt-1">Anil Neerukonda Institute of Technology & Sciences</div>
              </div>
              <div className="flex gap-3">
                {[Mail, Phone, ExternalLink].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-blue-400/60 cursor-pointer transition-all hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* ── Location & Map Section ── */}
        <div
          id="location"
          ref={locationRef}
          className="relative p-8 md:p-10 rounded-3xl overflow-hidden border scroll-mt-24"
          style={{
            background: 'rgba(13,21,38,0.85)',
            borderColor: 'rgba(249,115,22,0.3)',
            backdropFilter: 'blur(16px)',
            opacity: locationVisible ? 1 : 0,
            transform: locationVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            boxShadow: '0 0 50px rgba(249,115,22,0.08)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Address Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
                <Navigation className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase">Event Venue & Directions</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-white">
                Event Location
              </h3>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base font-bold text-white">Anil Neerukonda Institute of Technology & Sciences (ANITS)</h4>
                    <p className="text-xs text-slate-300 font-mono mt-1 leading-relaxed">
                      Sangivalasa, Bheemunipatnam Mandal, Visakhapatnam, Andhra Pradesh — 531162
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                📍 Situated along the Visakhapatnam-Srikakulam National Highway (NH-16), easily accessible by bus, taxi, or train from Visakhapatnam Railway Station & Airport.
              </p>

              {/* Redirect to Google Maps Button */}
              <div className="pt-2">
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105 shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                    boxShadow: '0 0 25px rgba(249,115,22,0.3)',
                  }}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Venue In Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Google Map Embedded Frame */}
            <div className="md:col-span-5 h-64 md:h-full min-h-[220px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative group">
              <iframe
                title="ANITS Location Map"
                src="https://maps.google.com/maps?q=Anil+Neerukonda+Institute+of+Technology+and+Sciences+Sangivalasa+Visakhapatnam&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.1) saturate(1.2)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-mono text-xs font-bold"
              >
                <span>Click to open full map</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>


        {/* Footer info */}
        <div className="text-center pt-8 border-t border-slate-800/80">
          <p className="text-xs text-slate-500 font-mono">
            NIRMAAN 2K26 · National Level 24-Hour Hackathon · Department of CSE (Data Science), ANITS
          </p>
        </div>

      </div>
    </section>
  );
}
