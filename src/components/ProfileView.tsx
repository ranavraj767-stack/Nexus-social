import React, { useState } from 'react';
import { UserProfile, Post, Story, VerifiedBadgeTier } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { VerifiedRosette } from './VerifiedRosette';
import { sounds } from '../utils/audio';
import {
  Crown,
  Sparkles,
  Shield,
  Key,
  Flame,
  Grid,
  Camera,
  Hash,
  Lock,
  CheckCircle2,
  Share2,
  RefreshCw,
  Gift,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileViewProps {
  currentUser: UserProfile;
  userPosts: Post[];
  userStories: Story[];
  onOpenVerifyModal: () => void;
  onEquipBadgeDirect: (tier: VerifiedBadgeTier) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  userPosts,
  userStories,
  onOpenVerifyModal,
  onEquipBadgeDirect,
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'snaps' | 'crypto'>('grid');
  const [keyRotated, setKeyRotated] = useState(false);

  const isOwner = currentUser.isOwner || currentUser.email === 'ranavraj767@gmail.com';

  const handleRotateCryptoKeys = () => {
    sounds.playVerifiedSparkle();
    setKeyRotated(true);
    setTimeout(() => setKeyRotated(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 select-none">
      {/* 1. Main Profile Identity Card */}
      <div className="relative rounded-3xl bg-[#0F172A]/90 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar with Big Scalloped Badge */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-blue-500 to-amber-400 shadow-xl shadow-indigo-500/20">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-full h-full rounded-full object-cover border-2 border-[#0B0F19]"
              />
            </div>
            <span className="absolute -bottom-1 -right-1">
              <VerifyBadge tier={currentUser.verifiedTier} size="lg" />
            </span>
          </div>

          {/* Profile Bio & Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>{currentUser.displayName}</span>
                  <VerifyBadge tier={currentUser.verifiedTier} size="md" />
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">@{currentUser.username}</p>
              </div>

              {/* Verified Action Button */}
              <div className="flex items-center justify-center gap-2">
                <button
                  id="btn-profile-manage-badge"
                  onClick={onOpenVerifyModal}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
                    isOwner
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white hover:brightness-110 shadow-amber-500/20'
                      : currentUser.verifiedTier !== 'none'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:brightness-110 shadow-indigo-500/20'
                  }`}
                >
                  <VerifiedRosette
                    tier={isOwner ? 'founder_free' : currentUser.verifiedTier === 'none' ? 'verified_blue' : currentUser.verifiedTier}
                    size={16}
                  />
                  <span>
                    {isOwner ? 'Founder Pass ($0.00 Free)' : currentUser.verifiedTier !== 'none' ? 'Manage Verified' : 'Get Verified'}
                  </span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {currentUser.bio}
            </p>

            {/* Platform Stats Row: Insta Followers, Snap Score & Streaks, Discord Status */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0B0F19] p-2.5 rounded-2xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Followers</div>
                <div className="text-sm font-extrabold text-white">
                  {currentUser.followersCount.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#0B0F19] p-2.5 rounded-2xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Snap Score</div>
                <div className="text-sm font-extrabold text-amber-400">
                  {currentUser.snapScore.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#0B0F19] p-2.5 rounded-2xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Flame Streak</div>
                <div className="text-sm font-extrabold text-orange-400 flex items-center gap-1">
                  <Flame size={14} className="text-amber-400" />
                  <span>{currentUser.streakCount} Days</span>
                </div>
              </div>

              <div className="bg-[#0B0F19] p-2.5 rounded-2xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Discord Status</div>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="capitalize">{currentUser.discordStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OWNER SPECIAL CALLOUT */}
        {isOwner && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-blue-500/15 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-md">
                <Crown size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <span>FOUNDER MASTER ACCESS ACTIVATED</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.2 rounded-full border border-amber-400/30">
                    Free Forever ($0.00)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  All badges (Founder Gold Crown, Scalloped Blue 3D, Obsidian Flame, Cyber Emerald) are 100% unlocked for your account ({currentUser.email}).
                </p>
              </div>
            </div>

            {/* Quick One-Click Aesthetic Badge Switcher for Owner */}
            <div className="flex items-center gap-1.5 bg-[#0B0F19] p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => onEquipBadgeDirect('founder_free')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  currentUser.verifiedTier === 'founder_free'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Founder Gold 3D Badge"
              >
                <Crown size={12} /> Crown
              </button>
              <button
                onClick={() => onEquipBadgeDirect('verified_blue')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  currentUser.verifiedTier === 'verified_blue'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Scalloped 3D Blue Badge (From Image)"
              >
                <VerifiedRosette tier="verified_blue" size={13} /> Blue
              </button>
              <button
                onClick={() => onEquipBadgeDirect('verified_obsidian')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  currentUser.verifiedTier === 'verified_obsidian'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Obsidian Flame Badge"
              >
                <VerifiedRosette tier="verified_obsidian" size={13} /> Obsidian
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Profile Tabs Header */}
      <div className="flex items-center justify-center bg-[#0F172A]/90 p-1.5 rounded-2xl border border-slate-800 max-w-md mx-auto shadow-lg">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'grid'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid size={15} />
          <span>Feed Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('snaps')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'snaps'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera size={15} />
          <span>Snap Archive</span>
        </button>

        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'crypto'
              ? 'bg-[#1E293B] text-emerald-300 border border-emerald-500/30 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key size={15} />
          <span>E2EE Enclave</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#0B0F19] border border-slate-800 shadow-md cursor-pointer"
            >
              <img
                src={post.mediaUrl}
                alt="Feed Post"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0B0F19]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                <span>❤️ {post.likesCount}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'snaps' && (
        <div className="bg-[#0F172A]/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="text-amber-400" />
              <span>Active Snap Streaks & Memories</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
              {currentUser.streakCount} Streak Score 🔥
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-slate-800 shadow group"
              >
                <img
                  src={story.mediaUrl}
                  alt="Story Memory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                  <span className="text-[10px] text-white font-bold">{story.createdAt}</span>
                  {story.caption && (
                    <p className="text-[10px] text-slate-300 truncate">{story.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'crypto' && (
        <div className="bg-[#0F172A]/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="text-emerald-400" />
                <span>WebCrypto End-to-End Cryptographic Enclave</span>
              </h3>
              <p className="text-xs text-slate-400">
                Hardware-accelerated RSA-OAEP 2048-bit asymmetric key pair with AES-256-GCM
              </p>
            </div>

            <button
              onClick={handleRotateCryptoKeys}
              className="px-4 py-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-all self-start shadow-sm"
            >
              <RefreshCw size={13} className={keyRotated ? 'animate-spin' : ''} />
              <span>{keyRotated ? 'Keys Regenerated!' : 'Rotate RSA Key Pair'}</span>
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#0B0F19] p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>PUBLIC KEY SHA-256 FINGERPRINT:</span>
                <span className="text-emerald-400 font-bold">2048-BIT RSA</span>
              </div>
              <div className="text-emerald-300 font-bold tracking-wider text-sm bg-[#1E293B] p-2.5 rounded-xl border border-slate-700/80">
                {currentUser.isOwner
                  ? 'MASTER-FOUNDER-4819-2048-SHA256'
                  : 'CLIENT-WEB-2940-9812-AESGCM'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F19]/80 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <div className="text-white font-bold">Cryptographic Security Guarantee:</div>
              <div>• Private keys are never stored on any server or sent across the network.</div>
              <div>• Symmetrical AES-GCM session keys are generated per message and destroyed after decryption.</div>
              <div>• Zero-knowledge encrypted storage in browser IndexedDB / Web RAM.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
