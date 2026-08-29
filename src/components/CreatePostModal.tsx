import React, { useState, useRef } from 'react';
import { UserProfile, Post, Story } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { sounds } from '../utils/audio';
import {
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  Tag,
  Check,
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onCreatePost: (newPost: Post) => void;
  onCreateStory: (newStory: Story) => void;
}

const FILTER_PRESETS = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'cyber', name: 'Cyberpunk', css: 'contrast-125 saturate-150 hue-rotate-15 brightness-110' },
  { id: 'golden', name: 'Golden Hour', css: 'sepia-50 saturate-150 brightness-105' },
  { id: 'noir', name: 'Retro Noir', css: 'grayscale contrast-150 brightness-90' },
  { id: 'tokyo', name: 'Tokyo Neon', css: 'saturate-200 contrast-115 hue-rotate-45' },
  { id: 'matrix', name: 'Emerald Mesh', css: 'hue-rotate-90 saturate-150 contrast-120' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreatePost,
  onCreateStory,
}) => {
  const [postType, setPostType] = useState<'feed' | 'story'>('feed');
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [tagsInput, setTagsInput] = useState('#Nexus #Verified');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const sampleMediaOptions = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = mediaUrl || sampleMediaOptions[0];

    sounds.playCameraShutter();

    if (postType === 'feed') {
      const parsedTags = tagsInput
        .split(' ')
        .filter((t) => t.startsWith('#'))
        .slice(0, 5);

      const newPost: Post = {
        id: `post_${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorUsername: currentUser.username,
        authorAvatar: currentUser.avatar,
        authorVerifiedTier: currentUser.verifiedTier,
        mediaUrl: finalUrl,
        mediaType: 'image',
        caption: caption.trim() || 'New encrypted visual drop ⚡',
        location: location.trim() || 'Nexus Global Mesh',
        createdAt: 'Just now',
        likesCount: 1,
        isLiked: true,
        isSaved: false,
        tags: parsedTags.length > 0 ? parsedTags : ['#Nexus', '#Verified'],
        comments: [],
      };
      onCreatePost(newPost);
    } else {
      const newStory: Story = {
        id: `story_${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorUsername: currentUser.username,
        authorAvatar: currentUser.avatar,
        authorVerifiedTier: currentUser.verifiedTier,
        mediaUrl: finalUrl,
        mediaType: 'image',
        caption: caption.trim(),
        createdAt: 'Just now',
        durationSeconds: 5,
        seen: false,
        isSnapStreak: true,
      };
      onCreateStory(newStory);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-xl my-6 rounded-3xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Create New Broadcast
                <VerifyBadge tier={currentUser.verifiedTier} size="xs" />
              </h2>
              <p className="text-[11px] text-slate-400">Publish high-resolution feeds or 24h stories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher: Feed Post vs 24h Story */}
        <div className="px-5 pt-4">
          <div className="flex bg-[#0B0F19] p-1 rounded-2xl border border-slate-800 max-w-xs">
            <button
              onClick={() => setPostType('feed')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                postType === 'feed'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Feed Post
            </button>
            <button
              onClick={() => setPostType('story')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                postType === 'story'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24h Snap Story 🔥
            </button>
          </div>
        </div>

        {/* Media Preview & Selector */}
        <div className="p-5 space-y-4">
          <div className="relative aspect-video rounded-2xl bg-[#0B0F19] border border-slate-800 overflow-hidden flex flex-col items-center justify-center group">
            {mediaUrl ? (
              <img
                src={mediaUrl}
                alt="Upload Preview"
                className={`w-full h-full object-cover ${FILTER_PRESETS.find((f) => f.id === selectedFilter)?.css}`}
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Choose a photo or sample visual</p>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  {sampleMediaOptions.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMediaUrl(sample)}
                      className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 hover:border-indigo-400 transition-all hover:scale-105"
                    >
                      <img src={sample} alt="sample" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Change / Upload Button Overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-[#0F172A]/90 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-700 flex items-center gap-1.5 shadow-lg backdrop-blur-md"
              >
                <Upload size={13} />
                <span>Upload Local</span>
              </button>
            </div>
          </div>

          {/* Aesthetic Filter Chips */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Color Grades & Filters
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {FILTER_PRESETS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all whitespace-nowrap ${
                    selectedFilter === filter.id
                      ? 'bg-indigo-600/20 border-indigo-400 text-indigo-300'
                      : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Caption & Location Input */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption, mention @creators, or describe the cryptographic moment..."
                rows={3}
                className="w-full bg-[#0B0F19] text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 resize-none shadow-inner"
              />
            </div>

            {postType === 'feed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location (e.g. Tokyo, Kyoto, Studio)"
                    className="w-full bg-[#0B0F19] text-slate-200 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                </div>
                <div className="relative">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="#Nexus #E2EE #Cyber"
                    className="w-full bg-[#0B0F19] text-slate-200 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between bg-[#0B0F19]/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Encrypted Broadcast Ready</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              id="btn-publish-post"
              type="button"
              onClick={handlePublish}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:brightness-110 shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Publish {postType === 'feed' ? 'Post' : 'Story'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
