import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { sound } from '../audio/SoundEffects';
import {
  Compass,
  GraduationCap,
  Terminal,
  Brain,
  Rocket,
  Wrench,
  Sparkles,
  Target
} from 'lucide-react';

export const VisionSection: React.FC = () => {
  const { mode } = useLanguage();

  const goals = [
    {
      num: '01',
      title: 'Class 12 Academic Excellence',
      titleHi: 'कक्षा 12 में मजबूत शैक्षणिक आधार',
      desc: 'Continue Class 12 Science studies under the Bihar Board with high discipline, mastering core physics, chemistry, and mathematics.',
      descHi: 'बिहार बोर्ड से कक्षा 12 (साइंस) की पढ़ाई को लगन से पूरा करना और गणित व विज्ञान के मूल सिद्धांतों में महारत हासिल करना।',
      icon: <GraduationCap className="w-5 h-5 text-cyan-400" />,
      border: 'hover:border-cyan-500/50',
    },
    {
      num: '02',
      title: 'Deepen Python & Software Fundamentals',
      titleHi: 'पायथन और सॉफ्टवेयर सिद्धांतों में गहराई',
      desc: 'Master object-oriented design, algorithms, complexity analysis, modular architecture, and write production-grade code every day.',
      descHi: 'ऑब्जेक्ट ओरिएंटेड प्रोग्रामिंग, एल्गोरिदम, और कोड क्लीनलीनेस में निरंतर सुधार करना।',
      icon: <Terminal className="w-5 h-5 text-purple-400" />,
      border: 'hover:border-purple-500/50',
    },
    {
      num: '03',
      title: 'Master ML, Deep Learning & LLMs',
      titleHi: 'ML, डीप लर्निंग और LLMs में दक्षता',
      desc: 'Transition from foundations to mathematical intuition, training neural networks, understanding transformers, and designing AI agents.',
      descHi: 'मशीन लर्निंग मॉडल, डीप न्यूरल नेटवर्क्स और आधुनिक LLMs की तकनीकी बारीकियों को समझना।',
      icon: <Brain className="w-5 h-5 text-pink-400" />,
      border: 'hover:border-pink-500/50',
    },
    {
      num: '04',
      title: 'Ship, Test & Deploy Real Projects',
      titleHi: 'असली प्रोजेक्ट्स का निर्माण और सफल डिप्लॉयमेंट',
      desc: 'Turn ideas into working code: deploy web applications on Render, publish Android utilities, and maintain open-source GitHub repositories.',
      descHi: 'सिर्फ प्रोटोटाइप नहीं, बल्कि रेंडर पर लाइव ऐप्स और गिटहब पर सक्रिय रिपॉजिटरी तैयार करना।',
      icon: <Rocket className="w-5 h-5 text-emerald-400" />,
      border: 'hover:border-emerald-500/50',
    },
    {
      num: '05',
      title: 'Build Useful AI-Powered Products',
      titleHi: 'उपयोगी AI-संचालित उत्पादों का निर्माण',
      desc: 'Focus on technology that helps people learn, automates tedious tasks, ensures digital safety, and solves tangible problems.',
      descHi: 'ऐसे AI टूल्स और ऐप्स बनाना जो लोगों के दैनिक जीवन को आसान, सुरक्षित और उपयोगी बनाएं।',
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      border: 'hover:border-amber-500/50',
    },
    {
      num: '06',
      title: 'Evolve into a Full-Scale AI Engineer',
      titleHi: 'पूर्ण AI Engineer बनने का लक्ष्य',
      desc: 'Bridge the gap between modern research, cloud systems, and applied engineering to lead impactful technology innovations.',
      descHi: 'अनुसंधान और व्यावहारिक सॉफ्टवेयर इंजीनियरिंग के बीच सेतु बनकर एक सफल AI Engineer बनना।',
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      border: 'hover:border-indigo-500/50',
    },
  ];

  return (
    <section id="vision" className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-gray-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Target className="w-3.5 h-3.5" />
            <span>VISION_HORIZON // 06</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
            {mode === 'hi'
              ? 'मेरे लक्ष्य एवं भविष्य की दृष्टि'
              : mode === 'en'
              ? 'Goals & Future Vision'
              : 'Goals & Future Vision / मेरे लक्ष्य'}
          </h2>
          <p className="text-sm sm:text-base font-mono text-gray-400 max-w-2xl mx-auto">
            {mode === 'hi'
              ? 'कक्षा 12 से लेकर पेशेवर AI इंजीनियर बनने तक की स्पष्ट प्रतिबद्धता'
              : 'Clear commitments from academic excellence in Class 12 to becoming a professional AI Engineer'}
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g, idx) => (
            <div
              key={idx}
              onMouseEnter={() => sound.playHover()}
              className={`cyber-card p-6 rounded-2xl space-y-3 group hover:-translate-y-1 transition duration-200 border border-gray-800 ${g.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800">
                  {g.icon}
                </div>
                <span className="font-cyber font-black text-xl text-gray-700 group-hover:text-cyan-400/60 transition">
                  {g.num}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-cyber font-bold text-white text-base group-hover:text-cyan-300 transition">
                  {mode === 'hi' ? g.titleHi : g.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {mode === 'hi' ? g.descHi : g.desc}
                </p>
                {mode === 'both' && (
                  <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-800/80 pt-2">
                    {g.descHi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
