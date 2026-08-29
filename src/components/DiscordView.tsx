import React, { useState } from 'react';
import {
  DiscordServer,
  DiscordChannel,
  UserProfile,
  DirectMessage,
  DiscordVoiceMember,
} from '../types';
import { VerifyBadge } from './VerifyBadge';
import { sounds } from '../utils/audio';
import {
  Hash,
  Volume2,
  Lock,
  Mic,
  MicOff,
  Headphones,
  PhoneOff,
  Send,
  Plus,
  Radio,
  Sparkles,
  Shield,
  Smile,
  Paperclip,
} from 'lucide-react';
import { motion } from 'motion/react';

interface DiscordViewProps {
  servers: DiscordServer[];
  currentServerId: string;
  onSelectServer: (serverId: string) => void;
  activeChannel: DiscordChannel;
  onSelectChannel: (channel: DiscordChannel) => void;
  messages: DirectMessage[];
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSendMessage: (channelId: string, text: string) => void;
  connectedVoiceChannel: DiscordChannel | null;
  onConnectVoice: (channel: DiscordChannel) => void;
  onDisconnectVoice: () => void;
  isMicMuted: boolean;
  onToggleMic: () => void;
  isDeafened: boolean;
  onToggleDeafen: () => void;
}

export const DiscordView: React.FC<DiscordViewProps> = ({
  servers,
  currentServerId,
  onSelectServer,
  activeChannel,
  onSelectChannel,
  messages,
  currentUser,
  allUsers,
  onSendMessage,
  connectedVoiceChannel,
  onConnectVoice,
  onDisconnectVoice,
  isMicMuted,
  onToggleMic,
  isDeafened,
  onToggleDeafen,
}) => {
  const [messageInput, setMessageInput] = useState('');

  const activeServer = servers.find((s) => s.id === currentServerId) || servers[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sounds.playMessageSent();
    onSendMessage(activeChannel.id, messageInput.trim());
    setMessageInput('');
  };

  // Mock voice participants inside connected channel
  const voiceMembers: DiscordVoiceMember[] = [
    {
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      verifiedTier: currentUser.verifiedTier,
      isMuted: isMicMuted,
      isDeafened: isDeafened,
      isSpeaking: !isMicMuted,
      isScreenSharing: false,
    },
    {
      userId: 'usr_elena',
      username: 'elena_design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      verifiedTier: 'verified_blue',
      isMuted: false,
      isDeafened: false,
      isSpeaking: true,
      isScreenSharing: false,
    },
    {
      userId: 'usr_kai',
      username: 'kai_audio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      verifiedTier: 'verified_gold',
      isMuted: false,
      isDeafened: false,
      isSpeaking: false,
      isScreenSharing: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)] flex rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-2xl overflow-hidden text-slate-100 select-none">
      {/* 1. Discord Server Icon Rail */}
      <div className="w-18 bg-[#0F172A]/95 border-r border-slate-800 flex flex-col items-center py-3 gap-3 shrink-0">
        {servers.map((server) => {
          const isSelected = server.id === activeServer.id;
          return (
            <button
              key={server.id}
              onClick={() => onSelectServer(server.id)}
              className={`relative group w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 text-lg font-bold shadow-md ${
                isSelected
                  ? 'bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-2xl text-white ring-2 ring-indigo-400/60 shadow-indigo-500/20'
                  : 'bg-[#1E293B] rounded-3xl hover:rounded-2xl hover:bg-slate-700 text-slate-300'
              }`}
              title={server.name}
            >
              {isSelected && (
                <div className="absolute -left-3 w-1.5 h-8 rounded-r-full bg-white" />
              )}
              <span>{server.icon}</span>
            </button>
          );
        })}

        <div className="w-8 h-[1px] bg-slate-800 my-1" />

        <button
          className="w-12 h-12 rounded-3xl hover:rounded-2xl bg-[#1E293B] hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all shadow-sm"
          title="Create New Server"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* 2. Channel Directory & Voice Dock */}
      <div className="w-60 sm:w-64 bg-[#0F172A]/80 border-r border-slate-800 flex flex-col justify-between shrink-0">
        {/* Server Header Banner */}
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="font-extrabold text-sm text-white truncate">{activeServer.name}</span>
              <VerifyBadge tier="founder_free" size="xs" />
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
              VIP
            </span>
          </div>

          {/* Categories & Channels */}
          <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-17rem)]">
            {activeServer.categories.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {cat.name}
                </div>
                <div className="space-y-0.5">
                  {cat.channels.map((chan) => {
                    const isChanActive = activeChannel.id === chan.id;
                    const isVoice = chan.type === 'voice';
                    const isConnectedVoice = connectedVoiceChannel?.id === chan.id;

                    return (
                      <button
                        key={chan.id}
                        onClick={() => {
                          if (isVoice) {
                            if (isConnectedVoice) {
                              onDisconnectVoice();
                            } else {
                              onConnectVoice(chan);
                            }
                          } else {
                            onSelectChannel(chan);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isChanActive && !isVoice
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                            : isConnectedVoice
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isVoice ? (
                            <Volume2
                              size={15}
                              className={isConnectedVoice ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}
                            />
                          ) : chan.isE2EESecured ? (
                            <Lock size={14} className="text-emerald-400" />
                          ) : (
                            <Hash size={15} />
                          )}
                          <span className="truncate">{chan.name}</span>
                        </div>

                        {chan.isE2EESecured && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                            E2EE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Voice Panel Dock (if in voice channel) */}
        {connectedVoiceChannel && (
          <div className="p-3 bg-emerald-950/40 border-t border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Radio size={14} className="animate-pulse" />
                <span>Voice Connected</span>
              </div>
              <button
                onClick={onDisconnectVoice}
                className="p-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                title="Disconnect from voice"
              >
                <PhoneOff size={13} />
              </button>
            </div>
            <div className="text-[11px] text-slate-300 font-medium truncate mb-2">
              {connectedVoiceChannel.name} (384kbps Hi-Fi)
            </div>
          </div>
        )}

        {/* Bottom User Bar & Controls */}
        <div className="p-2.5 bg-[#0B0F19] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute -bottom-0.5 -right-0.5">
                <VerifyBadge tier={currentUser.verifiedTier} size="xs" showTooltip={false} />
              </span>
            </div>
            <div className="truncate text-left">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>{currentUser.displayName}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">@{currentUser.username}</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleMic}
              className={`p-1.5 rounded-lg transition-colors ${
                isMicMuted
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMicMuted ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            <button
              onClick={onToggleDeafen}
              className={`p-1.5 rounded-lg transition-colors ${
                isDeafened
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isDeafened ? 'Undeafen' : 'Deafen'}
            >
              <Headphones size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Chat / Voice Stage Stage */}
      <div className="flex-1 flex flex-col justify-between bg-[#0B0F19]/40">
        {/* Top Channel Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0F172A]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {activeChannel.isE2EESecured ? (
              <Lock size={18} className="text-emerald-400" />
            ) : (
              <Hash size={18} className="text-slate-400" />
            )}
            <span className="font-bold text-sm text-white">{activeChannel.name}</span>
            {activeChannel.topic && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-slate-400 truncate max-w-md">
                  {activeChannel.topic}
                </span>
              </>
            )}
          </div>

          {activeChannel.isE2EESecured && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
              <Shield size={13} />
              <span>WebCrypto E2EE Active</span>
            </div>
          )}
        </div>

        {/* Middle: Either Voice Stage Grid or Text Messages Feed */}
        {connectedVoiceChannel && activeChannel.type === 'voice' ? (
          /* Voice Stage Room Grid */
          <div className="flex-1 p-6 flex flex-col justify-center items-center overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                <Volume2 className="text-emerald-400" />
                <span>{connectedVoiceChannel.name}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Hi-Fi Lossless Voice Stage • 3 Participants Connected
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
              {voiceMembers.map((member) => (
                <div
                  key={member.userId}
                  className={`relative p-6 rounded-3xl bg-[#1E293B]/95 border flex flex-col items-center justify-center text-center transition-all ${
                    member.isSpeaking
                      ? 'border-emerald-400 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-400/50'
                      : 'border-slate-700/80'
                  }`}
                >
                  {/* Speaking indicator pulsating ring */}
                  <div className="relative mb-3">
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className={`w-20 h-20 rounded-full object-cover border-2 transition-all ${
                        member.isSpeaking ? 'border-emerald-400 scale-105' : 'border-slate-700'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1">
                      <VerifyBadge tier={member.verifiedTier} size="sm" />
                    </span>
                  </div>

                  <div className="font-bold text-sm text-white flex items-center gap-1">
                    <span>{member.username}</span>
                    <VerifyBadge tier={member.verifiedTier} size="xs" />
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-[11px]">
                    {member.isMuted ? (
                      <span className="text-rose-400 flex items-center gap-1 font-semibold">
                        <MicOff size={12} /> Muted
                      </span>
                    ) : member.isSpeaking ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Speaking
                      </span>
                    ) : (
                      <span className="text-slate-400">Connected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Text Chat Message Stream */
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <Hash size={40} className="mb-2 text-slate-600" />
                <p className="text-sm font-semibold text-slate-400">Welcome to #{activeChannel.name}!</p>
                <p className="text-xs">This is the start of the #{activeChannel.name} channel.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const author = allUsers.find((u) => u.id === msg.senderId) || allUsers[0];
                return (
                  <div
                    key={msg.id}
                    className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-[#1E293B]/40 transition-colors group"
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <img
                        src={author.avatar}
                        alt={author.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <span className="absolute -bottom-1 -right-1">
                        <VerifyBadge tier={author.verifiedTier} size="xs" />
                      </span>
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white flex items-center gap-1">
                          {author.displayName}
                          <VerifyBadge tier={author.verifiedTier} size="xs" />
                        </span>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                        {msg.senderPublicKeyFingerprint && (
                          <span className="text-[9px] text-emerald-400/90 font-mono bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            🔒 {msg.senderPublicKeyFingerprint}
                          </span>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                        {msg.plainText}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Bottom Message Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-[#0F172A]/70">
          <div className="relative flex items-center bg-[#0B0F19] text-slate-200 rounded-2xl border border-slate-800 focus-within:border-indigo-500 px-3 py-2 shadow-inner">
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <Paperclip size={16} />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message #${activeChannel.name}...`}
              className="flex-1 bg-transparent px-3 py-1 text-xs sm:text-sm focus:outline-none placeholder-slate-500"
            />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <Smile size={16} />
              </button>

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 transition-all shadow-md shadow-indigo-500/20"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
