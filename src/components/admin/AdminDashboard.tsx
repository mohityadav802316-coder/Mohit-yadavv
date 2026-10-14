import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { sound } from '../audio/SoundEffects';
import { VisitorMessage } from '../../types';
import {
  auth,
  db,
  signInWithPopup,
  signOut,
  googleProvider,
  onAuthStateChanged,
  isUserAdmin,
  AUTHORIZED_ADMIN_EMAILS,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  handleFirestoreError,
  OperationType
} from '../../firebase';
import { User } from 'firebase/auth';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  LogOut,
  LogIn,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  RefreshCw,
  Mail,
  User as UserIcon,
  Calendar,
  AlertTriangle,
  X,
  BookOpen,
  ArrowLeft,
  Terminal,
  ExternalLink,
  Image as ImageIcon,
  Camera,
  Palette,
  FolderGit2,
  Compass,
  MessageSquare,
  Eye
} from 'lucide-react';
import { AdminImageManager } from './AdminImageManager';
import { AdminProfileManager } from './AdminProfileManager';
import { AdminHeroManager } from './AdminHeroManager';
import { AdminScenesManager } from './AdminScenesManager';
import { AdminThemeCustomizer } from './AdminThemeCustomizer';
import { AdminProjectManager } from './AdminProjectManager';
import { AdminContactManager } from './AdminContactManager';

