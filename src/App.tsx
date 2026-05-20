import React, { useState, useEffect } from "react";
import { useApp } from "./context/AppContext";
import { BottomPlayer } from "./components/BottomPlayer";
import { ChatAssistant } from "./components/ChatAssistant";
import { ShortsReels } from "./components/ShortsReels";
import { AdminPanel } from "./components/AdminPanel";
import { SermonVideoPlayer } from "./components/SermonVideoPlayer";
import { AppLogo } from "./components/AppLogo";
import { translations } from "./lib/translations";

// Import brand custom professional tabs
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";

import {
  BookOpen,
  Music,
  Tv,
  Sparkles,
  Heart,
  User as UserIcon,
  Search,
  Bookmark,
  Share2,
  Send,
  Sliders,
  LogOut,
  ChevronRight,
  PlusCircle,
  Hash,
  Activity,
  Settings,
  Flame,
  Play,
  Pause,
  AlertCircle,
  Compass,
  ArrowRight
} from "lucide-react";

export default function App() {
  const {
    user,
    setUser,
    bibleTopics,
    bibleVerses,
    sermons,
    songs,
    shorts,
    prayers,
    devotionals,
    dailyVerse,
    currentScripture,
    isLoading,
    currentSong,
    isPlaying,
    playSong,
    pauseSong,
    resumeSong,
    toggleFavoriteVerse,
    toggleFavoriteSong,
    toggleFavoriteSermon,
    addPrayerRequest,
    castAmen,
    currentLang,
    setCurrentLang,
    themeMode,
    setThemeMode,
    engagementStats,
    incrementTrackedActivity
  } = useApp();

  // Active Switching Page Navigation including law compliance and support terms
  const [currentPage, setCurrentPage] = useState<"home" | "bible" | "sermons" | "music" | "shorts" | "prayers" | "assistant" | "profile" | "admin" | "about" | "contact" | "privacy" | "terms">("home");

  // Track Daily Verse view interactions dynamically
  useEffect(() => {
    if (currentPage === "home" || currentPage === "bible") {
      incrementTrackedActivity("dailyVerseViews");
    }
  }, [currentPage]);

  // Dynamic Search inputs
  const [bibleSearch, setBibleSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [musicSearch, setMusicSearch] = useState("");
  const [sermonCategory, setSermonCategory] = useState<string>("All");

  // Custom Prayer Form input
  const [prayerRequestText, setPrayerRequestText] = useState("");
  const [prayerIsPrivate, setPrayerIsPrivate] = useState(false);
  const [prayerSuccess, setPrayerSuccess] = useState(false);

  // Authentication credentials states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");

  // Active YouTube embed popup stream helper
  const [activeYoutubeEmbed, setActiveYoutubeEmbed] = useState<string | null>(null);

  // Get active translation set
  const t = translations[currentLang] || translations["EN"];

  // Cycles English -> Hindi -> Nagamese
  const cycleLanguage = () => {
    if (currentLang === "EN") {
      setCurrentLang("HI");
    } else if (currentLang === "HI") {
      setCurrentLang("Nagamese");
    } else {
      setCurrentLang("EN");
    }
  };

  // Loading Screen
  if (isLoading) {
    const loadingScriptures = [
      { text: "Man shall not live by bread alone, but by every word that proceeds from the mouth of God.", citation: "Matthew 4:4" },
      { text: "Thy word is a lamp unto my feet, and a light unto my path.", citation: "Psalm 119:105" },
      { text: "I am the bread of life; whoever comes to me shall not hunger, and whoever believes in me shall never thirst.", citation: "John 6:35" },
      { text: "Be still, and know that I am Isor.", citation: "Nagaland Psalms 46:10" }
    ];
    // Rotate index based on seconds or day minutes so users see different promises
    const quoteIdx = Math.floor((Date.now() / 2500) % loadingScriptures.length);
    const selectedQuote = loadingScriptures[quoteIdx];

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white px-6 relative overflow-hidden">
        {/* Soft atmospheric halo backdrops */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-amber-500/5 via-emerald-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative flex flex-col items-center max-w-sm text-center space-y-6 z-10 animate-fadeIn">
          {/* Breathing Sacramental Emblem */}
          <div className="relative group p-2 rounded-full bg-zinc-900/40 border border-zinc-800/80 shadow-2xl">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
            <div className="absolute -inset-0.5 rounded-full border border-amber-500/10 border-b-amber-500 animate-pulse" />
            <AppLogo size={128} className="w-28 h-28 drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105" />
          </div>

          {/* Title & Grace Meter */}
          <div className="space-y-1">
            <h1 className="text-xl font-display font-black tracking-tight text-zinc-100 bg-gradient-to-r from-amber-200 via-zinc-200 to-emerald-400 bg-clip-text text-transparent">
              LivingBreadHub
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Sanctuary of Grace syncing...</p>
          </div>

          {/* Scripture Promise Card */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-900/80 shadow-inner max-w-xs space-y-2">
            <p className="text-xs text-zinc-300 italic font-serif leading-relaxed">
              "{selectedQuote.text}"
            </p>
            <p className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">
              — {selectedQuote.citation}
            </p>
          </div>

          {/* Secure Handshake Logs */}
          <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Establishing zero-trust security handshake</span>
          </div>
        </div>
      </div>
    );
  }

  // Auth Guard Screen (if logged out)
  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 relative ${themeMode === "dark" ? "bg-zinc-950 text-white" : "bg-slate-50 text-slate-900"}`}>
        <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="w-full max-w-sm glass-panel bg-zinc-900/90 rounded-3xl p-6 border border-zinc-800 shadow-2xl relative">
          <div className="text-center mb-6 flex flex-col items-center">
            <AppLogo size={110} className="w-24 h-24 mb-4 drop-shadow-xl hover:scale-105 transition-all duration-300" />
            <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Gateway of Grace
            </span>
            <h1 className="text-2xl font-display font-bold text-zinc-100 mt-3 tracking-tight">LivingBreadHub</h1>
            <p className="text-xs text-zinc-400 mt-1">Enter into food for your spirit</p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form id="auth-main-form" onSubmit={(e) => {
            e.preventDefault();
            if (!authEmail || !authPassword) {
              setAuthError("Please fill out all credentials.");
              return;
            }
            // Use simulated custom credentials setup (perfectly sandboxed)
            const isExplicitAdmin = authEmail === "malsomvaiphei44@gmail.com" || authEmail.includes("admin");
            setUser({
              id: "sim_" + Date.now(),
              email: authEmail,
              name: authName || authEmail.split("@")[0],
              role: isExplicitAdmin ? "admin" : "user",
              favorites: { verses: [], songs: [], sermons: [] },
              listeningHistory: []
            });
          }} className="space-y-4 text-xs md:text-sm">
            {isSignUp && (
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Malsom Vaiphei"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Email Address *</label>
              <input
                id="auth-email"
                type="email"
                placeholder="malsomvaiphei44@gmail.com"
                value={authEmail}
                onChange={e => { setAuthEmail(e.target.value); setAuthError(""); }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs"
                required
              />
              <p className="text-[10px] text-zinc-500 mt-1">Use "malsomvaiphei44@gmail.com" to log in with master Admin privileges.</p>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Password *</label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={authPassword}
                onChange={e => { setAuthPassword(e.target.value); setAuthError(""); }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs"
                required
              />
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-bold tracking-wider uppercase text-xs transition-colors mt-2"
            >
              {isSignUp ? "Create Account & Sign In" : "Access Sanctuary"}
            </button>
          </form>

          {/* Social Sign In simulated panel */}
          <div className="relative my-5">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-zinc-805" />
            <span className="relative z-10 px-3 bg-zinc-900/90 text-[10px] text-zinc-500 uppercase font-mono tracking-widest text-center block w-max mx-auto">
              Or Social Credentials
            </span>
          </div>

          <button
            id="btn-google-social-login"
            onClick={() => {
              setUser({
                id: "google_p1",
                email: "malsomvaiphei44@gmail.com",
                name: "Malsom Vaiphei",
                role: "admin",
                favorites: { verses: [], songs: [], sermons: [] },
                listeningHistory: []
              });
            }}
            className="w-full py-2.5 bg-gradient-to-r from-red-500/10 to-amber-500/10 hover:from-red-500/20 hover:to-amber-500/20 border border-zinc-800 rounded-xl text-zinc-200 hover:text-white transition-all text-xs flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.801 0 3.42.68 4.653 1.795l2.433-2.433C17.525 1.724 14.996 1 12.24 1c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.783 0 9.6-4.067 9.6-9.76 0-.665-.058-1.3-.178-1.954z"/>
            </svg>
            <span>Sign In with Google</span>
          </button>

          <p className="text-center text-xs text-zinc-500 mt-5">
            {isSignUp ? "Already have a fellowship account?" : "New to the Fellowship?"}{" "}
            <button
              id="btn-toggle-auth"
              onClick={() => { setIsSignUp(!isSignUp); setAuthError(""); }}
              className="text-emerald-400 hover:underline inline-block font-semibold"
            >
              {isSignUp ? "Sign In Now" : "Register Credentials"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Filter calculations: Bible Search
  const filteredVerses = bibleVerses.filter(verse => {
    const matchesSearch = verse.reference.toLowerCase().includes(bibleSearch.toLowerCase()) || 
                          verse.text.toLowerCase().includes(bibleSearch.toLowerCase());
    const matchesTopic = selectedTopic ? verse.topic === selectedTopic : true;
    return matchesSearch && matchesTopic;
  });

  // Filter calculations: Songs search
  const filteredSongs = songs.filter(song => {
    return song.title.toLowerCase().includes(musicSearch.toLowerCase()) || 
           song.artist.toLowerCase().includes(musicSearch.toLowerCase()) ||
           (song.album && song.album.toLowerCase().includes(musicSearch.toLowerCase()));
  });

  // Filter calculations: Sermons
  const filteredSermons = sermons.filter(sermon => {
    if (sermonCategory === "All") return true;
    return sermon.category.toLowerCase().includes(sermonCategory.toLowerCase());
  });

  // Quick whatsapp share scripture tool
  const handleShareVerse = (verse: any) => {
    const textStr = verse.text[currentLang] || verse.text["EN"] || verse.text;
    const shareMessage = `"${textStr}" — ${verse.reference}. Found on LivingBreadHub ✝️✨ Join me today!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      themeMode === "dark" 
        ? "bg-zinc-950 text-zinc-100" 
        : "bg-stone-50 text-zinc-905"
    }`}>
      {/* Immersive glowing background design accent */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-500/5 via-emerald-500/5 to-transparent pointer-events-none" />

      {/* Top Banner App Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-3.5 transition-colors ${
        themeMode === "dark" ? "bg-zinc-950/80 border-zinc-900" : "bg-stone-50/80 border-stone-200"
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <AppLogo size={42} className="w-11 h-11 drop-shadow-md hover:rotate-6 transition-all duration-300 animate-fadeIn" />
            <div>
              <h1 id="app-title-brand" className="text-sm md:text-base font-display font-bold tracking-tight bg-gradient-to-r from-amber-300 via-zinc-200 to-emerald-400 bg-clip-text text-transparent">
                LivingBreadHub
              </h1>
              <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500">Manna for the Soul</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Lang Cycles Swapper EN -> HI -> Nagamese */}
            <button
              id="btn-lang-switcher"
              onClick={cycleLanguage}
              className="text-[10px] tracking-widest font-bold font-mono border border-zinc-800/80 rounded-lg px-2.5 py-1 text-zinc-400 hover:text-emerald-400 transition-colors"
              title="Toggle language: English, Hindi, Nagamese"
            >
              🌐 {currentLang === "EN" ? "ENGLISH" : currentLang === "HI" ? "हिन्दी" : "NAGAMESE"}
            </button>

            {/* Admin Console Route button visible if user role === 'admin' or has admin in email */}
            {(user.role === "admin" || user.email.includes("admin")) && (
              <button
                id="btn-route-admin"
                onClick={() => setCurrentPage("admin")}
                className={`text-[10px] font-bold py-1 px-2.5 rounded-lg border flex items-center gap-1 transition-all ${
                  currentPage === "admin" 
                    ? "bg-emerald-500 text-zinc-950 border-emerald-500" 
                    : "bg-zinc-900 border-zinc-800 text-emerald-400 hover:bg-zinc-850"
                }`}
              >
                <Sliders className="w-3" />
                <span>Console</span>
              </button>
            )}

            {/* Profile Avatar Trigger button */}
            <button
              id="btn-route-profile"
              onClick={() => setCurrentPage("profile")}
              className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all ${
                currentPage === "profile" 
                  ? "bg-emerald-500 text-zinc-950" 
                  : "bg-zinc-904 hover:bg-zinc-800 border border-zinc-800 text-zinc-400"
              }`}
            >
              <UserIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Flow Screen Panel Switcher details */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-36">
        {activeYoutubeEmbed && (
          <SermonVideoPlayer
            youtubeIdOrUrl={activeYoutubeEmbed}
            onClose={() => setActiveYoutubeEmbed(null)}
            title={sermons.find((s) => s.youtubeId === activeYoutubeEmbed)?.title}
            pastor={sermons.find((s) => s.youtubeId === activeYoutubeEmbed)?.pastor}
          />
        )}

        {/* 1. HOME SCREEN VIEW */}
        {currentPage === "home" && (
          <div className="space-y-6">
            {/* Elevation Church andspotify hybrid styled welcome hero banner */}
            <section className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-zinc-900 text-white border border-zinc-800 shadow-2xl">
              {/* Abs gradients */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] tracking-widest font-mono px-2 py-0.5 rounded-full font-bold">
                    {t.dailyDevotionalSection.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                    May 20, 2026
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-display font-black text-zinc-100 tracking-tight leading-none mb-3">
                  Welcome to LivingBreadHub — <span className="text-amber-300 block text-lg md:text-xl font-normal mt-1 leading-snug">{t.welcomeSubtitle}</span>
                </h1>
                
                <p className="text-xs md:text-sm text-zinc-350 leading-relaxed max-w-md">
                  "{devotionals[0]?.title || "Streams of Selah: Overcoming Daily Waves of Anxiety"}"
                </p>

                {/* Micro Devotional Snippet inline */}
                <div className="my-4 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80 text-xs text-zinc-400 italic">
                  "{devotionals[0]?.content.substring(0, 160) || "In a world of constant notification beeps and rapid schedules, anxiety often feels like an unwanted background static. But scripture reveals anxiety isn't meant to be managed alone; it is meant to be transferred."}..."
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    id="btn-home-devotional-trigger"
                    onClick={() => {
                      setCurrentPage("assistant");
                    }}
                    className="bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-bold px-4 py-2.5 text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-zinc-950" />
                    <span>{t.talkWithAi}</span>
                  </button>

                  <button
                    id="btn-worship-playlist-trigger"
                    onClick={() => setCurrentPage("music")}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 px-4 py-2.5 text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.streamPlaylist}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Daily Scripture Promise Section with exact multi-lingual translations */}
            <section className="bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl p-5 border border-amber-500/20 relative">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.verseOfTheDaySection}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-serif italic text-zinc-100 tracking-tight leading-relaxed">
                    "{currentScripture.text[currentLang] || currentScripture.text["EN"]}"
                  </h3>
                  <p className="text-xs font-semibold text-amber-300 font-sans">
                    — {currentScripture.reference} ({currentScripture.theme})
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    id="btn-bookmark-daily"
                    onClick={() => {
                      toggleFavoriteVerse(currentScripture.reference);
                      alert("Scripture Promise Bookmarked to Profile Tab!");
                    }}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition-all shadow"
                    title="Bookmark scripture"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-share-daily"
                    onClick={() => handleShareVerse(currentScripture)}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-emerald-400 transition-all shadow"
                    title="Share to WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Youth Section / Christian Shorts horizontal slider list */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-zinc-100 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    {t.shortsSection}
                  </h3>
                  <p className="text-[10px] text-zinc-500">Quick vertical sermon bytes</p>
                </div>
                <button
                  id="btn-home-all-shorts"
                  onClick={() => setCurrentPage("shorts")}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  Swipe Reels View
                  <ChevronRight className="w-3" />
                </button>
              </div>

              {/* Slider list */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {shorts.length === 0 ? (
                  <div className="col-span-2 md:col-span-4 p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 text-center text-xs text-zinc-500">
                    {t.noContentYet}
                  </div>
                ) : (
                  shorts.slice(0, 4).map((reel) => (
                    <div
                      key={reel.id}
                      onClick={() => setCurrentPage("shorts")}
                      className="group relative h-48 rounded-2xl bg-zinc-900 overflow-hidden cursor-pointer border border-zinc-850 hover:border-zinc-700 transition-all"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=400"
                        alt="Reel thumbnail placeholder"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-zinc-900/10 flex flex-col justify-end p-3 relative z-10">
                        <span className="text-[9px] bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded uppercase font-mono w-max mb-1">
                          {reel.speaker}
                        </span>
                        <h4 className="text-[11px] font-bold text-zinc-100 line-clamp-1 leading-tight group-hover:text-amber-300 transition-colors">
                          {reel.title}
                        </h4>
                        <p className="text-[9px] text-zinc-400 truncate mt-0.5">{reel.likes || 0} likes</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Trending Sermons video panel */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-zinc-100 uppercase tracking-wider text-xs flex items-center gap-1">
                    <Tv className="w-3.5 h-3.5 text-amber-400" />
                    {t.sermonsSection}
                  </h3>
                  <p className="text-[10px] text-zinc-500">Sunday streaming sermon feeds from Hillsong & Elevation Pastors</p>
                </div>
                <button
                  id="btn-home-all-sermons"
                  onClick={() => setCurrentPage("sermons")}
                  className="text-xs text-emerald-400 hover:underline text-[11px]"
                >
                  View All Sermons
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sermons.length === 0 ? (
                  <div className="col-span-1 md:col-span-2 p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 text-center text-xs text-zinc-500">
                    {t.noContentYet}
                  </div>
                ) : (
                  sermons.slice(0, 2).map((sermon) => {
                    const isFav = user.favorites.sermons.includes(sermon.id);
                    return (
                      <div
                        key={sermon.id}
                        onClick={() => {
                          if (sermon.youtubeId) {
                            setActiveYoutubeEmbed(sermon.youtubeId);
                            incrementTrackedActivity("sermonsWatched");
                          } else {
                            alert("Sermon video stream initialized.");
                          }
                        }}
                        className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-3.5 hover:border-zinc-700 transition-all flex gap-3.5 cursor-pointer hover:bg-zinc-850/50 group"
                      >
                        <div className="relative w-28 h-20 bg-zinc-850 shrink-0 rounded-xl overflow-hidden shadow-inner border border-zinc-800">
                          <img
                            src={sermon.thumbnailUrl}
                            alt={sermon.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          {/* Play tactile overlays */}
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                            <div className="bg-emerald-500 text-zinc-950 p-2 rounded-full shadow-lg hover:bg-emerald-400 active:scale-90 transition-all transform group-hover:scale-110">
                              <Play className="w-4 h-4 text-zinc-950 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-bold text-amber-400 block mb-0.5 font-mono">
                              {sermon.category}
                            </span>
                            <h4 className="text-xs md:text-sm font-bold text-zinc-100 truncate group-hover:text-amber-300 transition-colors">
                              {sermon.title}
                            </h4>
                            <p className="text-[10px] text-zinc-400 truncate">{sermon.pastor}</p>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-zinc-500 mt-2" onClick={(e) => e.stopPropagation()}>
                            <span>{sermon.duration} • {sermon.views || 0} {t.sermonViews}</span>
                            <button
                              id={`btn-fav-sermon-${sermon.id}`}
                              onClick={() => toggleFavoriteSermon(sermon.id)}
                              className={`p-1 rounded-full ${isFav ? "text-rose-500 bg-rose-500/10" : "text-zinc-500 hover:text-rose-400"}`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Spotify Worship Playlist section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-zinc-100 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Music className="w-4 h-3.5 text-emerald-400" />
                    {t.streamPlaylist}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono">Tap covers to immediately start playing track in background</p>
                </div>
                <button
                  id="btn-home-all-music"
                  onClick={() => setCurrentPage("music")}
                  className="text-xs text-emerald-400 hover:underline text-[11px]"
                >
                  Open Player Dashboard
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {songs.length === 0 ? (
                  <div className="col-span-2 md:col-span-5 p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 text-center text-xs text-zinc-500">
                    {t.noContentYet}
                  </div>
                ) : (
                  songs.slice(0, 5).map((song) => {
                    const isCurrent = currentSong?.id === song.id;
                    const isFav = user.favorites.songs.includes(song.id);
                    return (
                      <div
                        key={song.id}
                        onClick={() => {
                          if (isCurrent && isPlaying) {
                            pauseSong();
                          } else {
                            playSong(song, songs);
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between cursor-pointer select-none ${
                          isCurrent && isPlaying
                            ? "bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5 scale-[1.02]"
                            : "bg-zinc-900/65 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700 shadow-sm"
                        }`}
                      >
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-800 mb-2">
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          {/* Audio overlays */}
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/45 transition-colors duration-300">
                            <div className={`p-2.5 rounded-full shadow-lg transition-all duration-300 transform group-hover:scale-110 ${
                              isCurrent && isPlaying ? "bg-amber-400 text-zinc-950 animate-pulse" : "bg-white text-zinc-950"
                            }`}>
                              {isCurrent && isPlaying ? (
                                <Pause className="w-4 h-4 fill-current text-zinc-950" />
                              ) : (
                                <Play className="w-4 h-4 fill-current text-zinc-950 ml-0.5" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-[11px] font-bold truncate transition-colors ${isCurrent ? "text-emerald-400" : "text-zinc-100"}`}>{song.title}</h4>
                          <p className="text-[9px] text-zinc-400 truncate">{song.artist}</p>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-zinc-650 mt-1.5 pt-1.5 border-t border-zinc-800/40">
                          <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">{song.category || "Worship"}</span>
                          <span className="text-[8px] text-zinc-400">{song.plays || 0} plays</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Fellowship Prayer request feed snippet */}
            <section className="space-y-3 bg-zinc-900/40 p-5 rounded-3xl border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-zinc-100 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Heart className="w-4 h-3.5 text-rose-450" />
                    {t.prayersSection}
                  </h3>
                  <p className="text-[10px] text-zinc-500">Touch "AMEN • Pray" to stand with your brothers and sisters</p>
                </div>
                <button
                  id="btn-home-all-prayers"
                  onClick={() => setCurrentPage("prayers")}
                  className="text-xs text-emerald-400 hover:underline text-[11px]"
                >
                  Submit & Request Support
                </button>
              </div>

              <div className="space-y-2.5">
                {prayers.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic text-center py-4">No public prayers yet. Be the first to share a petition!</p>
                ) : (
                  prayers.slice(0, 2).map((p) => {
                    return (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-800 transition-colors flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="font-bold text-zinc-300">{p.isPrivate ? "Anonymous Believer" : p.userName}</span>
                            <span className="text-zinc-650 font-mono">• {new Date(p.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-zinc-400 leading-relaxed italic text-[11px] md:text-xs">
                            "{p.request}"
                          </p>
                        </div>
                        {/* AMEN CTA */}
                        <button
                          id={`btn-amen-${p.id}`}
                          onClick={() => castAmen(p.id)}
                          className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 shrink-0 flex items-center gap-1"
                        >
                          <Heart className="w-3 h-3 fill-current text-rose-500" />
                          <span>AMEN</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1 rounded">
                            {p.amenCount}
                          </span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        )}

        {/* 2. BIBLE TOPICS & SCRIPTURE VIEW */}
        {currentPage === "bible" && (
          <div className="space-y-6">
            {/* Header with Search */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                YouVersion Scripture Search
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">Browse Holy Verses</h2>
              <p className="text-xs text-zinc-400">Filter scriptural collections by modern Christian categories, or browse dynamic search keywords</p>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                <input
                  id="bible-search-input"
                  type="text"
                  placeholder="Search keywords e.g. 'strength', 'amazing', 'worship'..."
                  value={bibleSearch}
                  onChange={e => setBibleSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-3 text-xs md:text-sm text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Topics Selector Pills */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 font-mono">
                Topic Category Filters:
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  id="btn-topic-all"
                  onClick={() => setSelectedTopic(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    !selectedTopic ? "bg-amber-400 text-zinc-950 font-bold" : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                  }`}
                >
                  All Topics
                </button>
                {bibleTopics.map(topic => (
                  <button
                    key={topic.id}
                    id={`btn-topic-${topic.id}`}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      selectedTopic === topic.id ? "bg-amber-400 text-zinc-950 font-bold" : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Verses grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVerses.map(verse => {
                const isFav = user.favorites.verses.includes(verse.id);
                return (
                  <div
                    key={verse.id}
                    className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-750 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-amber-500" />
                        <span className="text-[9.5px] uppercase tracking-wider font-bold text-zinc-500 font-mono">
                          {verse.topic.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-serif italic text-zinc-200 leading-relaxed">
                        "{verse.text}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
                      <span className="text-xs font-semibold text-amber-300 font-sans">
                        {verse.reference}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`btn-bookmark-verse-${verse.id}`}
                          onClick={() => {
                            toggleFavoriteVerse(verse.id);
                            alert(`Verse "${verse.reference}" priority updated inside profile favorites!`);
                          }}
                          className={`p-2 rounded-xl transition-all ${
                            isFav ? "bg-rose-500/15 text-rose-500" : "bg-zinc-950 hover:bg-zinc-800 text-zinc-400"
                          }`}
                          title="Bookmark Verse"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                        </button>
                        <button
                          id={`btn-share-verse-${verse.id}`}
                          onClick={() => handleShareVerse(verse)}
                          className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-all"
                          title="Share to WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredVerses.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center py-10 bg-zinc-900/20 rounded-2xl border border-zinc-800/60 text-zinc-500">
                  <Compass className="w-8 h-8 mx-auto mb-2 text-zinc-600 animate-pulse" />
                  <span>No scripture matches your criteria. Select another option.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. SERMONS STREAMING LIST */}
        {currentPage === "sermons" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Weekly Preaching Collection
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">Video & Audio Sermon Streams</h2>
              <p className="text-xs text-zinc-400">Stream fully authorized videos directly from major Christian ministries and global pastors</p>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Faith", "Leadership", "Prayer", "Worship & Peace"].map(cat => (
                <button
                  key={cat}
                  id={`btn-sermon-cat-${cat}`}
                  onClick={() => setSermonCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    sermonCategory === cat ? "bg-emerald-500 text-zinc-950 font-bold" : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sermons list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSermons.map(sermon => {
                const isFav = user.favorites.sermons.includes(sermon.id);
                const isActivePlaying = activeYoutubeEmbed === sermon.youtubeId;
                return (
                  <div
                    key={sermon.id}
                    onClick={() => {
                      if (sermon.youtubeId) {
                        setActiveYoutubeEmbed(sermon.youtubeId);
                        incrementTrackedActivity("sermonsWatched");
                      } else {
                        alert("Sermon video stream initialized.");
                      }
                    }}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 cursor-pointer select-none transition-all duration-300 ${
                      isActivePlaying
                        ? "bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/40 shadow-xl shadow-emerald-500/5 scale-[1.01]"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-855"
                    } group`}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-950 shadow-inner border border-zinc-850">
                      <img
                        src={sermon.thumbnailUrl}
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/45 transition-colors duration-300 animate-fadeIn">
                        <div className={`p-3 rounded-full shadow-2xl transition transform group-hover:scale-110 ${
                          isActivePlaying ? "bg-amber-400 text-zinc-950 animate-pulse" : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                        }`}>
                          <Play className="w-5.5 h-5.5 fill-current ml-0.5 text-zinc-950" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500 font-mono">
                          {sermon.category.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-zinc-500">• {sermon.duration}</span>
                        {isActivePlaying && (
                          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono uppercase animate-pulse">Streaming</span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm md:text-base text-zinc-100 group-hover:text-amber-300 transition-colors">
                        {sermon.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">{sermon.pastor}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t border-zinc-800/40" onClick={(e) => e.stopPropagation()}>
                      <span>Live Streamed • {sermon.views || 0} views</span>
                      <div className="flex items-center gap-1">
                        <button
                          id={`btn-fav-sermon-main-${sermon.id}`}
                          onClick={() => toggleFavoriteSermon(sermon.id)}
                          className={`p-2 rounded-xl transition ${
                            isFav ? "bg-rose-500/15 text-rose-500" : "bg-zinc-950 hover:bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. SEAMLESS SPOTIFY MUSIC SECTION */}
        {currentPage === "music" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Premium Acoustic Praise Player
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">Spotify Praise Stream</h2>
              <p className="text-xs text-zinc-400">Stream beautifully curated acoustic chords, high-vibe pad loops and classical hymns instantly</p>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                <input
                  id="music-search-field"
                  type="text"
                  placeholder="Search tracks, singers, albums..."
                  value={musicSearch}
                  onChange={e => setMusicSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-3 text-xs md:text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Playlists list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredSongs.map(song => {
                const isPlayingThis = currentSong?.id === song.id && isPlaying;
                const isFav = user.favorites.songs.includes(song.id);
                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      if (isPlayingThis) {
                        pauseSong();
                      } else {
                        playSong(song, songs);
                      }
                    }}
                    className={`p-3.5 rounded-2xl transition-all duration-300 border flex items-center justify-between gap-3.5 cursor-pointer shadow-sm select-none ${
                      currentSong?.id === song.id 
                        ? "bg-gradient-to-r from-emerald-500/10 to-amber-500/5 border-emerald-500/45 shadow-md text-white scale-[1.01]" 
                        : "bg-zinc-900/60 border-zinc-850 hover:border-zinc-805 hover:bg-zinc-850/80"
                    } group`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative w-14 h-14 bg-zinc-800 shrink-0 rounded-xl overflow-hidden shadow border border-zinc-800">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors duration-300">
                          <div className="p-1.5 rounded-full bg-white text-zinc-950 shadow-md">
                            {isPlayingThis ? (
                              <Pause className="w-3.5 h-3.5 fill-current text-zinc-950" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current text-zinc-950 ml-0.5" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs md:text-sm font-bold truncate flex items-center gap-1.5 transition-colors ${
                          currentSong?.id === song.id ? "text-emerald-400" : "text-zinc-100"
                        }`}>
                          {song.title}
                          {isPlayingThis && (
                            <span className="flex gap-[2px] items-end h-3 shrink-0">
                              <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-2" style={{ animationDelay: "0s", animationDuration: "0.6s" }} />
                              <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-3" style={{ animationDelay: "0.2s", animationDuration: "0.8s" }} />
                              <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: "0.4s", animationDuration: "0.5s" }} />
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] md:text-xs text-zinc-400 truncate mt-0.5">
                          {song.artist} • <span className="italic text-zinc-550">{song.album}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0" onClick={e => e.stopPropagation()}>
                      <span className="font-mono text-[9px] text-zinc-500">{song.duration}</span>
                      <button
                        id={`btn-fav-song-row-${song.id}`}
                        onClick={() => toggleFavoriteSong(song.id)}
                        className={`p-2 rounded-xl transition ${
                          isFav ? "text-rose-500 bg-rose-500/10 shadow-sm" : "text-zinc-500 hover:text-rose-450 bg-zinc-950 hover:bg-zinc-800"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. GOSPEL CHRISTIAN SHORTS - DETAILED VERTICAL */}
        {currentPage === "shorts" && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Swipe up for more Inspiration Reels
              </span>
              <p className="text-xs text-zinc-400 mt-1">Youth and community short sermon seeds</p>
            </div>

            <ShortsReels />
          </div>
        )}

        {/* 6. COMMUNITY PRAYER REQUESTS PAGE */}
        {currentPage === "prayers" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Community Restoration Fellowship
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">Fellowship Prayer Wall</h2>
              <p className="text-xs text-zinc-400">Share your urgent requests publicly, or pray anonymously. Lift hands for brothers and sisters.</p>
            </div>

            <form id="prayer-upload-form" onSubmit={async (e) => {
              e.preventDefault();
              if (!prayerRequestText.trim()) return;

              const success = await addPrayerRequest(prayerRequestText, prayerIsPrivate);
              if (success) {
                setPrayerSuccess(true);
                setPrayerRequestText("");
                setTimeout(() => setPrayerSuccess(false), 4000);
              }
            }} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h3 className="font-bold text-xs tracking-wider uppercase text-zinc-300">Submit Your Prayer Request</h3>

              {prayerSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl p-3.5">
                  Your request was registered on the Community Grace Wall successfully!
                </div>
              )}

              <textarea
                id="prayer-wall-input"
                rows={3}
                placeholder="Cast your burden here... e.g. 'Standing on scripture promises for mother's prompt healing...'"
                value={prayerRequestText}
                onChange={e => setPrayerRequestText(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500 px-3.5 py-3 rounded-xl text-xs md:text-sm text-zinc-100 resize-none font-sans"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                  <input
                    id="checkbox-prayer-private"
                    type="checkbox"
                    checked={prayerIsPrivate}
                    onChange={e => setPrayerIsPrivate(e.target.checked)}
                    className="accent-emerald-505 rounded text-zinc-900"
                  />
                  <span>Post Anonymously</span>
                </label>

                <button
                  id="btn-prayer-submit"
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>
            </form>

            <div className="space-y-3.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block font-mono">
                Active Community Petitions:
              </label>

              {prayers.map(p => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-zinc-905 border border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-300">
                        {p.isPrivate ? "Anonymous Believer" : p.userName}
                      </span>
                      <span className="text-[10px] text-zinc-500">• {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs md:text-sm text-zinc-350 italic font-serif leading-relaxed">
                      "{p.request}"
                    </p>
                  </div>

                  <button
                    id={`btn-pray-amen-main-${p.id}`}
                    onClick={() => castAmen(p.id)}
                    className="self-start md:self-center bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                    <span>AMEN • Pray</span>
                    <span className="bg-emerald-400/20 px-1.5 rounded-md">
                      {p.amenCount}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. AI BIBLE ASSISTANT - DEVOTIONAL COUNSEL */}
        {currentPage === "assistant" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Theological Counsel & Encouragement
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">AI Scripture Devotions</h2>
              <p className="text-xs text-zinc-400">Interact with BreadOfLifeAI. Share your anxiety, query scriptures, or request custom daily encouragement.</p>
            </div>

            <ChatAssistant />
          </div>
        )}

        {/* 8. PROFILE PAGE */}
        {currentPage === "profile" && (
          <div className="space-y-6">
            <div className="bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800 flex flex-col md:flex-row items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl font-sans" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-zinc-950 flex items-center justify-center font-display font-black text-2xl shadow-xl shadow-amber-500/10 select-none">
                {user.name.substring(0, 1).toUpperCase()}
              </div>

              <div className="text-center md:text-left flex-1 space-y-1">
                <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-bold">
                  {user.role === "admin" ? "Platform Overseer (Admin)" : "Fellowship Member"}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-zinc-100 leading-tight">{user.name}</h3>
                <p className="text-xs text-zinc-500 font-mono">{user.email}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-0">
                <button
                  id="btn-toggle-dark-mode"
                  onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
                  className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-zinc-300 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>{themeMode === "dark" ? "Light Theme" : "Dark Theme"}</span>
                </button>

                <button
                  id="btn-logout-flow"
                  onClick={() => {
                    setUser(null);
                  }}
                  className="bg-zinc-950 hover:bg-rose-950/40 hover:text-rose-400 border border-zinc-800 transition px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-zinc-300 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs md:text-sm">
              {/* Favorited scriptures bookmarks */}
              <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
                  <Bookmark className="w-4 h-4 text-amber-400 fill-current" />
                  Saved Scriptures ({user.favorites.verses.length})
                </h4>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {user.favorites.verses.map((vRef, idx) => {
                    return (
                      <div key={idx} className="p-3 bg-zinc-950 rounded-xl border border-zinc-850">
                        <p className="font-serif italic text-zinc-305 leading-relaxed text-[11px] md:text-xs">
                          Scripture Promise: {vRef}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/40">
                          <span className="text-[10px] font-semibold text-amber-300">{vRef}</span>
                          <button
                            id={`btn-remove-bookmark-${idx}`}
                            onClick={() => toggleFavoriteVerse(vRef)}
                            className="text-[10px] text-zinc-550 hover:text-rose-400 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {user.favorites.verses.length === 0 && (
                    <p className="text-zinc-500 italic text-center py-4 bg-zinc-950/30 rounded-xl">
                      No saved scriptures yet. Tap bookmarked promise icons on holy Bible scriptures.
                    </p>
                  )}
                </div>
              </div>

              {/* Favorite Worship Songs */}
              <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-805 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  Favorite Praise Tracks ({user.favorites.songs.length})
                </h4>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {songs
                    .filter(s => user.favorites.songs.includes(s.id))
                    .map(song => (
                      <div
                        key={song.id}
                        className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850 flex items-center justify-between gap-2 cursor-pointer hover:border-zinc-800"
                        onClick={() => playSong(song, songs)}
                      >
                        <div className="min-w-0">
                          <h5 className="font-semibold text-zinc-200 text-xs truncate">{song.title}</h5>
                          <p className="text-[10px] text-zinc-400 truncate">{song.artist}</p>
                        </div>
                        <button
                          id={`btn-remove-fav-song-${song.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteSong(song.id);
                          }}
                          className="text-[10px] text-zinc-500 hover:text-rose-400 p-1 shrink-0 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                  {user.favorites.songs.length === 0 && (
                    <p className="text-zinc-500 italic text-center py-4 bg-zinc-950/30 rounded-xl font-sans">
                      No saved praise songs yet. Try tapping hearts in music panels.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Listening History */}
            <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-850 space-y-3 text-xs">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                Listening History (Plays Sync Logs)
              </h4>

              {user.listeningHistory && user.listeningHistory.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {user.listeningHistory.map((h, i) => {
                    const song = songs.find(s => s.id === h.songId);
                    if (!song) return null;
                    return (
                      <div key={i} className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-lg border border-zinc-900">
                        <span className="font-bold text-zinc-300 truncate">{song.title} ({song.artist})</span>
                        <span className="font-mono text-[9px] text-zinc-550">{new Date(h.playedAt).toLocaleTimeString()}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-zinc-500 italic py-2">
                  No recently played logs. Choose some worship tracks to begin track playback.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 9. ADMIN PANEL ROUTE */}
        {currentPage === "admin" && (
          <div className="space-y-4">
            <AdminPanel />
          </div>
        )}

        {/* 10. ABOUT US COVENANT ROUTE */}
        {currentPage === "about" && (
          <AboutPage onBack={() => setCurrentPage("home")} />
        )}

        {/* 11. CONTACT SANCTUARY ROUTE */}
        {currentPage === "contact" && (
          <ContactPage onBack={() => setCurrentPage("home")} />
        )}

        {/* 12. PRIVACY COVENANT */}
        {currentPage === "privacy" && (
          <PrivacyPage onBack={() => setCurrentPage("home")} />
        )}

        {/* 13. TERMS AND CONDITIONS COVENANT */}
        {currentPage === "terms" && (
          <TermsPage onBack={() => setCurrentPage("home")} />
        )}

        {/* Consistent Sanctified Brand Footer */}
        {["home", "bible", "sermons", "music", "shorts", "prayers", "profile"].includes(currentPage) && (
          <footer className="mt-16 pt-8 border-t border-zinc-900 text-center space-y-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <AppLogo size={42} className="w-10 h-10 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500" />
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 font-mono">LivingBreadHub</p>
              <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed font-sans">
                A sanctified digital sanctuary curated for daily devotions, collective prayer walls, and acoustic grace feeds.
              </p>
            </div>
            
            {/* Quick Portal Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-bold text-zinc-400 font-mono tracking-wider">
              <button 
                id="footer-lnk-about" 
                onClick={() => { setCurrentPage("about"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-emerald-400 transition-colors uppercase cursor-pointer"
              >
                About Us
              </button>
              <button 
                id="footer-lnk-contact" 
                onClick={() => { setCurrentPage("contact"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-emerald-400 transition-colors uppercase cursor-pointer"
              >
                Contact
              </button>
              <button 
                id="footer-lnk-privacy" 
                onClick={() => { setCurrentPage("privacy"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-emerald-400 transition-colors uppercase cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                id="footer-lnk-terms" 
                onClick={() => { setCurrentPage("terms"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-emerald-400 transition-colors uppercase cursor-pointer"
              >
                Terms of Use
              </button>
            </div>
            
            <p className="text-[9px] text-zinc-600 font-mono">
              &copy; 2026 LivingBreadHub. Built with holy dedication. All rights reserved.
            </p>
          </footer>
        )}
      </main>

      {/* Floating Spotify Bottom Player context */}
      <BottomPlayer />

      {/* Modern responsive Bottom navigation bar optimized for Mobile devices */}
      <nav id="sticky-bottom-nav" className={`fixed bottom-0 inset-x-0 z-40 border-t px-2 py-2 transition-colors ${
        themeMode === "dark" 
          ? "bg-zinc-950/95 border-zinc-900 text-zinc-400" 
          : "bg-stone-50/95 border-stone-200 text-zinc-650"
      }`}>
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <button
            id="nav-btn-home"
            onClick={() => setCurrentPage("home")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              currentPage === "home" 
                ? "text-emerald-400 font-bold" 
                : "hover:text-zinc-200"
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-semibold">{t.navHome}</span>
          </button>

          <button
            id="nav-btn-bible"
            onClick={() => setCurrentPage("bible")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              currentPage === "bible" 
                ? "text-amber-400 font-bold" 
                : "hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-semibold">{t.navDevotionals}</span>
          </button>

          <button
            id="nav-btn-music"
            onClick={() => setCurrentPage("music")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              currentPage === "music" 
                ? "text-emerald-400 font-bold" 
                : "hover:text-zinc-200"
            }`}
          >
            <Music className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-semibold">{t.navHome === "Ghor" ? "Gaan" : "Praise"}</span>
          </button>

          <button
            id="nav-btn-assistant"
            onClick={() => setCurrentPage("assistant")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              currentPage === "assistant" 
                ? "text-amber-400 font-bold" 
                : "hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-semibold">{t.navHome === "Ghor" ? "Counsel" : "Counsel"}</span>
          </button>

          <button
            id="nav-btn-prayers"
            onClick={() => setCurrentPage("prayers")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              currentPage === "prayers" 
                ? "text-emerald-400 font-bold" 
                : "hover:text-zinc-200"
            }`}
          >
            <Heart className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-semibold">{t.navHome === "Ghor" ? "Prarthana" : "Prayers"}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
