import React, { useState } from 'react';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import { ProfileSettings } from '../../types';
import {
  User as UserIcon,
  Save,
  CheckCircle2,
  GraduationCap,
  Target,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

export const AdminProfileManager: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useImages();
  const profile = siteSettings.profile;

  const [formData, setFormData] = useState<ProfileSettings>({
    name: profile?.name || 'Mohit Yadav',
    title: profile?.title || 'Future AI Engineer | Python Developer | Web & App Creator',
    titleHi: profile?.titleHi || 'भावी AI इंजीनियर | पायथन डेवलपर | वेब एवं ऐप क्रिएटर',
    bioEn: profile?.bioEn || "I'm an aspiring AI Engineer and Python developer passionate about building applications, websites, AI-powered tools, and futuristic digital experiences.",
    bioHi: profile?.bioHi || 'मैं एक aspiring AI Engineer और Python Developer हूँ। मुझे apps, websites, AI-powered tools और futuristic digital experiences बनाना पसंद है।',
    education: profile?.education || 'Class 12 Science Student',
    educationHi: profile?.educationHi || 'कक्षा 12 विज्ञान का छात्र',
    academicBoard: profile?.academicBoard || 'Bihar Board (BSEB)',
    targetRole: profile?.targetRole || 'Future AI Engineer & Tech Innovator',
    targetRoleHi: profile?.targetRoleHi || 'भावी AI इंजीनियर एवं तकनीकी निर्माता',
    careerGoalsEn: profile?.careerGoalsEn || [
      'Master Advanced Python and foundational mathematics for AI and Machine Learning.',
      'Build practical AI solutions, intelligent automation tools, and real-time apps.',
      'Pursue higher university education in Computer Science and Artificial Intelligence.',
    ],
    careerGoalsHi: profile?.careerGoalsHi || [
      'AI और मशीन लर्निंग के लिए एडवांस्ड पायथन और बुनियादी गणित में महारत हासिल करना।',
      'व्यावहारिक AI समाधान, इंटेलिजेंट ऑटोमेशन टूल्स और रियल-टाइम ऐप्स बनाना।',
      'कंप्यूटर साइंस और आर्टिफिशियल इंटेलिजेंस में उच्च विश्वविद्यालयी शिक्षा प्राप्त करना।',
    ],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = async (publish = true) => {
    sound.playClick();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updateSiteSettings(
        {
          profile: formData,
        },
        publish
      );
      sound.playSuccess();
      setSaveStatus('Profile settings successfully saved & synchronized!');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err: any) {
      sound.playAlert();
      setSaveStatus(`Failed to save: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addCareerGoal = () => {
    sound.playClick();
    setFormData((prev) => ({
      ...prev,
      careerGoalsEn: [...prev.careerGoalsEn, 'New target milestone...'],
      careerGoalsHi: [...prev.careerGoalsHi, 'नया लक्ष्य...'],
    }));
  };

  const removeCareerGoal = (index: number) => {
    sound.playClick();
    setFormData((prev) => ({
      ...prev,
      careerGoalsEn: prev.careerGoalsEn.filter((_, i) => i !== index),
      careerGoalsHi: prev.careerGoalsHi.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h3 className="font-cyber font-bold text-xl text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-cyan-400" />
            <span>Profile &amp; Biography Manager / प्रोफ़ाइल प्रबंधन</span>
          </h3>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Edit your official personal identity, bilingual biography, verified education, and career vision.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Synchronizing...' : 'Save & Publish Profile'}</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className={`p-3.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
          saveStatus.includes('Failed')
            ? 'bg-red-950/80 border border-red-500/50 text-red-300'
            : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
        }`}>
          {saveStatus.includes('Failed') ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Basic Identity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Full Name (अंग्रेजी)
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-white font-cyber text-sm outline-none transition"
            placeholder="Mohit Yadav"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Target Role / महत्वाकांक्षा
          </label>
          <input
            type="text"
            value={formData.targetRole}
            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-white text-sm outline-none transition"
            placeholder="Future AI Engineer & Tech Innovator"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Professional Main Title (EN)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-cyan-300 font-mono text-sm outline-none transition"
            placeholder="Future AI Engineer | Python Developer | Web & App Creator"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Professional Title in Hindi (हिंदी)
          </label>
          <input
            type="text"
            value={formData.titleHi}
            onChange={(e) => setFormData({ ...formData, titleHi: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-cyan-300 font-sans text-sm outline-none transition"
            placeholder="भावी AI इंजीनियर | पायथन डेवलपर | वेब एवं ऐप क्रिएटर"
          />
        </div>
      </div>

      {/* Verified Academic Dossier */}
      <div className="p-5 rounded-2xl bg-gray-950/80 border border-purple-500/30 space-y-4">
        <h4 className="font-cyber font-bold text-sm text-purple-300 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-purple-400" />
          <span>Academic Foundation &amp; Board Verification</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-400 uppercase">Education Level</label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-400 uppercase">Education in Hindi</label>
            <input
              type="text"
              value={formData.educationHi}
              onChange={(e) => setFormData({ ...formData, educationHi: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-400 uppercase">Academic Board</label>
            <input
              type="text"
              value={formData.academicBoard}
              onChange={(e) => setFormData({ ...formData, academicBoard: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Biographies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            English Biography
          </label>
          <textarea
            rows={4}
            value={formData.bioEn}
            onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-gray-200 text-xs leading-relaxed outline-none transition resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Hindi Biography (हिंदी परिचय)
          </label>
          <textarea
            rows={4}
            value={formData.bioHi}
            onChange={(e) => setFormData({ ...formData, bioHi: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-gray-200 text-xs leading-relaxed outline-none transition resize-none font-sans"
          />
        </div>
      </div>

      {/* Career Goals List */}
      <div className="p-5 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-cyber font-bold text-sm text-cyan-300 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Career Milestones &amp; Aspirations</span>
          </h4>
          <button
            onClick={addCareerGoal}
            className="px-3 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.careerGoalsEn.map((goal, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400">GOAL #{idx + 1}</span>
                {formData.careerGoalsEn.length > 1 && (
                  <button
                    onClick={() => removeCareerGoal(idx)}
                    className="text-gray-500 hover:text-red-400 text-xs"
                    title="Remove goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={goal}
                onChange={(e) => {
                  const updated = [...formData.careerGoalsEn];
                  updated[idx] = e.target.value;
                  setFormData({ ...formData, careerGoalsEn: updated });
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-black border border-gray-800 text-xs text-gray-200 outline-none"
                placeholder="English aspiration description..."
              />
              <input
                type="text"
                value={formData.careerGoalsHi[idx] || ''}
                onChange={(e) => {
                  const updated = [...formData.careerGoalsHi];
                  updated[idx] = e.target.value;
                  setFormData({ ...formData, careerGoalsHi: updated });
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-black border border-gray-800 text-xs text-gray-300 font-sans outline-none"
                placeholder="हिंदी विवरण..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
