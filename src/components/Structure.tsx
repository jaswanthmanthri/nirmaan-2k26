import { useEffect, useRef, useState } from 'react';
import { FileText, Code2, ClipboardCheck, Award, Clock } from 'lucide-react';

const ROUND1_PARAMS = [
  { label: 'Problem Understanding', weight: 20, color: '#3B82F6' },
  { label: 'Innovation', weight: 30, color: '#F97316' },
  { label: 'Feasibility', weight: 20, color: '#3B82F6' },
  { label: 'Impact', weight: 20, color: '#F97316' },
  { label: 'Presentation', weight: 10, color: '#06B6D4' },
];

const ROUND2_PHASES = [
  { time: '6 hrs in', title: 'Evaluation Round 1', desc: 'Initial review of progress and direction by mentors.', color: '#F97316' },
  { time: '14 hrs in', title: 'Round 2 — Top 20', desc: 'Top 20 teams shortlisted for final evaluation.', color: '#3B82F6' },
  { time: '24 hrs in', title: 'Final Evaluation', desc: 'Final pitches and demos before the jury.', color: '#F97316' },
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

function AnimatedBar({ weight, color, visible }: { weight: number; color: string; visible: boolean }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: visible ? `${weight * 3}%` : '0%',
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  );
}

export default function Structure() {
  const { ref: headRef, visible: headVisible } = useInView(0.3);
  const { ref: r1Ref, visible: r1Visible } = useInView(0.2);
  const { ref: r2Ref, visible: r2Visible } = useInView(0.2);

  return (
    <section id="structure" className="relative py-28 px-6">
      {/* Glow bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 80% 50%, rgba(59,130,246,0.06) 0%, transparent 60%)',
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
            <span className="text-blue-400 text-xs font-mono tracking-[0.35em] uppercase">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #60A5FA 50%, #fff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            Structure & Evaluation
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-mono text-sm">
            Two rigorous rounds designed to surface the best ideas and the sharpest builders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Round 1 */}
          <div
            ref={r1Ref}
            className="group relative p-7 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
            style={{
              background: 'rgba(13,21,38,0.7)',
              border: '1px solid rgba(59,130,246,0.2)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 30px rgba(59,130,246,0.05)',
              opacity: r1Visible ? 1 : 0,
              transform: r1Visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease, box-shadow 0.3s, translate 0.3s',
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #3B82F6, transparent)' }} />
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(59,130,246,0.07), transparent 70%)' }} />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-mono text-blue-400 tracking-widest uppercase">Round 1</div>
                <h3 className="text-lg font-bold text-white">Online Idea Submission</h3>
              </div>
            </div>

            <div className="p-4 rounded-xl mb-6"
              style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <ClipboardCheck className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-slate-200">PPT Guidelines</span>
              </div>
              <p className="text-sm text-slate-400">
                Submit a presentation with a <span className="font-bold text-white">maximum of 10 slides</span> covering
                problem, solution, architecture, feasibility, and impact.
              </p>
            </div>

            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Evaluation Parameters</h4>
            <div className="space-y-3">
              {ROUND1_PARAMS.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>{p.label}</span>
                    <span style={{ color: p.color }}>{p.weight}%</span>
                  </div>
                  <AnimatedBar weight={p.weight} color={p.color} visible={r1Visible} />
                </div>
              ))}
            </div>
          </div>

          {/* Round 2 */}
          <div
            ref={r2Ref}
            className="group relative p-7 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
            style={{
              background: 'rgba(13,21,38,0.7)',
              border: '1px solid rgba(249,115,22,0.2)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 30px rgba(249,115,22,0.05)',
              opacity: r2Visible ? 1 : 0,
              transform: r2Visible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s, box-shadow 0.3s, translate 0.3s',
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #F97316, transparent)' }} />
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 70% 0%, rgba(249,115,22,0.07), transparent 70%)' }} />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                <Code2 className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-xs font-mono text-orange-400 tracking-widest uppercase">Round 2</div>
                <h3 className="text-lg font-bold text-white">24-Hr Offline Finale</h3>
              </div>
            </div>

            <div className="p-4 rounded-xl mb-6 flex items-center gap-3"
              style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <Clock className="w-5 h-5 text-orange-400 shrink-0" />
              <p className="text-sm text-slate-400">
                <span className="font-bold text-white">24 hours</span> of non-stop building at ANITS, Visakhapatnam.
              </p>
            </div>

            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-5">Evaluation Phases</h4>
            <div className="space-y-5">
              {ROUND2_PHASES.map((phase, i) => (
                <div
                  key={i}
                  className="relative pl-9"
                  style={{
                    opacity: r2Visible ? 1 : 0,
                    transform: r2Visible ? 'translateY(0)' : 'translateY(10px)',
                    transition: `opacity 0.5s ease ${0.3 + i * 0.12}s, transform 0.5s ease ${0.3 + i * 0.12}s`,
                  }}
                >
                  <div
                    className="absolute left-0 top-0.5 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono"
                    style={{
                      background: `rgba(${i % 2 === 0 ? '249,115,22' : '59,130,246'},0.15)`,
                      border: `1px solid ${phase.color}55`,
                      color: phase.color,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {i < ROUND2_PHASES.length - 1 && (
                    <div className="absolute left-[11px] top-7 bottom-[-20px] w-px"
                      style={{ background: 'rgba(249,115,22,0.15)' }} />
                  )}
                  <div className="text-xs font-mono tracking-wider uppercase mb-0.5" style={{ color: phase.color }}>
                    {phase.time}
                  </div>
                  <div className="text-sm font-bold text-slate-200 mb-0.5">{phase.title}</div>
                  <div className="text-xs text-slate-500">{phase.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-7 p-3 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <Award className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-xs font-mono text-orange-300">Winners announced at the closing ceremony</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
