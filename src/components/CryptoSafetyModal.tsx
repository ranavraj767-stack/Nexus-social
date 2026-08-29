import React, { useState } from 'react';
import { UserProfile } from '../types';
import { VerifyBadge } from './VerifyBadge';
import { VerifiedRosette } from './VerifiedRosette';
import { X, ShieldCheck, Check, QrCode, Lock, Key, Copy, Sparkles } from 'lucide-react';

interface CryptoSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  peerUser: UserProfile;
  safetyChunks: string[];
}

export const CryptoSafetyModal: React.FC<CryptoSafetyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  peerUser,
  safetyChunks,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifiedManually, setIsVerifiedManually] = useState(false);

  if (!isOpen) return null;

  const fullSafetyString = safetyChunks.join(' ');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSafetyString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-lg my-6 rounded-3xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#0F172A] via-[#0F172A] to-indigo-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Cryptographic Safety Numbers
              </h2>
              <p className="text-[11px] text-slate-400">
                Peer E2EE Fingerprint Verification with @{peerUser.username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Peer Badges Summary */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0F19] border border-slate-800">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentUser.displayName}</span>
                  <VerifyBadge tier={currentUser.verifiedTier} size="xs" />
                </div>
                <div className="text-[10px] text-slate-400">Your Local Key</div>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-2.5">
              <img
                src={peerUser.avatar}
                alt={peerUser.displayName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{peerUser.displayName}</span>
                  <VerifyBadge tier={peerUser.verifiedTier} size="xs" />
                </div>
                <div className="text-[10px] text-slate-400">Peer Public Key</div>
              </div>
            </div>
          </div>

          {/* Signal-style QR Code Simulation & 60-digit number grid */}
          <div className="bg-[#0B0F19] p-5 rounded-3xl border border-slate-800 space-y-4 text-center">
            {/* Visual QR / Matrix block */}
            <div className="mx-auto w-32 h-32 bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-full h-full border-4 border-slate-950 rounded-lg flex flex-col items-center justify-center p-1 bg-white relative">
                <QrCode size={80} className="text-slate-950" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-1 rounded-full bg-indigo-600 text-white shadow">
                    <Lock size={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* 6 chunks of 5 numbers (Signal Standard) */}
            <div className="grid grid-cols-3 gap-2">
              {safetyChunks.map((chunk, idx) => (
                <div
                  key={idx}
                  className="bg-[#1E293B] p-2 rounded-xl border border-slate-700/80 font-mono text-sm font-bold text-emerald-300 tracking-wider shadow-sm"
                >
                  {chunk}
                </div>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{isCopied ? 'Copied Safety Number' : 'Copy 60-Digit Safety Code'}</span>
            </button>
          </div>

          {/* Cryptography Specification Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1.5 text-slate-300 shadow-inner">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <Key size={14} />
              <span>SubtleCrypto Technical Specs</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              • Asymmetric Key Exchange: <strong>RSA-OAEP 2048-bit (SHA-256)</strong><br />
              • Symmetric Payload Cipher: <strong>AES-256-GCM (12-byte IV)</strong><br />
              • Zero-Knowledge Guarantee: Ciphertext is decrypted strictly inside client browser RAM.
            </p>
          </div>

          {/* Mark as Verified Button */}
          <button
            onClick={() => {
              setIsVerifiedManually(!isVerifiedManually);
            }}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isVerifiedManually
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <Check size={14} />
            <span>
              {isVerifiedManually
                ? 'Safety Number Verified & Authenticated ✓'
                : 'Mark as Cryptographically Verified'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
