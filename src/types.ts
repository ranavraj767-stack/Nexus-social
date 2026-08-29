export type AppMode = 'instagram' | 'snapchat' | 'discord' | 'dms' | 'profile';

export type VerifiedBadgeTier = 'founder_free' | 'verified_blue' | 'verified_gold' | 'verified_emerald' | 'verified_obsidian' | 'none';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  isOwner: boolean;
  verifiedTier: VerifiedBadgeTier;
  verifiedExpiry?: string;
  verifiedSince?: string;
  snapScore: number;
  streakCount: number;
  followersCount: number;
  followingCount: number;
  discordStatus: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  publicKey?: string; // Exported RSA/ECDH key for E2EE
  privateKey?: CryptoKey; // In-memory private key for current session
}

export interface PostComment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  userVerifiedTier: VerifiedBadgeTier;
  text: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorVerifiedTier: VerifiedBadgeTier;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  location?: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: PostComment[];
  tags: string[];
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorVerifiedTier: VerifiedBadgeTier;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
  durationSeconds: number;
  seen: boolean;
  caption?: string;
  isSnapStreak?: boolean;
}

export interface SnapMessage {
  id: string;
  senderId: string;
  receiverId: string;
  mediaUrl: string;
  caption?: string;
  viewDuration: number; // in seconds (e.g. 5, 10, or -1 for infinite)
  isOpened: boolean;
  openedAt?: string;
  expiresAt?: string;
  isBurned: boolean;
  isE2EE: boolean;
  streakDay?: number;
  createdAt: string;
}

export interface DiscordServer {
  id: string;
  name: string;
  icon: string;
  description: string;
  ownerId: string;
  banner?: string;
  categories: {
    id: string;
    name: string;
    channels: DiscordChannel[];
  }[];
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  topic?: string;
  isE2EESecured?: boolean;
  unreadCount?: number;
}

export interface DiscordVoiceMember {
  userId: string;
  username: string;
  avatar: string;
  verifiedTier: VerifiedBadgeTier;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  channelId?: string; // if discord channel
  plainText?: string; // Decrypted representation for local view
  encryptedPayload: string; // Base64 ciphertext
  iv: string; // Base64 init vector
  senderPublicKeyFingerprint: string;
  timestamp: string;
  disappearingTimer?: number; // 0 = never, 5 = 5s, 30 = 30s, 86400 = 24h
  mediaAttachment?: {
    url: string;
    type: 'image' | 'snap_ephemeral';
    viewDuration?: number;
  };
  isRead: boolean;
  isDecryptedSuccessfully: boolean;
}

export interface E2EESafetyFingerprint {
  userAId: string;
  userBId: string;
  fingerprintChunks: string[];
  qrPayload: string;
  isVerified: boolean;
}
