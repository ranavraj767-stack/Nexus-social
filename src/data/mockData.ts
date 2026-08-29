import { UserProfile, Post, Story, DiscordServer, DirectMessage } from '../types';

export const OWNER_EMAIL = 'ranavraj767@gmail.com';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_owner',
    email: OWNER_EMAIL,
    username: 'vraj.nexus',
    displayName: 'Vraj Rana',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Founder & Architect of Nexus ⚡ Cyberpunk aesthetic, cryptography & generative visual systems. [Founder Lifetime Pass: $0.00 FREE]',
    isOwner: true,
    verifiedTier: 'founder_free',
    verifiedSince: 'Founding Member',
    snapScore: 184500,
    streakCount: 420,
    followersCount: 89400,
    followingCount: 342,
    discordStatus: 'online',
    customStatus: '🛡️ Enclave E2EE Active | 👑 Founder',
  },
  {
    id: 'usr_elena',
    email: 'elena.art@gmail.com',
    username: 'elena_design',
    displayName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'Visual director & digital sculptor 🌌 Tokyo / Paris. Verified Pro subscriber.',
    isOwner: false,
    verifiedTier: 'verified_blue',
    verifiedExpiry: '2027-01-15',
    verifiedSince: 'Mar 2025',
    snapScore: 94210,
    streakCount: 185,
    followersCount: 42300,
    followingCount: 680,
    discordStatus: 'online',
    customStatus: '🎨 Rendering 3D Shaders',
  },
  {
    id: 'usr_kai',
    email: 'kai.t@sound.fm',
    username: 'kai_audio',
    displayName: 'Kai Takahashi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Modular synth producer & audio engineer 🎹 Gold VIP member.',
    isOwner: false,
    verifiedTier: 'verified_gold',
    verifiedExpiry: '2026-11-20',
    verifiedSince: 'Jun 2025',
    snapScore: 61400,
    streakCount: 94,
    followersCount: 28900,
    followingCount: 410,
    discordStatus: 'idle',
    customStatus: '🎧 Patching EuroRack Synth',
  },
  {
    id: 'usr_cipher',
    email: 'cipher@zero-day.io',
    username: '0xCipher',
    displayName: 'Cipher / ZeroDay',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Quantum cryptography researcher & secure mesh architect. Obsidian tier.',
    isOwner: false,
    verifiedTier: 'verified_obsidian',
    verifiedExpiry: '2028-09-01',
    verifiedSince: 'Jan 2025',
    snapScore: 124800,
    streakCount: 310,
    followersCount: 64100,
    followingCount: 190,
    discordStatus: 'dnd',
    customStatus: '🔒 Verifying SHA-512 Safety Keys',
  },
  {
    id: 'usr_aria',
    email: 'aria.wanderer@outlook.com',
    username: 'aria_wanderlust',
    displayName: 'Aria Montgomery',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    bio: 'Exploring hidden waterfalls and cyberpunk alleys around the globe ✈️📸',
    isOwner: false,
    verifiedTier: 'none',
    snapScore: 32000,
    streakCount: 42,
    followersCount: 12400,
    followingCount: 950,
    discordStatus: 'online',
    customStatus: '🌿 Trekking in Kyoto',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'usr_owner',
    authorName: 'Vraj Rana',
    authorUsername: 'vraj.nexus',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorVerifiedTier: 'founder_free',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Nexus Core Architecture v3.0 deployed ⚡ Zero-knowledge ephemeral messaging, live voice lounges and custom verified badge privileges. The future is encrypted.',
    location: 'Cyber Enclave HQ • Secure Zone',
    createdAt: '20m ago',
    likesCount: 1428,
    isLiked: true,
    isSaved: true,
    tags: ['#Nexus', '#E2EE', '#Design', '#Cyberpunk'],
    comments: [
      {
        id: 'c_1',
        userId: 'usr_elena',
        username: 'elena_design',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        userVerifiedTier: 'verified_blue',
        text: 'The glassmorphic visual hierarchy and E2EE key safety inspection are next level! ✨',
        createdAt: '15m ago',
        likes: 24,
        isLiked: true,
      },
      {
        id: 'c_2',
        userId: 'usr_cipher',
        username: '0xCipher',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        userVerifiedTier: 'verified_obsidian',
        text: 'WebCrypto RSA-OAEP 2048 + AES-GCM 256 validated in sandbox. Zero leaks detected.',
        createdAt: '8m ago',
        likes: 19,
        isLiked: false,
      }
    ],
  },
  {
    id: 'post_2',
    authorId: 'usr_elena',
    authorName: 'Elena Rostova',
    authorUsername: 'elena_design',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    authorVerifiedTier: 'verified_blue',
    mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Brutalist concrete architecture bathed in morning neon lights. Double tap if you appreciate minimal symmetry.',
    location: 'Roppongi Hills, Tokyo',
    createdAt: '2h ago',
    likesCount: 3890,
    isLiked: false,
    isSaved: false,
    tags: ['#Architecture', '#Tokyo', '#Minimalism'],
    comments: [
      {
        id: 'c_3',
        userId: 'usr_kai',
        username: 'kai_audio',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        userVerifiedTier: 'verified_gold',
        text: 'Those shadows look like a synthesizer waveform! 🌊',
        createdAt: '1h ago',
        likes: 12,
      }
    ]
  },
  {
    id: 'post_3',
    authorId: 'usr_kai',
    authorName: 'Kai Takahashi',
    authorUsername: 'kai_audio',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    authorVerifiedTier: 'verified_gold',
    mediaUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Late night modular session in the analog studio. 48 patches, zero computers involved until recording.',
    location: 'Berlin Sound Works',
    createdAt: '5h ago',
    likesCount: 2190,
    isLiked: true,
    isSaved: false,
    tags: ['#Synthesizer', '#Ambient', '#Eurorack'],
    comments: []
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'st_owner',
    authorId: 'usr_owner',
    authorName: 'Vraj Rana',
    authorUsername: 'vraj.nexus',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorVerifiedTier: 'founder_free',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: '⚡ Founder VIP badge with active cryptographic verification live in production!',
    createdAt: '10m ago',
    durationSeconds: 5,
    seen: false,
    isSnapStreak: true,
  },
  {
    id: 'st_elena',
    authorId: 'usr_elena',
    authorName: 'Elena Rostova',
    authorUsername: 'elena_design',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    authorVerifiedTier: 'verified_blue',
    mediaUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Moodboard for upcoming exhibition ✨',
    createdAt: '1h ago',
    durationSeconds: 6,
    seen: false,
    isSnapStreak: true,
  },
  {
    id: 'st_cipher',
    authorId: 'usr_cipher',
    authorName: 'Cipher / ZeroDay',
    authorUsername: '0xCipher',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    authorVerifiedTier: 'verified_obsidian',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Decentralized keys verified. No man-in-the-middle possible.',
    createdAt: '3h ago',
    durationSeconds: 5,
    seen: true,
    isSnapStreak: false,
  },
  {
    id: 'st_aria',
    authorId: 'usr_aria',
    authorName: 'Aria Montgomery',
    authorUsername: 'aria_wanderlust',
    authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    authorVerifiedTier: 'none',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Yosemite dawn reflection 🌲',
    createdAt: '4h ago',
    durationSeconds: 6,
    seen: true,
    isSnapStreak: true,
  }
];

