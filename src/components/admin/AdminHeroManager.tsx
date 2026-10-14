import React, { useState } from 'react';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import {
  Camera,
  RotateCw,
  Save,
  CheckCircle2,
  Sparkles,
  Sliders,
  Eye,
  Layers,
  AlertCircle
} from 'lucide-react';
import { db, doc, updateDoc, serverTimestamp } from '../../firebase';

export const AdminHeroManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, allImages } = useImages();
  const hero = siteSettings.hero;

  const [heroTitle, setHeroTitle] = useState(hero?.heroTitle || 'MOHIT YADAV');
  const [heroSubtitle, setHeroSubtitle] = useState(
    hero?.heroSubtitle || 'Future AI Engineer | Python Developer | Web & App Creator'
  );
  const [heroBioEn, setHeroBioEn] = useState(
    hero?.heroBioEn || "I'm an aspiring AI Engineer and Python developer passionate about building applications, websites, AI-powered tools, and futuristic digital experiences."
  );
  const [heroBioHi, setHeroBioHi] = useState(
    hero?.heroBioHi || 'मैं एक aspiring AI Engineer और Python Developer हूँ। मुझे apps, websites, AI-powered tools और futuristic digital experiences बनाना पसंद है।'
  );
  const [orbitInterval, setOrbitInterval] = useState(hero?.orbitCycleInterval || 2.5);
  const [particlesEnabled, setParticlesEnabled] = useState(hero?.particlesEnabled ?? true);
  const [enable3DOrbit, setEnable3DOrbit] = useState(hero?.enable3DPhotoOrbit ?? true);
  const [enableQuantumCore, setEnableQuantumCore] = useState(hero?.enableQuantumCore ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Toggle image inclusion in Hero Orbit
  const handleToggleOrbitImage = async (imageId: string, currentVal: boolean) => {
    sound.playClick();
    try {
      const imgRef = doc(db, 'images', imageId);
      await updateDoc(imgRef, {
        isHeroOrbit: !currentVal,
        updatedAt: serverTimestamp(),
      });
      sound.playSuccess();
    } catch (err: any) {
      console.error('Error updating orbit image:', err);
    }
  };

  // Toggle main profile photo
  const handleSetMainPhoto = async (imageId: string) => {
    sound.playClick();
    try {
      // Unset previous
      for (const img of allImages) {
        if (img.isMainProfile && img.id !== imageId) {
          try {
            await updateDoc(doc(db, 'images', img.id), { isMainProfile: false });
          } catch {}
        }
      }
      // Set new
      await updateDoc(doc(db, 'images', imageId), {
        isMainProfile: true,
        section: 'profile',
        updatedAt: serverTimestamp(),
      });
      sound.playSuccess();
      setSaveStatus('Primary portrait updated!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Error setting main photo:', err);
    }
  };

  const handleSaveHeroSettings = async () => {
    sound.playClick();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updateSiteSettings({
        hero: {
          heroTitle,
          heroSubtitle,
          heroBioEn,
          heroBioHi,
          orbitCycleInterval: Number(orbitInterval),
          autoRotateSpeed: 0.45,
          enable3DPhotoOrbit: enable3DOrbit,
          enableQuantumCore,
          orbitImageIds: allImages.filter((i) => i.isHeroOrbit).map((i) => i.id),
          particlesEnabled,
        },
        heroTitle,
        heroSubtitle,
        heroBioEn,
        heroBioHi,
        orbitCycleInterval: Number(orbitInterval),
      });
      sound.playSuccess();
      setSaveStatus('Hero & 3D Orbit settings saved & synchronized!');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err: any) {
      sound.playAlert();
      setSaveStatus(`Failed to save: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const orbitPhotos = allImages.filter((img) => img.isHeroOrbit);
  const mainPhoto = allImages.find((img) => img.isMainProfile);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h3 className="font-cyber font-bold text-xl text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <span>3D Photo-Orbit &amp; Hero Manager / 3D हीरो प्रबंधन</span>
          </h3>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Configure central profile portrait, 4-5 orbiting carousel photographs, rotation intervals, and visual modes.
          </p>
        </div>

        <button
          onClick={handleSaveHeroSettings}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Synchronizing...' : 'Save & Publish Hero'}</span>
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

      {/* Hero Orbit Carousel Timing & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-gray-950/80 border border-cyan-500/30 space-y-3">
          <label className="text-xs font-mono text-cyan-300 uppercase block font-semibold flex items-center justify-between">
            <span>Orbit Carousel Transition Timing</span>
            <span className="text-white bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">{orbitInterval}s</span>
          </label>
          <input
            type="range"
            min="2.0"
            max="10.0"
            step="0.5"
            value={orbitInterval}
            onChange={(e) => setOrbitInterval(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <p className="text-[11px] font-mono text-gray-400">
            Featured photograph auto-cycles every {orbitInterval} seconds (smooth transition).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-950/80 border border-purple-500/30 space-y-3">
          <span className="text-xs font-mono text-purple-300 uppercase block font-semibold">
            Interactive Visual Engines
          </span>
          <div className="space-y-2 text-xs font-mono">
            <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={enable3DOrbit}
                onChange={(e) => setEnable3DOrbit(e.target.checked)}
                className="accent-purple-400 rounded"
              />
              <span>Enable 3D Photo-Orbit Nexus</span>
            </label>
            <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={enableQuantumCore}
                onChange={(e) => setEnableQuantumCore(e.target.checked)}
                className="accent-purple-400 rounded"
              />
              <span>Enable Quantum Core Switcher</span>
            </label>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-3">
          <span className="text-xs font-mono text-gray-300 uppercase block font-semibold">
            Atmospheric Effects
          </span>
          <label className="flex items-center gap-2 text-xs font-mono text-gray-200 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={particlesEnabled}
              onChange={(e) => setParticlesEnabled(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span>Cyberpunk Ambient Particle Vortex</span>
          </label>
          <p className="text-[11px] font-mono text-gray-400">
            GPU-accelerated procedural 3D points in Three.js viewport.
          </p>
        </div>
      </div>

      {/* Orbit Selection Grid */}
      <div className="p-5 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-cyber font-bold text-sm text-white flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-cyan-400" />
              <span>Select Orbit Carousel Photographs (Choose 4 or 5)</span>
            </h4>
            <p className="text-xs font-mono text-gray-400">
              Currently Selected: <span className="text-cyan-300 font-bold">{orbitPhotos.length} / 5</span> images
            </p>
          </div>
        </div>

        {allImages.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-gray-800 rounded-xl space-y-2">
            <Camera className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-xs font-mono text-gray-400">
              No photos uploaded to Firebase Storage yet. Upload photographs in the "Image Manager" tab first!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((img) => (
              <div
                key={img.id}
                className={`p-2.5 rounded-xl border transition ${
                  img.isHeroOrbit
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-500/20'
                    : 'border-gray-800 bg-gray-900/60'
                } space-y-2`}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
                  <img
                    src={img.downloadUrl}
                    alt={img.caption}
                    className="w-full h-full object-cover"
                  />
                  {img.isMainProfile && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-500 text-gray-950 font-cyber font-bold text-[9px] uppercase shadow">
                      Primary
                    </span>
                  )}
                  {img.isHeroOrbit && (
                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-cyan-500 text-gray-950 font-mono font-bold text-[9px] uppercase shadow">
                      In Orbit
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono text-white truncate">{img.caption || 'Photo'}</p>
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => handleToggleOrbitImage(img.id, img.isHeroOrbit ?? false)}
                      className={`flex-1 py-1 rounded text-[10px] font-mono border transition ${
                        img.isHeroOrbit
                          ? 'bg-cyan-500 text-gray-950 font-bold border-cyan-400'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-500'
                      }`}
                    >
                      {img.isHeroOrbit ? 'Remove' : '+ Add Orbit'}
                    </button>
                    {!img.isMainProfile && (
                      <button
                        onClick={() => handleSetMainPhoto(img.id)}
                        className="px-2 py-1 rounded text-[10px] font-mono bg-gray-800 hover:bg-emerald-950 text-gray-400 hover:text-emerald-300 border border-gray-700"
                        title="Set as Main Central Portrait"
                      >
                        Set Main
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hero Text Customizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Hero Heading (EN)
          </label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white font-cyber text-sm outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Hero Subtitle
          </label>
          <input
            type="text"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-cyan-300 font-mono text-sm outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Hero Introduction (English)
          </label>
          <textarea
            rows={3}
            value={heroBioEn}
            onChange={(e) => setHeroBioEn(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 text-xs outline-none resize-none font-sans"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            Hero Introduction in Hindi (हिंदी)
          </label>
          <textarea
            rows={3}
            value={heroBioHi}
            onChange={(e) => setHeroBioHi(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 text-xs outline-none resize-none font-sans"
          />
        </div>
      </div>
    </div>
  );
};
