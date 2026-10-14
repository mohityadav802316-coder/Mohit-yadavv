import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { sound } from '../audio/SoundEffects';
import {
  ShieldCheck,
  Lock,
  Terminal,
  Activity,
  KeyRound,
  EyeOff,
  Cpu,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const CyberSecuritySection: React.FC = () => {
  const { mode } = useLanguage();
  const [testInput, setTestInput] = useState('Mohit-Cyber-Defense-Protocol-2026');
  const [activeTab, setActiveTab] = useState<'integrity' | 'zerotrust' | 'network' | 'auth'>('integrity');
  const [isVerifying, setIsVerifying] = useState(false);

  // Simple simulated defensive cryptographic hash for demo
  const computeSimpleHash = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `SHA256: 0x${hex}9a4f7e2c8b1d3f6a5e0b...[VERIFIED]`;
  };

  const handleSimulateCheck = () => {
    sound.playClick();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      sound.playSuccess();
    }, 600);
  };

  const defensivePillars = [
    {
      id: 'integrity',
      title: 'Cryptographic Integrity',
      titleHi: 'क्रिप्टोग्राफ़िक डेटा अखंडता',
      icon: <KeyRound className="w-5 h-5 text-cyan-400" />,
      desc: 'Ensuring data transmission cannot be tampered with in transit using SHA-256 verification and digital signatures.',
      descHi: 'SHA-256 और डिजिटल हस्ताक्षरों का उपयोग कर यह सुनिश्चित करना कि डेटा के साथ कोई छेड़छाड़ न हो सके।',
      spec: 'SHA-256 / HMAC / TLS 1.3 Strict',
      badge: 'DEFENSIVE'
    },
    {
      id: 'zerotrust',
      title: 'Zero-Trust Architecture',
      titleHi: 'ज़ीरो-ट्रस्ट सुरक्षा सिद्धांत',
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      desc: 'Never trust, always verify. Strict identity validation and granular role-based access control (RBAC).',
      descHi: 'कभी भी अंधविश्वास न करें, हमेशा सत्यापन करें। कड़े प्रमाणीकरण और भूमिका-आधारित एक्सेस कंट्रोल (RBAC)।',
      spec: 'Least Privilege / Token Verification',
      badge: 'GOVERNANCE'
    },
    {
      id: 'network',
      title: 'Defensive Traffic Analysis',
      titleHi: 'सुरक्षात्मक नेटवर्क विश्लेषण',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      desc: 'Monitoring anomalous request spikes, rate-limiting DDoS patterns, and securing API gateway perimeters.',
      descHi: 'असामान्य ट्रैफ़िक स्पाइक्स की निगरानी, DDoS रोकथाम और API गेटवे को सुरक्षित रखना।',
      spec: 'Rate Limiting / Anomaly Detection',
      badge: 'MONITORING'
    },
    {
      id: 'auth',
      title: 'Secure Authentication & Secrets',
      titleHi: 'सुरक्षित प्रमाणीकरण और सीक्रेट्स',
      icon: <ShieldCheck className="w-5 h-5 text-pink-400" />,
      desc: 'Hardware security keys, OAuth 2.0 PKCE, server-side secret isolation, and prevention of injection vulnerabilities.',
      descHi: 'OAuth 2.0, सर्वर-साइड सीक्रेट आइसोलेशन और डेटाबेस इंजेक्शन से पूर्ण बचाव।',
      spec: 'OAuth 2.0 / Firebase Auth Rules',
      badge: 'ETHICAL SEC'
    }
  ];

  return (
    <section id="cybersecurity" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-cyan-900/40 bg-gradient-to-b from-[#02050c] via-[#050b18] to-[#02050c] overflow-hidden">
      {/* Scene 2 — Cyber Defense Matrix Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />
      <div className="absolute -top-40 right-10 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-md shadow-cyan-950/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SCENE 2 // DEFENSIVE CYBER &amp; DIGITAL SECURITY</span>
            <span className="text-gray-500">•</span>
            <span className="text-emerald-400">ETHICAL BY DESIGN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cyber font-bold text-white tracking-wide">
            {mode === 'hi' ? (
              <>
                साइबर सुरक्षा एवं{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 neon-text-cyan">
                  डिफेंसिव सिस्टम्स
                </span>
              </>
            ) : mode === 'en' ? (
              <>
                Cyber Defense &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 neon-text-cyan">
                  Digital Security
                </span>
              </>
            ) : (
              <>
                Cyber Defense &amp; Digital Security /{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  डिफेंसिव सुरक्षा
                </span>
              </>
            )}
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
            {mode === 'hi'
              ? 'डिजिटल संपत्तियों की सुरक्षा, डेटा अखंडता और नैतिक साइबर रक्षा सिद्धांतों का अध्ययन। हम केवल वैध और रक्षात्मक सुरक्षा तकनीकों का समर्थन करते हैं।'
              : 'Studying defensive cybersecurity, cryptographic verification, and robust application architecture. Focused strictly on protecting users and securing digital systems.'}
          </p>
        </div>

        {/* 4 Defensive Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defensivePillars.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(pillar.id as any);
              }}
              className={`cyber-card p-6 rounded-2xl transition duration-300 cursor-pointer flex flex-col justify-between border ${
                activeTab === pillar.id
                  ? 'border-cyan-400 bg-gray-900/90 shadow-lg shadow-cyan-500/20'
                  : 'border-cyan-900/40 bg-gray-950/70 hover:border-cyan-500/50 hover:bg-gray-900/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
                    {pillar.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-cyber font-bold text-white text-base">
                    {mode === 'hi' ? pillar.titleHi : pillar.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {mode === 'hi' ? pillar.descHi : pillar.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>{pillar.spec}</span>
                <span className="text-xs">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Defensive Security Terminal Simulator */}
        <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-gray-950/85 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/50">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-cyber font-bold text-white text-base flex items-center gap-2">
                  DEFENSIVE TELEMETRY &amp; HASH VERIFICATION CONSOLE
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    ACTIVE
                  </span>
                </h4>
                <p className="text-xs font-mono text-gray-400">
                  Simulating packet signature verification and tamper detection.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>TLS 1.3 SECURED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Simulation */}
            <div className="lg:col-span-6 space-y-4">
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wide">
                Test Data Payload for Integrity Hash
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="w-full bg-gray-900 border border-cyan-500/40 rounded-xl px-4 py-3 text-sm font-mono text-cyan-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  placeholder="Enter custom string to calculate defensive hash..."
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSimulateCheck}
                  disabled={isVerifying}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400 text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Verifying Integrity...' : 'Calculate Cryptographic Hash'}</span>
                </button>

                <span className="text-[11px] font-mono text-gray-400">
                  Payload length: {testInput.length} bytes
                </span>
              </div>
            </div>

            {/* Verification Result Output */}
            <div className="lg:col-span-6 p-4 rounded-xl bg-gray-900/90 border border-gray-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-gray-400 border-b border-gray-800/80 pb-2">
                <span>SECURITY PROTOCOL LOG</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> NO TAMPERING DETECTED
                </span>
              </div>

              <div className="space-y-1.5 text-gray-300 pt-1">
                <div className="text-cyan-400">
                  &gt; Payload: &ldquo;{testInput}&rdquo;
                </div>
                <div className="text-emerald-300 break-all font-semibold">
                  &gt; Output: {computeSimpleHash(testInput)}
                </div>
                <div className="text-gray-400 text-[11px]">
                  &gt; Defensive Rules: Deny by default, explicit allowlist, verified auth tokens.
                </div>
              </div>
            </div>
          </div>

          {/* Ethical Notice Disclaimer */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-gray-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">Ethical Security Standard:</span>
              <p className="text-gray-400 leading-relaxed font-sans">
                This project upholds defensive and ethical cybersecurity practices. All techniques explore secure software architecture, authentication hardening, and data protection in compliance with cyber laws and educational guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