interface AdminDashboardProps {
  onBackToPortfolio: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToPortfolio }) => {
  const { mode } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<VisitorMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<VisitorMessage | null>(null);
  const [activeTab, setActiveTab] = useState<
    'images' | 'hero' | 'profile' | 'scenes' | 'theme' | 'projects' | 'contact' | 'messages' | 'guide'
  >('images');

  const [fetchError, setFetchError] = useState('');

  // Monitor Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user && isUserAdmin(user)) {
        await fetchMessages();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    sound.playClick();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      sound.playSuccess();
    } catch (err: any) {
      const code = err?.code || '';
      const message = err?.message || '';

      // Gracefully handle user cancellation, popup closed, or double-click requests without throwing noisy console errors
      if (
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/user-cancelled' ||
        message.includes('closed-by-user') ||
        message.includes('user-cancelled') ||
        message.includes('cancelled-popup-request')
      ) {
        console.info('Google Sign-In prompt was closed or cancelled by user.');
        setLoginError('Sign-in prompt was closed or cancelled. Click below to try again.');
      } else if (code === 'auth/popup-blocked') {
        console.warn('Google Sign-In popup was blocked by browser.');
        setLoginError('Sign-in popup was blocked by your browser. Please allow popups for this page and try again.');
      } else if (code === 'auth/network-request-failed') {
        console.warn('Network issue during Google Sign-In:', err);
        setLoginError('Network connection issue. Please check your internet connection and try again.');
      } else {
        console.warn('Google Sign-In Notice:', code, message);
        setLoginError(message || 'Authentication encountered an issue. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    sound.playClick();
    try {
      await signOut(auth);
      setMessages([]);
      setSelectedMessage(null);
      setFetchError('');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    setFetchError('');
    try {
      let snapshot;
      try {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        snapshot = await getDocs(q);
      } catch (orderErr) {
        console.warn('OrderBy query failed or missing index, attempting plain collection fetch:', orderErr);
        snapshot = await getDocs(collection(db, 'messages'));
      }

      const items: VisitorMessage[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          name: data.name || 'Anonymous',
          email: data.email,
          message: data.message || '',
          createdAt: data.createdAt,
          read: data.read || false,
          archived: data.archived || false,
          source: data.source,
        });
      });

      // Sort client-side by date
      items.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return tB - tA;
      });

      setMessages(items);
    } catch (err: any) {
      console.error('Error fetching messages: ', err);
      setFetchError(err?.message || 'Permission denied or network failure while accessing Firestore.');
      try {
        handleFirestoreError(err, OperationType.LIST, 'messages');
      } catch {
        // Logged for diagnostics
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleToggleRead = async (msg: VisitorMessage) => {
    sound.playClick();
    try {
      const msgRef = doc(db, 'messages', msg.id);
      await updateDoc(msgRef, {
        read: !msg.read,
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, read: !msg.read });
      }
    } catch (err) {
      console.error('Error updating read state:', err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `messages/${msg.id}`);
      } catch {}
    }
  };

  const handleToggleArchive = async (msg: VisitorMessage) => {
    sound.playClick();
    try {
      const msgRef = doc(db, 'messages', msg.id);
      await updateDoc(msgRef, {
        archived: !msg.archived,
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, archived: !m.archived } : m))
      );
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, archived: !msg.archived });
      }
    } catch (err) {
      console.error('Error updating archive state:', err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `messages/${msg.id}`);
      } catch {}
    }
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    sound.playSuccess();
    try {
      await deleteDoc(doc(db, 'messages', messageToDelete.id));
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      if (selectedMessage && selectedMessage.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      setMessageToDelete(null);
    } catch (err) {
      console.error('Error deleting message:', err);
      try {
        handleFirestoreError(err, OperationType.DELETE, `messages/${messageToDelete.id}`);
      } catch {}
    }
  };

  const formatTimestamp = (ts: any): string => {
    if (!ts) return 'Just now';
    if (ts.toDate) {
      return ts.toDate().toLocaleString();
    }
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString();
    }
    return String(ts);
  };

  // Filtered Messages
  const filteredMessages = messages.filter((m) => {
    if (filterType === 'unread' && m.read) return false;
    if (filterType === 'archived' && !m.archived) return false;
    if (filterType === 'all' && m.archived) return false;

    if (!searchQuery) return true;
    const queryLower = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(queryLower) ||
      (m.email && m.email.toLowerCase().includes(queryLower)) ||
      m.message.toLowerCase().includes(queryLower)
    );
  });

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.read && !m.archived).length;
  const archivedCount = messages.filter((m) => m.archived).length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-cyan-400 font-mono">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>INITIALIZING SECURITY CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  // State 1: User is not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-950 relative">
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

        <div className="max-w-md w-full bg-gray-950/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl relative z-10">
          <button
            onClick={onBackToPortfolio}
            className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border-2 border-cyan-500/50 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="font-cyber font-bold text-2xl text-white">
                Admin Command Center
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                SECURE FIREBASE AUTHENTICATION GATE
              </p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              This terminal provides encrypted access to visitor contact transmissions, database controls, and portfolio configuration.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-mono">
              {loginError}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-cyber font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 ${
                isLoggingIn ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate with Google</span>
                </>
              )}
            </button>

            <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-[11px] font-mono text-gray-400 space-y-1">
              <span className="text-cyan-300 font-bold block">Authorized Admin Identifiers:</span>
              <p>• yadavshiv16478@gmail.com</p>
              <p>• mohityadav802316@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 2: User is logged in but NOT an authorized admin
  if (!isUserAdmin(currentUser)) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-950 relative">
        <div className="max-w-md w-full bg-gray-950/90 border border-red-500/50 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border-2 border-red-500/50 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="font-cyber font-bold text-2xl text-white">
              Access Denied // 403 Forbidden
            </h2>
            <p className="text-xs font-mono text-red-400">
              UNAUTHORIZED IDENTITY DETECTED
            </p>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            You are authenticated as <span className="font-mono text-cyan-300">{currentUser.email}</span>, which is not registered on the administrative allowlist.
          </p>

          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-[11px] font-mono text-gray-400 text-left space-y-1">
            <span className="text-gray-300 font-bold block">Security Notice:</span>
            <p>Visitor transmissions are protected by Zero-Trust Firestore Security Rules. Only verified portfolio owners can decrypt messages.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleLogout}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-mono text-gray-300 border border-gray-800 hover:border-gray-700"
            >
              Sign Out
            </button>
            <button
              onClick={onBackToPortfolio}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-cyber font-bold text-gray-950"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 3: User IS an authorized admin
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-gray-950/90 border-b border-cyan-500/30 backdrop-blur-xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPortfolio}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 transition"
            title="Return to Public Portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <span className="font-cyber font-bold text-white text-base tracking-wide flex items-center gap-2">
              ADMIN CONTROL NEXUS
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                AUTHORIZED
              </span>
            </span>
            <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
              Welcome, {currentUser.email}
            </span>
          </div>
        </div>

        {/* Return to Portfolio & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBackToPortfolio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 text-xs font-mono transition cursor-pointer"
            title="Sign out of Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Website Control Center Sub-Navigation Tabs */}
      <div className="bg-gray-950/85 border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto sticky top-16 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: 'images', label: 'Images & Orbit', icon: <ImageIcon className="w-3.5 h-3.5 text-pink-400" /> },
            { id: 'hero', label: '3D Orbit & Hero', icon: <Camera className="w-3.5 h-3.5 text-cyan-400" /> },
            { id: 'profile', label: 'Profile & Bio', icon: <UserIcon className="w-3.5 h-3.5 text-purple-400" /> },
            { id: 'scenes', label: 'Scenes & Order', icon: <Compass className="w-3.5 h-3.5 text-blue-400" /> },
            { id: 'theme', label: 'Theme Customizer', icon: <Palette className="w-3.5 h-3.5 text-emerald-400" /> },
            { id: 'projects', label: 'Projects Universe', icon: <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" /> },
            { id: 'contact', label: 'Contact Uplink', icon: <Mail className="w-3.5 h-3.5 text-pink-400" /> },
            { id: 'messages', label: `Transmissions (${totalCount})`, icon: <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> },
            { id: 'guide', label: 'Security Manual', icon: <BookOpen className="w-3.5 h-3.5 text-purple-400" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'bg-gray-900/70 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {activeTab === 'messages' ? (
          <>
            {/* Metric Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="cyber-card p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400 block uppercase">Total Transmissions</span>
                  <span className="font-cyber font-bold text-2xl text-white">{totalCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                  <Mail className="w-5 h-5" />
                </div>
              </div>

              <div className="cyber-card p-4 rounded-xl border border-pink-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400 block uppercase">Unread Messages</span>
                  <span className="font-cyber font-bold text-2xl text-pink-400">{unreadCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-pink-950/80 text-pink-400 border border-pink-500/40">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="cyber-card p-4 rounded-xl border border-purple-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400 block uppercase">Archived Vault</span>
                  <span className="font-cyber font-bold text-2xl text-purple-400">{archivedCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-500/40">
                  <Archive className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Error Notification Banner if query failed */}
            {fetchError && (
              <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/60 flex items-center justify-between gap-3 text-red-200 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Firestore Connection Notice: {fetchError}</span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    fetchMessages();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-white font-semibold shrink-0 transition"
                >
                  Retry Fetch
                </button>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-900/80 p-3 rounded-xl border border-gray-800">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by sender name, email, or message keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 shrink-0">
                {(['all', 'unread', 'archived'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      sound.playClick();
                      setFilterType(type);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition ${
                      filterType === type
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                        : 'bg-gray-950 text-gray-400 border border-gray-800 hover:text-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}

                <button
                  onClick={() => {
                    sound.playClick();
                    fetchMessages();
                  }}
                  disabled={loadingMessages}
                  className="p-2 bg-gray-950 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-lg text-xs transition"
                  title="Refresh Message Feed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            {loadingMessages ? (
              <div className="p-12 text-center text-cyan-400 font-mono text-xs">
                FETCHING SECURE TRANSMISSIONS FROM FIRESTORE...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800 space-y-2">
                <Mail className="w-8 h-8 text-gray-600 mx-auto" />
                <h4 className="font-cyber font-bold text-gray-400 text-base">
                  No transmissions found
                </h4>
                <p className="text-xs font-mono text-gray-500">
                  {searchQuery ? 'Try matching another keyword or filter criteria.' : 'Visitor messages submitted on the portfolio will appear here in real time.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 sm:p-5 rounded-xl border transition ${
                      !msg.read
                        ? 'bg-cyan-950/20 border-cyan-500/50 shadow-md shadow-cyan-950/30'
                        : 'bg-gray-900/60 border-gray-800'
                    } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                  >
                    <div
                      className="space-y-1.5 flex-1 cursor-pointer"
                      onClick={() => {
                        sound.playClick();
                        setSelectedMessage(msg);
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-cyber font-bold text-white text-base">
                          {msg.name}
                        </span>
                        {!msg.read && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-500/40">
                            NEW / UNREAD
                          </span>
                        )}
                        {msg.archived && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                            ARCHIVED
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-gray-500">
                          {formatTimestamp(msg.createdAt)}
                        </span>
                      </div>

                      {msg.email && (
                        <span className="text-xs font-mono text-cyan-400 block">
                          {msg.email}
                        </span>
                      )}

                      <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 font-sans">
                        {msg.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleRead(msg)}
                        className={`p-2 rounded-lg border text-xs font-mono transition ${
                          msg.read
                            ? 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-400 hover:bg-cyan-500/30'
                        }`}
                        title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleArchive(msg)}
                        className={`p-2 rounded-lg border text-xs font-mono transition ${
                          msg.archived
                            ? 'bg-purple-900/60 text-purple-300 border-purple-500/60'
                            : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                        }`}
                        title={msg.archived ? 'Unarchive' : 'Archive'}
                      >
                        <Archive className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          setMessageToDelete(msg);
                        }}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-red-950 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/60 transition"
                        title="Delete transmission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'images' ? (
          /* Firebase Storage Image Manager */
          <AdminImageManager />
        ) : activeTab === 'hero' ? (
          /* 3D Photo-Orbit & Hero Manager */
          <AdminHeroManager />
        ) : activeTab === 'profile' ? (
          /* Profile & Bio Manager */
          <AdminProfileManager />
        ) : activeTab === 'scenes' ? (
          /* Scene & Section Order Manager */
          <AdminScenesManager />
        ) : activeTab === 'theme' ? (
          /* Theme Customizer */
          <AdminThemeCustomizer />
        ) : activeTab === 'projects' ? (
          /* Project Universe Manager */
          <AdminProjectManager />
        ) : activeTab === 'contact' ? (
          /* Contact & Uplink Manager */
          <AdminContactManager />
        ) : (
          /* Firebase Setup Guide & Deployment Manual (Hindi + English) */
          <div className="cyber-card p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="font-cyber font-bold text-xl text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Firebase Configuration &amp; Deployment Manual</span>
              </h3>
              <p className="text-xs font-mono text-gray-400">
                Beginner-friendly step-by-step instructions in English &amp; Hindi for Mohit Yadav.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* English Instructions */}
              <div className="space-y-4 p-5 rounded-xl bg-gray-900/70 border border-gray-800">
                <h4 className="font-cyber font-bold text-cyan-300 text-sm">
                  ENGLISH: FIREBASE &amp; HOSTING SETUP
                </h4>
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 font-sans leading-relaxed">
                  <li>
                    <strong className="text-white">Active Database &amp; Storage:</strong> Your Firestore database is configured under project <code className="text-cyan-400">supple-energy-k5wls</code> with Storage bucket <code className="text-cyan-400">supple-energy-k5wls.firebasestorage.app</code>.
                  </li>
                  <li>
                    <strong className="text-white">Admin Allowlist:</strong> Your email <code className="text-cyan-400">mohityadav802316@gmail.com</code> is registered as the authorized admin account with full upload and deletion rights.
                  </li>
                  <li>
                    <strong className="text-white">Deploying to Firebase Hosting &amp; Storage Rules:</strong>
                    <pre className="mt-1 p-2 rounded bg-gray-950 text-[11px] text-gray-300 font-mono">
                      npm run build{"\n"}firebase deploy
                    </pre>
                  </li>
                  <li>
                    <strong className="text-white">Image Management:</strong> Use the &quot;Image Manager&quot; tab above to upload multiple photos directly to Firebase Storage, set your main avatar, toggle draft/published status, and reorder photos.
                  </li>
                </ol>
              </div>

              {/* Hindi Instructions */}
              <div className="space-y-4 p-5 rounded-xl bg-gray-900/70 border border-gray-800">
                <h4 className="font-cyber font-bold text-pink-300 text-sm">
                  हिंदी: फायरबेस और स्टोरेज निर्देश
                </h4>
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 font-sans leading-relaxed">
                  <li>
                    <strong className="text-white">डेटाबेस एवं स्टोरेज तैयार:</strong> आपका फायरबेस फायरस्टोर और फायरबेस स्टोरेज बकेट <code className="text-pink-400">supple-energy-k5wls.firebasestorage.app</code> पूरी तरह सक्रिय है।
                  </li>
                  <li>
                    <strong className="text-white">एडमिन पहचान:</strong> आपका ईमेल <code className="text-pink-400">mohityadav802316@gmail.com</code> इस पोर्टल में तस्वीरें अपलोड करने, मुख्य अवतार सेट करने और डिलीट करने के लिए अधिकृत है।
                  </li>
                  <li>
                    <strong className="text-white">वेबसाइट लाइव डिप्लॉय करना:</strong>
                    <pre className="mt-1 p-2 rounded bg-gray-950 text-[11px] text-gray-300 font-mono">
                      npm run build{"\n"}firebase deploy
                    </pre>
                  </li>
                  <li>
                    <strong className="text-white">फ़ोटो अपलोड एवं प्रबंधन:</strong> ऊपर दिए गए &quot;Image Manager&quot; टैब से आप एक साथ कई फ़ोटो अपने फ़ोन या कंप्यूटर से फायरबेस स्टोरेज में सीधे अपलोड कर सकते हैं।
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-gray-950 border border-cyan-500/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg border border-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block">
                Transmission Dossier
              </span>
              <h3 className="font-cyber font-bold text-xl text-white">
                {selectedMessage.name}
              </h3>
              {selectedMessage.email && (
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedMessage.email}</span>
                </a>
              )}
              <span className="text-[11px] font-mono text-gray-500 block pt-1">
                Received: {formatTimestamp(selectedMessage.createdAt)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap">
              {selectedMessage.message}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleRead(selectedMessage)}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-xs font-mono text-cyan-300 border border-gray-800"
                >
                  {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <button
                  onClick={() => handleToggleArchive(selectedMessage)}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-xs font-mono text-purple-300 border border-gray-800"
                >
                  {selectedMessage.archived ? 'Unarchive' : 'Archive'}
                </button>
              </div>

              <button
                onClick={() => {
                  setMessageToDelete(selectedMessage);
                  setSelectedMessage(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-xs font-mono text-red-300 border border-red-500/40"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-gray-950 border border-red-500/60 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-cyber font-bold text-lg text-white">
                Confirm Deletion
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                Are you sure you want to permanently delete the message from <span className="text-white font-semibold">&quot;{messageToDelete.name}&quot;</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setMessageToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-mono text-gray-400 hover:text-white border border-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-cyber font-bold text-white shadow-lg shadow-red-600/30"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
