import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a,button,input,select,textarea,[data-hover]')) setIsHovering(true);
    };
    const onLeave = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a,button,input,select,textarea,[data-hover]')) setIsHovering(false);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', onEnter);
    window.addEventListener('mouseout', onLeave);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', onEnter);
      window.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: isHovering ? '6px' : '5px',
          height: isHovering ? '6px' : '5px',
          marginLeft: isHovering ? '-3px' : '-2.5px',
          marginTop: isHovering ? '-3px' : '-2.5px',
          background: '#F97316',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.2s, height 0.2s, background 0.2s',
          boxShadow: '0 0 8px rgba(249,115,22,0.8)',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: isHovering ? '44px' : '32px',
          height: isHovering ? '44px' : '32px',
          marginLeft: isHovering ? '-22px' : '-16px',
          marginTop: isHovering ? '-22px' : '-16px',
          border: `1.5px solid ${isHovering ? 'rgba(249,115,22,0.7)' : 'rgba(59,130,246,0.5)'}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.3s, height 0.3s, border-color 0.3s, margin 0.3s',
          willChange: 'transform',
          backdropFilter: isHovering ? 'blur(2px)' : 'none',
          background: isHovering ? 'rgba(249,115,22,0.05)' : 'transparent',
        }}
      />
    </>
  );
}
