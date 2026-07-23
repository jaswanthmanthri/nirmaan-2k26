import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', href: '#hero' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Structure', href: '#structure' },
  { label: 'Domains', href: '#domains' },
  { label: 'Sponsor Us', href: '#sponsors' },
  { label: 'Help & Contact', href: '#contact' },
  { label: 'Location', href: '#location' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isWorkflowPage = ['/register', '/admin'].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed left-0 right-0 z-40 transition-all duration-500"
      style={{
        top: 28,
        background: scrolled || isWorkflowPage ? 'rgba(2,8,23,0.85)' : 'transparent',
        backdropFilter: scrolled || isWorkflowPage ? 'blur(16px)' : 'none',
        boxShadow: scrolled || isWorkflowPage ? '0 0 30px rgba(249,115,22,0.08)' : 'none',
        borderBottom: scrolled || isWorkflowPage ? '1px solid rgba(249,115,22,0.15)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/nirmaanlogo.png"
            alt="NIRMAAN Logo"
            className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-[0_0_16px_rgba(249,115,22,0.7)] group-hover:scale-105 transition-transform duration-300"
          />
          <div className="leading-tight">
            <div className="font-black text-white text-lg md:text-xl tracking-tight" style={{ textShadow: '0 0 12px rgba(249,115,22,0.4)' }}>
              NIRMAAN
            </div>
            <div className="text-[11px] font-bold text-blue-400 tracking-[0.25em] font-mono">2K26</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {!isWorkflowPage && NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-orange-400 rounded-lg transition-all duration-200 font-mono hover:bg-orange-500/5"
              style={{ letterSpacing: '0.05em' }}
            >
              {item.label}
            </a>
          ))}
          {isWorkflowPage && (
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-orange-400 rounded-lg transition-all duration-200 font-mono hover:bg-orange-500/5"
              style={{ letterSpacing: '0.05em' }}
            >
              ← Back to Home
            </Link>
          )}
          <Link
            to="/register"
            className="ml-2 px-5 py-2 text-sm font-bold text-white rounded-none transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #EA580C, #F97316)',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              boxShadow: '0 0 20px rgba(249,115,22,0.3)',
            }}
          >
            Register Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: '#FB923C' }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 bg-orange-400 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 bg-orange-400 transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-orange-400 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 py-4 flex flex-col gap-1"
          style={{
            background: 'rgba(2,8,23,0.95)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(249,115,22,0.15)',
          }}
        >
          {!isWorkflowPage && NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-orange-400 rounded-lg font-mono transition-colors"
              style={{ letterSpacing: '0.05em' }}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="px-4 py-3 text-sm font-bold text-orange-400 hover:text-orange-300 rounded-lg font-mono transition-colors"
            style={{ letterSpacing: '0.05em' }}
          >
            Register Now →
          </Link>
        </div>
      )}
    </nav>
  );
}
