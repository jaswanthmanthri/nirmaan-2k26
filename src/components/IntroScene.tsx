import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const BLOCK_COUNT = 22;

function FloatingBlock({
  initialPos,
  targetPos,
  phase,
  color,
  emissiveColor,
  size,
}: {
  initialPos: [number, number, number];
  targetPos: [number, number, number];
  phase: 'floating' | 'assembling' | 'done';
  color: string;
  emissiveColor: string;
  size: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    t.current += delta;

    if (phase === 'floating') {
      ref.current.position.x = initialPos[0] + Math.sin(t.current * 0.4) * 0.4;
      ref.current.position.y = initialPos[1] + Math.cos(t.current * 0.3) * 0.3;
      ref.current.position.z = initialPos[2] + Math.sin(t.current * 0.5) * 0.2;
      ref.current.rotation.x += delta * 0.25;
      ref.current.rotation.y += delta * 0.2;
      // Pulse emissive
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.abs(Math.sin(t.current * 1.2)) * 0.6;
    } else if (phase === 'assembling') {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetPos[0], delta * 3);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetPos[1], delta * 3);
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetPos[2], delta * 3);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, delta * 3);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, delta * 3);
    }
  });

  return (
    <mesh ref={ref} position={initialPos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.05}
        metalness={0.8}
        transparent
        opacity={0.88}
        emissive={emissiveColor}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function CircuitBeam({ angle, colorHex }: { angle: number; colorHex: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.4 + angle) * 2.5;
    (ref.current.material as THREE.MeshStandardMaterial).opacity =
      0.08 + Math.abs(Math.sin(t * 0.3 + angle)) * 0.12;
  });

  return (
    <mesh ref={ref} rotation={[0, angle, Math.PI / 2]} position={[Math.cos(angle) * 5, 0, Math.sin(angle) * 2.5]}>
      <cylinderGeometry args={[0.015, 0.015, 14, 6]} />
      <meshStandardMaterial color={colorHex} transparent opacity={0.1} emissive={colorHex} emissiveIntensity={2} />
    </mesh>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 120;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
  }

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F97316" size={0.04} transparent opacity={0.5} />
    </points>
  );
}

function CameraFlyThrough({ phase, onComplete }: { phase: string; onComplete: () => void }) {
  const { camera } = useThree();
  const t = useRef(0);
  const triggered = useRef(false);

  useFrame((_, delta) => {
    if (phase !== 'flythrough') return;
    t.current += delta;

    const progress = Math.min(t.current / 2.2, 1);
    const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

    camera.position.z = THREE.MathUtils.lerp(5, -8, eased);
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(60, 110, eased);
    camera.updateProjectionMatrix();

    if (progress >= 1 && !triggered.current) {
      triggered.current = true;
      onComplete();
    }
  });

  return null;
}

const BLOCK_DATA = Array.from({ length: BLOCK_COUNT }, (_, i) => {
  const angle = (i / BLOCK_COUNT) * Math.PI * 2;
  const radius = 3.5 + Math.random() * 2.5;
  // Orange, blue, and cyan palette
  const palette = [
    { color: '#EA580C', emissive: '#F97316' },
    { color: '#1D4ED8', emissive: '#3B82F6' },
    { color: '#0E7490', emissive: '#06B6D4' },
    { color: '#C2410C', emissive: '#FB923C' },
    { color: '#1E40AF', emissive: '#60A5FA' },
  ];
  const p = palette[i % palette.length];
  return {
    initialPos: [Math.cos(angle) * radius, (Math.random() - 0.5) * 5, Math.sin(angle) * radius - 2] as [number, number, number],
    targetPos: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, -0.5] as [number, number, number],
    color: p.color,
    emissiveColor: p.emissive,
    size: [0.28 + Math.random() * 0.45, 0.28 + Math.random() * 0.45, 0.28 + Math.random() * 0.35] as [number, number, number],
  };
});

function Scene({
  phase,
  onFlythroughComplete,
}: {
  phase: 'floating' | 'assembling' | 'flythrough' | 'done';
  onFlythroughComplete: () => void;
}) {
  const blockPhase = phase === 'floating' ? 'floating' : phase === 'assembling' || phase === 'flythrough' ? 'assembling' : 'done';

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#3B82F6" />
      <pointLight position={[0, 0, 4]} intensity={2.5} color="#F97316" />
      <pointLight position={[3, 2, -2]} intensity={1.5} color="#3B82F6" />
      <pointLight position={[-3, -2, -2]} intensity={1.2} color="#06B6D4" />

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <CircuitBeam
          key={i}
          angle={(i / 8) * Math.PI * 2}
          colorHex={i % 2 === 0 ? '#F97316' : '#3B82F6'}
        />
      ))}

      <ParticleField />

      {BLOCK_DATA.map((b, i) => (
        <FloatingBlock key={i} {...b} phase={blockPhase} />
      ))}

      <CameraFlyThrough phase={phase} onComplete={onFlythroughComplete} />
    </>
  );
}

