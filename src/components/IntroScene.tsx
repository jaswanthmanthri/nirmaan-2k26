import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const BLOCK_COUNT = 18;

function FloatingBlock({
  initialPos,
  targetPos,
  phase,
  color,
  size,
}: {
  initialPos: [number, number, number];
  targetPos: [number, number, number];
  phase: 'floating' | 'assembling' | 'done';
  color: string;
  size: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    t.current += delta;

    if (phase === 'floating') {
      ref.current.position.x = initialPos[0] + Math.sin(t.current * 0.4) * 0.3;
      ref.current.position.y = initialPos[1] + Math.cos(t.current * 0.3) * 0.2;
      ref.current.position.z = initialPos[2] + Math.sin(t.current * 0.5) * 0.15;
      ref.current.rotation.x += delta * 0.2;
      ref.current.rotation.y += delta * 0.15;
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
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.3} transparent opacity={0.92} />
    </mesh>
  );
}

function BlueprintBeam({ angle }: { angle: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.5 + angle) * 2;
    (ref.current.material as THREE.MeshStandardMaterial).opacity =
      0.12 + Math.abs(Math.sin(t * 0.4 + angle)) * 0.08;
  });

  return (
    <mesh ref={ref} rotation={[0, angle, Math.PI / 2]} position={[Math.cos(angle) * 4, 0, Math.sin(angle) * 2]}>
      <cylinderGeometry args={[0.02, 0.02, 12, 8]} />
      <meshStandardMaterial color="#2563EB" transparent opacity={0.15} emissive="#2563EB" emissiveIntensity={0.5} />
    </mesh>
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
    camera.fov = THREE.MathUtils.lerp(60, 110, eased);
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
  const radius = 3 + Math.random() * 2;
  return {
    initialPos: [Math.cos(angle) * radius, (Math.random() - 0.5) * 4, Math.sin(angle) * radius - 2] as [number, number, number],
    targetPos: [(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, -0.5] as [number, number, number],
    color: i % 3 === 0 ? '#2563EB' : i % 3 === 1 ? '#F59E0B' : '#E2E8F0',
    size: [0.3 + Math.random() * 0.4, 0.3 + Math.random() * 0.4, 0.3 + Math.random() * 0.3] as [number, number, number],
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
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#E2E8F0" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#2563EB" />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <BlueprintBeam key={i} angle={(i / 6) * Math.PI * 2} />
      ))}

      {BLOCK_DATA.map((b, i) => (
        <FloatingBlock key={i} {...b} phase={blockPhase} />
      ))}

      <CameraFlyThrough phase={phase} onComplete={onFlythroughComplete} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#F8FAFC" roughness={1} />
      </mesh>
    </>
  );
}

export default function IntroScene({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'floating' | 'assembling' | 'flythrough' | 'done'>('floating');
  const [showButton, setShowButton] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleConstruct = () => {
    setPhase('assembling');
    setTimeout(() => setPhase('flythrough'), 2000);
  };

  const handleFlythroughComplete = () => {
    setFlashVisible(true);
    setTimeout(onComplete, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F6FF 50%, #FFF8E7 100%)' }}
      >
        <Scene phase={phase} onFlythroughComplete={handleFlythroughComplete} />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        <div
          className="text-center"
          style={{
            opacity: phase === 'floating' ? 1 : phase === 'assembling' ? 0.3 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          <div className="mb-2 text-xs font-semibold tracking-[0.4em] text-blue-500 uppercase">
            ANITS Presents
          </div>
          <div
            className="font-black leading-none mb-1"
            style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', color: '#0F172A', letterSpacing: '-0.02em' }}
          >
            NIRMAAN
          </div>
          <div
            className="font-black leading-none mb-6"
            style={{ fontSize: 'clamp(2rem, 7vw, 5rem)', color: '#2563EB', letterSpacing: '0.05em' }}
          >
            2K26
          </div>
          <div className="text-slate-500 text-sm tracking-widest uppercase mb-8">
            National Level 24-Hour Hackathon
          </div>
          {showButton && phase === 'floating' && (
            <button
              onClick={handleConstruct}
              className="pointer-events-auto px-10 py-4 rounded-full font-bold text-white text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                boxShadow: '0 8px 32px rgba(37,99,235,0.4)',
              }}
            >
              Construct NIRMAAN
            </button>
          )}
        </div>

        {phase === 'assembling' && (
          <div className="text-center animate-pulse">
            <div className="text-blue-600 font-bold text-lg tracking-widest uppercase">
              Building the Future...
            </div>
          </div>
        )}
      </div>

      {flashVisible && (
        <div className="absolute inset-0 bg-white" style={{ animation: 'flashIn 0.6s ease-out forwards' }} />
      )}

      <style>{`
        @keyframes flashIn {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
