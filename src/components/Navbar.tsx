import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Home', href: '#hero' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Structure', href: '#structure' },
  { label: 'Domains', href: '#domains' },
  { label: 'Register', href: '#register' },
  { label: 'Sponsors', href: '#sponsors' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(15,23,42,0.06)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(226,232,240,0.6)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
            <span className="text-white font-black text-lg">N</span>
            <div className="absolute inset-0 bg-amber-400 opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>
          <div className="leading-tight">
            <div className="font-black text-slate-900 text-base tracking-tight">NIRMAAN</div>
            <div className="text-[10px] font-semibold text-blue-600 tracking-[0.2em]">2K26</div>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50/60 transition-all"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#register"
            className="ml-2 px-5 py-2 text-sm font-bold text-white rounded-lg transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            Register Now
          </a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 bg-slate-800 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 bg-slate-800 transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-slate-800 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200 px-6 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
