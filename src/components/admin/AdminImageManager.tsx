import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { sound } from '../audio/SoundEffects';
import { PortfolioImage } from '../../types';
import {
  db,
  storage,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  handleFirestoreError,
  OperationType
} from '../../firebase';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Edit3,
  RefreshCw,
  RotateCw,
  AlertCircle,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface UploadQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  caption: string;
  captionHi: string;
  section: PortfolioImage['section'];
  category: 'personal' | 'setup' | 'ai_creation' | 'coding' | 'blueprint';
  isMainProfile: boolean;
}

export const AdminImageManager: React.FC = () => {
  const { mode } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Existing uploaded images list from Firestore
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'profile' | 'about' | 'gallery' | 'roadmap' | 'drafts'>('all');
  const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload Queue state for multi-file uploads
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Image editing modal state
  const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editCaptionHi, setEditCaptionHi] = useState('');
  const [editSection, setEditSection] = useState<PortfolioImage['section']>('gallery');
  const [editCategory, setEditCategory] = useState<'personal' | 'setup' | 'ai_creation' | 'coding' | 'blueprint'>('personal');
  const [editOrder, setEditOrder] = useState(0);

  // Image to delete confirmation
  const [imageToDelete, setImageToDelete] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'images'));
      const items: PortfolioImage[] = [];
      snap.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          title: data.title || '',
          caption: data.caption || '',
          captionHi: data.captionHi || '',
          downloadUrl: data.downloadUrl || '',
          storagePath: data.storagePath || '',
          section: data.section || 'gallery',
          category: data.category || 'personal',
          displayOrder: data.displayOrder ?? 0,
          isPublished: data.isPublished ?? true,
          isMainProfile: data.isMainProfile ?? false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });

      // Sort by displayOrder ascending, then created
      items.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
        return tB - tA;
      });

      setImages(items);
    } catch (err: any) {
      console.error('Error fetching images:', err);
      setGlobalMessage({
        type: 'error',
        text: err?.message || 'Failed to load portfolio images.',
      });
      try {
        handleFirestoreError(err, OperationType.LIST, 'images');
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  // Handle files selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadQueueItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setGlobalMessage({
          type: 'error',
          text: `File "${file.name}" is not a recognized image type (PNG, JPG, WEBP).`,
        });
        continue;
      }

      // Validate size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setGlobalMessage({
          type: 'error',
          text: `File "${file.name}" exceeds 10MB limit.`,
        });
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl,
        progress: 0,
        status: 'pending',
        caption: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        captionHi: '',
        section: 'gallery',
        category: 'personal',
        isMainProfile: false,
      });
    }

    if (newItems.length > 0) {
      sound.playClick();
      setUploadQueue((prev) => [...prev, ...newItems]);
      setGlobalMessage({
        type: 'success',
        text: `${newItems.length} image(s) queued for upload. Review options and click "Upload to Storage".`,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove item from queue
  const removeQueueItem = (id: string) => {
    setUploadQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  // Process and upload all pending items to Firebase Storage
  const handleUploadAll = async () => {
    if (uploadQueue.length === 0 || isUploading) return;
    setIsUploading(true);
    sound.playClick();

    for (let i = 0; i < uploadQueue.length; i++) {
      const item = uploadQueue[i];
      if (item.status === 'completed') continue;

      // Update item status to uploading
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 5 } : q))
      );

      try {
        const cleanName = item.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `portfolio/${Date.now()}_${cleanName}`;
        const storageRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(storageRef, item.file, {
          contentType: item.file.type,
        });

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setUploadQueue((prev) =>
                prev.map((q) => (q.id === item.id ? { ...q, progress } : q))
              );
            },
            (error) => {
              console.error('Firebase Storage upload error:', error);
              setUploadQueue((prev) =>
                prev.map((q) =>
                  q.id === item.id
                    ? { ...q, status: 'error', errorMessage: error.message }
                    : q
                )
              );
              reject(error);
            },
            async () => {
              // Upload finished! Get download URL
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

              // If marked as main profile, unmark previous ones
              if (item.isMainProfile) {
                const profileImages = images.filter((img) => img.isMainProfile);
                for (const p of profileImages) {
                  try {
                    await updateDoc(doc(db, 'images', p.id), { isMainProfile: false });
                  } catch {}
                }
              }

              // Create Firestore metadata document
              const payload = {
                title: item.caption,
                caption: item.caption,
                captionHi: item.captionHi || item.caption,
                downloadUrl,
                storagePath,
                section: item.isMainProfile ? 'profile' : item.section,
                category: item.category,
                displayOrder: images.length + i,
                isPublished: true,
                isMainProfile: item.isMainProfile,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              };

              await addDoc(collection(db, 'images'), payload);

              setUploadQueue((prev) =>
                prev.map((q) =>
                  q.id === item.id ? { ...q, status: 'completed', progress: 100 } : q
                )
              );
              resolve();
            }
          );
        });
      } catch (err: any) {
        console.error('Upload task error:', err);
      }
    }

    setIsUploading(false);
    sound.playSuccess();
    setGlobalMessage({
      type: 'success',
      text: 'Image upload sequence completed! Website has been automatically updated.',
    });
    // Refresh images
    await fetchImages();
  };

  // Toggle Publish / Unpublish
  const handleTogglePublish = async (image: PortfolioImage) => {
    sound.playClick();
    try {
      const newStatus = !image.isPublished;
      await updateDoc(doc(db, 'images', image.id), {
        isPublished: newStatus,
        updatedAt: serverTimestamp(),
      });
      setImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, isPublished: newStatus } : img))
      );
      setGlobalMessage({
        type: 'success',
        text: `Image "${image.caption || 'Photo'}" is now ${newStatus ? 'Published' : 'Unpublished (Draft)'}.`,
      });
    } catch (err: any) {
      console.error('Error toggling publish:', err);
      setGlobalMessage({ type: 'error', text: 'Failed to update publication status.' });
    }
  };

  // Set as Main Profile Avatar
  const handleSetMainProfile = async (image: PortfolioImage) => {
    sound.playSuccess();
    try {
      // Unset any previous main profile
      const prevMains = images.filter((img) => img.isMainProfile);
      for (const p of prevMains) {
        await updateDoc(doc(db, 'images', p.id), { isMainProfile: false });
      }

      // Set target image
      await updateDoc(doc(db, 'images', image.id), {
        isMainProfile: true,
        section: 'profile',
        isPublished: true,
        updatedAt: serverTimestamp(),
      });

      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isMainProfile: img.id === image.id,
          section: img.id === image.id ? 'profile' : img.section,
        }))
      );

      // Also persist to localStorage for zero-latency instant local fallback
      localStorage.setItem('mohit_profile_photo', image.downloadUrl);

      setGlobalMessage({
        type: 'success',
        text: 'Main profile photograph successfully updated across the website!',
      });
    } catch (err) {
      console.error('Error setting main profile:', err);
      setGlobalMessage({ type: 'error', text: 'Failed to set main profile photograph.' });
    }
  };

  const handleToggleOrbit = async (image: PortfolioImage) => {
    sound.playClick();
    const newOrbit = !image.isHeroOrbit;
    try {
      await updateDoc(doc(db, 'images', image.id), {
        isHeroOrbit: newOrbit,
        updatedAt: serverTimestamp(),
      });
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, isHeroOrbit: newOrbit } : img
        )
      );
      sound.playSuccess();
      setGlobalMessage({
        type: 'success',
        text: newOrbit
          ? 'Photograph added to 3D Hero Carousel Orbit!'
          : 'Photograph removed from 3D Hero Carousel Orbit.',
      });
    } catch (err: any) {
      console.error('Error toggling hero orbit:', err);
    }
  };

  // Edit image metadata
  const openEditModal = (image: PortfolioImage) => {
    sound.playClick();
    setEditingImage(image);
    setEditCaption(image.caption || '');
    setEditCaptionHi(image.captionHi || '');
    setEditSection(image.section || 'gallery');
    setEditCategory(image.category || 'personal');
    setEditOrder(image.displayOrder ?? 0);
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;
    sound.playSuccess();
    try {
      const updates = {
        title: editCaption,
        caption: editCaption,
        captionHi: editCaptionHi,
        section: editSection,
        category: editCategory,
        displayOrder: Number(editOrder),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, 'images', editingImage.id), updates);
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id
            ? {
                ...img,
                ...updates,
              }
            : img
        )
      );

      setEditingImage(null);
      setGlobalMessage({ type: 'success', text: 'Image metadata successfully updated!' });
    } catch (err) {
      console.error('Error updating image metadata:', err);
      setGlobalMessage({ type: 'error', text: 'Failed to save changes.' });
    }
  };

  // Delete image permanently from Storage and Firestore
  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    sound.playSuccess();
    try {
      // 1. Delete binary from Firebase Storage if storagePath exists
      if (imageToDelete.storagePath) {
        try {
          const fileRef = ref(storage, imageToDelete.storagePath);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.warn('Storage file deletion note (may already be deleted):', storageErr);
        }
      }

      // 2. Delete metadata doc from Firestore
      await deleteDoc(doc(db, 'images', imageToDelete.id));

      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
      setImageToDelete(null);
      setGlobalMessage({
        type: 'success',
        text: 'Image deleted from both Firebase Storage and database.',
      });
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setGlobalMessage({
        type: 'error',
        text: err?.message || 'Failed to delete image.',
      });
    }
  };

  // Reordering helper
  const handleMoveOrder = async (image: PortfolioImage, direction: 'up' | 'down') => {
    sound.playClick();
    const newOrder = direction === 'up' ? image.displayOrder - 1 : image.displayOrder + 1;
    try {
      await updateDoc(doc(db, 'images', image.id), {
        displayOrder: newOrder,
        updatedAt: serverTimestamp(),
      });
      setImages((prev) =>
        prev
          .map((img) => (img.id === image.id ? { ...img, displayOrder: newOrder } : img))
          .sort((a, b) => a.displayOrder - b.displayOrder)
      );
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  // Filtered images list
  const filteredImages = images.filter((img) => {
    if (activeFilter === 'drafts') return !img.isPublished;
    if (activeFilter === 'all') return true;
    return img.section === activeFilter;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      {globalMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono transition ${
            globalMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
              : 'bg-red-950/60 border-red-500/60 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {globalMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{globalMessage.text}</span>
          </div>
          <button
            onClick={() => setGlobalMessage(null)}
            className="p-1 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Box Card */}
      <div className="cyber-card p-6 sm:p-7 rounded-2xl space-y-5 border border-cyan-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div className="space-y-1">
            <h3 className="font-cyber font-bold text-xl text-white flex items-center gap-2.5">
              <Upload className="w-5 h-5 text-cyan-400" />
              <span>Upload Photographs to Firebase Storage</span>
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Select multiple photos from your phone or PC. Binary files are stored directly in Firebase Storage, and published photos reflect on your live website.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => {
                sound.playClick();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-cyan-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Select Photos</span>
            </button>
          </div>
        </div>

        {/* Upload Queue Cards */}
        {uploadQueue.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 font-semibold">
                QUEUED FOR UPLOAD ({uploadQueue.length} files)
              </span>

              <button
                onClick={handleUploadAll}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-cyber font-bold text-xs tracking-wider flex items-center gap-2 disabled:opacity-50 transition shadow-md shadow-pink-600/30"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>UPLOADING TO STORAGE...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload All to Storage</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-3 relative group"
                >
                  <button
                    onClick={() => removeQueueItem(item.id)}
                    disabled={isUploading}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-950/80 hover:bg-red-950 text-gray-400 hover:text-red-300 border border-gray-800 transition"
                    title="Remove from queue"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-800 shrink-0 bg-black">
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2 min-w-0 pr-6">
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUploadQueue((prev) =>
                            prev.map((q) => (q.id === item.id ? { ...q, caption: val } : q))
                          );
                        }}
                        placeholder="Caption (English)..."
                        className="w-full px-2 py-1 bg-gray-950 border border-gray-800 rounded text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={item.section}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setUploadQueue((prev) =>
                              prev.map((q) => (q.id === item.id ? { ...q, section: val } : q))
                            );
                          }}
                          className="px-2 py-1 bg-gray-950 border border-gray-800 rounded text-[11px] font-mono text-cyan-300"
                        >
                          <option value="gallery">Section: Gallery</option>
                          <option value="about">Section: About Me</option>
                          <option value="profile">Section: Profile</option>
                          <option value="roadmap">Section: Roadmap</option>
                        </select>

                        <select
                          value={item.category}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setUploadQueue((prev) =>
                              prev.map((q) => (q.id === item.id ? { ...q, category: val } : q))
                            );
                          }}
                          className="px-2 py-1 bg-gray-950 border border-gray-800 rounded text-[11px] font-mono text-purple-300"
                        >
                          <option value="personal">Cat: Personal</option>
                          <option value="setup">Cat: Setup</option>
                          <option value="ai_creation">Cat: AI Art</option>
                          <option value="coding">Cat: Coding</option>
                          <option value="blueprint">Cat: Blueprint</option>
                        </select>
                      </div>

                      {/* Main Profile Checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] font-mono text-pink-300 pt-1">
                        <input
                          type="checkbox"
                          checked={item.isMainProfile}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUploadQueue((prev) =>
                              prev.map((q) =>
                                q.id === item.id
                                  ? { ...q, isMainProfile: checked, section: checked ? 'profile' : q.section }
                                  : q
                              )
                            );
                          }}
                          className="rounded border-gray-700 accent-pink-500"
                        />
                        <span>Set as Main Profile Photo</span>
                      </label>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {item.status === 'uploading' && (
                    <div className="space-y-1">
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full transition-all duration-200"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 block text-right">
                        {item.progress}% uploaded
                      </span>
                    </div>
                  )}

                  {item.status === 'completed' && (
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Uploaded &amp; Synced to Database!</span>
                    </div>
                  )}

                  {item.status === 'error' && (
                    <div className="text-[11px] font-mono text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{item.errorMessage || 'Upload failed'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images Library Card */}
      <div className="cyber-card p-6 sm:p-7 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <h3 className="font-cyber font-bold text-xl text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <span>Published Portfolio Photographs ({images.length})</span>
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Manage live visibility, captions, main profile avatar, and display ordering.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                fetchImages();
              }}
              disabled={loading}
              className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-lg text-xs transition"
              title="Refresh Image Feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `All (${images.length})` },
            { id: 'profile', label: `Profile (${images.filter((i) => i.section === 'profile').length})` },
            { id: 'gallery', label: `Gallery (${images.filter((i) => i.section === 'gallery').length})` },
            { id: 'about', label: `About Me (${images.filter((i) => i.section === 'about').length})` },
            { id: 'roadmap', label: `Roadmap (${images.filter((i) => i.section === 'roadmap').length})` },
            { id: 'drafts', label: `Unpublished (${images.filter((i) => !i.isPublished).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                activeFilter === tab.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-sm shadow-purple-500/20'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="p-12 text-center text-cyan-400 font-mono text-xs">
            FETCHING LIVE IMAGES FROM FIRESTORE...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800 space-y-3">
            <ImageIcon className="w-10 h-10 text-gray-600 mx-auto" />
            <h4 className="font-cyber font-bold text-gray-400 text-base">
              No photos found in this section
            </h4>
            <p className="text-xs font-mono text-gray-500 max-w-md mx-auto">
              Use the upload area above to select and upload your personal photos directly to Firebase Storage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`cyber-card rounded-xl overflow-hidden border ${
                  image.isMainProfile
                    ? 'border-pink-500/80 shadow-lg shadow-pink-500/20'
                    : image.isPublished
                    ? 'border-gray-800 hover:border-cyan-500/60'
                    : 'border-amber-900/40 opacity-75'
                } flex flex-col justify-between transition duration-200 group`}
              >
                {/* Photo frame */}
                <div className="relative aspect-[16/10] bg-black overflow-hidden">
                  <img
                    src={image.downloadUrl}
                    alt={image.caption || 'Portfolio photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />

                  {/* Top badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-950/85 border border-gray-700 text-cyan-300">
                      {image.section.toUpperCase()}
                    </span>

                    {image.isMainProfile && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/90 border border-pink-500 text-pink-300 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-pink-400 text-pink-400" />
                        MAIN AVATAR
                      </span>
                    )}

                    {!image.isPublished && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500 text-amber-300">
                        DRAFT
                      </span>
                    )}
                  </div>

                  {/* Order Rank */}
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-950/85 border border-gray-700 text-gray-300">
                      Order: #{image.displayOrder}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-cyber font-bold text-white text-sm truncate">
                      {image.caption || 'Untitled Photograph'}
                    </h4>
                    {image.captionHi && (
                      <p className="text-xs text-gray-400 font-sans truncate">
                        {image.captionHi}
                      </p>
                    )}
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs font-mono">
                    {/* Main profile toggle */}
                    <button
                      onClick={() => handleSetMainProfile(image)}
                      disabled={image.isMainProfile}
                      className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                        image.isMainProfile
                          ? 'text-pink-400 font-bold'
                          : 'text-gray-400 hover:text-pink-300 hover:bg-pink-950/40'
                      }`}
                      title="Set as Main Profile Avatar"
                    >
                      <Star className={`w-3.5 h-3.5 ${image.isMainProfile ? 'fill-pink-400' : ''}`} />
                      <span className="text-[11px]">
                        {image.isMainProfile ? 'Main Avatar' : 'Make Avatar'}
                      </span>
                    </button>

                    {/* Hero Orbit Toggle */}
                    <button
                      onClick={() => handleToggleOrbit(image)}
                      className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                        image.isHeroOrbit
                          ? 'text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/40'
                          : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800'
                      }`}
                      title={image.isHeroOrbit ? 'In 3D Hero Carousel Orbit' : 'Add to 3D Hero Carousel Orbit'}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{image.isHeroOrbit ? 'In Orbit' : '+ Orbit'}</span>
                    </button>

                    {/* Publish toggle */}
                    <button
                      onClick={() => handleTogglePublish(image)}
                      className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                        image.isPublished
                          ? 'text-emerald-400 hover:bg-emerald-950/40'
                          : 'text-amber-400 hover:bg-amber-950/40'
                      }`}
                      title={image.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {image.isPublished ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Draft</span>
                        </>
                      )}
                    </button>

                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(image, 'up')}
                        className="p-1 text-gray-400 hover:text-cyan-300 hover:bg-gray-800 rounded transition"
                        title="Move Up Order"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(image, 'down')}
                        className="p-1 text-gray-400 hover:text-cyan-300 hover:bg-gray-800 rounded transition"
                        title="Move Down Order"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Edit button */}
                    <button
                      onClick={() => openEditModal(image)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition"
                      title="Edit metadata"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setImageToDelete(image)}
                      className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-950/50 rounded transition"
                      title="Delete photograph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Metadata Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-gray-950 border border-purple-500/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setEditingImage(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg border border-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h4 className="font-cyber font-bold text-lg text-white">
                Edit Photograph Metadata
              </h4>
              <p className="text-xs font-mono text-gray-400">
                Update section placement, captions, and display order.
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-800 shrink-0 bg-black">
                <img
                  src={editingImage.downloadUrl}
                  alt="Edit"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-cyan-300 block mb-1">
                    English Caption / Title:
                  </label>
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-pink-300 block mb-1">
                    Hindi Caption (वैकल्पिक हिंदी विवरण):
                  </label>
                  <input
                    type="text"
                    value={editCaptionHi}
                    onChange={(e) => setEditCaptionHi(e.target.value)}
                    placeholder="उदा. कोडिंग सत्र या व्यक्तिगत तस्वीर"
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs font-sans text-gray-200 focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  Website Section:
                </label>
                <select
                  value={editSection}
                  onChange={(e) => setEditSection(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs font-mono text-cyan-300"
                >
                  <option value="gallery">Gallery</option>
                  <option value="about">About Me</option>
                  <option value="profile">Profile Avatar</option>
                  <option value="roadmap">Roadmap</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  Category:
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs font-mono text-purple-300"
                >
                  <option value="personal">Personal Photos</option>
                  <option value="setup">Coding Setup</option>
                  <option value="ai_creation">AI Creation Lab</option>
                  <option value="coding">Coding &amp; Dev</option>
                  <option value="blueprint">Project Blueprint</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  Display Order Rank:
                </label>
                <input
                  type="number"
                  value={editOrder}
                  onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs font-mono text-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-xs font-mono text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-cyber font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-gray-950 border border-red-500/60 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-cyber font-bold text-lg text-white">
                Delete Photograph Permanently?
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                This will delete the file from <strong className="text-white">Firebase Storage</strong> and erase its database metadata. It will disappear from the public portfolio.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setImageToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-mono text-gray-400 hover:text-white border border-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-cyber font-bold text-white shadow-lg shadow-red-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
