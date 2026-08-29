import React, { useState } from 'react';
import { UserProfile, VerifiedBadgeTier } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { sounds } from '../utils/audio';
import { X, Check, Sparkles, Crown, Shield, Zap, Lock, CreditCard, Gift, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpgradeTier: (tier: VerifiedBadgeTier) => void;
}

export const VerifyModal: React.FC<VerifyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeTier,
}) => {
  const [selectedTier, setSelectedTier] = useState<VerifiedBadgeTier>(
    currentUser.isOwner ? 'founder_free' : 'verified_blue'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isOwner = currentUser.isOwner || currentUser.email === 'ranavraj767@gmail.com';

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      sounds.playVerifiedSparkle();
      onUpgradeTier(selectedTier);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2200);
    }, 1200);
  };

  const tiersConfig = [
    {
      id: 'verified_blue' as VerifiedBadgeTier,
      name: 'Nexus Verified Blue',
      priceMonthly: '$7.99',
      priceYearly: '$69.99/yr',
      description: 'The authentic creator badge for feeds, stories and channels.',
      color: 'from-sky-500 to-blue-600',
      badgeTier: 'verified_blue' as VerifiedBadgeTier,
      features: [
        'Official Blue Verified checkmark next to your name',
        'Priority feed distribution and comments ranking',
        'HD Snap uploads (1080p 60fps) with custom lens access',
        'Discord Verified role badge in all partnered servers',
      ],
    },
    {
      id: 'verified_gold' as VerifiedBadgeTier,
      name: 'Nexus Gold VIP',
      priceMonthly: '$14.99',
      priceYearly: '$129.99/yr',
      description: 'For power creators, producers and audio engineers.',
      color: 'from-amber-500 to-yellow-400',
      badgeTier: 'verified_gold' as VerifiedBadgeTier,
      features: [
        'Holographic Golden Star & Amber Aura glow',
        'Lossless 384kbps Hi-Fi Voice Lounge audio bitrate',
        'Unlimited Snap streak freeze protection 🔥',
        'Custom verified server badges & custom animated emojis',
        'Encrypted DMs priority key handshake',
      ],
    },
    {
      id: 'verified_obsidian' as VerifiedBadgeTier,
      name: 'Obsidian Quantum E2EE',
      priceMonthly: '$19.99',
      priceYearly: '$189.99/yr',
      description: 'Maximum privacy armor, zero-knowledge encryption & dark flame aesthetic.',
      color: 'from-fuchsia-600 to-violet-700',
      badgeTier: 'verified_obsidian' as VerifiedBadgeTier,
      features: [
        'Obsidian Flame verified insignia with violet particle trail',
        'Self-destructing snaps with zero-trace crypto wiper',
        'Verified Quantum Safety Number audit badge',
        'VIP Access to all secret encrypted Discord lounges',
        'Instant tamper detection alerts in private chats',
      ],
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100"
        >
          {/* Header Graphic */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-[#0F172A] to-[#0B0F19] border-b border-slate-800">
            <button
              id="btn-close-verify-modal"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-amber-400 shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Nexus Verified Hub
                  <VerifyBadge tier={isOwner ? 'founder_free' : selectedTier} size="md" />
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Elevate your status across Feeds, Stories, Snaps & Discord Encrypted Lounges
                </p>
              </div>
            </div>

            {/* Special Owner Banner: "FREE FOR ME ONLY" */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-blue-500/20 border border-amber-400/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-400 text-slate-950">
                    <Crown size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>OWNER PRIVILEGE: 100% FREE LIFETIME GRANT</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                        $0.00 / Free Forever
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Recognized account: <strong className="text-white">{currentUser.email}</strong>. You have unrestricted access to all Verified badges & cryptographic perks at zero cost!
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <Gift size={13} /> Active VIP
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Billing Toggle (For non-owners or choosing paid badges) */}
            {!isOwner ? (
              <div className="flex items-center justify-between bg-[#0B0F19] p-1.5 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                <button
                  id="btn-billing-monthly"
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-[#1E293B] text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  id="btn-billing-yearly"
                  onClick={() => setBillingCycle('yearly')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Yearly</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">Save 25%</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-amber-300 font-semibold bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/30">
                  Select your active badge aesthetic (All free for Founder):
                </span>
              </div>
            )}

            {/* Tier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {tiersConfig.map((tier) => {
                const isSelected = selectedTier === tier.id;
                return (
                  <div
                    key={tier.id}
                    id={`card-tier-${tier.id}`}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative p-4 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1E293B] border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-400/50'
                        : 'bg-[#0B0F19] border-slate-800 hover:border-slate-700 hover:bg-[#1E293B]/40'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                        <Check size={10} /> Selected
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <VerifyBadge tier={tier.badgeTier} size="md" />
                        <span className="text-xs font-bold text-slate-300">
                          {isOwner ? (
                            <span className="text-emerald-400 font-extrabold">$0.00 (Free)</span>
                          ) : billingCycle === 'monthly' ? (
                            tier.priceMonthly + '/mo'
                          ) : (
                            tier.priceYearly
                          )}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white">{tier.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{tier.description}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                      {tier.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-300">
                          <CheckCircle2 size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Guarantee & Checkout Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield size={16} className="text-emerald-400" />
                <span>WebCrypto 256-bit tamper proof security included</span>
              </div>

              <button
                id="btn-activate-verify-tier"
                onClick={handleSubscribe}
                disabled={isProcessing}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl transition-all ${
                  isOwner
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:brightness-110 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:brightness-110 shadow-indigo-500/20'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synchronizing Enclave...</span>
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Check size={18} />
                    <span>Badge Activated!</span>
                  </div>
                ) : isOwner ? (
                  <>
                    <Crown size={16} />
                    <span>Equip Founder Badge ($0.00 Free)</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>
                      Subscribe for {billingCycle === 'monthly' ? '$7.99/mo' : '$69.99/yr'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
