import React, { useState, useEffect } from 'react';
import { Story, UserProfile } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { sounds } from '../utils/audio';
import { X, Heart, Send, ChevronLeft, ChevronRight, Pause, Play, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  currentUser: UserProfile;
  onSendStoryReply: (storyId: string, replyText: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
  currentUser,
  onSendStoryReply,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [hasLiked, setHasLiked] = useState(false);

  const activeStory = stories[currentIndex] || stories[0];
  const duration = (activeStory?.durationSeconds || 5) * 1000;

  useEffect(() => {
    setProgress(0);
    setHasLiked(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((curr) => curr + 1);
            return 0;
          } else {
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, duration, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((curr) => curr + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((curr) => curr - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sounds.playMessageSent();
    onSendStoryReply(activeStory.id, replyText.trim());
    setReplyText('');
  };

  const handleToggleLike = () => {
    sounds.playLikePop();
    setHasLiked(!hasLiked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none">
      {/* Close button */}
      <button
        id="btn-close-story"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Main Story Container */}
      <div className="relative w-full max-w-md h-[90vh] max-h-[820px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between">
        {/* Story Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Profile Bar */}
        <div className="relative z-30 pt-7 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={activeStory.authorAvatar}
                alt={activeStory.authorName}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/80"
              />
              <span className="absolute -bottom-1 -right-1">
                <VerifyBadge tier={activeStory.authorVerifiedTier} size="xs" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <span>{activeStory.authorName}</span>
                <VerifyBadge tier={activeStory.authorVerifiedTier} size="xs" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span>{activeStory.createdAt}</span>
                {activeStory.isSnapStreak && (
                  <span className="flex items-center gap-0.5 text-amber-400 font-semibold bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-500/30">
                    <Flame size={10} /> Streak
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-full bg-black/40 text-white/80 hover:text-white"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </div>

        {/* Story Image / Video Media */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width / 3) {
              handlePrev();
            } else {
              handleNext();
            }
          }}
        >
          <img
            src={activeStory.mediaUrl}
            alt="Story"
            className="w-full h-full object-cover select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

          {activeStory.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20">
              <p className="text-white text-sm font-medium bg-black/60 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                {activeStory.caption}
              </p>
            </div>
          )}
        </div>

        {/* Story Reply & Interaction Bar */}
        <div className="relative z-30 p-4 pb-5 flex items-center gap-2">
          <form onSubmit={handleSendReply} className="flex-1 relative">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${activeStory.authorName}...`}
              className="w-full bg-black/40 backdrop-blur-md text-white placeholder-white/70 text-xs px-4 py-2.5 rounded-full border border-white/20 focus:outline-none focus:border-indigo-400 focus:bg-black/60 shadow-lg"
            />
            {replyText.trim() && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30"
              >
                <Send size={12} />
              </button>
            )}
          </form>

          <button
            onClick={handleToggleLike}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              hasLiked
                ? 'bg-rose-600 text-white scale-110'
                : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'
            }`}
          >
            <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Nav arrows */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 disabled:opacity-0"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/70"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
