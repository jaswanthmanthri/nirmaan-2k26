import { Calendar, FileText, Trophy, Users, Flag, CheckCircle2 } from 'lucide-react';

const TIMELINE = [
  { date: '20 July 2026', title: 'Registrations Open', desc: 'Team registration portal goes live. Form your squad and lock in your spot.', icon: Users, status: 'open' },
  { date: '10 August 2026', title: 'Registration Deadline', desc: 'Final day to register your team and submit entry fees.', icon: Flag, status: 'deadline' },
  { date: '10 August 2026', title: 'PPT Submission', desc: 'Submit your idea presentation (max 10 slides) for Round 1 evaluation.', icon: FileText, status: 'submit' },
  { date: '15 August 2026', title: 'Round 1 Results', desc: 'Shortlisted teams announced for the 24-hour offline finale.', icon: CheckCircle2, status: 'results' },
  { date: '11–12 September 2026', title: 'Grand Finale (Offline)', desc: '24-hour coding marathon at ANITS, Visakhapatnam.', icon: Trophy, status: 'finale' },
];

export default function Timeline() {
  return (
    <section id="timeline" className="relative py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
            Event Schedule
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Interactive Timeline
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Mark your calendars. Every milestone on the road to NIRMAAN 2K26.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-amber-200 md:-translate-x-1/2" />

          <div className="space-y-12">
            {TIMELINE.map((item, i) => {
              const Icon = item.icon;
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex items-center gap-6 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center shadow-md">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 ml-16 md:ml-0 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="inline-block group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1">
                      <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">{item.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{item.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
