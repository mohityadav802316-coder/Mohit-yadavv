import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import {
  GraduationCap,
  Sparkles,
  Target,
  Code,
  Compass,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Award,
  BookOpen
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { mode } = useLanguage();
  const { mainProfileImage, siteSettings } = useImages();
  const profile = siteSettings.profile;
  const localPhotoUrl = typeof window !== 'undefined' ? localStorage.getItem('mohit_profile_photo') || '' : '';

  const displayPhotoUrl = mainProfileImage?.downloadUrl || localPhotoUrl;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-gray-800/80 bg-gradient-to-b from-[#020408] via-[#05070f] to-[#020408]">
      {/* Scene B — Luxury Dark Chrome Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-slate-400/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-mono shadow-sm">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCENE B // LUXURY DOSSIER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
            {mode === 'hi'
              ? 'मेरे बारे में'
              : mode === 'en'
              ? 'About Me'
              : 'About Me / मेरे बारे में'}
          </h2>
          <p className="text-sm sm:text-base font-mono text-slate-400 max-w-2xl mx-auto">
            {mode === 'hi'
              ? 'शैक्षणिक पृष्ठभूमि, तकनीक में रुचि और भावी लक्ष्य'
              : 'Academic Background, Tech Passion & Future AI Aspirations'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Profile Photo Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-[340px] aspect-[4/5] rounded-3xl p-1 bg-gradient-to-b from-slate-400/30 via-slate-700/20 to-cyan-500/30 shadow-2xl shadow-black/80">
              <div className="w-full h-full bg-gray-950 rounded-[22px] overflow-hidden relative flex flex-col items-center justify-center border border-slate-800">
                {displayPhotoUrl ? (
                  <img
                    src={displayPhotoUrl}
                    alt="Mohit Yadav - Official Portrait"
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-700"
                  />
                ) : (
                  /* Stylized Luxury Placeholder Card */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-gray-950 via-slate-900/60 to-gray-950">
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg shadow-cyan-950/30 group-hover:scale-105 transition duration-300">
                      <Camera className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-cyber font-bold text-lg text-white block">
                        MOHIT YADAV
                      </span>
                      <span className="text-xs font-mono text-cyan-300 block">
                        Official Portrait
                      </span>
                      <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto pt-1 font-sans">
                        Class 12 Science Student, Bihar Board
                      </p>
                    </div>
                  </div>
                )}

                {/* Chrome Corner Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-400 pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-400 pointer-events-none" />

                {/* Bottom Overlay Pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-gray-950/90 border border-slate-800/80 p-2.5 rounded-xl backdrop-blur-md flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {mainProfileImage ? 'STORAGE VERIFIED' : 'STATUS: ACTIVE'}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    BSEB SCIENCE
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-400 mt-3 text-center">
              Official Profile // Class 12 Science (Bihar Board)
            </p>
          </div>

          {/* Right Column: Background Story, Education & Interests */}
          <div className="lg:col-span-7 space-y-6">
            {/* Education Card */}
            <div className="cyber-card p-6 rounded-2xl space-y-3 border border-slate-800 hover:border-slate-700 bg-slate-950/60 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cyber font-bold text-white text-base sm:text-lg">
                    {mode === 'hi' ? 'शिक्षा और पृष्ठभूमि' : 'Education & Foundation'}
                  </h3>
                  <span className="text-xs font-mono text-purple-300">
                    Class 12 Science Student // Bihar Board (BSEB)
                  </span>
                </div>
              </div>

              <div className="text-sm text-slate-300 space-y-2 leading-relaxed font-sans">
                {(mode === 'both' || mode === 'en') && (
                  <p>
                    Currently pursuing Class 12 Science under the Bihar Board, building a solid grounding in scientific principles, mathematics, and logical reasoning alongside daily software engineering practice.
                  </p>
                )}
                {(mode === 'both' || mode === 'hi') && (
                  <p className={mode === 'both' ? 'border-t border-slate-800/80 pt-2 text-slate-400' : ''}>
                    वर्तमान में बिहार बोर्ड के तहत कक्षा 12 (साइंस) की पढ़ाई कर रहा हूँ। विज्ञान, गणित और तार्किक सोच की मजबूत नींव के साथ-साथ कोडिंग और सॉफ्टवेयर डेवलपमेंट में लगातार काम कर रहा हूँ।
                  </p>
                )}
              </div>
            </div>

            {/* Career Ambition & Passion */}
            <div className="cyber-card p-6 rounded-2xl space-y-3 border border-slate-800 hover:border-cyan-500/40 bg-slate-950/60 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cyber font-bold text-white text-base sm:text-lg">
                    {mode === 'hi' ? 'करियर लक्ष्य एवं दृष्टि' : 'Career Goal & Ambition'}
                  </h3>
                  <span className="text-xs font-mono text-cyan-300">
                    Aspiring AI Engineer // Product Creator
                  </span>
                </div>
              </div>

              <div className="text-sm text-slate-300 space-y-2 leading-relaxed font-sans">
                {(mode === 'both' || mode === 'en') && (
                  <p>
                    My core ambition is to become a world-class AI Engineer and engineer real, production-ready AI products that solve practical everyday problems. I focus on hands-on creation rather than passive reading.
                  </p>
                )}
                {(mode === 'both' || mode === 'hi') && (
                  <p className={mode === 'both' ? 'border-t border-slate-800/80 pt-2 text-slate-400' : ''}>
                    मेरा मुख्य लक्ष्य एक कुशल AI Engineer बनना और ऐसे असली AI-powered उत्पाद तैयार करना है जो लोगों के वास्तविक जीवन की समस्याओं का समाधान करें। केवल सिद्धांत नहीं, बल्कि व्यावहारिक निर्माण मेरी प्राथमिकता है।
                  </p>
                )}
              </div>
            </div>

            {/* My Real Interests */}
            <div className="cyber-card p-6 rounded-2xl space-y-3 border border-slate-800 hover:border-pink-500/40 bg-slate-950/60 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/30">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cyber font-bold text-white text-base sm:text-lg">
                    {mode === 'hi' ? 'तकनीकी रुचियां' : 'Core Technology Interests'}
                  </h3>
                  <span className="text-xs font-mono text-pink-300">
                    What drives my daily curiosity
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { en: 'AI Engineering & Agents', hi: 'AI इंजीनियरिंग और एजेंट्स' },
                  { en: 'Python Programming', hi: 'पायथन प्रोग्रामिंग' },
                  { en: 'Web & App Architecture', hi: 'वेब और ऐप आर्किटेक्चर' },
                  { en: 'Intelligent Automation', hi: 'ऑटोमेशन और टूल्स' },
                  { en: 'Creative AI Media', hi: 'AI मीडिया जनरेशन' },
                  { en: '3D Game Development', hi: '3D गेम डेवलपमेंट' },
                  { en: 'Defensive Security', hi: 'डिफेंसिव साइबर सुरक्षा' },
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-gray-900/90 border border-slate-800 text-xs font-mono text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
                  >
                    {mode === 'hi' ? item.hi : mode === 'en' ? item.en : `${item.en} / ${item.hi}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
