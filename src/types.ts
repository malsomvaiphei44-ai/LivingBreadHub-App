export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  favorites: {
    verses: string[]; // Verse IDs
    songs: string[];  // Song IDs
    sermons: string[]; // Sermon IDs
  };
  listeningHistory: {
    songId: string;
    playedAt: string;
  }[];
}

export interface BibleTopic {
  id: string;
  name: string; // Faith, Prayer, Healing, Anxiety, Love, Worship, Forgiveness, Salvation, Leadership
  description: string;
}

export interface BibleVerse {
  id: string;
  reference: string; // e.g. "Hebrews 11:1"
  text: string;
  topic: string; // category id
  bookmarked?: boolean;
}

export interface Sermon {
  id: string;
  title: string;
  pastor: string;
  category: string;
  duration: string;
  youtubeId?: string;
  videoUrl?: string; // For MP4 uploads simulation
  audioUrl?: string; // Optional audio version
  thumbnailUrl: string;
  views: number;
  date: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  plays: number;
  category?: string;
}

export interface ShortReel {
  id: string;
  title: string;
  speaker: string;
  videoUrl: string; // MP4 placeholder
  caption: string;
  likes: number;
  shares: number;
}

export interface PrayerRequest {
  id: string;
  userEmail: string;
  userName: string;
  request: string;
  isPrivate: boolean;
  amenCount: number;
  createdAt: string;
  amens?: string[]; // email of users who added AMEN
}

export interface Devotional {
  id: string;
  title: string;
  date: string;
  bibleReadings: string[];
  content: string;
  reflection: string;
  author: string;
}
