import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import { GalleryItem, PortfolioImage } from '../../types';
import {
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  X,
  Compass,
  Camera,
  ShieldCheck
} from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { mode } = useLanguage();
  const { galleryImages } = useImages();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<any | null>(null);

  // Default stylized placeholders when no photos have been uploaded by admin yet
  const defaultItems: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Deep AI Neural Concept',
      titleHi: 'डीप AI न्यूरल विजुअल',
      category: 'ai_creation',
      categoryLabel: 'AI Creation Lab',
      categoryLabelHi: 'AI क्रिएशन लैब',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      caption: 'Prompt-engineered neural network visualization generated during AI model architectural studies.',
      captionHi: 'AI मॉडल आर्किटेक्चर अध्ययन के दौरान प्रॉम्प्ट इंजीनियरिंग द्वारा जनरेट किया गया न्यूरल नेटवर्क विजुअल।',
      isPlaceholder: true,
    },
    {
      id: 'g2',
      title: 'Cyberpunk Developer Terminal',
      titleHi: 'साइबरपंक डेवलपर टर्मिनल',
      category: 'setup',
      categoryLabel: 'Coding Setup',
      categoryLabelHi: 'कोडिंग सेटअप',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      caption: 'Dark neon development environment configured for Python automation and script benchmarking.',
      captionHi: 'पायथन ऑटोमेशन और स्क्रिप्ट बेंचमार्किंग के लिए कॉन्फ़िगर किया गया डार्क नियॉन कोडिंग एनवायरनमेंट।',
      isPlaceholder: true,
    },
    {
      id: 'g3',
      title: 'PinChat Mobile Interface Blueprint',
      titleHi: 'पिनचैट मोबाइल इंटरफ़ेस ब्लूप्रिंट',
      category: 'blueprint',
      categoryLabel: 'Project Blueprint',
      categoryLabelHi: 'प्रोजेक्ट ब्लूप्रिंट',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      caption: 'Wireframe and structural interface layout for the PinChat real-time messaging concept.',
      captionHi: 'पिनचैट रियल-टाइम मैसेजिंग ऐप के लिए वायरफ्रेम और इंटरफ़ेस लेआउट।',
      isPlaceholder: true,
    },
    {
      id: 'g4',
      title: 'Synthetic Cyber City Grid',
      titleHi: 'सिंथेटिक साइबर सिटी ग्रिड',
      category: 'ai_creation',
      categoryLabel: 'AI Creation Lab',
      categoryLabelHi: 'AI क्रिएशन लैब',
      imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
      caption: 'Procedural neon urban perspective exploring 3D game depth, atmospheric lighting, and shaders.',
      captionHi: '3D गेम डेप्थ और लाइटिंग का अध्ययन करने वाला प्रोसीजरल नियॉन विजुअल।',
      isPlaceholder: true,
    },
    {
      id: 'g5',
      title: 'Python Script Automation Matrix',
      titleHi: 'पायथन स्क्रिप्ट ऑटोमेशन मैट्रिक्स',
      category: 'coding',
      categoryLabel: 'Coding & Dev',
      categoryLabelHi: 'कोडिंग एवं वर्क',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      caption: 'Execution logs and terminal debugging view for data handling and API testing.',
      captionHi: 'डेटा हैंडलिंग और API टेस्टिंग के लिए टर्मिनल डिबगिंग और एग्जीक्यूशन लॉग्स।',
      isPlaceholder: true,
    },
    {
      id: 'g6',
      title: 'Android Digital Wellness Concept',
      titleHi: 'एंड्रॉइड डिजिटल वेलनेस ब्लूप्रिंट',
      category: 'blueprint',
      categoryLabel: 'Project Blueprint',
      categoryLabelHi: 'प्रोजेक्ट ब्लूप्रिंट',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      caption: 'System architecture diagram and workflow blueprint for the Porn Blocker Android utility.',
      captionHi: 'पॉर्न ब्लॉकर एंड्रॉइड यूटिलिटी ऐप के लिए सिस्टम आर्किटेक्चर एवं फ्लोचार्ट।',
      isPlaceholder: true,
    },
  ];

  // Convert Firebase Storage galleryImages to unified display list
  const displayItems = galleryImages.length > 0
    ? galleryImages.map((img) => ({
        id: img.id,
        title: img.title || img.caption || 'Personal Photograph',
        titleHi: img.captionHi || img.caption || 'तस्वीर',
        category: img.category || 'personal',
        categoryLabel: img.category === 'personal' ? 'Personal Journey' : img.category.toUpperCase(),
        categoryLabelHi: img.category === 'personal' ? 'व्यक्तिगत यात्रा' : img.category,
        imageUrl: img.downloadUrl,
        caption: img.caption,
        captionHi: img.captionHi || img.caption,
        isPlaceholder: false,
      }))
    : defaultItems;

  const filteredItems = displayItems.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-gray-900 bg-gradient-to-b from-[#02050c] via-[#080d1e] to-[#02050c] overflow-hidden">
      {/* Scene E — Ambient glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-300 text-xs font-mono shadow-sm">
            <Compass className="w-3.5 h-3.5 text-pink-400" />
            <span>SCENE E // PERSONAL GALLERY &amp; JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
            {mode === 'hi'
              ? 'मेरी गैलरी एवं यात्रा'
              : mode === 'en'
              ? 'Personal Gallery & Journey'
              : 'Gallery / मेरी गैलरी'}
          </h2>
          <p className="text-sm sm:text-base font-mono text-gray-400 max-w-2xl mx-auto">
            {mode === 'hi'
              ? 'तस्वीरें, कोडिंग सेटअप, AI क्रिएशन्स और प्रोजेक्ट ब्लूप्रिंट्स'
              : 'Photographs, Coding Setups, AI Creations, and Project Blueprints'}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', labelEn: 'All Showcase', labelHi: 'सभी दृश्य' },
              { id: 'personal', labelEn: 'Personal Journey', labelHi: 'व्यक्तिगत यात्रा' },
              { id: 'setup', labelEn: 'Coding Setup', labelHi: 'कोडिंग सेटअप' },
              { id: 'ai_creation', labelEn: 'AI Creation Lab', labelHi: 'AI क्रिएशन' },
              { id: 'coding', labelEn: 'Coding & Dev', labelHi: 'कोडिंग एवं वर्क' },
              { id: 'blueprint', labelEn: 'Project Blueprints', labelHi: 'प्रोजेक्ट ब्लूप्रिंट्स' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                  selectedCategory === tab.id
                    ? 'bg-pink-500/25 text-pink-300 border border-pink-400 shadow-sm shadow-pink-500/30'
                    : 'bg-gray-900/70 text-gray-400 border border-gray-800 hover:text-gray-200'
                }`}
              >
                {mode === 'hi' ? tab.labelHi : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="cyber-card rounded-2xl overflow-hidden group flex flex-col justify-between border border-gray-800 hover:border-pink-500/60 shadow-xl transition-all duration-300"
            >
              {/* Image Frame with Lightbox Trigger */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-gray-900 cursor-pointer"
                onClick={() => {
                  sound.playClick();
                  setActiveLightbox(item);
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />

                {/* Cyberpunk Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent opacity-60 group-hover:opacity-30 transition" />

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-950/80 border border-gray-700 text-gray-300 backdrop-blur-md">
                    {mode === 'hi' ? item.categoryLabelHi : item.categoryLabel}
                  </span>
                </div>

                {/* Maximize Icon */}
                <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-gray-950/80 border border-gray-700 text-gray-300 group-hover:text-pink-400 group-hover:border-pink-500 transition">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Caption & Clean Details */}
              <div className="p-4 space-y-2">
                <h3 className="font-cyber font-bold text-white text-base group-hover:text-pink-300 transition">
                  {mode === 'hi' ? item.titleHi : item.title}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-sans">
                  {mode === 'hi' ? item.captionHi : item.caption}
                </p>

                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveLightbox(item);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    {mode === 'hi' ? 'बड़ा देखें' : 'View Fullscreen'}
                  </button>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {item.isPlaceholder ? 'Conceptual Visual' : 'Personal Photograph'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Viewer */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="relative max-w-4xl w-full max-h-[92vh] flex flex-col rounded-2xl overflow-hidden border border-pink-500/50 bg-gray-950 shadow-2xl">
            {/* Top Bar */}
            <div className="p-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-cyber font-bold text-white text-lg">
                  {'title' in activeLightbox ? (mode === 'hi' ? activeLightbox.titleHi : activeLightbox.title) : 'Photograph'}
                </h4>
                <span className="text-xs font-mono text-pink-400">
                  {'categoryLabel' in activeLightbox ? activeLightbox.categoryLabel : 'Personal Photograph'}
                </span>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="flex-1 overflow-hidden flex items-center justify-center p-2 bg-black">
              <img
                src={'imageUrl' in activeLightbox ? activeLightbox.imageUrl : activeLightbox.downloadUrl}
                alt="Selected view"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Bottom Caption */}
            <div className="p-4 bg-gray-900/90 border-t border-gray-800">
              <p className="text-sm text-gray-200 font-sans">
                {mode === 'hi' ? (activeLightbox.captionHi || activeLightbox.caption) : activeLightbox.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
