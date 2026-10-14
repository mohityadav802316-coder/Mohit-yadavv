import React, { useState } from 'react';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import { ContactSettings } from '../../types';
import {
  Mail,
  Save,
  CheckCircle2,
  Github,
  Globe,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';

export const AdminContactManager: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useImages();
  const contact = siteSettings.contact;

  const [formData, setFormData] = useState<ContactSettings>({
    email: contact?.email || 'mohityadav802316@gmail.com',
    githubUrl: contact?.githubUrl || 'https://github.com',
    telegramUrl: contact?.telegramUrl || '',
    linkedinUrl: contact?.linkedinUrl || '',
    twitterUrl: contact?.twitterUrl || '',
    location: contact?.location || 'Bihar, India',
    locationHi: contact?.locationHi || 'बिहार, भारत',
    responseAvailability: contact?.responseAvailability || 'Open for learning collaborations and tech discussions',
    responseAvailabilityHi: contact?.responseAvailabilityHi || 'सीखने, सहयोगात्मक प्रोजेक्ट्स और तकनीकी चर्चाओं के लिए उपलब्ध',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = async () => {
    sound.playClick();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updateSiteSettings({
        contact: formData,
      });
      sound.playSuccess();
      setSaveStatus('Contact information saved & synchronized!');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err: any) {
      sound.playAlert();
      setSaveStatus(`Failed to save: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h3 className="font-cyber font-bold text-xl text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>Contact &amp; Social Uplink Manager / संपर्क प्रबंधन</span>
          </h3>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Manage your official email address, verified social profiles, and collaboration status.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Synchronizing...' : 'Save & Publish Contact'}</span>
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Official Contact Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-cyan-300 font-mono text-sm outline-none"
            placeholder="mohityadav802316@gmail.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            GitHub Profile URL
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-gray-200 font-mono text-sm outline-none"
            placeholder="https://github.com/..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Location (EN)
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-gray-200 text-sm outline-none"
            placeholder="Bihar, India"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Location in Hindi (हिंदी)
          </label>
          <input
            type="text"
            value={formData.locationHi}
            onChange={(e) => setFormData({ ...formData, locationHi: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-gray-200 text-sm outline-none font-sans"
            placeholder="बिहार, भारत"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Response &amp; Collaboration Availability (EN)
          </label>
          <input
            type="text"
            value={formData.responseAvailability}
            onChange={(e) => setFormData({ ...formData, responseAvailability: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-gray-200 text-sm outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Availability in Hindi (हिंदी)
          </label>
          <input
            type="text"
            value={formData.responseAvailabilityHi}
            onChange={(e) => setFormData({ ...formData, responseAvailabilityHi: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-cyan-500 text-gray-200 text-sm outline-none font-sans"
          />
        </div>
      </div>
    </div>
  );
};
