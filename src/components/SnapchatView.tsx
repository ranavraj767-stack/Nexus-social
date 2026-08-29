import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, SnapMessage } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { sounds } from '../utils/audio';
import {
  Camera,
  Flame,
  Zap,
  Clock,
  Send,
  Lock,
  RefreshCw,
  Sparkles,
  Shield,
  Eye,
  CheckCircle,
  X,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SnapchatViewProps {
  currentUser: UserProfile;
  friends: UserProfile[];
  receivedSnaps: SnapMessage[];
  onSendSnap: (recipientId: string, mediaUrl: string, caption: string, duration: number) => void;
  onOpenSnap: (snapId: string) => void;
}

const LENSES = [
  { id: 'clean', name: 'Original', overlay: '' },
  { id: 'cyber', name: 'Cyberpunk HUD', overlay: 'border-2 border-sky-400/40 shadow-[inset_0_0_40px_rgba(14,165,233,0.3)]' },
  { id: 'gold', name: 'Gold Sparkle', overlay: 'border-2 border-amber-400/40 shadow-[inset_0_0_40px_rgba(245,158,11,0.3)]' },
  { id: 'matrix', name: 'Matrix Emerald', overlay: 'border-2 border-emerald-400/40 shadow-[inset_0_0_40px_rgba(16,185,129,0.3)]' },
  { id: 'vapor', name: 'Vapor Neon', overlay: 'border-2 border-fuchsia-400/40 shadow-[inset_0_0_40px_rgba(217,70,239,0.3)]' },
];

export const SnapchatView: React.FC<SnapchatViewProps> = ({
  currentUser,
  friends,
  receivedSnaps,
  onSendSnap,
  onOpenSnap,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'streaks' | 'inbox'>('camera');
  const [selectedLens, setSelectedLens] = useState('cyber');
  const [snapDuration, setSnapDuration] = useState(5);
  const [caption, setCaption] = useState('');
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [viewingSnap, setViewingSnap] = useState<SnapMessage | null>(null);
  const [viewCountdown, setViewCountdown] = useState(5);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample snapshot presets if webcam is not granted
  const sampleSnaps = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
  ];

  // Try to start live camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeTab === 'camera' && !capturedMedia) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setIsCameraActive(true);
          }
        })
        .catch(() => {
          setIsCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [activeTab, capturedMedia]);

  // Handle Capture
  const handleShutter = () => {
    sounds.playCameraShutter();
    if (isCameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedMedia(dataUrl);
        return;
      }
    }
    // Fallback sample snapshot
    setCapturedMedia(sampleSnaps[Math.floor(Math.random() * sampleSnaps.length)]);
  };

  // Retake
  const handleRetake = () => {
    setCapturedMedia(null);
    setCaption('');
    setSelectedRecipients([]);
  };

  // Toggle recipient
  const toggleRecipient = (userId: string) => {
    if (selectedRecipients.includes(userId)) {
      setSelectedRecipients(selectedRecipients.filter((id) => id !== userId));
    } else {
      setSelectedRecipients([...selectedRecipients, userId]);
    }
  };

  // Select all streaks
  const handleSelectAllStreaks = () => {
    const friendIds = friends.map((f) => f.id);
    setSelectedRecipients(friendIds);
  };

  // Send Snap
  const handleSend = () => {
    if (!capturedMedia || selectedRecipients.length === 0) return;
    sounds.playMessageSent();

    selectedRecipients.forEach((recId) => {
      onSendSnap(recId, capturedMedia, caption, snapDuration);
    });

    handleRetake();
    setActiveTab('streaks');
  };

  // Open & Countdown Snap
  const handleViewSnap = (snap: SnapMessage) => {
    if (snap.isBurned) return;
    setViewingSnap(snap);
    setViewCountdown(snap.viewDuration || 5);
    onOpenSnap(snap.id);

    const timer = setInterval(() => {
      setViewCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setViewingSnap(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      {/* Snap Sub-Header & Navigation Tabs */}
      <div className="flex items-center justify-between bg-[#0F172A]/90 backdrop-blur-md p-2 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'camera'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera size={15} />
            <span>AR Camera</span>
          </button>

          <button
            onClick={() => setActiveTab('streaks')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'streaks'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame size={15} className="text-amber-400" />
            <span>Streaks ({currentUser.streakCount} 🔥)</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap size={15} />
            <span>Received Snaps</span>
            {receivedSnaps.filter((s) => !s.isOpened).length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px]">
                {receivedSnaps.filter((s) => !s.isOpened).length}
              </span>
            )}
          </button>
        </div>

        {/* Snap Score Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0B0F19] border border-slate-800 text-xs shadow-inner">
          <span className="text-slate-400 font-medium">SnapScore:</span>
          <span className="font-extrabold text-amber-400">
            {currentUser.snapScore.toLocaleString()}
          </span>
          <VerifyBadge tier={currentUser.verifiedTier} size="xs" />
        </div>
      </div>

      {/* TAB 1: CAMERA & EPHEMERAL SNAP MAKER */}
      {activeTab === 'camera' && (
        <div className="relative max-w-md mx-auto aspect-[9/16] max-h-[720px] rounded-3xl overflow-hidden bg-[#0B0F19] border border-slate-800 shadow-2xl flex flex-col justify-between">
          <canvas ref={canvasRef} className="hidden" />

          {/* Viewfinder Media Screen */}
          <div className="absolute inset-0 z-0">
            {capturedMedia ? (
              <img
                src={capturedMedia}
                alt="Captured Snap"
                className="w-full h-full object-cover"
              />
            ) : isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80"
                  alt="Camera Simulation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0B0F19]/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                  <Camera size={44} className="text-amber-400 mb-2 animate-bounce" />
                  <p className="text-sm font-bold text-white">Live Camera Ready</p>
                  <p className="text-xs text-slate-300 mt-1">
                    Tap the shutter circle below to capture snap & apply E2EE armor
                  </p>
                </div>
              </div>
            )}

            {/* AR Lens Overlay */}
            <div
              className={`absolute inset-0 pointer-events-none transition-all ${
                LENSES.find((l) => l.id === selectedLens)?.overlay
              }`}
            />
          </div>

          {/* Top Camera Controls */}
          <div className="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-[#0B0F19]/80 to-transparent">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#0F172A]/80 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-amber-400/30">
                <Lock size={10} className="text-emerald-400" />
                <span>WebCrypto E2EE</span>
              </span>
            </div>

            {capturedMedia && (
              <button
                onClick={handleRetake}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Center Caption Overlay if Captured */}
          {capturedMedia && (
            <div className="relative z-20 px-4">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a snap caption..."
                className="w-full bg-black/60 backdrop-blur-md text-white text-center font-bold text-sm px-4 py-2.5 rounded-2xl border border-white/20 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Bottom Camera Controls & Shutter */}
          <div className="relative z-20 p-4 pb-6 space-y-4 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/60 to-transparent">
            {!capturedMedia ? (
              <>
                {/* AR Lens Filter Selector */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
                  {LENSES.map((lens) => (
                    <button
                      key={lens.id}
                      onClick={() => setSelectedLens(lens.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        selectedLens === lens.id
                          ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                          : 'bg-black/40 text-slate-300 backdrop-blur-md hover:text-white'
                      }`}
                    >
                      {lens.name}
                    </button>
                  ))}
                </div>

                {/* Shutter Circle Button */}
                <div className="flex items-center justify-center">
                  <button
                    id="btn-snap-shutter"
                    onClick={handleShutter}
                    className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center bg-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-transform group shadow-2xl"
                  >
                    <div className="w-full h-full rounded-full bg-white group-hover:bg-amber-400 transition-colors shadow-inner" />
                  </button>
                </div>
              </>
            ) : (
              /* Send Drawer */
              <div className="space-y-3 bg-[#1E293B]/95 backdrop-blur-xl p-4 rounded-3xl border border-slate-700/80 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-400" />
                    <span>View Timer:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[3, 5, 10].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setSnapDuration(sec)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                          snapDuration === sec
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Friends Picker */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Send To:</span>
                    <button
                      onClick={handleSelectAllStreaks}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                    >
                      <Flame size={12} /> Send to All Streaks
                    </button>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {friends.map((friend) => {
                      const isSelected = selectedRecipients.includes(friend.id);
                      return (
                        <div
                          key={friend.id}
                          onClick={() => toggleRecipient(friend.id)}
                          className={`flex items-center gap-1.5 p-1.5 pr-2.5 rounded-2xl cursor-pointer border transition-all shrink-0 ${
                            isSelected
                              ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                              : 'bg-[#0B0F19] border-slate-800 text-slate-400'
                          }`}
                        >
                          <img
                            src={friend.avatar}
                            alt={friend.displayName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold">{friend.displayName}</span>
                          <Flame size={11} className="text-amber-400" />
                          <span className="text-[10px] font-bold">{friend.streakCount}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Send Button */}
                <button
                  id="btn-send-snap"
                  onClick={handleSend}
                  disabled={selectedRecipients.length === 0}
                  className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 hover:brightness-105"
                >
                  <Send size={14} />
                  <span>Send Snap ({selectedRecipients.length} Recipient)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STREAKS & BEST FRIENDS DASHBOARD */}
      {activeTab === 'streaks' && (
        <div className="space-y-4">
          {/* Streak Leaderboard & Info */}
          <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 rounded-3xl p-5 border border-amber-400/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 shadow-lg">
                <Flame size={28} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Snap Streaks & Best Friends
                  <VerifyBadge tier={currentUser.verifiedTier} size="xs" />
                </h3>
                <p className="text-xs text-slate-300">
                  Send a snap every 24h to keep your flame alive. 0 missed days!
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('camera')}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:brightness-110"
            >
              <Camera size={14} />
              <span>Snap All Friends</span>
            </button>
          </div>

          {/* Friends Streak Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-[#1E293B]/90 backdrop-blur-md rounded-3xl p-4 border border-slate-700/80 shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-700"
                    />
                    <span className="absolute -bottom-1 -right-1">
                      <VerifyBadge tier={friend.verifiedTier} size="xs" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                      <span>{friend.displayName}</span>
                      <VerifyBadge tier={friend.verifiedTier} size="xs" />
                    </div>
                    <div className="text-[11px] text-slate-400">@{friend.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
                    <Flame size={16} className="animate-pulse" />
                    <span className="font-extrabold text-sm">{friend.streakCount}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRecipients([friend.id]);
                      setActiveTab('camera');
                    }}
                    className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                    title="Send Snap to keep streak"
                  >
                    <Camera size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RECEIVED SNAPS INBOX (SELF-DESTRUCTING) */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="bg-[#1E293B]/90 rounded-3xl p-5 border border-slate-700/80 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock size={16} className="text-emerald-400" />
              <span>Encrypted Ephemeral Snaps Inbox</span>
            </h3>
            <p className="text-xs text-slate-400">
              Snaps self-destruct immediately after viewing. Tamper-proof zero trace.
            </p>

            <div className="divide-y divide-slate-800">
              {receivedSnaps.map((snap) => {
                const sender = friends.find((f) => f.id === snap.senderId) || friends[0];
                return (
                  <div
                    key={snap.id}
                    className="py-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={sender.avatar}
                          alt={sender.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="absolute -bottom-1 -right-1">
                          <VerifyBadge tier={sender.verifiedTier} size="xs" />
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                          <span>{sender.displayName}</span>
                          <VerifyBadge tier={sender.verifiedTier} size="xs" />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {snap.isBurned
                            ? '🔥 Snap Burned & Shredded'
                            : snap.isOpened
                            ? 'Opened • Just now'
                            : `Tap to View (${snap.viewDuration}s)`}
                        </div>
                      </div>
                    </div>

                    <div>
                      {snap.isBurned ? (
                        <span className="text-xs text-slate-500 font-semibold">Burned</span>
                      ) : (
                        <button
                          onClick={() => handleViewSnap(snap)}
                          className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Eye size={14} />
                          <span>View Snap</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN COUNTDOWN SNAP VIEWER (EPHEMERAL) */}
      <AnimatePresence>
        {viewingSnap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg select-none">
            <div className="relative w-full max-w-md h-[90vh] max-h-[800px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              {/* Countdown circle */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-black text-white">{viewCountdown}s left</span>
              </div>

              <img
                src={viewingSnap.mediaUrl}
                alt="Ephemeral Snap"
                className="w-full h-full object-cover"
              />

              {viewingSnap.caption && (
                <div className="absolute bottom-10 left-4 right-4 z-20">
                  <p className="text-white text-center text-sm font-bold bg-black/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                    {viewingSnap.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
