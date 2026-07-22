import { useEffect, useRef, useState } from 'react';
import { 
  Brain, Sparkles, BarChart3, ShieldAlert, Cloud, Cpu, 
  Globe, Smartphone, Boxes, CreditCard, Activity, 
  GraduationCap, Leaf, Sprout, Heart, Flame, Eye, GitBranch 
} from 'lucide-react';

const DOMAINS = [
  // Core Tech
  { 
    name: 'Artificial Intelligence & Machine Learning', 
    category: 'Core Tech',
    icon: Brain, 
    desc: 'Harness machine learning algorithms and neural networks to create intelligent, predictive solutions.', 
    span: 'md:col-span-2', 
    accent: '#F97316', 
    accentDark: '#EA580C',
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Generative AI & Large Language Models (LLMs)', 
    category: 'Core Tech',
    icon: Sparkles, 
    desc: 'Explore the frontiers of transformers, retrieval-augmented generation, and creative artificial agents.', 
    span: '', 
    accent: '#3B82F6', 
    accentDark: '#1D4ED8',
    bgImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Data Science & Analytics', 
    category: 'Core Tech',
    icon: BarChart3, 
    desc: 'Transform raw datasets into actionable insights and data-driven intelligence.', 
    span: '', 
    accent: '#06B6D4', 
    accentDark: '#0E7490',
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Cyber Security & Digital Forensics', 
    category: 'Core Tech',
    icon: ShieldAlert, 
    desc: 'Fortify digital infrastructure, conduct forensic investigations, and detect threat vectors.', 
    span: '', 
    accent: '#EF4444', 
    accentDark: '#B91C1C',
    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Cloud Computing & DevOps', 
    category: 'Core Tech',
    icon: Cloud, 
    desc: 'Deploy resilient scale infrastructures with continuous integration and cloud native tools.', 
    span: '', 
    accent: '#3B82F6', 
    accentDark: '#1D4ED8',
    bgImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Internet of Things (IoT) & Smart Systems', 
    category: 'Core Tech',
    icon: Cpu, 
    desc: 'Connect physical devices and build smart sensor arrays for edge computing pipelines.', 
    span: '', 
    accent: '#F59E0B', 
    accentDark: '#D97706',
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
  },

  // Development & Web3
  { 
    name: 'Full Stack & Web Development', 
    category: 'Dev & Web3',
    icon: Globe, 
    desc: 'Create highly responsive, performant, and premium interactive web applications.', 
    span: '', 
    accent: '#06B6D4', 
    accentDark: '#0E7490',
    bgImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Mobile Application Development', 
    category: 'Dev & Web3',
    icon: Smartphone, 
    desc: 'Craft native or cross-platform mobile experiences that delight end-users.', 
    span: '', 
    accent: '#10B981', 
    accentDark: '#047857',
    bgImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Blockchain & Web3', 
    category: 'Dev & Web3',
    icon: Boxes, 
    desc: 'Implement trustless protocols, decentralization, smart contracts, and decentralized finance (DeFi).', 
    span: 'md:col-span-2', 
    accent: '#8B5CF6', 
    accentDark: '#6D28D9',
    bgImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'FinTech', 
    category: 'Dev & Web3',
    icon: CreditCard, 
    desc: 'Revolutionize digital payments, micro-lending systems, and financial accessibility.', 
    span: '', 
    accent: '#EC4899', 
    accentDark: '#BE185D',
    bgImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
  },

  // Applied Tech
  { 
    name: 'HealthTech & MedTech', 
    category: 'Applied Tech',
    icon: Activity, 
    desc: 'Design medical tools, telehealth solutions, and AI diagnostics to save lives.', 
    span: '', 
    accent: '#EF4444', 
    accentDark: '#B91C1C',
    bgImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'EdTech & Digital Learning', 
    category: 'Applied Tech',
    icon: GraduationCap, 
    desc: 'Build future classroom systems, personalized learning paths, and accessible classrooms.', 
    span: '', 
    accent: '#3B82F6', 
    accentDark: '#1D4ED8',
    bgImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Smart Agriculture', 
    category: 'Applied Tech',
    icon: Sprout, 
    desc: 'Pioneer high-yield precision farming, crop monitoring, and sustainable supply chains.', 
    span: 'md:col-span-2', 
    accent: '#10B981', 
    accentDark: '#047857',
    bgImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
  },

  // Impact & Future
  { 
    name: 'Sustainability & Smart Cities', 
    category: 'Impact & Future',
    icon: Leaf, 
    desc: 'Formulate green systems, energy-grid management, and clean urban solutions.', 
    span: '', 
    accent: '#10B981', 
    accentDark: '#047857',
    bgImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Women Safety & Social Impact', 
    category: 'Impact & Future',
    icon: Heart, 
    desc: 'Develop high-security tools, alert utilities, and community programs for positive social change.', 
    span: '', 
    accent: '#EC4899', 
    accentDark: '#BE185D',
    bgImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Disaster Management & Climate Resilience', 
    category: 'Impact & Future',
    icon: Flame, 
    desc: 'Build prediction radars, emergency management routing, and resilient disaster support tools.', 
    span: '', 
    accent: '#F97316', 
    accentDark: '#EA580C',
    bgImage: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Accessibility & Inclusive Technologies', 
    category: 'Impact & Future',
    icon: Eye, 
    desc: 'Create assistive technology interfaces, text-to-speech visual descriptors, and inclusive UX formats.', 
    span: '', 
    accent: '#8B5CF6', 
    accentDark: '#6D28D9',
    bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
  },

  // Special / Highlight Track kept at the very end of list
  { 
    name: 'Open Source Software & Open Innovation', 
    category: 'Dev & Web3',
    icon: GitBranch, 
    desc: 'Have a wild idea or software project that fits nowhere else? Develop open solutions and invent completely new conceptual models outside traditional boundaries.', 
    span: 'md:col-span-3', 
    isSpecial: true,
    accent: '#F59E0B', 
    accentDark: '#EF4444',
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
  },
];

