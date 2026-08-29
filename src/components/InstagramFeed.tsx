import React, { useState } from 'react';
import { Post, Story, UserProfile, PostComment } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { sounds } from '../utils/audio';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Send,
  Sparkles,
  Plus,
  Flame,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InstagramFeedProps {
  posts: Post[];
  stories: Story[];
  currentUser: UserProfile;
  onOpenStory: (index: number) => void;
  onOpenCreateModal: () => void;
  onToggleLikePost: (postId: string) => void;
  onToggleSavePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onShareToDM: (post: Post) => void;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({
  posts,
  stories,
  currentUser,
  onOpenStory,
  onOpenCreateModal,
  onToggleLikePost,
  onToggleSavePost,
  onAddComment,
  onShareToDM,
}) => {
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [likedAnimPostId, setLikedAnimPostId] = useState<string | null>(null);

  const handleDoubleClickLike = (postId: string) => {
    sounds.playLikePop();
    setLikedAnimPostId(postId);
    onToggleLikePost(postId);
    setTimeout(() => setLikedAnimPostId(null), 900);
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    sounds.playMessageSent();
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      {/* 1. Stories Carousel Header */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md rounded-3xl p-3.5 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none">
          {/* Add story button */}
          <div
            onClick={onOpenCreateModal}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
          >
            <div className="relative w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-indigo-400/80 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 p-1 rounded-full bg-indigo-600 text-white shadow-md">
                <Plus size={12} strokeWidth={3} />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-300 truncate max-w-[64px]">
              Your Story
            </span>
          </div>

          {/* Stories List */}
          {stories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => onOpenStory(idx)}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              <div
                className={`relative w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                  story.seen
                    ? 'border-2 border-slate-700'
                    : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 shadow-md shadow-rose-500/20 animate-pulse'
                }`}
              >
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-full h-full rounded-full object-cover border-2 border-[#0F172A]"
                />
                <span className="absolute -bottom-1 -right-1">
                  <VerifyBadge tier={story.authorVerifiedTier} size="xs" />
                </span>
              </div>
              <div className="flex items-center gap-0.5 max-w-[70px]">
                <span className="text-[11px] font-medium text-slate-200 truncate">
                  {story.authorUsername.replace('@', '')}
                </span>
                {story.isSnapStreak && <Flame size={10} className="text-amber-400 shrink-0" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Feed Posts Stream */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            id={`post-card-${post.id}`}
            className="bg-[#1E293B]/95 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-xl overflow-hidden text-slate-100 transition-all hover:border-indigo-500/40"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <span className="absolute -bottom-1 -right-1">
                    <VerifyBadge tier={post.authorVerifiedTier} size="xs" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>{post.authorName}</span>
                    <VerifyBadge tier={post.authorVerifiedTier} size="xs" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>@{post.authorUsername}</span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                    {post.location && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-400/90 truncate max-w-[140px]">
                          {post.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.authorVerifiedTier === 'founder_free' && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-sm shadow-amber-500/10">
                    👑 FOUNDER
                  </span>
                )}
                <button className="p-2 text-slate-400 hover:text-slate-200">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Post Media with Double-Tap Like */}
            <div
              className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#0B0F19] overflow-hidden cursor-pointer group select-none"
              onDoubleClick={() => handleDoubleClickLike(post.id)}
            >
              <img
                src={post.mediaUrl}
                alt="Post Media"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />

              {/* Animated Floating Big Heart on Double Tap */}
              <AnimatePresence>
                {likedAnimPostId === post.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.3, opacity: 1 }}
                    exit={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  >
                    <Heart size={100} className="text-rose-500 fill-rose-500 drop-shadow-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verified Cryptographic Watermark tag */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-[#0B0F19]/80 backdrop-blur-md border border-slate-700/80 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-md">
                <Lock size={11} className="text-emerald-400" />
                <span className="font-medium">SHA-256 Verified Media</span>
              </div>
            </div>

            {/* Post Action Buttons */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      sounds.playLikePop();
                      onToggleLikePost(post.id);
                    }}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition-transform active:scale-125 ${
                      post.isLiked ? 'text-rose-500' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart size={22} fill={post.isLiked ? 'currentColor' : 'none'} />
                    <span>{post.likesCount.toLocaleString()}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                    }
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white"
                  >
                    <MessageCircle size={22} />
                    <span>{post.comments.length}</span>
                  </button>

                  <button
                    onClick={() => onShareToDM(post)}
                    className="p-1 text-slate-300 hover:text-indigo-400 transition-colors"
                    title="Send Encrypted Snap / Post via DM"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                <button
                  onClick={() => onToggleSavePost(post.id)}
                  className={`p-1 transition-colors ${
                    post.isSaved ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark size={21} fill={post.isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Caption */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <span className="font-bold text-white mr-1.5">{post.authorName}</span>
                {post.caption}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Comments ({post.comments.length})
                  </div>
                  {post.comments.slice(-3).map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2 text-xs">
                      <div className="relative shrink-0 mt-0.5">
                        <img
                          src={comment.userAvatar}
                          alt={comment.username}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-white mr-1.5 inline-flex items-center gap-1">
                          {comment.username}
                          <VerifyBadge tier={comment.userVerifiedTier} size="xs" />
                        </span>
                        <span className="text-slate-300">{comment.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{comment.createdAt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Add Comment Input */}
              <form
                onSubmit={(e) => handleCommentSubmit(post.id, e)}
                className="pt-2 flex items-center gap-2"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    placeholder="Add a verified comment..."
                    className="w-full bg-[#0B0F19] text-slate-200 text-xs px-3.5 py-2.5 rounded-full border border-slate-800 focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                  {(commentInputs[post.id] || '').trim() && (
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    >
                      <Send size={11} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
