import { FileText, Code2, ClipboardCheck, Award, Clock, Users } from 'lucide-react';

const ROUND1_PARAMS = [
  { label: 'Problem Understanding', weight: 20, color: '#2563EB' },
  { label: 'Innovation', weight: 30, color: '#F59E0B' },
  { label: 'Feasibility', weight: 20, color: '#2563EB' },
  { label: 'Impact', weight: 20, color: '#F59E0B' },
  { label: 'Presentation', weight: 10, color: '#2563EB' },
];

const ROUND2_PHASES = [
  { time: '6 hrs in', title: 'Evaluation Round 1', desc: 'Initial review of progress and direction by mentors.' },
  { time: '14 hrs in', title: 'Round 2 — Top 20 Shortlisting', desc: 'Top 20 teams shortlisted for final evaluation.' },
  { time: '24 hrs in', title: 'Final Evaluation', desc: 'Final pitches and demos before the jury.' },
];

export default function Structure() {
  return (
    <section id="structure" className="relative py-24 px-6" style={{ background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold tracking-widest uppercase mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Structure & Evaluation
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Two rigorous rounds designed to surface the best ideas and the sharpest builders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Round 1 */}
          <div className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-600 tracking-widest uppercase">Round 1</div>
                <h3 className="text-xl font-bold text-slate-900">Online Idea Submission</h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-bold text-slate-700">PPT Guidelines</span>
              </div>
              <p className="text-sm text-slate-500">
                Submit a presentation with a <span className="font-bold text-slate-800">maximum of 10 slides</span> covering
                problem, solution, architecture, feasibility, and impact.
              </p>
            </div>

            <h4 className="text-sm font-bold text-slate-700 mb-4">Evaluation Parameters</h4>
            <div className="space-y-3">
              {ROUND1_PARAMS.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>{p.label}</span>
                    <span>{p.weight}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 group-hover:scale-x-105 origin-left"
                      style={{ width: `${p.weight * 3}%`, background: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Round 2 */}
          <div className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-600 tracking-widest uppercase">Round 2</div>
                <h3 className="text-xl font-bold text-slate-900">24-Hr Offline Finale</h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-600" />
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-800">24 hours</span> of non-stop building at ANITS, Visakhapatnam.
              </p>
            </div>

            <h4 className="text-sm font-bold text-slate-700 mb-4">Evaluation Phases</h4>
            <div className="space-y-4">
              {ROUND2_PHASES.map((phase, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-5 h-5 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-600">{i + 1}</span>
                  </div>
                  {i < ROUND2_PHASES.length - 1 && (
                    <div className="absolute left-[9px] top-7 bottom-[-16px] w-0.5 bg-amber-200" />
                  )}
                  <div className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-0.5">{phase.time}</div>
                  <div className="text-sm font-bold text-slate-800">{phase.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{phase.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-xl bg-blue-50 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Winners announced at the closing ceremony</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