const CATEGORIES = ['All', 'Core Tech', 'Dev & Web3', 'Applied Tech', 'Impact & Future'];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Domains() {
  const { ref: headRef, visible: headVisible } = useInView(0.3);
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Open Innovation is a special track, always visible at the bottom of every filtered tab view!
  const filteredDomains = activeCategory === 'All' 
    ? DOMAINS 
    : DOMAINS.filter(d => d.category === activeCategory || d.isSpecial);

  return (
    <section id="domains" className="relative py-28 px-6">
      {/* Glow bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 20% 60%, rgba(249,115,22,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.06) 0%, transparent 60%)',
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
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400 text-xs font-mono tracking-[0.35em] uppercase">Choose Your Arena</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #FB923C 50%, #fff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            Problem Domains
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-mono text-sm">
            Interactive tracks. Endless possibilities. Pick the category and choose your domain.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2.5 rounded-full font-mono text-xs md:text-sm font-bold tracking-wider transition-all duration-300 border uppercase"
              style={{
                background: activeCategory === cat 
                  ? 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(59,130,246,0.15) 100%)' 
                  : 'rgba(13,21,38,0.5)',
                borderColor: activeCategory === cat ? '#F97316' : 'rgba(59,130,246,0.15)',
                boxShadow: activeCategory === cat 
                  ? '0 0 15px rgba(249,115,22,0.25), inset 0 0 10px rgba(59,130,246,0.1)' 
                  : 'none',
                color: activeCategory === cat ? '#FFF' : '#94A3B8',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Layout (Restored) */}
        <div className="grid md:grid-cols-3 gap-4 auto-rows-[minmax(175px,auto)] transition-all duration-500">
          {filteredDomains.map((d, idx) => {
            const Icon = d.icon;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={d.name}
                className={`group relative p-6 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${d.span}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  background: d.isSpecial 
                    ? 'linear-gradient(135deg, rgba(8, 12, 24, 0.95) 0%, rgba(13, 21, 38, 0.9) 100%)'
                    : 'rgba(8,12,24,0.82)',
                  border: d.isSpecial
                    ? `1.5px solid ${isHovered ? '#F59E0B' : 'rgba(245, 158, 11, 0.35)'}`
                    : `1px solid ${isHovered ? `${d.accent}77` : 'rgba(59,130,246,0.15)'}`,
                  backdropFilter: 'blur(16px)',
                  boxShadow: d.isSpecial
                    ? isHovered 
                      ? '0 16px 45px rgba(245, 158, 11, 0.3), inset 0 0 25px rgba(245, 158, 11, 0.1)' 
                      : '0 4px 20px rgba(245, 158, 11, 0.08)'
                    : isHovered 
                    ? `0 12px 30px ${d.accent}22, inset 0 0 20px ${d.accent}08` 
                    : 'none',
                  transform: isHovered ? 'translateY(-6px) scale(1.012)' : 'translateY(0) scale(1)',
                }}
              >
                {/* Background Image Overlay for Related Field */}
                <div 
                  className="absolute inset-0 opacity-[0.28] group-hover:opacity-[0.45] transition-opacity duration-500 pointer-events-none bg-cover bg-center"
                  style={{ 
                    backgroundImage: `linear-gradient(to bottom, rgba(8, 12, 24, 0.3) 0%, rgba(8, 12, 24, 0.8) 100%), url(${d.bgImage})` 
                  }}
                />

                {/* Special tag for Open Innovation */}
                {d.isSpecial && (
                  <div 
                    className="absolute top-4 right-4 text-black text-[9px] font-black font-mono px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                    style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}
                  >
                    ★ SPECIAL OPEN TRACK
                  </div>
                )}

                {/* Hover glow background */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${d.accent}12, transparent 75%)` }}
                />
                
                {/* Glowing top line */}
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${d.accent}bb, transparent)` }} />
                
                {/* Bottom line fill anim */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, ${d.accent}, ${d.accentDark})` }}
                />

                {/* Icon badge */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 relative z-10"
                  style={{ 
                    background: `${d.accent}15`, 
                    border: `1px solid ${isHovered ? `${d.accent}44` : 'rgba(59,130,246,0.18)'}`,
                    boxShadow: isHovered ? `0 0 15px ${d.accent}33` : 'none'
                  }}
                >
                  <Icon className="w-6 h-6 transition-transform duration-300" style={{ color: d.accent }} />
                </div>

                <h3 className="text-base md:text-lg font-black text-white mb-2 group-hover:text-cyan-300 transition-colors relative z-10">
                  {d.name}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors relative z-10">
                  {d.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
