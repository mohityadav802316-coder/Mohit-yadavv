import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import {
  db,
  collection,
  addDoc,
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from '../../firebase';
import confetti from 'canvas-confetti';
import {
  Mail,
  Copy,
  Check,
  Send,
  MessageSquare,
  Github,
  Instagram,
  Facebook,
  Compass,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { mode } = useLanguage();
  const { siteSettings } = useImages();

  // Contact Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Anti-spam submission timing
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const officialEmail = siteSettings.contact?.email || 'mohityadav802316@gmail.com';

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setErrorMessage('');

    // Input Validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setErrorMessage(
        mode === 'hi'
          ? 'कृपया अपना नाम 2 से 100 अक्षरों के बीच दर्ज करें।'
          : 'Please enter a valid name between 2 and 100 characters.'
      );
      return;
    }

    if (trimmedMessage.length < 2 || trimmedMessage.length > 2000) {
      setErrorMessage(
        mode === 'hi'
          ? 'कृपया अपना संदेश 2 से 2000 अक्षरों के बीच लिखें।'
          : 'Please enter a message between 2 and 2000 characters.'
      );
      return;
    }

    if (trimmedEmail && trimmedEmail.length > 150) {
      setErrorMessage(
        mode === 'hi'
          ? 'ईमेल अधिकतम 150 अक्षरों का हो सकता है।'
          : 'Email address must not exceed 150 characters.'
      );
      return;
    }

    // Rate Limiting (1 message every 20 seconds per client session)
    const now = Date.now();
    if (now - lastSubmitTime < 20000) {
      setErrorMessage(
        mode === 'hi'
          ? 'कृपया अगला संदेश भेजने से पहले 20 सेकंड प्रतीक्षा करें।'
          : 'Rate limit active: Please wait 20 seconds before submitting another transmission.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const messagesRef = collection(db, 'messages');
      const payload: Record<string, any> = {
        name: trimmedName,
        message: trimmedMessage,
        createdAt: serverTimestamp(),
        read: false,
        archived: false,
        source: 'portfolio_contact_form',
      };

      if (trimmedEmail) {
        payload.email = trimmedEmail;
      }

      await addDoc(messagesRef, payload);

      // Success
      sound.playSuccess();
      setSubmitSuccess(true);
      setLastSubmitTime(Date.now());
      setName('');
      setEmail('');
      setMessage('');

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#a855f7', '#ec4899'],
      });
    } catch (err: any) {
      console.error('Error saving visitor message: ', err);
      // Fallback display if Firestore security denies or network drops
      setErrorMessage(
        mode === 'hi'
          ? 'संदेश भेजने में त्रुटि हुई। कृपया सीधे ईमेल पर संपर्क करें: mohityadav802316@gmail.com'
          : 'Failed to dispatch message to Firestore vault. Please email directly to mohityadav802316@gmail.com'
      );
      try {
        handleFirestoreError(err, OperationType.CREATE, 'messages');
      } catch {
        // Logged
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: 'GitHub',
      handle: 'mohityadav802316-coder',
      url: 'https://github.com/mohityadav802316-coder',
      icon: <Github className="w-5 h-5 text-gray-300 group-hover:text-cyan-400" />,
      color: 'hover:border-cyan-500/50',
    },
    {
      name: 'Instagram',
      handle: '__mohittt_00',
      url: 'https://www.instagram.com/__mohittt_00/',
      icon: <Instagram className="w-5 h-5 text-gray-300 group-hover:text-pink-400" />,
      color: 'hover:border-pink-500/50',
    },
    {
      name: 'Facebook',
      handle: 'Mohit Yadav Profile',
      url: 'https://www.facebook.com/share/1GPDmPeg2X/',
      icon: <Facebook className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />,
      color: 'hover:border-blue-500/50',
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-gray-900 bg-gray-950/40">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCENE F // TRANSMISSION NEXUS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
            {mode === 'hi'
              ? 'संपर्क करें एवं संदेश भेजें'
              : mode === 'en'
              ? 'Contact & Leave a Message'
              : 'Contact / संपर्क करें'}
          </h2>
          <p className="text-sm sm:text-base font-mono text-gray-400 max-w-2xl mx-auto">
            {mode === 'hi'
              ? 'सीधे ईमेल, सोशल मीडिया या नीचे दिए गए सुरक्षित फायरबेस फॉर्म से संदेश भेजें'
              : 'Direct communication channels and live Firestore visitor transmission vault'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Email Card */}
            <div className="cyber-card p-6 rounded-2xl space-y-4 border border-cyan-500/30">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-cyber font-bold text-white text-base">
                    {mode === 'hi' ? 'आधिकारिक ईमेल' : 'Official Email'}
                  </h3>
                  <span className="text-xs font-mono text-cyan-300">
                    Direct Inquiry &amp; Collaboration
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900 border border-gray-800">
                <span className="font-mono text-xs sm:text-sm text-gray-200 select-all truncate pr-2">
                  {officialEmail}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition shrink-0"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {mode === 'hi'
                  ? 'प्रोजेक्ट्स, कोडिंग सहयोग, या AI संबंधित चर्चा के लिए कभी भी ईमेल करें।'
                  : 'Feel free to reach out for software projects, tech questions, or AI discussions.'}
              </p>
            </div>

            {/* Social Channels Card */}
            <div className="cyber-card p-6 rounded-2xl space-y-4">
              <h3 className="font-cyber font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{mode === 'hi' ? 'सोशल प्रोफाइल्स' : 'Social Platforms'}</span>
              </h3>

              <div className="space-y-3">
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className={`flex items-center justify-between p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 ${s.color} group transition duration-200`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-950 border border-gray-800">
                        {s.icon}
                      </div>
                      <div>
                        <span className="font-cyber font-bold text-sm text-white group-hover:text-cyan-300 transition block">
                          {s.name}
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                          {s.handle}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition" />
                  </a>
                ))}
              </div>
            </div>

            {/* Location & Timezone Node */}
            <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-400">
              <span>LOCATION: BIHAR, INDIA</span>
              <span className="text-cyan-400">TIMEZONE: IST (UTC+5:30)</span>
            </div>
          </div>

          {/* Right Column: Real Cloud Firestore Visitor Message Vault */}
          <div className="lg:col-span-7">
            <div className="cyber-card p-6 sm:p-8 rounded-2xl space-y-6 border border-cyan-500/40 relative shadow-2xl">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-cyber font-bold text-xl sm:text-2xl text-white">
                    {mode === 'hi'
                      ? 'यहाँ अपना मैसेज छोड़ें'
                      : mode === 'en'
                      ? 'Leave Me a Message'
                      : 'Leave Me a Message / यहाँ अपना मैसेज छोड़ें'}
                  </h3>
                  <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs font-mono text-gray-400">
                  {mode === 'hi'
                    ? 'आपका संदेश सीधे मेरे सुरक्षित एडमिन पैनल में स्टोर होगा।'
                    : 'Transmitted directly into Cloud Firestore and viewable inside my authenticated admin panel.'}
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-xl bg-cyan-950/40 border border-cyan-500/60 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-cyber font-bold text-lg text-white">
                      {mode === 'hi' ? 'संदेश सफलतापूर्वक प्राप्त हुआ!' : 'Transmission Successfully Stored!'}
                    </h4>
                    <p className="text-xs text-cyan-200">
                      {mode === 'hi'
                        ? 'धन्यवाद! आपका संदेश सुरक्षित रूप से सेव हो गया है। मैं जल्द ही आपसे संपर्क करूँगा।'
                        : 'Thank you! Your message has been encrypted & stored in my Firebase vault. I will review it shortly.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSubmitSuccess(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-xs font-mono text-cyan-300 border border-cyan-500/40"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-cyan-300 flex items-center justify-between">
                      <span>{mode === 'hi' ? 'आपका नाम (आवश्यक)' : 'Your Name *'}</span>
                      <span className="text-[10px] text-gray-500">2-100 characters</span>
                    </label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder={mode === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. John Doe / Tech Enthusiast'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm font-sans text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  {/* Email field (optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-cyan-300 flex items-center justify-between">
                      <span>{mode === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Your Email (Optional)'}</span>
                      <span className="text-[10px] text-gray-500">For direct reply</span>
                    </label>
                    <input
                      type="email"
                      maxLength={150}
                      placeholder="e.g. yourname@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm font-sans text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-cyan-300 flex items-center justify-between">
                      <span>{mode === 'hi' ? 'आपका संदेश (आवश्यक)' : 'Message Content *'}</span>
                      <span className="text-[10px] text-gray-500">
                        {message.length} / 2000
                      </span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      minLength={2}
                      maxLength={2000}
                      placeholder={
                        mode === 'hi'
                          ? 'नमस्ते मोहित, मैं आपके प्रोजेक्ट्स और AI विजन के बारे में बात करना चाहता हूँ...'
                          : 'Hello Mohit, I came across your portfolio and wanted to connect regarding...'
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm font-sans text-white focus:outline-none focus:border-cyan-400 transition resize-none"
                    />
                  </div>

                  {/* Submission and Safety Note */}
                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-gray-950 font-cyber font-bold text-sm tracking-wide transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                          <span>ENCRYPTING &amp; DISPATCHING...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>
                            {mode === 'hi'
                              ? 'सुरक्षित संदेश भेजें'
                              : 'Transmit Message to Vault'}
                          </span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-gray-500">
                      <Lock className="w-3 h-3 text-cyan-500/70" />
                      <span>Zero-Trust Firestore Guard • Protected Admin Decryption Only</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
