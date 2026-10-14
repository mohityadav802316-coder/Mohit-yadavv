import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { sound } from '../audio/SoundEffects';
import { Shield, Heart, Terminal, Sparkles, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { mode } = useLanguage();

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-gray-900 bg-gray-950/90 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-900">
          {/* Brand Info */}
          <div className="space-y-1.5 text-center md:text-left">
            <span className="font-cyber font-black text-xl text-white tracking-wider flex items-center justify-center md:justify-start gap-2">
              MOHIT YADAV
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                AI DEV
              </span>
            </span>
            <p className="text-xs font-mono text-gray-400">
              Future AI Engineer | Python Developer | Web &amp; App Creator
            </p>
            <p className="text-[11px] text-gray-500 font-sans">
              Class 12 Science Student, Bihar Board • Bihar, India
            </p>
          </div>

          {/* Quick Nav & Admin Link */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <a href="#about" onClick={() => sound.playHover()} className="hover:text-cyan-300 transition">
              About
            </a>
            <span className="text-gray-800">•</span>
            <a href="#skills" onClick={() => sound.playHover()} className="hover:text-cyan-300 transition">
              Skills
            </a>
            <span className="text-gray-800">•</span>
            <a href="#roadmap" onClick={() => sound.playHover()} className="hover:text-cyan-300 transition">
              Roadmap
            </a>
            <span className="text-gray-800">•</span>
            <a href="#projects" onClick={() => sound.playHover()} className="hover:text-cyan-300 transition">
              Projects
            </a>
            <span className="text-gray-800">•</span>
            <a href="#gallery" onClick={() => sound.playHover()} className="hover:text-cyan-300 transition">
              Gallery
            </a>
            <span className="text-gray-800">•</span>
            <a href="#contact" onClick={() => sound.playHover()} className="hover:text-cyan-300 transition">
              Contact
            </a>
            <span className="text-gray-800">•</span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenAdmin();
              }}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/50 hover:text-cyan-300 transition group"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition" />
          </button>
        </div>

        {/* Bilingual Closing Statement */}
        <div className="text-center space-y-2">
          {(mode === 'both' || mode === 'en') && (
            <p className="text-xs text-gray-400 font-sans max-w-xl mx-auto">
              &ldquo;Dedicated to relentless daily learning, mastering AI fundamentals, and crafting impactful digital tools for the future.&rdquo;
            </p>
          )}

          {(mode === 'both' || mode === 'hi') && (
            <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto">
              &ldquo;निरंतर दैनिक अध्ययन, AI के मूल सिद्धांतों में महारत और भविष्य के लिए उपयोगी डिजिटल टूल्स बनाने के प्रति समर्पित।&rdquo;
            </p>
          )}

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-gray-500">
            <span>© 2026 Mohit Yadav. All rights reserved.</span>
            <span>•</span>
            <span className="text-cyan-400/80">Built with React, Three.js &amp; Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
