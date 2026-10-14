import React, { useState } from 'react';
import { useImages } from '../../context/ImageContext';
import { sound } from '../audio/SoundEffects';
import { ProjectItem } from '../../types';
import {
  FolderGit2,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminProjectManager: React.FC = () => {
  const { projects, updateSiteSettings } = useImages();
  const [projectList, setProjectList] = useState<ProjectItem[]>(projects);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleOpenEdit = (p: ProjectItem) => {
    sound.playClick();
    setEditingProject({ ...p });
  };

  const handleSaveModal = () => {
    if (!editingProject) return;
    sound.playSuccess();
    setProjectList((prev) =>
      prev.map((item) => (item.id === editingProject.id ? editingProject : item))
    );
    setEditingProject(null);
  };

  const handleAddNewProject = () => {
    sound.playClick();
    const newProj: ProjectItem = {
      id: `project-${Date.now()}`,
      title: 'New Innovation',
      titleHi: 'नया प्रोजेक्ट',
      subtitle: 'Technical Prototype & Exploration',
      subtitleHi: 'तकनीकी प्रोटोटाइप एवं खोज',
      description: 'Comprehensive architectural overview and problem definition...',
      descriptionHi: 'प्रोजेक्ट का विवरण एवं उद्देश्य...',
      status: 'Active Development',
      statusHi: 'सक्रिय विकास',
      tags: ['Python', 'Architecture', 'AI'],
      features: ['Core algorithmic engine', 'Modular structure'],
      featuresHi: ['मुख्य एल्गोरिदम', 'मॉड्यूलर संरचना'],
      targetOutcome: 'Useful real-world tool.',
      targetOutcomeHi: 'उपयोगी वास्तविक उत्पाद।',
      isAvailable: false,
    };
    setProjectList([...projectList, newProj]);
    setEditingProject(newProj);
  };

  const handleDeleteProject = (id: string) => {
    sound.playClick();
    if (window.confirm('Are you sure you want to delete this project from the showcase?')) {
      setProjectList(projectList.filter((p) => p.id !== id));
      sound.playSuccess();
    }
  };

  const handleSaveAll = async () => {
    sound.playClick();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updateSiteSettings({
        projects: projectList,
      });
      sound.playSuccess();
      setSaveStatus('Projects successfully saved and published to the live website!');
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
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <span>Project Universe Manager / प्रोजेक्ट प्रबंधन</span>
          </h3>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Manage your 6 core innovations, bilingual technical descriptions, active progress statuses, and verified links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNewProject}
            className="px-3.5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Synchronizing...' : 'Save & Publish Projects'}</span>
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

      {/* Projects Table / Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectList.map((p, idx) => (
          <div
            key={p.id || idx}
            className="p-5 rounded-2xl bg-gray-950/80 border border-gray-800 hover:border-gray-700 space-y-3 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-cyan-300">
                {p.status}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-cyan-400 border border-gray-800 text-xs"
                  title="Edit Project"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {projectList.length > 1 && (
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="p-1.5 rounded-lg bg-gray-900 hover:bg-red-950 text-gray-500 hover:text-red-400 border border-gray-800 text-xs"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-cyber font-bold text-white text-base">{p.title}</h4>
              <p className="text-xs font-mono text-gray-400 mt-0.5">{p.subtitle}</p>
            </div>

            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-sans">
              {p.description}
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              {p.tags.map((t, tIdx) => (
                <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 text-gray-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative max-w-2xl w-full bg-gray-950 border border-cyan-500/50 rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h4 className="font-cyber font-bold text-lg text-white">
                Edit Project // {editingProject.title}
              </h4>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Title (EN)</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-cyber text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Title in Hindi (हिंदी)</label>
                <input
                  type="text"
                  value={editingProject.titleHi}
                  onChange={(e) => setEditingProject({ ...editingProject, titleHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Subtitle (EN)</label>
                <input
                  type="text"
                  value={editingProject.subtitle}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-mono text-cyan-300 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Status</label>
                <select
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-mono text-white outline-none"
                >
                  <option value="Active Development">Active Development</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Live Showcase">Live Showcase</option>
                  <option value="Concept">Concept</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Description (EN)</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-200 outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Description in Hindi (हिंदी)</label>
                <textarea
                  rows={3}
                  value={editingProject.descriptionHi}
                  onChange={(e) => setEditingProject({ ...editingProject, descriptionHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-200 outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.tags.join(', ')}
                  onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-mono text-white outline-none"
                  placeholder="Python, AI, React"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-xs font-mono text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-cyber font-bold text-xs"
              >
                Apply Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
