import { Brain, Shield, Boxes, Cpu, DollarSign, Wheat, HeartPulse, Car, Lightbulb } from 'lucide-react';

const DOMAINS = [
  { name: 'AI/ML', icon: Brain, desc: 'Machine learning, deep learning, and intelligent systems that solve real-world problems.', span: 'md:col-span-2', accent: '#2563EB' },
  { name: 'Cyber Security', icon: Shield, desc: 'Protect systems, detect threats, and build resilient digital infrastructure.', span: '', accent: '#0F172A' },
  { name: 'Blockchain', icon: Boxes, desc: 'Decentralized apps, smart contracts, and trustless systems.', span: '', accent: '#F59E0B' },
  { name: 'IoT', icon: Cpu, desc: 'Connected devices and sensor networks for smarter environments.', span: '', accent: '#2563EB' },
  { name: 'FinTech', icon: DollarSign, desc: 'Reimagining payments, lending, and financial inclusion.', span: '', accent: '#0F172A' },
  { name: 'AgriTech', icon: Wheat, desc: 'Innovations for sustainable agriculture and food security.', span: 'md:col-span-2', accent: '#F59E0B' },
  { name: 'MedTech', icon: HeartPulse, desc: 'Healthcare solutions that improve patient outcomes and access.', span: '', accent: '#2563EB' },
  { name: 'Smart Mobility', icon: Car, desc: 'Future of transportation, EVs, and connected vehicles.', span: '', accent: '#0F172A' },
  { name: 'Open Innovation', icon: Lightbulb, desc: 'Have a wild idea that fits nowhere else? This is your playground.', span: 'md:col-span-2', accent: '#F59E0B' },
];

export default function Domains() {
  return (
    <section id="domains" className="relative py-24 px-6" style={{ background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold tracking-widest uppercase mb-4">
            Choose Your Arena
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Problem Domains
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Nine tracks. Endless possibilities. Pick the domain where your idea belongs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
          {DOMAINS.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.name}
                className={`group relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden ${d.span}`}
              >
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ background: d.accent }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `${d.accent}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: d.accent }} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">{d.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{d.desc}</p>
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: d.accent }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