export const INITIAL_DISCORD_SERVERS: DiscordServer[] = [
  {
    id: 'srv_nexus',
    name: 'Nexus Prime',
    icon: '⚡',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    description: 'Official Nexus ecosystem community for verified creators, engineers & visionaries.',
    ownerId: 'usr_owner',
    categories: [
      {
        id: 'cat_general',
        name: 'WELCOME & ANNOUNCEMENTS',
        channels: [
          { id: 'ch_announcements', name: '📢 announcements', type: 'announcement', topic: 'Official updates from Vraj and the Nexus team' },
          { id: 'ch_general', name: '💬 general-chat', type: 'text', topic: 'Main public forum for Nexus community members' },
          { id: 'ch_showcase', name: '✨ creations-showcase', type: 'text', topic: 'Share snaps, renders & crypto experiments' }
        ]
      },
      {
        id: 'cat_crypto',
        name: 'ENCRYPTED CHANNELS (E2EE)',
        channels: [
          { id: 'ch_alpha', name: '🔒 alpha-enclave', type: 'text', isE2EESecured: true, topic: 'SubtleCrypto End-to-End Encrypted channel (Key-gated)' },
          { id: 'ch_security', name: '🛡️ security-audits', type: 'text', isE2EESecured: true, topic: 'Peer cryptographic fingerprint audits & safety checks' }
        ]
      },
      {
        id: 'cat_voice',
        name: 'VOICE & AUDIO STAGES',
        channels: [
          { id: 'ch_lounge', name: '🔊 Creator Lounge', type: 'voice' },
          { id: 'ch_lofi', name: '🎧 Lofi Coding Beats', type: 'voice' },
          { id: 'ch_stage', name: '🎙️ Founder Keynote Stage', type: 'voice' }
        ]
      }
    ]
  },
  {
    id: 'srv_creators',
    name: 'Verified VIP Club',
    icon: '💎',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    description: 'Exclusive lounge for Verified badge holders and Founder.',
    ownerId: 'usr_owner',
    categories: [
      {
        id: 'cat_vip_chat',
        name: 'VIP EXCLUSIVE',
        channels: [
          { id: 'ch_vip_lounge', name: '👑 verified-sanctuary', type: 'text', isE2EESecured: true },
          { id: 'ch_vip_voice', name: '💎 VIP High Table', type: 'voice' }
        ]
      }
    ]
  },
  {
    id: 'srv_gaming',
    name: 'Cyber Gaming Arena',
    icon: '🎮',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    description: 'Competitive squads, clips, scrims and casual play.',
    ownerId: 'usr_kai',
    categories: [
      {
        id: 'cat_gaming_main',
        name: 'GAMING HUB',
        channels: [
          { id: 'ch_game_chat', name: '🎯 game-tactics', type: 'text' },
          { id: 'ch_squad_voice', name: '🔊 Squad Comms 1', type: 'voice' }
        ]
      }
    ]
  }
];

