import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import {
  Code,
  Terminal,
  Cpu,
  BrainCircuit,
  Layers,
  Wrench,
  BookOpen,
  Sparkles,
  GitBranch,
  Cloud,
  Database,
  Compass,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { mode } = useLanguage();
  const { skills } = useImages();
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'tools' | 'learning'>('all');

  const filteredSkills = skills.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const getSkillIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'terminal':
      case 'code':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'braincircuit':
      case 'brain':
        return <BrainCircuit className="w-5 h-5 text-purple-400" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'code2':
      case 'gitbranch':
        return <GitBranch className="w-5 h-5 text-cyan-400" />;
      case 'globe':
      case 'cloud':
        return <Cloud className="w-5 h-5 text-blue-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      default:
        return <Code className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'current':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            {mode === 'hi' ? 'सक्रिय दक्षता' : 'Active Skill'}
          </span>
        );
      case 'tools':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
            {mode === 'hi' ? 'टूल एवं डिप्लॉय' : 'Toolchain'}
          </span>
        );
      case 'learning':
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/80 border border-pink-500/40 text-pink-300">
            {mode === 'hi' ? 'सक्रिय अध्ययन' : 'Active Study'}
          </span>
        );
    }
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-gray-900 bg-gradient-to-b from-[#02050c] via-[#050b1a] to-[#02050c] overflow-hidden">
      {/* Scene C — Holographic Lab Atmosphere & Hex Grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-mono shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>SCENE C // AI ENGINEER NEURAL LABORATORY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
            {mode === 'hi'
              ? 'मेरी स्किल्स एवं टूल्स'
              : mode === 'en'
              ? 'Skills & Tech Stack'
              : 'Skills / मेरी स्किल्स'}
          </h2>
          <p className="text-sm sm:text-base font-mono text-gray-400 max-w-2xl mx-auto">
            {mode === 'hi'
              ? 'वास्तविक ज्ञान और सक्रिय अध्ययन क्षेत्र (कोई बनावटी प्रतिशत नहीं)'
              : 'Genuine competencies and active study domains (Honest evaluation — zero fake percentages)'}
          </p>

          {/* Holographic Diagnostic Bar */}
          <div className="max-w-xl mx-auto flex items-center justify-between p-3 rounded-xl bg-gray-950/80 border border-purple-500/30 text-xs font-mono text-gray-400 mt-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-300">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>CORE ARCHITECTURE: PYTHON 3.12+</span>
            </div>
            <div className="flex items-center gap-2 text-pink-300">
              <Zap className="w-4 h-4 text-pink-400" />
              <span>HORIZON: LLM AGENTS &amp; DEEP LEARNING</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', labelEn: 'All Domains', labelHi: 'सभी क्षेत्र' },
              { id: 'current', labelEn: 'Current Skills', labelHi: 'वर्तमान स्किल्स' },
              { id: 'tools', labelEn: 'Tools & Platforms', labelHi: 'टूल्स एवं प्लेटफॉर्म' },
              { id: 'learning', labelEn: 'Currently Learning', labelHi: 'अध्ययनरत विषय' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                  activeTab === tab.id
                    ? 'bg-purple-500/25 text-purple-300 border border-purple-400 shadow-sm shadow-purple-500/30'
                    : 'bg-gray-900/70 text-gray-400 border border-gray-800 hover:text-gray-200'
                }`}
              >
                {mode === 'hi' ? tab.labelHi : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, idx) => (
            <div
              key={skill.id || idx}
              className="cyber-card rounded-2xl border border-gray-800 hover:border-purple-500/50 bg-gradient-to-b from-gray-950/90 via-gray-900/60 to-gray-950/90 p-5 space-y-4 group transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 shadow-sm">
                  {getSkillIcon(skill.icon)}
                </div>
                {getCategoryBadge(skill.category)}
              </div>

              <div>
                <h3 className="font-cyber font-bold text-lg text-white group-hover:text-purple-300 transition">
                  {mode === 'hi' ? skill.nameHi : skill.name}
                </h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed font-sans">
                  {mode === 'hi' ? skill.descriptionHi : skill.description}
                </p>
              </div>

              {skill.highlights && skill.highlights.length > 0 && (
                <div className="pt-2 border-t border-gray-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {skill.highlights.map((h, hIdx) => (
                      <span
                        key={hIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
