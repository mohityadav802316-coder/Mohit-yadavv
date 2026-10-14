import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import { ProjectItem } from '../../types';
import {
  FolderGit2,
  ExternalLink,
  MessageSquare,
  Activity,
  ShieldCheck,
  Sparkles,
  Gamepad2,
  Globe,
  Tag,
  CheckCircle,
  Clock,
  X,
  Code2,
  ArrowRight,
  Terminal,
  Zap,
  Lock,
  Compass
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { mode } = useLanguage();
  const { projects } = useImages();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const getStatusBadge = (status: ProjectItem['status'], statusHi: string) => {
    switch (status) {
      case 'Live Showcase':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            {mode === 'hi' ? statusHi : status}
          </span>
        );
      case 'Active Development':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/50">
            <Clock className="w-3 h-3 text-cyan-400" />
            {mode === 'hi' ? statusHi : status}
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-950/80 text-purple-300 border border-purple-500/50">
            <Clock className="w-3 h-3 text-purple-400" />
            {mode === 'hi' ? statusHi : status}
          </span>
        );
      case 'Concept':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-pink-950/80 text-pink-300 border border-pink-500/50">
            <Sparkles className="w-3 h-3 text-pink-400" />
            {mode === 'hi' ? statusHi : status}
          </span>
        );
    }
  };

  const getProjectTheme = (id: string) => {
    switch (id) {
      case 'pinchat':
        return {
          border: 'hover:border-cyan-400 border-cyan-950/80',
          gradient: 'from-cyan-950/40 via-gray-950 to-gray-950',
          glow: 'group-hover:shadow-cyan-500/20',
          accent: 'text-cyan-400',
          badge: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
          tagBg: 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300',
          icon: <MessageSquare className="w-6 h-6 text-cyan-400" />,
          conceptTag: 'REALTIME CHAT ARCHITECTURE',
        };
      case 'lifetracker':
        return {
          border: 'hover:border-emerald-400 border-emerald-950/80',
          gradient: 'from-emerald-950/40 via-gray-950 to-gray-950',
          glow: 'group-hover:shadow-emerald-500/20',
          accent: 'text-emerald-400',
          badge: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
          tagBg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
          icon: <Activity className="w-6 h-6 text-emerald-400" />,
          conceptTag: 'BIO-METRIC HABIT LOGIC',
        };
      case 'pornblocker':
        return {
          border: 'hover:border-rose-400 border-rose-950/80',
          gradient: 'from-rose-950/40 via-gray-950 to-gray-950',
          glow: 'group-hover:shadow-rose-500/20',
          accent: 'text-rose-400',
          badge: 'bg-rose-950/70 border-rose-500/40 text-rose-300',
          tagBg: 'bg-rose-950/40 border-rose-800/60 text-rose-300',
          icon: <ShieldCheck className="w-6 h-6 text-rose-400" />,
          conceptTag: 'DEFENSIVE CONTENT FILTER',
        };
      case 'aicreation':
        return {
          border: 'hover:border-purple-400 border-purple-950/80',
          gradient: 'from-purple-950/40 via-gray-950 to-gray-950',
          glow: 'group-hover:shadow-purple-500/20',
          accent: 'text-purple-400',
          badge: 'bg-purple-950/70 border-purple-500/40 text-purple-300',
          tagBg: 'bg-purple-950/40 border-purple-800/60 text-purple-300',
          icon: <Sparkles className="w-6 h-6 text-purple-400" />,
          conceptTag: 'MULTIMODAL AI LAB',
        };
      case '3dgame':
        return {
          border: 'hover:border-blue-400 border-blue-950/80',
          gradient: 'from-blue-950/40 via-gray-950 to-gray-950',
          glow: 'group-hover:shadow-blue-500/20',
          accent: 'text-blue-400',
          badge: 'bg-blue-950/70 border-blue-500/40 text-blue-300',
          tagBg: 'bg-blue-950/40 border-blue-800/60 text-blue-300',
          icon: <Gamepad2 className="w-6 h-6 text-blue-400" />,
          conceptTag: 'THREE.JS SPATIAL ENGINE',
        };
      case 'portfolio':
      default:
        return {
          border: 'hover:border-pink-400 border-pink-950/80',
          gradient: 'from-pink-950/40 via-gray-950 to-gray-950',
          glow: 'group-hover:shadow-pink-500/20',
          accent: 'text-pink-400',
          badge: 'bg-pink-950/70 border-pink-500/40 text-pink-300',
          tagBg: 'bg-pink-950/40 border-pink-800/60 text-pink-300',
          icon: <Globe className="w-6 h-6 text-pink-400" />,
          conceptTag: 'CYBERPUNK MATRIX CORE',
        };
    }
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-gray-900 bg-gradient-to-b from-[#02050c] via-[#040915] to-[#02050c] overflow-hidden">
      {/* Scene D — Ambient Nebula */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-600/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-purple-600/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-mono shadow-sm">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>SCENE D // PROJECT UNIVERSE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
            {mode === 'hi'
              ? 'प्रोजेक्ट्स एवं इनोवेशन'
              : mode === 'en'
              ? 'Projects & Innovations'
              : 'Projects / मेरे प्रोजेक्ट्स'}
          </h2>
          <p className="text-sm sm:text-base font-mono text-gray-400 max-w-2xl mx-auto">
            {mode === 'hi'
              ? 'वास्तविक निर्माण — 6 प्रमुख प्रोजेक्ट्स की तकनीकी रूपरेखा एवं विकास स्थिति'
              : 'Honest Architecture — The 6 Core Projects & Their Active Engineering Status'}
          </p>
        </div>

        {/* Projects Universe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => {
            const theme = getProjectTheme(project.id);
            return (
              <div
                key={project.id}
                className={`cyber-card rounded-2xl border ${theme.border} bg-gradient-to-b ${theme.gradient} p-6 flex flex-col justify-between group transition-all duration-300 hover:scale-[1.02] shadow-xl ${theme.glow}`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon, Category Badge & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800 shadow-md">
                      {theme.icon}
                    </div>
                    {getStatusBadge(project.status, project.statusHi)}
                  </div>

                  {/* Concept Tag */}
                  <span className="text-[10px] font-mono tracking-wider block text-gray-400">
                    {theme.conceptTag}
                  </span>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-cyber font-bold text-xl text-white group-hover:text-cyan-300 transition">
                      {mode === 'hi' ? project.titleHi : project.title}
                    </h3>
                    <p className={`text-xs font-mono mt-1 ${theme.accent}`}>
                      {mode === 'hi' ? project.subtitleHi : project.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans line-clamp-3">
                    {mode === 'hi' ? project.descriptionHi : project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${theme.tagBg}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-6 mt-4 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedProject(project);
                    }}
                    className={`font-cyber font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${theme.accent} hover:underline`}
                  >
                    <span>{mode === 'hi' ? 'गहन विवरण देखें' : 'Inspect Architecture'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {project.isAvailable && project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white transition"
                      title="GitHub Repository"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-gray-400">
                      {mode === 'hi' ? 'निर्माणाधीन' : 'In Dev'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Deep Architecture Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative max-w-2xl w-full bg-gray-950 border border-cyan-500/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40">
                  {getProjectTheme(selectedProject.id).icon}
                </div>
                <div>
                  <h4 className="font-cyber font-bold text-xl sm:text-2xl text-white">
                    {mode === 'hi' ? selectedProject.titleHi : selectedProject.title}
                  </h4>
                  <span className="text-xs font-mono text-cyan-400">
                    {mode === 'hi' ? selectedProject.subtitleHi : selectedProject.subtitle}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Scope */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-xs font-mono">
              <span className="text-gray-400">Current Phase:</span>
              {getStatusBadge(selectedProject.status, selectedProject.statusHi)}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Architectural Overview
              </h5>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                {selectedProject.description}
              </p>
              {mode !== 'en' && (
                <p className="text-sm text-gray-400 leading-relaxed font-sans border-t border-gray-900 pt-2">
                  {selectedProject.descriptionHi}
                </p>
              )}
            </div>

            {/* Key Technical Features */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Planned &amp; Active Capabilities</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-gray-300 font-sans">
                {(mode === 'hi' ? selectedProject.featuresHi : selectedProject.features).map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Outcome */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono space-y-1">
              <span className="text-cyan-300 font-bold block">Target Engineering Outcome:</span>
              <p className="text-gray-300 font-sans">
                {mode === 'hi' ? selectedProject.targetOutcomeHi : selectedProject.targetOutcome}
              </p>
            </div>

            {/* External Links */}
            <div className="flex justify-end pt-2">
              {selectedProject.isAvailable && selectedProject.githubUrl ? (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-mono text-gray-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Repository in active local development — verified showcase</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