export default function IntroScene({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'floating' | 'assembling' | 'flythrough' | 'done'>('floating');
  const [showButton, setShowButton] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Subtle glitch loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setPhase('assembling');
    setTimeout(() => setPhase('flythrough'), 2000);
  };

  const handleFlythroughComplete = () => {
    setFlashVisible(true);
    setTimeout(onComplete, 600);
  };

  return (
    <div className="fixed inset-0 z-50" style={{ background: '#020817' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene phase={phase} onFlythroughComplete={handleFlythroughComplete} />
      </Canvas>

      {/* Techy grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px),
            linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px',
        }}
      />

      {/* Scanline sweep */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: 0.35 }}
      >
        <div className="scanline-sweep" />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,8,23,0.85) 100%)',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M0 20 L0 0 L20 0" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M8 20 L8 8 L20 8" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      </div>
      <div className="absolute top-6 right-6 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M0 20 L0 0 L20 0" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M8 20 L8 8 L20 8" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      </div>
      <div className="absolute bottom-6 left-6 pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M0 20 L0 0 L20 0" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M8 20 L8 8 L20 8" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 pointer-events-none" style={{ transform: 'scale(-1,-1)' }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M0 20 L0 0 L20 0" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M8 20 L8 8 L20 8" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* HUD top bar */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none flex items-center justify-between px-8 py-3"
        style={{ borderBottom: '1px solid rgba(249,115,22,0.12)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-500 text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">SYS_ONLINE</span>
        </div>
        <div className="text-blue-400 text-[10px] font-mono tracking-[0.2em] opacity-50">ANITS // NIRMAAN-2K26</div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">INIT_SEQUENCE</span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Main text overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        <div
          className="text-center"
          style={{
            opacity: phase === 'floating' ? 1 : phase === 'assembling' ? 0.2 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          {/* Subtitle */}
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #F97316)' }} />
            <span className="text-orange-400 text-xs font-mono tracking-[0.5em] uppercase">
              ANITS Presents
            </span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #F97316, transparent)' }} />
          </div>

          {/* NIRMAAN title with glitch */}
          <div
            className={`font-black leading-none mb-1 select-none ${glitchActive ? 'glitch-text' : ''}`}
            style={{
              fontSize: 'clamp(4rem, 13vw, 10rem)',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FB923C 40%, #F97316 60%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(249,115,22,0.4))',
            }}
          >
            NIRMAAN
          </div>

          {/* 2K26 */}
          <div
            className="font-black leading-none mb-8"
            style={{
              fontSize: 'clamp(2rem, 7vw, 5.5rem)',
              letterSpacing: '0.15em',
              background: 'linear-gradient(135deg, #60A5FA, #3B82F6, #1D4ED8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.5))',
            }}
          >
            2K26
          </div>

          {/* Tagline */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="h-px w-8 bg-blue-600 opacity-60" />
            <span className="text-slate-400 text-xs font-mono tracking-[0.4em] uppercase">
              National Level · 24-Hour Hackathon
            </span>
            <div className="h-px w-8 bg-orange-600 opacity-60" />
          </div>

          {/* Enter button */}
          {showButton && phase === 'floating' && (
            <button
              onClick={handleEnter}
              className="pointer-events-auto group relative overflow-hidden px-12 py-4 font-bold text-sm tracking-[0.3em] uppercase transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                border: '1px solid rgba(249,115,22,0.5)',
                background: 'rgba(249,115,22,0.08)',
                color: '#FB923C',
                clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                boxShadow: '0 0 30px rgba(249,115,22,0.15), inset 0 0 30px rgba(249,115,22,0.05)',
              }}
            >
              {/* Hover shine */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(59,130,246,0.1))' }}
              />
              <span className="relative flex items-center gap-3">
                <span className="text-blue-400 font-mono text-xs">▶</span>
                Enter NIRMAAN
                <span className="text-orange-500 font-mono text-xs opacity-60">_</span>
              </span>
            </button>
          )}
        </div>

        {/* Assembling state */}
        {phase === 'assembling' && (
          <div className="text-center space-y-3">
            <div className="text-orange-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
              &gt; Initializing Systems...
            </div>
            <div className="flex items-center justify-center gap-1">
              {[0,1,2,3,4,5,6,7].map(i => (
                <div
                  key={i}
                  className="w-1 h-4 rounded-sm bg-blue-500"
                  style={{
                    animation: `barPulse 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Flash */}
      {flashVisible && (
        <div className="absolute inset-0" style={{ background: '#020817', animation: 'flashIn 0.6s ease-out forwards' }} />
      )}

      <style>{`
        @keyframes flashIn {
          0% { opacity: 0; }
          60% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes barPulse {
          0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .scanline-sweep {
          position: absolute;
          top: -100%;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(249,115,22,0.03) 50%,
            transparent 100%
          );
          animation: scanSweep 6s linear infinite;
        }
        @keyframes scanSweep {
          0% { top: -40%; }
          100% { top: 100%; }
        }
        .glitch-text {
          animation: glitch 0.15s steps(2) forwards;
        }
        @keyframes glitch {
          0% { transform: translateX(0); filter: drop-shadow(0 0 30px rgba(249,115,22,0.4)); }
          25% { transform: translateX(-3px) skewX(-2deg); filter: drop-shadow(3px 0 0 rgba(59,130,246,0.8)) drop-shadow(-3px 0 0 rgba(249,115,22,0.8)); }
          50% { transform: translateX(3px) skewX(2deg); filter: drop-shadow(-3px 0 0 rgba(59,130,246,0.8)) drop-shadow(3px 0 0 rgba(249,115,22,0.8)); }
          75% { transform: translateX(-1px); }
          100% { transform: translateX(0); filter: drop-shadow(0 0 30px rgba(249,115,22,0.4)); }
        }
      `}</style>
    </div>
  );
}
