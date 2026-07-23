export default function AnnouncementBar() {
  const items = [
    '🔴 Registrations Closing Soon',
    '🏆 Prize Pool ₹70,000',
    '⚡ 24-Hour Non-Stop Hackathon',
    '📍 ANITS, Visakhapatnam',
    '🍿 Food & Refreshments Provided',
    '🔥 Campfire · Movie Screening · Fun Activities',
    '📅 11–12 September 2026',
    '💡 800+ Students · 12+ Domains',
  ];

  // Duplicate for seamless loop
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
      style={{
        height: '28px',
        background: 'rgba(2,8,23,0.96)',
        borderBottom: '1px solid rgba(249,115,22,0.18)',
      }}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(2,8,23,1) 0%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, rgba(2,8,23,1) 0%, transparent 100%)' }} />

      <div className="flex items-center h-full">
        <div className="announcement-track whitespace-nowrap flex items-center gap-0">
          {repeated.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="text-[11px] font-mono font-semibold tracking-widest px-6"
                style={{ color: i % 2 === 0 ? 'rgba(249,115,22,0.85)' : 'rgba(148,163,184,0.7)' }}
              >
                {item}
              </span>
              <span className="text-orange-800/40 text-[10px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .announcement-track {
          animation: announceTicker 55s linear infinite;
        }
        @keyframes announceTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
