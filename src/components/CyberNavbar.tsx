import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { sound } from './audio/SoundEffects';
import {
  Volume2,
  VolumeX,
  Languages,
  Shield,
  Menu,
  X,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface CyberNavbarProps {
  onOpenAdmin: () => void;
  isAdminView?: boolean;
}

export const CyberNavbar: React.FC<CyberNavbarProps> = ({ onOpenAdmin, isAdminView = false }) => {
  const { mode, setMode } = useLanguage();
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const cycleLanguage = () => {
    sound.playClick();
    if (mode === 'both') setMode('en');
    else if (mode === 'en') setMode('hi');
    else setMode('both');
  };

  const navLinks = [
    { href: '#cybersecurity', labelEn: 'Cyber Defense', labelHi: 'साइबर सुरक्षा' },
    { href: '#about', labelEn: 'About', labelHi: 'मेरे बारे में' },
    { href: '#skills', labelEn: 'Skills', labelHi: 'स्किल्स' },
    { href: '#roadmap', labelEn: 'Roadmap', labelHi: 'यात्रा' },
    { href: '#projects', labelEn: 'Projects', labelHi: 'प्रोजेक्ट्स' },
    { href: '#gallery', labelEn: 'Gallery', labelHi: 'गैलरी' },
    { href: '#vision', labelEn: 'Vision', labelHi: 'लक्ष्य' },
    { href: '#contact', labelEn: 'Contact', labelHi: 'संपर्क' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-950/85 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={() => sound.playClick()}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-indigo-600 to-pink-500 p-0.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition">
            <div className="w-full h-full bg-gray-950 rounded-[7px] flex items-center justify-center font-cyber font-black text-cyan-400 text-sm">
              MY
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-cyber font-bold text-white text-base tracking-wider group-hover:text-cyan-300 transition flex items-center gap-1.5">
              MOHIT YADAV
              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 border border-cyan-500/30 px-1 rounded">
                AI DEV
              </span>
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              Future AI Engineer // Bihar, IN
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        {!isAdminView && (
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => sound.playHover()}
                className="px-3 py-1.5 text-xs font-mono text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-md transition duration-150 border border-transparent hover:border-cyan-500/30"
              >
                {mode === 'hi' ? link.labelHi : mode === 'en' ? link.labelEn : `${link.labelEn} / ${link.labelHi}`}
              </a>
            ))}
          </nav>
        )}

        {/* Utility Controls & Admin Button */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Button */}
          <button
            onClick={cycleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-cyan-300 border border-gray-800 hover:border-cyan-500/40 rounded-lg text-xs font-mono transition shadow-sm"
            title="Toggle Language: Both | English | Hindi"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold uppercase text-[11px]">
              {mode === 'both' ? 'EN + HI' : mode === 'hi' ? 'हिंदी' : 'ENG'}
            </span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-cyan-300 border border-gray-800 hover:border-cyan-500/40 rounded-lg text-xs transition"
            title={isMuted ? 'Turn Sound FX On (Web Audio Synth)' : 'Mute Sound FX'}
            aria-label="Toggle sound effects"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>

          {/* Admin Panel Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdmin();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition ${
              isAdminView
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30'
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-white border-indigo-500/40 hover:border-indigo-400'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {isAdminView ? 'Return to Portfolio' : 'Admin Panel'}
            </span>
            <span className="sm:hidden">Admin</span>
          </button>

          {/* Mobile Menu Toggle */}
          {!isAdminView && (
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && !isAdminView && (
        <div className="lg:hidden bg-gray-950/95 border-b border-cyan-500/30 px-4 pt-3 pb-5 space-y-2 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-mono text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-md border border-gray-800 hover:border-cyan-500/30 flex items-center justify-between"
              >
                <span>{mode === 'hi' ? link.labelHi : link.labelEn}</span>
                <span className="text-[10px] text-gray-500">→</span>
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs font-mono text-gray-400">
            <span>STATUS: ONLINE</span>
            <span className="text-cyan-400">SECURE FIREBASE NODE</span>
          </div>
        </div>
      )}
    </header>
  );
};
