/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ImageProvider, useImages } from './context/ImageContext';
import { CyberBackground } from './components/CyberBackground';
import { CyberNavbar } from './components/CyberNavbar';
import { HeroSection } from './components/sections/HeroSection';
import { CyberSecuritySection } from './components/sections/CyberSecuritySection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { RoadmapSection } from './components/sections/RoadmapSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { GallerySection } from './components/sections/GallerySection';
import { VisionSection } from './components/sections/VisionSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { testFirestoreConnection } from './firebase';

function MainPortfolioContent({
  onOpenAdmin,
  isAdminView,
}: {
  onOpenAdmin: () => void;
  isAdminView: boolean;
}) {
  const { siteSettings } = useImages();

  const activeScenes = siteSettings.scenes?.activeScenes || {
    hero: true,
    cybersecurity: true,
    about: true,
    skills: true,
    roadmap: true,
    projects: true,
    gallery: true,
    vision: true,
    contact: true,
  };

  const sceneOrder = siteSettings.scenes?.sceneOrder || [
    'hero',
    'cybersecurity',
    'about',
    'skills',
    'roadmap',
    'projects',
    'gallery',
    'vision',
    'contact',
  ];

  const renderSceneItem = (key: string) => {
    switch (key) {
      case 'hero':
        return activeScenes.hero !== false ? <HeroSection key="hero" /> : null;
      case 'cybersecurity':
        return activeScenes.cybersecurity !== false ? <CyberSecuritySection key="cybersecurity" /> : null;
      case 'about':
        return activeScenes.about !== false ? <AboutSection key="about" /> : null;
      case 'skills':
        return activeScenes.skills !== false ? <SkillsSection key="skills" /> : null;
      case 'roadmap':
        return activeScenes.roadmap !== false ? <RoadmapSection key="roadmap" /> : null;
      case 'projects':
        return activeScenes.projects !== false ? <ProjectsSection key="projects" /> : null;
      case 'gallery':
        return activeScenes.gallery !== false ? <GallerySection key="gallery" /> : null;
      case 'vision':
        return activeScenes.vision !== false ? <VisionSection key="vision" /> : null;
      case 'contact':
        return activeScenes.contact !== false ? <ContactSection key="contact" /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <CyberNavbar onOpenAdmin={onOpenAdmin} isAdminView={isAdminView} />
      <main className="flex-1">
        {sceneOrder.map((sceneKey) => renderSceneItem(sceneKey))}
      </main>
      <Footer onOpenAdmin={onOpenAdmin} />
    </div>
  );
}

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin' || window.location.pathname === '/admin';
  });

  useEffect(() => {
    // Validate Firestore connection on boot as mandated by Firebase skill
    testFirestoreConnection().catch((err) => {
      console.warn('Initial Firestore ping note:', err);
    });

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminView(!isAdminView);
    if (!isAdminView) {
      window.location.hash = '#admin';
    } else {
      window.location.hash = '';
    }
  };

  return (
    <LanguageProvider>
      <ImageProvider>
        <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-cyan-500/30 selection:text-cyan-200">
          <CyberBackground />

          {isAdminView ? (
            <AdminDashboard onBackToPortfolio={() => handleOpenAdmin()} />
          ) : (
            <MainPortfolioContent
              onOpenAdmin={handleOpenAdmin}
              isAdminView={isAdminView}
            />
          )}
        </div>
      </ImageProvider>
    </LanguageProvider>
  );
}
