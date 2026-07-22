import { useState, useEffect } from 'react';
import IntroScene from './components/IntroScene';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Structure from './components/Structure';
import Domains from './components/Domains';
import Registration from './components/Registration';
import Sponsors from './components/Sponsors';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (introDone) {
      window.scrollTo(0, 0);
    }
  }, [introDone]);

  if (!introDone) {
    return <IntroScene onComplete={() => setIntroDone(true)} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <Timeline />
        <Structure />
        <Domains />
        <Registration />
        <Sponsors />
      </main>
    </div>
  );
}
