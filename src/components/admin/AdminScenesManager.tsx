import React, { useState } from 'react';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import {
  Layers,
  Save,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Compass,
  AlertCircle
} from 'lucide-react';

export const AdminScenesManager: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useImages();
  const scenes = siteSettings.scenes;

  const sceneLabels: Record<string, { en: string; hi: string; sceneTag: string }> = {
    hero: { en: 'Cyberpunk 3D Photo-Orbit Hero', hi: 'साइबरपंक 3D फोटो-ऑर्बिट हीरो', sceneTag: 'Scene 1 / A' },
    cybersecurity: { en: 'Defensive Cyber & Digital Security', hi: 'साइबर सुरक्षा एवं डिफेंसिव सिस्टम्स', sceneTag: 'Scene 2' },
    about: { en: 'Luxury About Me & Academic Dossier', hi: 'लग्जरी अबाउट मी एवं शैक्षणिक पृष्ठभूमि', sceneTag: 'Scene 3 / B' },
    skills: { en: 'AI Engineer & Neural Laboratory', hi: 'AI इंजीनियर एवं न्यूरल लैब', sceneTag: 'Scene 4 / C' },
    roadmap: { en: 'Learning Journey & Roadmap', hi: 'सीखने की यात्रा एवं रोडमैप', sceneTag: 'Horizon' },
    projects: { en: 'Project Universe (6 Core Innovations)', hi: 'प्रोजेक्ट यूनिवर्स (6 प्रमुख प्रोजेक्ट्स)', sceneTag: 'Scene 5 / D' },
    gallery: { en: 'Personal Gallery & Journey', hi: 'व्यक्तिगत गैलरी एवं यात्रा', sceneTag: 'Scene 6 / E' },
    vision: { en: 'Career Goals & Vision', hi: 'करियर विजन एवं भविष्य लक्ष्य', sceneTag: 'Vision' },
    contact: { en: 'Contact & Transmission Uplink', hi: 'संपर्क एवं संदेश प्रणाली', sceneTag: 'Scene 7 / F' },
  };

  const [activeScenes, setActiveScenes] = useState(
    scenes?.activeScenes || {
      hero: true,
      cybersecurity: true,
      about: true,
      skills: true,
      roadmap: true,
      projects: true,
      gallery: true,
      vision: true,
      contact: true,
    }
  );

  const [sceneOrder, setSceneOrder] = useState<string[]>(
    scenes?.sceneOrder || ['hero', 'cybersecurity', 'about', 'skills', 'roadmap', 'projects', 'gallery', 'vision', 'contact']
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleToggleScene = (key: string) => {
    sound.playClick();
    setActiveScenes((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newOrder = [...sceneOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSceneOrder(newOrder);
  };

  const handleSave = async () => {
    sound.playClick();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updateSiteSettings({
        scenes: {
          activeScenes,
          sceneOrder: sceneOrder as any,
        },
      });
      sound.playSuccess();
      setSaveStatus('Scene configuration saved and published to live website!');
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
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Scene &amp; Section Manager / सीन एवं सेक्शन प्रबंधन</span>
          </h3>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Reorder the cinematic scroll scenes, toggle individual sections on/off, and control atmospheric transitions.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Synchronizing...' : 'Save & Publish Scenes'}</span>
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

      {/* Ordered Scene List */}
      <div className="space-y-3">
        {sceneOrder.map((key, index) => {
          const isEnabled = (activeScenes as any)[key] !== false;
          const meta = sceneLabels[key] || { en: key, hi: key, sceneTag: 'Scene' };

          return (
            <div
              key={key}
              className={`p-4 rounded-2xl border transition duration-200 flex items-center justify-between gap-4 ${
                isEnabled
                  ? 'bg-gray-950/80 border-gray-800 hover:border-cyan-500/50 shadow-md'
                  : 'bg-gray-950/40 border-gray-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 font-mono text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                      {meta.sceneTag}
                    </span>
                    <h4 className="font-cyber font-bold text-sm text-white">{meta.en}</h4>
                  </div>
                  <span className="text-xs text-gray-400 font-sans block mt-0.5">{meta.hi}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Move buttons */}
                <button
                  onClick={() => handleMoveScene(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 disabled:opacity-30 cursor-pointer"
                  title="Move scene up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleMoveScene(index, 'down')}
                  disabled={index === sceneOrder.length - 1}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 disabled:opacity-30 cursor-pointer"
                  title="Move scene down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Visibility Toggle */}
                <button
                  onClick={() => handleToggleScene(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition cursor-pointer ${
                    isEnabled
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      : 'bg-gray-900 text-gray-500 border-gray-800'
                  }`}
                >
                  {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isEnabled ? 'Active' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
