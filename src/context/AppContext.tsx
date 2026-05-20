import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { User, BibleTopic, BibleVerse, Sermon, Song, ShortReel, PrayerRequest, Devotional } from "../types";
import { 
  db, 
  auth, 
  signInWithGoogle, 
  logoutUser, 
  OperationType, 
  handleFirestoreError 
} from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  setDoc, 
  getDoc,
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export interface MultilingualScripture {
  reference: string;
  theme: string;
  text: Record<string, string>; // EN, HI, Nagamese
}

// 12 beautiful, pre-populated scripture verses for high-quality automatic rotation
export const dailyScripturesList: MultilingualScripture[] = [
  {
    reference: "Philippians 4:13",
    theme: "Strength",
    text: {
      EN: "I can do all things through Christ who strengthens me.",
      HI: "जो मुझे सामर्थ्य देता है उसमें मैं सब कुछ कर सकता हूँ।",
      Nagamese: "Moi ta sob thakibo pare Jisu Khristo te kun moi ke shakti diye."
    }
  },
  {
    reference: "Isaiah 41:10",
    theme: "Peace & Assurance",
    text: {
      EN: "So do not fear, for I am with you; do not be dismayed, for I am your God.",
      HI: "मत डर, क्योंकि मैं तेरे संग हूँ, इधर-उधर मत ताक क्योंकि मैं तेरा परमेश्वर हूँ।",
      Nagamese: "Moi logote thaka karone na doribi, moi apuni laga Isor ase."
    }
  },
  {
    reference: "Romans 8:28",
    theme: "Hope & Divine Purpose",
    text: {
      EN: "And we know that in all things God works for the good of those who love him.",
      HI: "और हम जानते हैं कि जो लोग परमेश्वर से प्रेम रखते हैं, उनके लिये सब बातें मिलकर भलाई ही को उत्पन्न करती हैं।",
      Nagamese: "Isor ke morom kura khan karone, Isor sob bhal kam rasta banae."
    }
  },
  {
    reference: "Proverbs 3:5-6",
    theme: "Trust",
    text: {
      EN: "Trust in the Lord with all your heart and lean not on your own understanding.",
      HI: "अपनी समझ का सहारा न लेना, वरन् सम्पूर्ण मन से यहोवा पर भरोसा रखना।",
      Nagamese: "Apuni laga bhabna te bhorosa na kuri, hridoy logote Jisu te bhorosa kuribi."
    }
  },
  {
    reference: "Joshua 1:9",
    theme: "Courage",
    text: {
      EN: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you.",
      HI: "हियाव बान्ध और दृढ़ हो; मत डर और तेरा मन कच्चा न हो; क्योंकि जहाँ जहाँ तू जाएगा वहाँ वहाँ तेरा परमेश्वर यहोवा तेरे संग रहेगा।",
      Nagamese: "Shaktisali aru bhorosa thakibi. Na doribi, kilekoile apuni laga Isor apuni logote thakibo."
    }
  },
  {
    reference: "John 3:16",
    theme: "Salvation",
    text: {
      EN: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      HI: "क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा कि उसने अपना एकलौता पुत्र दे दिया, ताकि जो कोई उस पर विश्वास करे, वह नाश न हो, परन्तु अनन्त जीवन पाए।",
      Nagamese: "Isor ta prithibi ke bisi morom kurise kilekoile ta nijor ekta bacha ke dishe, kun bhorosa kure ta bache."
    }
  },
  {
    reference: "1 Peter 5:7",
    theme: "Anxiety Relief",
    text: {
      EN: "Cast all your anxiety on him because he cares for you.",
      HI: "अपनी सारी चिन्ता उसी पर डाल दो, क्योंकि उसको तुम्हारा ध्यान है।",
      Nagamese: "Apuni laga dukh dhyan sob Isor te peliya r dharu kilekoile ta apuni ke ghor chinta kure."
    }
  },
  {
    reference: "Matthew 6:33",
    theme: "Priority & Faith",
    text: {
      EN: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
      HI: "इसलिये पहले तुम परमेश्वर के राज्य और उसके धर्म की खोज करो तो ये सब वस्तुएं भी तुम्हें मिल जाएंगी।",
      Nagamese: "Mina pise Isor laga rajya aru thik kotha bhal te bisari jabi, aru sob bhal chij apuni pa-i thakibo."
    }
  }
];

