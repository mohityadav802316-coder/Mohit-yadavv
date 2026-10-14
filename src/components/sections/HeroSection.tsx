import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import { PhotoOrbitHero3D } from '../three/PhotoOrbitHero3D';
import { CyberCore3D } from '../three/CyberCore3D';
import {
  Sparkles,
  ArrowRight,
  Mail,
  Camera,
  Cpu,
  Layers,
  ChevronDown
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { mode } = useLanguage();
  const { mainProfileImage, heroOrbitImages, siteSettings } = useImages();
  const [heroMode, setHeroMode] = useState<'photo_orbit' | 'cyber_core'>('photo_orbit');

  const heroTitle = siteSettings.hero?.heroTitle || siteSettings.heroTitle || 'MOHIT YADAV';
  const heroSubtitle = siteSettings.hero?.heroSubtitle || siteSettings.heroSubtitle || siteSettings.profile?.title || 'Future AI Engineer | Python Developer | Web & App Creator';
  const heroBioEn = siteSettings.hero?.heroBioEn || siteSettings.heroBioEn || siteSettings.profile?.bioEn || "I'm an aspiring AI Engineer and Python developer passionate about building applications, websites, AI-powered tools, and futuristic digital experiences.";
  const heroBioHi = siteSettings.hero?.heroBioHi || siteSettings.heroBioHi || siteSettings.profile?.bioHi || "मैं एक aspiring AI Engineer और Python Developer हूँ। मुझे apps, websites, AI-powered tools और futuristic digital experiences बनाना पसंद है। मेरा लक्ष्य सीखते हुए अपने ideas को real, useful projects में बदलना है।";
  const cycleInterval = siteSettings.hero?.orbitCycleInterval || siteSettings.orbitCycleInterval || 2.5;

  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center pt-6 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Scene A — Background Cyber Matrix Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-35 pointer-events-none" />

      {/* Atmospheric lighting gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Introductions and CTAs (order-2 on mobile, order-1 on desktop) */}
        <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-md shadow-cyan-950/40">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SCENE A // 3D CYBERPUNK NEXUS</span>
            <span className="text-gray-500">•</span>
            <span className="text-pink-400">CLASS 12 SCIENCE (BSEB)</span>
          </div>

          {/* Name & Main Title with Futuristic Cyan/Chrome Gradient */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cyber font-black tracking-tight text-white leading-tight">
              {heroTitle.includes(' ') ? (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                    {heroTitle.split(' ')[0]}
                  </span>{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-500 neon-text-cyan drop-shadow-[0_0_30px_rgba(236,72,153,0.35)]">
                    {heroTitle.split(' ').slice(1).join(' ')}
                  </span>
                </>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400 neon-text-cyan">
                  {heroTitle}
                </span>
              )}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-mono text-cyan-300/90 font-medium tracking-wide">
              {heroSubtitle}
            </p>
          </div>

          {/* Bilingual Introductions */}
          <div className="space-y-3 bg-gray-950/75 border-l-2 border-cyan-500 p-4.5 rounded-r-2xl border-y border-r border-gray-800/80 backdrop-blur-md shadow-xl">
            {(mode === 'both' || mode === 'en') && (
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
                &ldquo;{heroBioEn}&rdquo;
              </p>
            )}

            {(mode === 'both' || mode === 'hi') && (
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans border-t border-gray-800/60 pt-2.5">
                &ldquo;{heroBioHi}&rdquo;
              </p>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              href="#roadmap"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider hover:from-cyan-400 hover:to-indigo-500 transition shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{mode === 'hi' ? 'मेरी यात्रा देखें' : 'Explore My Journey'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-gray-200 hover:text-cyan-300 font-cyber font-semibold text-xs uppercase tracking-wider border border-cyan-500/40 hover:border-cyan-400 transition shadow-md shadow-black/50"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{mode === 'hi' ? 'संपर्क करें' : 'Contact Me'}</span>
            </a>
          </div>

          {/* Quick Profile Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 backdrop-blur-md">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Academic Focus</span>
              <span className="text-xs sm:text-sm font-cyber font-bold text-cyan-300">Class 12 Sci</span>
              <span className="text-[10px] text-gray-500 block">Bihar Board (BSEB)</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 backdrop-blur-md">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Primary Core</span>
              <span className="text-xs sm:text-sm font-cyber font-bold text-purple-300">Python &amp; AI</span>
              <span className="text-[10px] text-gray-500 block">Fundamentals + Dev</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 backdrop-blur-md">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">In Development</span>
              <span className="text-xs sm:text-sm font-cyber font-bold text-pink-300">6 Projects</span>
              <span className="text-[10px] text-gray-500 block">Active Builds</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 backdrop-blur-md">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Target Horizon</span>
              <span className="text-xs sm:text-sm font-cyber font-bold text-emerald-300">AI Engineer</span>
              <span className="text-[10px] text-gray-500 block">Product Creator</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Photo-Orbit or Quantum Core Matrix (order-1 on mobile, order-2 on desktop) */}
        <div className="lg:col-span-6 relative flex flex-col items-center order-1 lg:order-2 w-full">
          {/* Switcher Toggle Controls */}
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5 bg-gray-950/80 p-1 rounded-xl border border-gray-800 text-[11px] font-mono">
              <button
                onClick={() => {
                  sound.playClick();
                  setHeroMode('photo_orbit');
                }}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                  heroMode === 'photo_orbit'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>3D Photo-Orbit</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setHeroMode('cyber_core');
                }}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                  heroMode === 'cyber_core'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-sm shadow-purple-500/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Quantum Core</span>
              </button>
            </div>

            <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">
              TOUCH &amp; DRAG TO ROTATE 3D
            </span>
          </div>

          <div className="w-full">
            {heroMode === 'photo_orbit' ? (
              <PhotoOrbitHero3D
                centralImage={mainProfileImage}
                orbitImages={heroOrbitImages}
                cycleInterval={cycleInterval}
              />
            ) : (
              <CyberCore3D />
            )}
          </div>

          <p className="text-[11px] font-mono text-gray-400 text-center mt-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline" />
            <span>
              {heroMode === 'photo_orbit'
                ? 'Interactive 3D Photo Orbit — Real Photographs Synchronized from Firebase'
                : '3D AI Matrix Core — Procedural Studio PBR with Exploded View Controls'}
            </span>
          </p>
        </div>
      </div>

      {/* Scroll indicator prompt */}
      <div className="hidden sm:flex flex-col items-center justify-center mt-6 text-gray-500 hover:text-cyan-400 transition">
        <a href="#about" onClick={() => sound.playClick()} className="flex flex-col items-center gap-1 text-[11px] font-mono">
          <span>SCROLL TO ENTER SCENE B // LUXURY DOSSIER</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
