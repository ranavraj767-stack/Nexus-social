import React, { useState } from 'react';
import { VerifiedBadgeTier } from '../types';
import { VerifiedRosette } from './VerifiedRosette';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VerifyBadgeProps {
  tier: VerifiedBadgeTier;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const VerifyBadge: React.FC<VerifyBadgeProps> = ({
  tier,
  size = 'sm',
  showTooltip = true,
  interactive = false,
  onClick,
  className = '',
}) => {
  const [hovered, setHovered] = useState(false);

  if (tier === 'none') {
    return null;
  }

  const pixelSizes = {
    xs: 14,
    sm: 17,
    md: 20,
    lg: 24,
    xl: 32,
  };

  const getTierInfo = () => {
    switch (tier) {
      case 'founder_free':
        return {
          title: 'Founder Lifetime VIP',
          badgeText: 'Free Lifetime Grant ($0.00)',
          tag: '100% Free Forever for Master Account',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-500/30',
          bgPill: 'bg-amber-950/60',
        };
      case 'verified_gold':
        return {
          title: 'Nexus Gold VIP',
          badgeText: 'Verified Subscriber ($14.99/mo)',
          tag: 'Hi-Fi Audio & 3D Gold Rosette',
          textColor: 'text-amber-400',
          borderColor: 'border-yellow-500/30',
          bgPill: 'bg-amber-950/50',
        };
      case 'verified_obsidian':
        return {
          title: 'Obsidian Quantum E2EE',
          badgeText: 'Verified Privacy Armor ($19.99/mo)',
          tag: 'SubtleCrypto Priority Handshake',
          textColor: 'text-fuchsia-400',
          borderColor: 'border-fuchsia-500/30',
          bgPill: 'bg-purple-950/50',
        };
      case 'verified_emerald':
        return {
          title: 'Cyber Matrix Emerald',
          badgeText: 'Verified Member ($9.99/mo)',
          tag: 'Emerald Verified Seal',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          bgPill: 'bg-emerald-950/50',
        };
      case 'verified_blue':
      default:
        return {
          title: 'Nexus Verified Blue',
          badgeText: 'Authentic Creator ($7.99/mo)',
          tag: 'Official 3D Scalloped Checkmark',
          textColor: 'text-sky-400',
          borderColor: 'border-sky-500/30',
          bgPill: 'bg-sky-950/50',
        };
    }
  };

  const info = getTierInfo();

  return (
    <span
      className={`relative inline-flex items-center justify-center align-middle cursor-pointer select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span className={`inline-flex items-center transition-transform duration-200 ${interactive ? 'hover:scale-115 active:scale-95' : ''}`}>
        <VerifiedRosette tier={tier} size={pixelSizes[size]} />
      </span>

      {/* Sparkle on Founder */}
      {tier === 'founder_free' && (
        <motion.span
          animate={{
            opacity: [0, 1, 0],
            rotate: [0, 90, 180],
            scale: [0.7, 1.1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1 -right-1 pointer-events-none text-amber-300"
        >
          <Sparkles size={size === 'xl' ? 12 : 9} />
        </motion.span>
      )}

      {/* Rich Interactive Tooltip */}
      <AnimatePresence>
        {showTooltip && hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.94 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none min-w-[210px] p-2.5 rounded-xl bg-slate-950/95 border border-slate-700/80 backdrop-blur-md shadow-2xl text-left"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <VerifiedRosette tier={tier} size={15} />
              <span className={info.textColor}>{info.title}</span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-tight">{info.badgeText}</p>
            <div className={`mt-1.5 flex items-center justify-between text-[9px] px-2 py-0.5 rounded border ${info.bgPill} ${info.borderColor} ${info.textColor}`}>
              <span>{info.tag}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};
