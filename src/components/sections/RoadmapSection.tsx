import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Brain,
  Code,
  Layers,
  Rocket
} from 'lucide-react';

export const RoadmapSection: React.FC = () => {
  const { mode } = useLanguage();
  const { milestones } = useImages();

  const getMilestoneDetails = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          badge: 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          accent: 'border-l-4 border-l-emerald-500',
        };
      case 'in-progress':
        return {
          badge: 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300',
          icon: <Clock className="w-5 h-5 text-cyan-400 animate-spin" />,
          accent: 'border-l-4 border-l-cyan-500',
        };
      case 'future':
      default:
        return {
          badge: 'bg-purple-950/70 border-purple-500/50 text-purple-300',
          icon: <Sparkles className="w-5 h-5 text-purple-400" />,
          accent: 'border-l-4 border-l-purple-500',
        };
    }
  };

  return (
    <section id="roadmap" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-gray-900 bg-gradient-to-b from-[#02050c] via-[#050914] to-[#02050c] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-emerald-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-sm">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>LEARNING HORIZON // 2026 ROADMAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
            {mode === 'hi'
              ? 'मेरी सीखने की यात्रा'
              : mode === 'en'
              ? 'Learning Journey & Roadmap'
              : 'Learning Journey / मेरी सीखने की यात्रा'}
          </h2>
          <p className="text-sm sm:text-base font-mono text-gray-400 max-w-2xl mx-auto">
            {mode === 'hi'
              ? 'शुरुआती बुनियादी बातों से लेकर स्वायत्त AI प्रणालियों तक का चरणबद्ध विकास'
              : 'Phased evolution from fundamental scripting to advanced autonomous AI systems'}
          </p>
        </div>

        {/* Milestones Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {milestones.map((m, idx) => {
            const details = getMilestoneDetails(m.status);
            return (
              <div
                key={m.id || idx}
                className={`cyber-card p-6 rounded-2xl border border-gray-800 bg-gray-950/75 backdrop-blur-xl ${details.accent} space-y-4 hover:border-gray-700 transition duration-300 shadow-xl`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    {m.phase}
                  </span>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${details.badge}`}>
                    {details.icon}
                    <span>{mode === 'hi' ? m.statusTextHi : m.statusText}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-cyber font-bold text-xl text-white">
                    {mode === 'hi' ? m.titleHi : m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed font-sans">
                    {mode === 'hi' ? m.descriptionHi : m.description}
                  </p>
                </div>

                {m.topics && m.topics.length > 0 && (
                  <div className="pt-2 border-t border-gray-800/80">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1.5">
                      Core Target Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.topics.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
