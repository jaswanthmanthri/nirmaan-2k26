import { useState, useRef, useEffect } from 'react';
import { Quote, Sparkles, Heart, User } from 'lucide-react';

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

interface Dignitary {
  id: string;
  name: string;
  designation: string;
  role: string;
  message: string;
  highlight: string;
}

const DIGNITARIES: Dignitary[] = [
  {
    id: 'director',
    name: 'Dr. XYZ',
    designation: 'CEO & Chairman, ANITS',
    role: 'Patron & Visionary',
    message: '"NIRMAAN 2K26 reflects our commitment to fostering world-class technical talent. We empower young minds to solve real-world challenges with courage and creativity."',
    highlight: 'Fostering Innovation & Academic Excellence',
  },
  {
    id: 'principal',
    name: 'Dr. ABC',
    designation: 'Principal, ANITS',
    role: 'Academic Leadership',
    message: '"A national platform like NIRMAAN 2K26 bridges academia with industry real-time problem solving. I take immense pride in our students for organizing an event of this caliber."',
    highlight: 'Bridging Academia with Real-World Industry',
  },
  {
    id: 'hod',
    name: 'Dr. PQR',
    designation: 'Head of Department, CSE (Data Science)',
    role: 'Convener & Department Head',
    message: '"Data Science and AI are shaping the future of engineering. NIRMAAN 2K26 is engineered by our CSE (DS) team to kindle curiosity and high-impact software solutions."',
    highlight: 'Igniting Technological Breakthroughs',
  },
];

