import React, { useState } from 'react';
import {
  AppMode,
  UserProfile,
  Post,
  Story,
  DiscordServer,
  DiscordChannel,
  DirectMessage,
  SnapMessage,
  VerifiedBadgeTier,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_DISCORD_SERVERS,
  INITIAL_DISCORD_MESSAGES,
  INITIAL_DIRECT_MESSAGES,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { InstagramFeed } from './components/InstagramFeed';
import { SnapchatView } from './components/SnapchatView';
import { DiscordView } from './components/DiscordView';
import { DirectMessagesView } from './components/DirectMessagesView';
import { ProfileView } from './components/ProfileView';
import { VerifyModal } from './components/VerifyModal';
import { CreatePostModal } from './components/CreatePostModal';
import { StoryViewer } from './components/StoryViewer';
import { sounds } from './utils/audio';

export default function App() {
  // Navigation & User State
  const [currentMode, setCurrentMode] = useState<AppMode>('instagram');
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('usr_owner');

  // Instagram Content State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);

  // Snapchat State
  const [receivedSnaps, setReceivedSnaps] = useState<SnapMessage[]>([
    {
      id: 'snap_1',
      senderId: 'usr_elena',
      receiverId: 'usr_owner',
      mediaUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      caption: 'Kyoto neon rain aesthetic 🌧️ (5s view)',
      viewDuration: 5,
      isOpened: false,
      isBurned: false,
      isE2EE: true,
      streakDay: 185,
      createdAt: '10m ago',
    },
    {
      id: 'snap_2',
      senderId: 'usr_cipher',
      receiverId: 'usr_owner',
      mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      caption: 'Quantum server room patch test 🔐',
      viewDuration: 3,
      isOpened: false,
      isBurned: false,
      isE2EE: true,
      streakDay: 310,
      createdAt: '1h ago',
    },
  ]);

  // Discord State
  const [discordServers, setDiscordServers] = useState<DiscordServer[]>(INITIAL_DISCORD_SERVERS);
  const [activeServerId, setActiveServerId] = useState<string>('srv_nexus');
  const [activeDiscordChannel, setActiveDiscordChannel] = useState<DiscordChannel>(
    INITIAL_DISCORD_SERVERS[0].categories[0].channels[1]
  );
  const [discordMessages, setDiscordMessages] = useState<Record<string, DirectMessage[]>>(
    INITIAL_DISCORD_MESSAGES
  );
  const [connectedVoiceChannel, setConnectedVoiceChannel] = useState<DiscordChannel | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Direct Messages & E2EE State
  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>(
    INITIAL_DIRECT_MESSAGES
  );
  const [activePeerId, setActivePeerId] = useState<string>('usr_elena');

  // Modals & Viewers State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Current Active User Profile
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Switch Active User (Test Owner Free Perks vs Regular Paid Badge)
  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
    sounds.playMessageSent();
  };

  // Upgrade or Switch Verified Badge Tier
  const handleUpgradeTier = (tier: VerifiedBadgeTier) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            verifiedTier: tier,
            verifiedSince: u.verifiedSince || 'Just now',
          };
        }
        return u;
      })
    );

    // Update author badges in posts
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.authorId === currentUser.id) {
          return { ...p, authorVerifiedTier: tier };
        }
        return p;
      })
    );
  };

  // Post Interactions
  const handleToggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleToggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      userVerifiedTier: currentUser.verifiedTier,
      text: commentText,
      createdAt: 'Just now',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleCreateStory = (newStory: Story) => {
    setStories([newStory, ...stories]);
  };

  const handleSendStoryReply = (storyId: string, replyText: string) => {
    const story = stories.find((s) => s.id === storyId);
    if (story && story.authorId !== currentUser.id) {
      handleSendDirectMessage(
        story.authorId,
        `Replied to your story: "${replyText}"`
      );
    }
  };

  const handleShareToDM = (post: Post) => {
    handleSendDirectMessage(
      activePeerId,
      `Shared post by @${post.authorUsername}: "${post.caption}"`
    );
    setCurrentMode('dms');
  };

  // Snapchat handlers
  const handleSendSnap = (
    recipientId: string,
    mediaUrl: string,
    caption: string,
    duration: number
  ) => {
    const newSnap: SnapMessage = {
      id: `snap_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: recipientId,
      mediaUrl,
      caption,
      viewDuration: duration,
      isOpened: false,
      isBurned: false,
      isE2EE: true,
      streakDay: currentUser.streakCount + 1,
      createdAt: 'Just now',
    };

    // Increment streak score
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            streakCount: u.streakCount + 1,
            snapScore: u.snapScore + 10,
          };
        }
        return u;
      })
    );

    // Also send an encrypted DM notification in thread
    handleSendDirectMessage(
      recipientId,
      `📷 [Encrypted Snap Sent - ${duration}s Ephemeral]`,
      duration,
      mediaUrl
    );
  };

  const handleOpenSnap = (snapId: string) => {
    setReceivedSnaps((prev) =>
      prev.map((s) => (s.id === snapId ? { ...s, isOpened: true, isBurned: true } : s))
    );
  };

  // Discord Handlers
  const handleSendDiscordMessage = (channelId: string, text: string) => {
    const newMsg: DirectMessage = {
      id: `disc_msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: 'all',
      channelId,
      plainText: text,
      encryptedPayload: btoa(text),
      iv: btoa('subtle_crypto_iv'),
      senderPublicKeyFingerprint: currentUser.isOwner ? 'FOUNDER-001' : 'WEB-E2EE',
      timestamp: 'Just now',
      isRead: true,
      isDecryptedSuccessfully: true,
    };

    setDiscordMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }));
  };

  const handleConnectVoice = (channel: DiscordChannel) => {
    sounds.playDiscordConnect();
    setConnectedVoiceChannel(channel);
  };

  const handleDisconnectVoice = () => {
    sounds.playDiscordDisconnect();
    setConnectedVoiceChannel(null);
  };

  // Direct Message E2EE Handlers
  const handleSendDirectMessage = (
    receiverId: string,
    plainText: string,
    disappearingTimer?: number,
    mediaUrl?: string
  ) => {
    const newMsg: DirectMessage = {
      id: `dm_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      plainText,
      encryptedPayload: btoa(plainText),
      iv: btoa('iv_' + Date.now()),
      senderPublicKeyFingerprint: currentUser.isOwner ? 'FOUNDER-001' : 'RSA2048-GCM',
      timestamp: 'Just now',
      disappearingTimer,
      mediaAttachment: mediaUrl
        ? {
            url: mediaUrl,
            type: 'image',
            viewDuration: disappearingTimer || 5,
          }
        : undefined,
      isRead: false,
      isDecryptedSuccessfully: true,
    };

    setDirectMessages((prev) => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), newMsg],
    }));
  };

  // Unread & unopened counts
  const unreadDMsCount = (Object.values(directMessages) as DirectMessage[][])
    .flat()
    .filter((m: DirectMessage) => m.receiverId === currentUser.id && !m.isRead).length;

  const unopenedSnapsCount = receivedSnaps.filter(
    (s) => s.receiverId === currentUser.id && !s.isOpened
  ).length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
        unreadDMsCount={unreadDMsCount}
        unopenedSnapsCount={unopenedSnapsCount}
        voiceConnectedServerName={connectedVoiceChannel?.name}
        onDisconnectVoice={handleDisconnectVoice}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Instagram Feed Mode */}
        {currentMode === 'instagram' && (
          <InstagramFeed
            posts={posts}
            stories={stories}
            currentUser={currentUser}
            onOpenStory={(idx) => setActiveStoryIndex(idx)}
            onOpenCreateModal={() => setIsCreatePostModalOpen(true)}
            onToggleLikePost={handleToggleLikePost}
            onToggleSavePost={handleToggleSavePost}
            onAddComment={handleAddComment}
            onShareToDM={handleShareToDM}
          />
        )}

        {/* Snapchat Mode */}
        {currentMode === 'snapchat' && (
          <SnapchatView
            currentUser={currentUser}
            friends={users.filter((u) => u.id !== currentUser.id)}
            receivedSnaps={receivedSnaps}
            onSendSnap={handleSendSnap}
            onOpenSnap={handleOpenSnap}
          />
        )}

        {/* Discord Mode */}
        {currentMode === 'discord' && (
          <DiscordView
            servers={discordServers}
            currentServerId={activeServerId}
            onSelectServer={setActiveServerId}
            activeChannel={activeDiscordChannel}
            onSelectChannel={setActiveDiscordChannel}
            messages={discordMessages[activeDiscordChannel.id] || []}
            currentUser={currentUser}
            allUsers={users}
            onSendMessage={handleSendDiscordMessage}
            connectedVoiceChannel={connectedVoiceChannel}
            onConnectVoice={handleConnectVoice}
            onDisconnectVoice={handleDisconnectVoice}
            isMicMuted={isMicMuted}
            onToggleMic={() => setIsMicMuted(!isMicMuted)}
            isDeafened={isDeafened}
            onToggleDeafen={() => setIsDeafened(!isDeafened)}
          />
        )}

        {/* E2EE Direct Messages Mode */}
        {currentMode === 'dms' && (
          <DirectMessagesView
            currentUser={currentUser}
            allUsers={users}
            activePeerId={activePeerId}
            onSelectPeer={setActivePeerId}
            directMessages={directMessages}
            onSendDirectMessage={handleSendDirectMessage}
          />
        )}

        {/* Profile Mode */}
        {currentMode === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            userPosts={posts.filter((p) => p.authorId === currentUser.id)}
            userStories={stories.filter((s) => s.authorId === currentUser.id)}
            onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
            onEquipBadgeDirect={handleUpgradeTier}
          />
        )}
      </main>

      {/* Verified Badge Hub Modal (Free for Owner / Paid for others) */}
      <VerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        currentUser={currentUser}
        onUpgradeTier={handleUpgradeTier}
      />

      {/* Create Broadcast Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        currentUser={currentUser}
        onCreatePost={handleCreatePost}
        onCreateStory={handleCreateStory}
      />

      {/* Full-Screen Instagram Story Viewer */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          currentUser={currentUser}
          onSendStoryReply={handleSendStoryReply}
        />
      )}
    </div>
  );
}
