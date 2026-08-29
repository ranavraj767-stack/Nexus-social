import React from 'react';
import { AppMode, UserProfile } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { VerifiedRosette } from './VerifiedRosette';
import {
  Compass,
  Camera,
  MessageSquare,
  Hash,
  User,
  Shield,
  Sparkles,
  PlusCircle,
  Flame,
  Volume2,
  Crown,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  onOpenVerifyModal: () => void;
  onOpenCreatePost: () => void;
  unreadDMsCount: number;
  unopenedSnapsCount: number;
  voiceConnectedServerName?: string;
  onDisconnectVoice?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenVerifyModal,
  onOpenCreatePost,
  unreadDMsCount,
  unopenedSnapsCount,
  voiceConnectedServerName,
  onDisconnectVoice,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-800/90 shadow-lg shadow-black/20 select-none">
      {/* Top Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onSelectMode('instagram')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                  <VerifiedRosette tier={currentUser.verifiedTier} size={20} />
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-tight text-white">NEXUS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  E2EE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider font-medium">
                INSTA • SNAP • DISCORD
              </span>
            </div>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <nav className="flex items-center bg-[#0B0F19]/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            id="nav-tab-instagram"
            onClick={() => onSelectMode('instagram')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'instagram'
                ? 'bg-gradient-to-r from-rose-500/90 to-indigo-600/90 text-white shadow-md shadow-indigo-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass size={15} />
            <span className="hidden md:inline">Feed</span>
          </button>

          <button
            id="nav-tab-snapchat"
            onClick={() => onSelectMode('snapchat')}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'snapchat'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Camera size={15} />
            <span className="hidden md:inline">Snaps</span>
            {unopenedSnapsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            id="nav-tab-discord"
            onClick={() => onSelectMode('discord')}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'discord'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Hash size={15} />
            <span className="hidden md:inline">Servers</span>
            {voiceConnectedServerName && (
              <span className="flex items-center text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-bold">
                <Volume2 size={10} className="animate-pulse mr-0.5" /> Live
              </span>
            )}
          </button>

          <button
            id="nav-tab-dms"
            onClick={() => onSelectMode('dms')}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'dms'
                ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare size={15} />
            <span className="hidden md:inline">E2EE DMs</span>
            <Lock size={11} className="text-emerald-400" />
            {unreadDMsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-bold">
                {unreadDMsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Side Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Post Button */}
          <button
            id="btn-create-post"
            onClick={onOpenCreatePost}
            className="p-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center gap-1.5 text-xs font-medium shadow-sm hover:scale-[1.02]"
            title="Create Post / Story"
          >
            <PlusCircle size={16} className="text-indigo-400" />
            <span className="hidden lg:inline">Post</span>
          </button>

          {/* Verified Badge Unlock / Manage Button */}
          <button
            id="btn-nav-verify"
            onClick={onOpenVerifyModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all hover:scale-[1.02] shadow-sm ${
              currentUser.isOwner
                ? 'bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-indigo-500/20 border-amber-400/50 text-amber-300 hover:border-amber-300 shadow-amber-500/10'
                : currentUser.verifiedTier !== 'none'
                ? 'bg-indigo-950/60 border-indigo-400/50 text-indigo-300 hover:border-indigo-300'
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 border-transparent text-white hover:brightness-110 shadow-indigo-500/20'
            }`}
          >
            <VerifiedRosette
              tier={currentUser.isOwner ? 'founder_free' : currentUser.verifiedTier === 'none' ? 'verified_blue' : currentUser.verifiedTier}
              size={16}
            />
            <span className="hidden sm:inline">
              {currentUser.isOwner
                ? 'Founder VIP (Free $0)'
                : currentUser.verifiedTier !== 'none'
                ? 'Verified Active'
                : 'Get Verified'}
            </span>
          </button>

          {/* Profile / Switch User Dropdown */}
          <div className="relative flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
            <button
              id="btn-nav-profile"
              onClick={() => onSelectMode('profile')}
              className="flex items-center gap-2 group p-1 rounded-xl hover:bg-[#1E293B] transition-colors"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-indigo-400 transition-colors"
                />
                <span className="absolute -bottom-1 -right-1">
                  <VerifyBadge tier={currentUser.verifiedTier} size="xs" showTooltip={false} />
                </span>
              </div>
            </button>

            {/* Quick Switch User Selector (for testing Owner vs Paid user privileges) */}
            <select
              id="select-switch-user"
              value={currentUser.id}
              onChange={(e) => onSwitchUser(e.target.value)}
              className="bg-[#0B0F19] text-slate-300 text-[11px] font-medium py-1 px-2 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[110px] sm:max-w-[140px] truncate"
              title="Switch user account (Test Owner vs Paid Member)"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.isOwner ? `👑 ${u.displayName} (Founder $0)` : `@${u.username}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
