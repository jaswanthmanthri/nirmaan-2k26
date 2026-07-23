import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroScene from './components/IntroScene';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import Timeline from './components/Timeline';
import Structure from './components/Structure';
import Domains from './components/Domains';
import Team from './components/Team';
import Sponsors from './components/Sponsors';
import RegisterPage from './components/RegisterPage';
import AdminPage from './components/AdminPage';

// Announcement bar height constant (keep in sync with AnnouncementBar.tsx)
const ANNOUNCE_H = 28;

function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Timeline />
      <Structure />
      <Domains />
      <Team />
      <Sponsors />
    </>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [isRegisterRoute, setIsRegisterRoute] = useState(false);

  useEffect(() => {
    setIsRegisterRoute(['/register', '/admin'].includes(window.location.pathname));
  }, []);

  useEffect(() => {
    if (introDone) {
      window.scrollTo(0, 0);
    }
  }, [introDone]);

  if (!introDone && !isRegisterRoute) {
    return <IntroScene onComplete={() => setIntroDone(true)} />;
  }

  return (
    <div className="min-h-screen text-slate-100 antialiased" style={{ background: 'transparent' }}>
      {/* Thin scrolling announcement bar — always on top */}
      <AnnouncementBar />

      {/* Navbar pushed down by bar height */}
      <div style={{ paddingTop: ANNOUNCE_H }}>
        <Navbar />
      </div>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}