export default function Team() {
  const { ref: headerRef, visible: headerVisible } = useInView(0.2);
  const { ref: dignitaryRef, visible: dignitaryVisible } = useInView(0.15);
  const { ref: teamRef, visible: teamVisible } = useInView(0.15);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="team" className="relative py-24 px-4 md:px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 50% 20%, rgba(249,115,22,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(59,130,246,0.06) 0%, transparent 60%)
        `,
      }} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-20">
        
        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className="text-center"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-orange-400 text-xs font-mono tracking-[0.35em] uppercase font-bold">Leadership & Organizers</span>
          </div>

          <h2 
            className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Patrons & Leadership
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm md:text-base leading-relaxed">
            Guided by visionary leaders and powered by a passionate team of student creators from the Department of CSE (Data Science).
          </p>
        </div>

        {/* ── Dignitaries Cards with Instant Hover Popover Quote ── */}
        <div ref={dignitaryRef} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIGNITARIES.map((item, idx) => {
              const isHovered = hoveredId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onTouchStart={() => setHoveredId(hoveredId === item.id ? null : item.id)}
                  className="group relative p-6 rounded-2xl transition-all duration-300 border backdrop-blur-xl flex flex-col items-center text-center hover:scale-[1.02] hover:border-orange-500/50"
                  style={{
                    background: 'linear-gradient(135deg, rgba(13,21,38,0.85) 0%, rgba(8,12,24,0.9) 100%)',
                    borderColor: 'rgba(59,130,246,0.25)',
                    boxShadow: isHovered ? '0 0 45px rgba(249,115,22,0.25)' : '0 0 20px rgba(0,0,0,0.3)',
                    opacity: dignitaryVisible ? 1 : 0,
                    transform: dignitaryVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease ${idx * 0.15}s, transform 0.6s ease ${idx * 0.15}s, border-color 0.3s ease, box-shadow 0.3s ease`,
                  }}
                >
                  {/* Avatar Placeholder Frame */}
                  <div className="relative mb-5">
                    <div 
                      className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden p-1 flex items-center justify-center transition-all duration-300 group-hover:ring-4 group-hover:ring-orange-500/60 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                      style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(59,130,246,0.3))' }}
                    >
                      <div className="w-full h-full rounded-full bg-slate-900/90 flex flex-col items-center justify-center border border-slate-700/60">
                        <User className="w-12 h-12 md:w-14 md:h-14 text-orange-400/90 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 right-0 left-0 mx-auto w-max px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-slate-200"
                      style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(249,115,22,0.4)' }}>
                      {item.role}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.name}
                  </h4>
                  <p className="text-xs font-mono font-semibold text-orange-400 uppercase tracking-wide mb-2">
                    {item.designation}
                  </p>
                  <p className="text-xs font-mono text-slate-400 italic">
                    {item.highlight}
                  </p>

                  {/* Hover Popover Box showing their thoughts on NIRMAAN 2K26 */}
                  <div 
                    className={`absolute inset-0 rounded-2xl p-6 flex flex-col justify-center items-center text-center backdrop-blur-2xl transition-all duration-400 pointer-events-none z-20 ${
                      isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(8,14,28,0.98) 100%)',
                      border: '1px solid rgba(249,115,22,0.5)',
                      boxShadow: '0 0 50px rgba(249,115,22,0.3)',
                    }}
                  >
                    <Quote className="w-8 h-8 text-orange-400 mb-2 opacity-80" />
                    <p className="text-xs md:text-sm italic font-medium text-slate-100 leading-relaxed font-sans mb-3">
                      {item.message}
                    </p>
                    <div className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-widest">
                      — {item.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs font-mono text-slate-500 italic">
            💡 Hover over or tap any profile to read their message about NIRMAAN 2K26
          </p>
        </div>


        {/* ── Organizing Team Photo Section (Full width, seamless layout) ── */}
        <div 
          ref={teamRef} 
          className="space-y-6 pt-6"
          style={{
            opacity: teamVisible ? 1 : 0,
            transform: teamVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="text-center">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-[0.25em] font-bold">The Brains & Muscle</span>
            <h3 
              className="text-3xl md:text-5xl font-black text-white mt-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Meet The Organizing Team
            </h3>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-2 font-mono">
              Department of CSE (Data Science), ANITS — working round-the-clock to build the ultimate hackathon experience.
            </p>
          </div>

          {/* Full Width Team Image Showcase */}
          <div 
            className="group relative rounded-3xl overflow-hidden border transition-all duration-500 w-full"
            style={{
              background: 'rgba(15,23,42,0.95)',
              borderColor: 'rgba(249,115,22,0.35)',
              boxShadow: '0 0 60px rgba(249,115,22,0.15)',
            }}
          >
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent z-10" />

            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[340px]">
              <img
                src="/team_group.jpg"
                alt="NIRMAAN 2K26 Organizing Team"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter contrast-[1.03]"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(to top, rgba(2,8,23,0.98) 0%, rgba(2,8,23,0.4) 55%, transparent 100%)',
              }} />

              {/* Badge on Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white backdrop-blur-md"
                  style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(249,115,22,0.4)' }}>
                  🔥 CSE (Data Science) Crew
                </span>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-2 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-orange-400"
                  style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                  <Heart className="w-3.5 h-3.5 fill-orange-400 text-orange-400 animate-pulse" />
                  <span>Driven by Passion, Built for Coders</span>
                </div>

                <h4 className="text-2xl md:text-4xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  "We don't just host an event. We craft an experience."
                </h4>

                <p className="text-slate-300 text-xs md:text-sm max-w-4xl leading-relaxed font-mono">
                  From designing problem statements to managing logistics, technical infrastructure, campfire arrangements, and food — our dedicated team is working endlessly so you can create, collaborate, and innovate without limits.
                </p>
              </div>
            </div>

            {/* Team Highlights Bar - Exactly 4 cleanly spread stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-4 text-center border-t border-slate-800"
              style={{ background: 'rgba(10,16,30,0.95)' }}>
              {[
                { title: 'Core Crew', desc: 'CSE (Data Science)' },
                { title: '50+ Coordinators', desc: 'Seamless Execution' },
                { title: '24/7 Support', desc: 'Always On Standby' },
                { title: '1 Shared Goal', desc: 'Coding Excellence' },
              ].map((stat, i) => (
                <div key={i} className="p-3 rounded-xl transition-colors hover:bg-orange-500/5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-sm font-bold text-orange-400 font-mono">{stat.title}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
