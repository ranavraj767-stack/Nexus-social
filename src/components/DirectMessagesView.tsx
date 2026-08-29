import React, { useState } from 'react';
import { UserProfile, DirectMessage } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { VerifiedRosette } from './VerifiedRosette';
import { CryptoSafetyModal } from './CryptoSafetyModal';
import { sounds } from '../utils/audio';
import {
  Lock,
  ShieldCheck,
  Timer,
  Send,
  Camera,
  Eye,
  Flame,
  Key,
  CheckCheck,
  Code2,
  Sparkles,
  Info,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DirectMessagesViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  activePeerId: string;
  onSelectPeer: (peerId: string) => void;
  directMessages: Record<string, DirectMessage[]>;
  onSendDirectMessage: (
    receiverId: string,
    plainText: string,
    disappearingTimer?: number,
    mediaUrl?: string
  ) => void;
}

export const DirectMessagesView: React.FC<DirectMessagesViewProps> = ({
  currentUser,
  allUsers,
  activePeerId,
  onSelectPeer,
  directMessages,
  onSendDirectMessage,
}) => {
  const [textInput, setTextInput] = useState('');
  const [disappearingTimer, setDisappearingTimer] = useState<number>(0); // 0 = off, 5, 30, 86400
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [showCipherInspector, setShowCipherInspector] = useState(false);
  const [activeMediaSnap, setActiveMediaSnap] = useState<{ url: string; duration: number } | null>(
    null
  );
  const [snapCountdown, setSnapCountdown] = useState(5);

  const friends = allUsers.filter((u) => u.id !== currentUser.id);
  const activePeer = allUsers.find((u) => u.id === activePeerId) || friends[0];

  const currentThread = directMessages[activePeer.id] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    sounds.playMessageSent();
    onSendDirectMessage(activePeer.id, textInput.trim(), disappearingTimer);
    setTextInput('');
  };

  const handleSendQuickSnap = () => {
    sounds.playCameraShutter();
    const sampleSnapUrl =
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
    onSendDirectMessage(
      activePeer.id,
      '📷 [Encrypted 5-Second Ephemeral Snap]',
      5,
      sampleSnapUrl
    );
  };

  const handleOpenSnapInChat = (url: string, duration: number = 5) => {
    setActiveMediaSnap({ url, duration });
    setSnapCountdown(duration);
    const timer = setInterval(() => {
      setSnapCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setActiveMediaSnap(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Mock Signal-style safety chunks
  const safetyChunks = ['48192', '59201', '92841', '02914', '58291', '38291'];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)] flex rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-2xl overflow-hidden text-slate-100 select-none">
      {/* 1. Conversations List Sidebar */}
      <div className="w-80 bg-[#0F172A]/90 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Lock size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Direct Messages
                </h2>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  WebCrypto 256-bit E2EE
                </p>
              </div>
            </div>

            <VerifyBadge tier={currentUser.verifiedTier} size="xs" />
          </div>

          {/* Peer List */}
          <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-13rem)]">
            {friends.map((peer) => {
              const isSelected = peer.id === activePeer.id;
              const thread = directMessages[peer.id] || [];
              const lastMsg = thread[thread.length - 1];

              return (
                <div
                  key={peer.id}
                  onClick={() => onSelectPeer(peer.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-400/40 text-white shadow-md'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="relative shrink-0">
                      <img
                        src={peer.avatar}
                        alt={peer.displayName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-700"
                      />
                      <span className="absolute -bottom-1 -right-1">
                        <VerifyBadge tier={peer.verifiedTier} size="xs" />
                      </span>
                    </div>

                    <div className="truncate text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <span className="truncate">{peer.displayName}</span>
                        <VerifyBadge tier={peer.verifiedTier} size="xs" />
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {lastMsg ? lastMsg.plainText : 'Start encrypted conversation...'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-500/30">
                      <Flame size={11} />
                      <span>{peer.streakCount}</span>
                    </div>
                    {lastMsg && (
                      <span className="text-[9px] text-slate-500">{lastMsg.timestamp}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current User Key Fingerprint status */}
        <div className="p-3 bg-[#0B0F19] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={14} className="text-emerald-400" />
            <span>Fingerprint:</span>
            <span className="font-mono text-xs text-emerald-400 font-bold">
              {currentUser.isOwner ? 'FOUNDER-001' : 'RSA-2048-GCM'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Active Chat Canvas */}
      <div className="flex-1 flex flex-col justify-between bg-[#0B0F19]/40">
        {/* Top Chat Bar */}
        <div className="p-4 border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activePeer.avatar}
                alt={activePeer.displayName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute -bottom-1 -right-1">
                <VerifyBadge tier={activePeer.verifiedTier} size="xs" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                <span>{activePeer.displayName}</span>
                <VerifyBadge tier={activePeer.verifiedTier} size="xs" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  E2EE Secure Handshake Active
                </span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{activePeer.streakCount} 🔥 Streak</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Disappearing Messages Selector */}
            <div className="flex items-center bg-[#0B0F19] p-1 rounded-2xl border border-slate-800">
              <Timer size={13} className="text-amber-400 ml-1.5 mr-1" />
              <select
                value={disappearingTimer}
                onChange={(e) => setDisappearingTimer(Number(e.target.value))}
                className="bg-transparent text-slate-300 text-[11px] font-semibold pr-2 py-0.5 focus:outline-none cursor-pointer"
                title="Disappearing timer"
              >
                <option value={0}>Timer Off</option>
                <option value={5}>5s Burn</option>
                <option value={30}>30s Burn</option>
                <option value={86400}>24h Disappear</option>
              </select>
            </div>

            {/* Safety Numbers Modal Trigger */}
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="px-3 py-1.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-all shadow-sm"
              title="Verify E2EE Safety Numbers"
            >
              <ShieldCheck size={14} />
              <span className="hidden sm:inline">Safety Code</span>
            </button>

            {/* Ciphertext Inspector Toggle */}
            <button
              onClick={() => setShowCipherInspector(!showCipherInspector)}
              className={`p-2 rounded-2xl border transition-all ${
                showCipherInspector
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle Live Ciphertext Inspector"
            >
              <Code2 size={16} />
            </button>
          </div>
        </div>

        {/* E2EE Info Callout Ribbon */}
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-[#0B0F19] border-b border-emerald-500/20 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-emerald-400" />
            <span>
              Messages & snaps to this chat are secured with <strong>RSA-OAEP + AES-256-GCM</strong>. Only you and {activePeer.displayName} have the cryptographic keys.
            </span>
          </div>
          {disappearingTimer > 0 && (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Timer size={12} /> {disappearingTimer}s Auto-Shred
            </span>
          )}
        </div>

        {/* Message Bubble Stream */}
        <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
          {currentThread.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <ShieldCheck size={48} className="text-emerald-500/50 animate-pulse" />
              <p className="text-sm font-bold text-white">End-to-End Encrypted Tunnel Established</p>
              <p className="text-xs text-slate-400 max-w-sm">
                No third party, not even the server, can read messages sent between this pair. Send a text or snap!
              </p>
            </div>
          ) : (
            currentThread.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-md p-3.5 rounded-3xl text-xs sm:text-sm shadow-xl ${
                      isMe
                        ? 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white rounded-br-none shadow-indigo-500/20'
                        : 'bg-[#1E293B] border border-slate-700/80 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {/* Disappearing timer indicator */}
                    {msg.disappearingTimer && msg.disappearingTimer > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mb-1">
                        <Timer size={11} />
                        <span>Self-destructs in {msg.disappearingTimer}s</span>
                      </div>
                    )}

                    {/* Media Snap Attachment if present */}
                    {msg.mediaAttachment && (
                      <div className="mb-2 rounded-2xl overflow-hidden border border-white/20 relative group">
                        <img
                          src={msg.mediaAttachment.url}
                          alt="Snap Attachment"
                          className="w-full aspect-video object-cover blur-sm group-hover:blur-none transition-all cursor-pointer"
                          onClick={() =>
                            handleOpenSnapInChat(
                              msg.mediaAttachment!.url,
                              msg.mediaAttachment!.viewDuration || 5
                            )
                          }
                        />
                        <div
                          onClick={() =>
                            handleOpenSnapInChat(
                              msg.mediaAttachment!.url,
                              msg.mediaAttachment!.viewDuration || 5
                            )
                          }
                          className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-all"
                        >
                          <div className="px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                            <Eye size={14} />
                            <span>View Snap ({msg.mediaAttachment.viewDuration || 5}s)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="leading-relaxed">{msg.plainText}</p>

                    {/* Raw Cryptographic Payload Inspector (if enabled) */}
                    {showCipherInspector && (
                      <div className="mt-2.5 pt-2 border-t border-white/20 font-mono text-[10px] space-y-1 bg-black/40 p-2 rounded-xl text-emerald-300">
                        <div className="text-amber-300 font-bold flex items-center gap-1">
                          <Code2 size={11} />
                          <span>Decrypted RAM Vector:</span>
                        </div>
                        <div className="truncate">IV: {msg.iv}</div>
                        <div className="truncate">Cipher: {msg.encryptedPayload}</div>
                        <div className="truncate">KeyFP: {msg.senderPublicKeyFingerprint}</div>
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isMe ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      <CheckCheck size={12} className="text-emerald-400" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Message Composition Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-[#0F172A]/80">
          <div className="flex items-center gap-2">
            {/* Send Quick Snap Camera Button */}
            <button
              type="button"
              onClick={handleSendQuickSnap}
              className="p-3 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 border border-amber-400/40 transition-colors"
              title="Send Ephemeral Snap Media"
            >
              <Camera size={18} />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Send encrypted message to ${activePeer.displayName}...`}
                className="w-full bg-[#0B0F19] text-slate-200 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:brightness-110 text-white font-bold disabled:opacity-40 shadow-lg shadow-indigo-500/20 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Safety Code Fingerprint Modal */}
      <CryptoSafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        currentUser={currentUser}
        peerUser={activePeer}
        safetyChunks={safetyChunks}
      />

      {/* Ephemeral Snap Viewer in DM */}
      <AnimatePresence>
        {activeMediaSnap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg select-none">
            <div className="relative w-full max-w-md h-[85vh] max-h-[750px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-black text-white">{snapCountdown}s left</span>
              </div>
              <img
                src={activeMediaSnap.url}
                alt="Ephemeral Snap in DM"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
