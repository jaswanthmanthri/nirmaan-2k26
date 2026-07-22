import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroScene from './components/IntroScene';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Structure from './components/Structure';
import Domains from './components/Domains';
import Sponsors from './components/Sponsors';
import RegisterPage from './components/RegisterPage';

function HomePage() {
  return (
    <>
      <Hero />
      <Timeline />
      <Structure />
      <Domains />
      <Sponsors />
    </>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [isRegisterRoute, setIsRegisterRoute] = useState(false);

  useEffect(() => {
    // Skip intro on /register route
    setIsRegisterRoute(window.location.pathname === '/register');
  }, []);

  useEffect(() => {
    if (introDone) {
      window.scrollTo(0, 0);
    }
  }, [introDone]);

  // Skip intro animation for register route
  if (!introDone && !isRegisterRoute) {
    return <IntroScene onComplete={() => setIntroDone(true)} />;
  }

  return (
    <div className="min-h-screen text-slate-100 antialiased" style={{ background: 'transparent' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}