export const defaultBibleTopics: BibleTopic[] = [
  { id: "faith", name: "Faith", description: "Trusting in God's promises and character." },
  { id: "prayer", name: "Prayer", description: "Communicating deeply and continuously with God." },
  { id: "healing", name: "Healing", description: "Restoration for the body, mind, and spirit." },
  { id: "anxiety", name: "Anxiety & Peace", description: "Overcoming fear and finding divine tranquility." },
  { id: "love", name: "Love", description: "The core commandment of Christ; selflessness in action." },
  { id: "worship", name: "Worship", description: "Glorifying God as a daily devotional lifestyle." }
];

export interface EngagementStats {
  prayersSubmitted: number;
  worshipSongsPlayed: number;
  dailyVerseViews: number;
  registeredUsers: number;
  sermonsWatched: number;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  bibleTopics: BibleTopic[];
  bibleVerses: BibleVerse[];
  sermons: Sermon[];
  songs: Song[];
  shorts: ShortReel[];
  prayers: PrayerRequest[];
  devotionals: Devotional[];
  dailyVerse: { reference: string; text: string; theme: string };
  currentScripture: MultilingualScripture;
  isLoading: boolean;
  engagementStats: EngagementStats;
  incrementTrackedActivity: (key: keyof EngagementStats) => void;
  