export const INITIAL_DISCORD_MESSAGES: Record<string, DirectMessage[]> = {
  'ch_announcements': [
    {
      id: 'dm_ann_1',
      senderId: 'usr_owner',
      receiverId: 'all',
      channelId: 'ch_announcements',
      plainText: '🚀 Welcome to Nexus! We have unified Instagram visual feeds, Snapchat disappearing snaps & streaks, and Discord encrypted voice lounges into a singular experience. Enjoy lifetime free Verified status as Founder!',
      encryptedPayload: 'U2VjdXJlQW5ub3VuY2VtZW50UGF5bG9hZFZlcmlmaWVk',
      iv: 'aXYxMjM0NTY3ODkw',
      senderPublicKeyFingerprint: 'FOUNDER-E2EE',
      timestamp: 'Today at 10:15 AM',
      isRead: true,
      isDecryptedSuccessfully: true
    }
  ],
  'ch_general': [
    {
      id: 'msg_gen_1',
      senderId: 'usr_elena',
      receiverId: 'all',
      channelId: 'ch_general',
      plainText: 'Hey everyone! Just joined the new server. Loving the custom badge tiers and sound effects!',
      encryptedPayload: 'RWxlbmFDaGF0UGF5bG9hZDEyMw==',
      iv: 'aXZFbGVuYTk5ODg3Nw==',
      senderPublicKeyFingerprint: 'ELENA-BLUE',
      timestamp: 'Today at 10:30 AM',
      isRead: true,
      isDecryptedSuccessfully: true
    },
    {
      id: 'msg_gen_2',
      senderId: 'usr_kai',
      receiverId: 'all',
      channelId: 'ch_general',
      plainText: 'The voice audio stage is crystal clear. Jump in if anyone is around for sound design!',
      encryptedPayload: 'S2FpQXVkaW9QYXlsb2FkMTIz',
      iv: 'aXZLYWkyMzgxOTI=',
      senderPublicKeyFingerprint: 'KAI-GOLD',
      timestamp: 'Today at 10:42 AM',
      isRead: true,
      isDecryptedSuccessfully: true
    }
  ],
  'ch_alpha': [
    {
      id: 'msg_sec_1',
      senderId: 'usr_cipher',
      receiverId: 'all',
      channelId: 'ch_alpha',
      plainText: '🔐 [E2EE Channel Payload] Client-side RSA-OAEP 2048 handshake confirmed. Symmetric AES-256 session keys are regenerated per packet transmission.',
      encryptedPayload: 'Q3J5cHRvQWxwaGFFbmNsYXZlU2VjdXJlU2Vzc2lvbg==',
      iv: 'aVpDaXBoZXIwOTg=',
      senderPublicKeyFingerprint: 'CIPHER-OBSIDIAN',
      timestamp: 'Today at 10:50 AM',
      isRead: true,
      isDecryptedSuccessfully: true
    }
  ]
};

export const INITIAL_DIRECT_MESSAGES: Record<string, DirectMessage[]> = {
  'usr_elena': [
    {
      id: 'dm_1',
      senderId: 'usr_elena',
      receiverId: 'usr_owner',
      plainText: 'Hey Vraj! I sent you the high-resolution brand asset snap. It has a 10-second disappearing timer enabled!',
      encryptedPayload: 'RUJFRUVuY3J5cHRlZFBheWxvYWRFbGVuYVRvVnJhajAwMQ==',
      iv: 'aVZlbGVuYTAwOTk4',
      senderPublicKeyFingerprint: 'ELENA-4920',
      timestamp: '10:48 AM',
      disappearingTimer: 10,
      mediaAttachment: {
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
        type: 'snap_ephemeral',
        viewDuration: 10
      },
      isRead: false,
      isDecryptedSuccessfully: true
    }
  ],
  'usr_cipher': [
    {
      id: 'dm_2',
      senderId: 'usr_cipher',
      receiverId: 'usr_owner',
      plainText: 'Safety fingerprint matched: 48192-59201-92841-02914-58291-38291. Direct tunnel is completely tamper-proof.',
      encryptedPayload: 'Q2lwaGVyRjJFRVBheWxvYWRTdWJ0bGVDcnlwdG8wMDI=',
      iv: 'aVZjaXBoZXI4ODIy',
      senderPublicKeyFingerprint: 'CIPHER-0091',
      timestamp: 'Yesterday',
      isRead: true,
      isDecryptedSuccessfully: true
    }
  ]
};