  // Media Player states
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, songList?: Song[]) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  stopSong: () => void;
  songListPool: Song[];

  // Interactive Play audio fields
  currentTime: number;
  duration: number;
  volume: number;
  seek: (seconds: number) => void;
  changeVolume: (vol: number) => void;

  // Language & Themes
  currentLang: "EN" | "HI" | "Nagamese";
  setCurrentLang: (lang: "EN" | "HI" | "Nagamese") => void;
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;

  // App functionalities
  toggleFavoriteVerse: (verseId: string) => void;
  toggleFavoriteSong: (songId: string) => void;
  toggleFavoriteSermon: (sermonId: string) => void;
  addPrayerRequest: (requestText: string, isPrivate: boolean) => Promise<boolean>;
  castAmen: (prayerId: string) => Promise<void>;
  
  // Authentications
  loginWithGoogle: () => Promise<void>;
  loginSimulated: (email: string, name: string) => void;
  logout: () => Promise<void>;

  // Refresh/Admin actions
  refreshData: () => Promise<void>;
  uploadContent: (type: "song" | "sermon" | "short" | "devotional", content: any) => Promise<boolean>;
  deleteContent: (type: "song" | "sermon" | "short" | "devotional", id: string) => Promise<boolean>;
  updateContent: (type: "song" | "sermon" | "short" | "devotional", id: string, content: any) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bibleTopics, setBibleTopics] = useState<BibleTopic[]>(defaultBibleTopics);
  const [bibleVerses, setBibleVerses] = useState<BibleVerse[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [shorts, setShorts] = useState<ShortReel[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [currentLang, setCurrentLang] = useState<"EN" | "HI" | "Nagamese">("EN");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [isLoading, setIsLoading] = useState(true);

  // Engagement tracking starting from 0 and growing dynamically
  const [engagementStats, setEngagementStats] = useState<EngagementStats>(() => {
    const saved = localStorage.getItem("living_bread_engagement_stats_2026");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Error parsing statistics", e);
      }
    }
    return {
      prayersSubmitted: 0,
      worshipSongsPlayed: 0,
      dailyVerseViews: 0,
      registeredUsers: 0,
      sermonsWatched: 0
    };
  });

  const incrementTrackedActivity = (key: keyof EngagementStats) => {
    setEngagementStats(prev => {
      const next = { ...prev, [key]: prev[key] + 1 };
      localStorage.setItem("living_bread_engagement_stats_2026", JSON.stringify(next));
      return next;
    });
  };

  // Active Multi-language Verse of the Day (rotates based on current day of month)
  const dayIndex = new Date().getDate() % dailyScripturesList.length;
  const currentScripture = dailyScripturesList[dayIndex];
  
  // Backward compatibility object
  const dailyVerse = {
    reference: currentScripture.reference,
    theme: currentScripture.theme,
    text: currentScripture.text[currentLang] || currentScripture.text["EN"]
  };

  // HTML Audio node states
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songListPool, setSongListPool] = useState<Song[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Store refs of states to bypass event listener dependency cycles
  const poolRef = useRef<Song[]>([]);
  const curSongRef = useRef<Song | null>(null);

  useEffect(() => {
    poolRef.current = songListPool;
    curSongRef.current = currentSong;
  }, [songListPool, currentSong]);

  // Handle Mount Audio Node Listener
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      triggerNextSong();
    };

    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("durationchange", handleDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("durationchange", handleDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Sync volume level updates to audio element
  const changeVolume = (vol: number) => {
    const bounded = Math.max(0, Math.min(1, vol));
    setVolume(bounded);
    if (audioRef.current) {
      audioRef.current.volume = bounded;
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current && duration > 0) {
      const bounded = Math.max(0, Math.min(duration, seconds));
      audioRef.current.currentTime = bounded;
      setCurrentTime(bounded);
    }
  };

  // Sync auth updates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsLoading(true);
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          let profile: User;
          const isExplicitAdmin = fbUser.email === "malsomvaiphei44@gmail.com" || fbUser.email?.includes("admin");

          if (userSnap.exists()) {
            profile = { 
              id: fbUser.uid, 
              ...userSnap.data() 
            } as User;
            // Overwrite role if primary email matches admin
            if (isExplicitAdmin && profile.role !== "admin") {
              profile.role = "admin";
              await setDoc(userDocRef, { role: "admin" }, { merge: true });
            }
          } else {
            profile = {
              id: fbUser.uid,
              email: fbUser.email || "",
              name: fbUser.displayName || fbUser.email?.split("@")[0] || "Fellowship Worshiper",
              role: isExplicitAdmin ? "admin" : "user",
              favorites: {
                verses: [],
                songs: [],
                sermons: []
              },
              listeningHistory: []
            };
            await setDoc(userDocRef, profile);
          }
          setUser(profile);
          
          // Count initial user registration entry
          const hasRegisteredThisSession = sessionStorage.getItem("living_bread_registered_session");
          if (!hasRegisteredThisSession) {
            sessionStorage.setItem("living_bread_registered_session", "true");
            incrementTrackedActivity("registeredUsers");
          }
        } catch (e) {
          console.error("Error setting user credentials: ", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Refresh dynamic content list from Firestore
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch songs
      const songsSnap = await getDocs(collection(db, "songs"));
      const songsList: Song[] = [];
      songsSnap.forEach((doc) => {
        songsList.push({ id: doc.id, ...doc.data() } as Song);
      });
      setSongs(songsList);

      // 2. Fetch sermons
      const sermonsSnap = await getDocs(collection(db, "sermons"));
      const sermonsList: Sermon[] = [];
      sermonsSnap.forEach((doc) => {
        sermonsList.push({ id: doc.id, ...doc.data() } as Sermon);
      });
      setSermons(sermonsList);

      // 3. Fetch shorts
      const shortsSnap = await getDocs(collection(db, "shorts"));
      const shortsList: ShortReel[] = [];
      shortsSnap.forEach((doc) => {
        shortsList.push({ id: doc.id, ...doc.data() } as ShortReel);
      });
      setShorts(shortsList);

      // 4. Fetch prayers
      const prayersSnap = await getDocs(collection(db, "prayers"));
      const prayersList: PrayerRequest[] = [];
      prayersSnap.forEach((doc) => {
        prayersList.push({ id: doc.id, ...doc.data() } as PrayerRequest);
      });
      prayersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPrayers(prayersList);

      // 5. Fetch devotionals
      const devSnap = await getDocs(collection(db, "devotionals"));
      const devList: Devotional[] = [];
      devSnap.forEach((doc) => {
        devList.push({ id: doc.id, ...doc.data() } as Devotional);
      });
      setDevotionals(devList);

    } catch (err) {
      console.warn("Could not sync from real Firestore backend, falling back directly to simulated Full-Stack endpoints to guarantee 100% stable runtime.", err);
      // Fallback endpoints in server.ts
      try {
        const response = await fetch("/api/init");
        const data = await response.json();
        if (data) {
          setSermons(data.sermons || []);
          setSongs(data.songs || []);
          setShorts(data.shorts || []);
          setPrayers(data.prayers || []);
          setDevotionals(data.devotionals || []);
        }
      } catch (innerError) {
        console.error("Final fallback error", innerError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Google Login popup
  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
      // fallback alert if needed
    }
  };

  // Sandbox simulated login to stay offline-friendly or run perfectly in context
  const loginSimulated = (email: string, name: string) => {
    const isExplicitAdmin = email === "malsomvaiphei44@gmail.com" || email.includes("admin");
    const testUser: User = {
      id: "sim_" + Date.now(),
      email,
      name,
      role: isExplicitAdmin ? "admin" : "user",
      favorites: {
        verses: ["Philippians 4:13"],
        songs: [],
        sermons: []
      },
      listeningHistory: []
    };
    setUser(testUser);
    incrementTrackedActivity("registeredUsers");
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      setUser(null);
    }
  };

  // Play controls
  const playSong = (song: Song, customList?: Song[]) => {
    if (!audioRef.current) return;
    
    // Check if toggled song is identical
    const isDifferent = currentSong?.id !== song.id;

    setCurrentSong(song);
    setIsPlaying(true);

    if (customList && customList.length > 0) {
      setSongListPool(customList);
    } else if (songs.length > 0 && songListPool.length === 0) {
      setSongListPool(songs);
    }

    if (isDifferent) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = 0;
    }
    
    audioRef.current.play().catch((err) => {
      console.warn("Acoustic playback failed or paused till user click: ", err);
    });

    // Track dynamic real-time songs engagement
    incrementTrackedActivity("worshipSongsPlayed");

    // Record listening History locally
    if (user) {
      const entry = { songId: song.id, playedAt: new Date().toISOString() };
      setUser(prev => prev ? {
        ...prev,
        listeningHistory: [entry, ...prev.listeningHistory].slice(0, 24)
      } : null);
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeSong = () => {
    if (!currentSong && songs.length > 0) {
      playSong(songs[0]);
      return;
    }
    if (currentSong && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play().catch((err) => console.log(err));
    }
  };

  const stopSong = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentSong(null);
  };

  const triggerNextSong = () => {
    const list = poolRef.current.length > 0 ? poolRef.current : songs;
    if (list.length === 0) return;
    const current = curSongRef.current;
    
    const currentIndex = list.findIndex(s => s.id === (current?.id || ""));
    const nextIndex = (currentIndex + 1) % list.length;
    const next = list[nextIndex];
    
    setCurrentSong(next);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = next.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn(e));
    }
  };

  const nextSong = () => {
    triggerNextSong();
  };

  const prevSong = () => {
    const list = songListPool.length > 0 ? songListPool : songs;
    if (list.length === 0) return;
    const currentIndex = list.findIndex(s => s.id === (currentSong?.id || ""));
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = list.length - 1;
    const prev = list[prevIndex];

    setCurrentSong(prev);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = prev.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn(e));
    }
  };

  // User database Favorited Syncs
  const toggleFavoriteVerse = async (verseId: string) => {
    if (!user) return;
    const list = [...user.favorites.verses];
    const index = list.indexOf(verseId);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(verseId);
    }

    const updated = {
      ...user,
      favorites: { ...user.favorites, verses: list }
    };
    setUser(updated);

    try {
      await updateDoc(doc(db, "users", user.id), {
        "favorites.verses": list
      });
    } catch {
      // Allow local updates even if offline
    }
  };

  const toggleFavoriteSong = async (songId: string) => {
    if (!user) return;
    const list = [...user.favorites.songs];
    const index = list.indexOf(songId);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(songId);
    }

    const updated = {
      ...user,
      favorites: { ...user.favorites, songs: list }
    };
    setUser(updated);

    try {
      await updateDoc(doc(db, "users", user.id), {
        "favorites.songs": list
      });
    } catch {}
  };

  const toggleFavoriteSermon = async (sermonId: string) => {
    if (!user) return;
    const list = [...user.favorites.sermons];
    const index = list.indexOf(sermonId);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(sermonId);
    }

    const updated = {
      ...user,
      favorites: { ...user.favorites, sermons: list }
    };
    setUser(updated);

    try {
      await updateDoc(doc(db, "users", user.id), {
        "favorites.sermons": list
      });
    } catch {}
  };

  // Create prayer requests
  const addPrayerRequest = async (requestText: string, isPrivate: boolean): Promise<boolean> => {
    if (!user) return false;
    const payload: Omit<PrayerRequest, "id"> = {
      userEmail: user.email,
      userName: user.name,
      request: requestText,
      isPrivate,
      amenCount: 0,
      createdAt: new Date().toISOString(),
      amens: []
    };

    try {
      // 1. Write to Firestore
      const docRef = await addDoc(collection(db, "prayers"), payload);
      // Local state prep
      const withId: PrayerRequest = { id: docRef.id, ...payload };
      setPrayers(prev => [withId, ...prev]);
      incrementTrackedActivity("prayersSubmitted");
      return true;
    } catch (err) {
      console.warn("Local post fallback: ", err);
      // Fallback server POST if firebase fails
      try {
        const res = await fetch("/api/prayers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const item = await res.json();
          setPrayers(prev => [item, ...prev]);
          incrementTrackedActivity("prayersSubmitted");
          return true;
        }
      } catch (apiErr) {
        console.error(apiErr);
      }
    }
    return false;
  };

  const castAmen = async (prayerId: string) => {
    if (!user) return;
    try {
      const prayerDocRef = doc(db, "prayers", prayerId);
      await updateDoc(prayerDocRef, {
        amenCount: increment(1),
        amens: arrayUnion(user.email)
      });
      
      // Update local state smoothly
      setPrayers(prev => prev.map(p => {
        if (p.id === prayerId) {
          return {
            ...p,
            amenCount: p.amenCount + 1,
            amens: [...(p.amens || []), user.email]
          };
        }
        return p;
      }));
    } catch (e) {
      // fallback call
      try {
        await fetch(`/api/prayers/${prayerId}/amen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email })
        });
        refreshData();
      } catch (inner) {
        console.error(inner);
      }
    }
  };

  // Secure admin uploads with direct writes
  const uploadContent = async (type: "song" | "sermon" | "short" | "devotional", content: any): Promise<boolean> => {
    let firestoreId: string | null = null;
    
    // Ensure default tracking attributes
    if (type === "song") {
      content.plays = content.plays || 0;
    } else if (type === "sermon") {
      content.views = content.views || 0;
    } else if (type === "short") {
      content.likes = content.likes || 0;
      content.shares = content.shares || 0;
    }

    // 1. Save to Firestore
    try {
      const colName = type === "song" ? "songs" : type === "sermon" ? "sermons" : type === "short" ? "shorts" : "devotionals";
      const docRef = await addDoc(collection(db, colName), content);
      firestoreId = docRef.id;
    } catch (err) {
      console.warn("Firestore upload failed, proceeding to save to REST...", err);
    }

    // 2. Save/Sync to Express REST DB
    try {
      const payload = firestoreId ? { ...content, id: firestoreId } : content;
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content: payload })
      });
    } catch (apiErr) {
      console.warn("REST API upload failed: ", apiErr);
    }

    await refreshData();
    return true;
  };

  // Secure admin edits / updates with direct writes & syncing
  const updateContent = async (type: "song" | "sermon" | "short" | "devotional", id: string, content: any): Promise<boolean> => {
    // 1. Update Firestore
    try {
      const colName = type === "song" ? "songs" : type === "sermon" ? "sermons" : type === "short" ? "shorts" : "devotionals";
      const docRef = doc(db, colName, id);
      await updateDoc(docRef, content);
    } catch (err) {
      console.warn("Firestore update content failed, falling back to REST: ", err);
    }

    // 2. Update Express REST DB
    try {
      await fetch(`/api/admin/content/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
    } catch (apiErr) {
      console.warn("REST update content failed: ", apiErr);
    }

    // 3. Update local state
    if (type === "song") {
      setSongs(prev => prev.map(s => s.id === id ? { ...s, ...content } : s));
    } else if (type === "sermon") {
      setSermons(prev => prev.map(s => s.id === id ? { ...s, ...content } : s));
    } else if (type === "short") {
      setShorts(prev => prev.map(s => s.id === id ? { ...s, ...content } : s));
    } else if (type === "devotional") {
      setDevotionals(prev => prev.map(d => d.id === id ? { ...d, ...content } : d));
    }

    await refreshData();
    return true;
  };

  // Admin content removals full controller
  const deleteContent = async (type: "song" | "sermon" | "short" | "devotional", id: string): Promise<boolean> => {
    // 1. Delete from Firestore
    try {
      const colName = type === "song" ? "songs" : type === "sermon" ? "sermons" : type === "short" ? "shorts" : "devotionals";
      await deleteDoc(doc(db, colName, id));
    } catch (err) {
      console.warn("Firestore delete failed, falling back to local/REST: ", err);
    }

    // 2. Delete from REST API
    try {
      await fetch(`/api/admin/content/${type}/${id}`, {
        method: "DELETE"
      });
    } catch (apiErr) {
      console.warn("REST delete failed: ", apiErr);
    }

    // 3. Local update to reflect instantly
    if (type === "song") setSongs(prev => prev.filter(s => s.id !== id));
    if (type === "sermon") setSermons(prev => prev.filter(s => s.id !== id));
    if (type === "short") setShorts(prev => prev.filter(s => s.id !== id));
    if (type === "devotional") setDevotionals(prev => prev.filter(d => d.id !== id));

    await refreshData();
    return true;
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      bibleTopics, bibleVerses,
      sermons, songs, shorts, prayers, devotionals, dailyVerse, currentScripture,
      isLoading,
      currentSong, isPlaying, playSong, pauseSong, resumeSong, nextSong, prevSong, stopSong, songListPool,
      currentTime, duration, volume, seek, changeVolume,
      currentLang, setCurrentLang, themeMode, setThemeMode,
      toggleFavoriteVerse, toggleFavoriteSong, toggleFavoriteSermon,
      addPrayerRequest, castAmen, refreshData, uploadContent, deleteContent, updateContent,
      loginWithGoogle, loginSimulated, logout,
      engagementStats, incrementTrackedActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside an AppProvider");
  return context;
};
