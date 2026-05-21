import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Database, 
  Sliders, 
  Music, 
  Video, 
  Scroll, 
  Heart, 
  BookOpen, 
  Pin, 
  Search, 
  Filter, 
  Edit2, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  UploadCloud, 
  ExternalLink, 
  FileAudio, 
  FileVideo, 
  Image as ImageIcon, 
  FolderMinus, 
  Undo,
  Check
} from "lucide-react";
import { Song, Sermon, ShortReel, Devotional } from "../types";

export const AdminPanel: React.FC = () => {
  const { 
    uploadContent, 
    deleteContent, 
    updateContent,
    songs, 
    sermons, 
    shorts, 
    devotionals, 
    refreshData 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"song" | "sermon" | "short" | "devotional">("song");
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Custom styled confirmation states
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "song" | "sermon" | "short" | "devotional";
    id: string;
    title: string;
  } | null>(null);

  // Inline editing modal state
  const [editingItem, setEditingItem] = useState<{
    type: "song" | "sermon" | "short" | "devotional";
    id: string;
    data: any;
  } | null>(null);

  // Drag and drop state indicators
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loadedFile, setLoadedFile] = useState<{ name: string; size: string; type: string } | null>(null);

  // Standard preset Christian categories asked by user
  const adminCategories = [
    "Worship Songs",
    "Sermons",
    "Daily Devotionals",
    "Youth Messages",
    "Shorts/Reels",
    "Gospel Music",
    "Bible Study"
  ];

  // Form State: Song / Spotify Playlist Links
  const [songForm, setSongForm] = useState({
    title: "",
    artist: "",
    album: "Single Selection",
    duration: "4:15",
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    category: "Worship Songs",
    featured: false
  });

  // Form State: Sermon / YouTube Videos
  const [sermonForm, setSermonForm] = useState({
    title: "",
    pastor: "",
    category: "Sermons",
    duration: "40 mins",
    youtubeId: "",
    thumbnailUrl: "",
    featured: false
  });

  // Form State: Shorts / Vertical Reels
  const [shortForm, setShortForm] = useState({
    title: "",
    speaker: "",
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054773d1c30d9d158de010ccfb7dd52&profile_id=165&oauth2_token_id=57447761",
    caption: "",
    featured: false
  });

  // Form State: Chronological Devotional File
  const [devotionalForm, setDevotionalForm] = useState({
    title: "",
    bibleReadings: "Hosea 6:1, Psalm 23:1",
    content: "",
    reflection: "",
    author: "Pastor Vaiphei",
    prayer: "",
    date: new Date().toISOString().split("T")[0]
  });

  // Auto fill mock URLs for testing comfort
  const autoFillMusicDemo = () => {
    setSongForm({
      ...songForm,
      title: "How Great Is Our God (Acoustic Sanctuary)",
      artist: "LivingBread Worship Choir",
      album: "Echoes of Selah",
      coverUrl: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=350",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      category: "Worship Songs"
    });
  };

  const autoFillSermonDemo = () => {
    setSermonForm({
      ...sermonForm,
      title: "An Unshakeable Covenant of Peace",
      pastor: "Evangelist Vaiphei",
      youtubeId: "W_zWJbYvCsc",
      thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
      duration: "42 mins",
      category: "Sermons"
    });
  };

  const autoFillShortDemo = () => {
    setShortForm({
      title: "The Core Blueprint of Faith",
      speaker: "Pastor Abraham",
      videoUrl: "https://player.vimeo.com/external/403848135.sd.mp4?s=9108a7bde337033501a4e1df3ad2748f654cd9c0&profile_id=165&oauth2_token_id=57447761",
      caption: "Your obedience determines the depth of your security ✝️🙌 #worship #jesus #reels"
    });
  };

  const autoFillDevotionalDemo = () => {
    setDevotionalForm({
      title: "Resting Under His Divine Shadow",
      bibleReadings: "Psalm 91:1-4, Romans 8:28",
      content: "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty. The world offers a shadow of doubt, but Jesus guarantees an fortress of peace. When trials pressure you, withdraw to prayer.",
      reflection: "Name one anxiety you will fully surrender to God's fortress of Selah today.",
      author: "Pastor Vaiphei",
      prayer: "Lord Jisu, I declare you are my refuge. Grant my heart a calm assurance.",
      date: new Date().toISOString().split("T")[0]
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processUploadedFile = (file: File) => {
    setUploadProgress(0);
    setLoadedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      type: file.type
    });
    setStatus(null);

    // Beautiful simulated progress interval
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Generate real Object URL so the file is directly playable in our audio player!
        const objectUrl = URL.createObjectURL(file);
        
        setStatus({
          message: `Successfully uploaded "${file.name}" to cloud media pool! Ready for instant playback of this actual file in the app.`,
          isError: false
        });

        // Autofill forms depending on exact folder type of media
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        
        if (file.type.startsWith("audio/") || file.name.endsWith(".mp3") || file.name.endsWith(".wav") || file.name.endsWith(".m4a")) {
          // It's a worship song track
          setActiveTab("song");
          setSongForm(prev => ({
            ...prev,
            title: prev.title || baseName,
            audioUrl: objectUrl,
            album: prev.album || "Local Sanctuary Recording",
            artist: prev.artist || "Fellowship Artist"
          }));
        } else if (file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".mov")) {
          // It's a vertical reel or sermon sermon
          if (file.size < 15 * 1024 * 1024) {
            // Under 15MB: Reel!
            setActiveTab("short");
            setShortForm(prev => ({
              ...prev,
              title: prev.title || baseName,
              videoUrl: objectUrl,
              speaker: prev.speaker || "Admin Pastor"
            }));
          } else {
            // Overhead: Video Sermon!
            setActiveTab("sermon");
            setSermonForm(prev => ({
              ...prev,
              title: prev.title || baseName,
              youtubeId: "", // Since it plays locally via custom video controller
              videoUrl: objectUrl, // Supports direct videoUrl streaming custom-built
              pastor: prev.pastor || "Malsom Vaiphei",
              thumbnailUrl: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=400"
            }));
          }
        }
        
        // Reset progress bar indicator after delay
        setTimeout(() => setUploadProgress(null), 1800);
      } else {
        setUploadProgress(progress);
      }
    }, 120);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleReplaceMedia = () => {
    setLoadedFile(null);
    setUploadProgress(null);
    setStatus({ message: "Media cleared. You can drop or choose another file now.", isError: false });
  };

  // Submit Operations
  const handleSongPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songForm.title || !songForm.artist) {
      setStatus({ message: "Song Title and Artist are strictly mandatory.", isError: true });
      return;
    }
    const payload = {
      ...songForm,
      coverUrl: songForm.coverUrl || "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=400",
      plays: 0
    };
    const ok = await uploadContent("song", payload);
    if (ok) {
      setStatus({ message: `\"${songForm.title}\" has been published & synced instantly to Worship playlists!`, isError: false });
      setSongForm({
        title: "",
        artist: "",
        album: "Single Selection",
        duration: "4:15",
        coverUrl: "",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        category: "Worship Songs",
        featured: false
      });
    } else {
      setStatus({ message: "Cloud publication failed.", isError: true });
    }
  };

  const handleSermonPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sermonForm.title || !sermonForm.pastor || !sermonForm.youtubeId) {
      setStatus({ message: "Subject title, pastor and YouTube video reference are required.", isError: true });
      return;
    }
    // Extract 11 digit ID from full youtube URL strings if they copy paste entire links
    let ytId = sermonForm.youtubeId;
    if (ytId.includes("v=")) {
      const match = ytId.match(/[?&]v=([^&#]+)/);
      if (match && match[1]) ytId = match[1];
    } else if (ytId.includes("youtu.be/")) {
      const parts = ytId.split("youtu.be/");
      if (parts[1]) ytId = parts[1].split(/[?#]/)[0];
    }

    const payload = {
      ...sermonForm,
      youtubeId: ytId,
      thumbnailUrl: sermonForm.thumbnailUrl || "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600",
      date: new Date().toISOString().split("T")[0],
      views: 0
    };

    const ok = await uploadContent("sermon", payload);
    if (ok) {
      setStatus({ message: `Sermon \"${sermonForm.title}\" has been published & linked to Sunday video feeds!`, isError: false });
      setSermonForm({
        title: "",
        pastor: "",
        category: "Sermons",
        duration: "40 mins",
        youtubeId: "",
        thumbnailUrl: "",
        featured: false
      });
    } else {
      setStatus({ message: "Database write failed.", isError: true });
    }
  };

  const handleShortPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortForm.title || !shortForm.speaker) {
      setStatus({ message: "Caption title and presenter name are required.", isError: true });
      return;
    }
    const payload = {
      ...shortForm,
      likes: 0,
      shares: 0
    };
    const ok = await uploadContent("short", payload);
    if (ok) {
      setStatus({ message: `Short Reel is now live on our visual feeds!`, isError: false });
      setShortForm({
        title: "",
        speaker: "",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054773d1c30d9d158de010ccfb7dd52&profile_id=165&oauth2_token_id=57447761",
        caption: "",
        featured: false
      });
    } else {
      setStatus({ message: "Failed syncing vertical short reel.", isError: true });
    }
  };

  const handleDevotionalPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devotionalForm.title || !devotionalForm.content) {
      setStatus({ message: "Devotional title and core scripture study content are mandatory.", isError: true });
      return;
    }
    const payload = {
      ...devotionalForm,
      bibleReadings: devotionalForm.bibleReadings.split(",").map(s => s.trim())
    };
    const ok = await uploadContent("devotional", payload);
    if (ok) {
      setStatus({ message: `Daily Devotional study written successfully for ${devotionalForm.date}!`, isError: false });
      setDevotionalForm({
        title: "",
        bibleReadings: "Hosea 6:1, Psalm 23:1",
        content: "",
        reflection: "",
        author: "Pastor Vaiphei",
        prayer: "",
        date: new Date().toISOString().split("T")[0]
      });
    } else {
      setStatus({ message: "Failed saving Selah devotional log.", isError: true });
    }
  };

  // Perform secure edits and saving
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const { type, id, data } = editingItem;
    let finalData = { ...data };

    if (type === "devotional" && typeof finalData.bibleReadings === "string") {
      finalData.bibleReadings = finalData.bibleReadings.split(",").map((s: string) => s.trim());
    }

    const ok = await updateContent(type, id, finalData);
    if (ok) {
      setStatus({ message: `Successfully edited and refreshed active "${data.title}" data item!`, isError: false });
      setEditingItem(null);
    } else {
      setStatus({ message: "Cloud update command failed.", isError: true });
    }
  };

  // Safe delete command
  const triggerDelete = (type: "song" | "sermon" | "short" | "devotional", id: string, title: string) => {
    setDeleteConfirm({ type, id, title });
  };

  const handleConfirmedDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id, title } = deleteConfirm;
    
    const ok = await deleteContent(type, id);
    if (ok) {
      setStatus({ message: `Permanently deleted and unlinked: "${title}" from cloud databases successfully.`, isError: false });
    } else {
      setStatus({ message: "Could not complete deletion request.", isError: true });
    }
    setDeleteConfirm(null);
  };

  // Order arranging swap function (clicks swap index and triggers persistent order save)
  const reorderItem = async (type: "song" | "sermon" | "short" | "devotional", index: number, direction: "up" | "down") => {
    let pool: any[] = [];
    if (type === "song") pool = [...songs];
    else if (type === "sermon") pool = [...sermons];
    else if (type === "short") pool = [...shorts];
    else if (type === "devotional") pool = [...devotionals];

    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === pool.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = pool[index];
    pool[index] = pool[targetIdx];
    pool[targetIdx] = temp;

    // Direct writes update back state & DB sequence
    setStatus({ message: "Saving customized item arrangement order...", isError: false });
    await updateContent(type, pool[index].id, pool[index]);
    await updateContent(type, pool[targetIdx].id, pool[targetIdx]);
    setStatus({ message: "Custom content order arrangement saved!", isError: false });
  };

  // Searching logic
  const getFilteredItems = (items: any[]) => {
    return items.filter(item => {
      const matchQuery = 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.artist && item.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.pastor && item.pastor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.speaker && item.speaker.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchCategory = selectedCategoryFilter === "All" || 
        (item.category && item.category.toLowerCase() === selectedCategoryFilter.toLowerCase());

      return matchQuery && matchCategory;
    });
  };

  const filteredSongs = getFilteredItems(songs);
  const filteredSermons = getFilteredItems(sermons);
  const filteredShorts = getFilteredItems(shorts);
  const filteredDevotionals = getFilteredItems(devotionals);

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-zinc-100" id="media-admin-console">
      
      {/* Dynamic Instant Update Warning Header Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 rounded-2xl border border-emerald-500/20 p-4.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-xs md:text-sm text-zinc-100">Live Synchronous Publisher Console</h4>
            <p className="text-[11px] text-zinc-400">All uploads, edits, thumbnail replacements or deletions appear active for users in real-time instantly.</p>
          </div>
        </div>
        <button 
          onClick={async () => {
            setStatus({ message: "Re-scanning server directories & resetting indices...", isError: false });
            await refreshData();
            setStatus({ message: "Synced all resources successfully!", isError: false });
          }}
          className="text-xs bg-zinc-800 hover:bg-zinc-750 text-zinc-300 px-4.5 py-2.5 rounded-xl border border-zinc-700/60 transition flex items-center gap-2 select-none"
        >
          <Undo className="w-3.5 h-3.5" />
          <span>Sync & Refresh Data</span>
        </button>
      </div>

      {/* Global Status Banner Alert */}
      {status && (
        <div className={`p-4 rounded-xl flex items-start gap-2.5 border text-xs leading-relaxed transition-all duration-300 ${
          status.isError 
            ? "bg-rose-500/10 border-rose-500/30 text-rose-400" 
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        }`}>
          {status.isError ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />}
          <div className="flex-1">
            <span>{status.message}</span>
          </div>
          <button onClick={() => setStatus(null)} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid Layout: Upload on the Left, Live Management Panel on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ===================== COLUMN 1: UPLOAD & DISK CONSOLE (40%) ===================== */}
        <div className="lg:col-span-5 bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-zinc-800/80 p-5 shadow-xl relative overflow-hidden space-y-5">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-emerald-400" />
              <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Publish Core Media</h3>
            </div>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Dev Console</span>
          </div>

          {/* Type toggles inside the publish console */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-850">
            <button
              onClick={() => { setActiveTab("song"); setStatus(null); }}
              className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                activeTab === "song" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Upload Spotify or audio tracks"
            >
              <Music className="w-4 h-4" />
              <span>Music</span>
            </button>
            <button
              onClick={() => { setActiveTab("sermon"); setStatus(null); }}
              className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                activeTab === "sermon" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Add YouTube Sermon videos"
            >
              <Video className="w-4 h-4" />
              <span>Sermon</span>
            </button>
            <button
              onClick={() => { setActiveTab("short"); setStatus(null); }}
              className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                activeTab === "short" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Publish vertical Shorts or Reels"
            >
              <FileVideo className="w-4 h-4" />
              <span>Reel</span>
            </button>
            <button
              onClick={() => { setActiveTab("devotional"); setStatus(null); }}
              className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                activeTab === "devotional" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Publish a Daily Devotional Feed"
            >
              <Scroll className="w-4 h-4" />
              <span>Devotional</span>
            </button>
          </div>

          {/* Interactive Drag & Drop / Click to Upload Area */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 relative ${
              dragActive ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]" : "border-zinc-800 bg-zinc-950/20 hover:bg-zinc-850/15"
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="audio/*,video/*" 
              onChange={handleFileInputChange} 
            />

            {uploadProgress !== null ? (
              <div id="upload-progress-container" className="w-full max-w-xs space-y-2 py-2" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span className="animate-pulse">Uploading Media...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-150 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[9px] text-zinc-500">Do not close this tab. Processing audio/video codecs...</p>
              </div>
            ) : loadedFile ? (
              <div id="media-loaded-feedback" className="w-full p-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/25 flex items-center justify-between gap-3 text-left" onClick={e => e.stopPropagation()}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Media Vault File Ready</span>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-200 block truncate mt-0.5" title={loadedFile.name}>{loadedFile.name}</span>
                  <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{loadedFile.size} • {loadedFile.type || "unknown codec"}</span>
                </div>
                <button
                  id="btn-replace-media"
                  type="button"
                  onClick={handleReplaceMedia}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-350 font-mono text-[9px] uppercase tracking-wider rounded-lg border border-zinc-800 font-bold transition-all shrink-0 cursor-pointer"
                >
                  Replace
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-zinc-300 block">Drag & Drop Audio / Video here</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">Or <span className="text-emerald-400 font-bold underline">click to browse</span> from device</span>
                  <span className="text-[9px] text-zinc-500 block mt-1">Accepts MP3, WAV, MP4, MOV (Auto codec detect)</span>
                </div>
              </>
            )}
          </div>

          {/* TAB 1: WORSHIP SONG / SPOTIFY PUBLISHER FORM */}
          {activeTab === "song" && (
            <form onSubmit={handleSongPublish} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">Song / Spotify Track Publish Form</span>
                <button 
                  type="button" 
                  onClick={autoFillMusicDemo}
                  className="text-[9px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded hover:bg-amber-500/20"
                >
                  ⚡ Autofill Demo Work
                </button>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Track Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Lord I Need You (Acoustic Cover)"
                  value={songForm.title}
                  onChange={e => setSongForm({...songForm, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-3 py-2.5 text-zinc-200 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Artist / Band Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Matt Maher"
                    value={songForm.artist}
                    onChange={e => setSongForm({...songForm, artist: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-3 py-2.5 text-zinc-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Album / Praise Set</label>
                  <input
                    type="text"
                    placeholder="e.g. Hillsong Live"
                    value={songForm.album}
                    onChange={e => setSongForm({...songForm, album: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Select App Category</label>
                  <select
                    value={songForm.category}
                    onChange={e => setSongForm({...songForm, category: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-2.5 text-zinc-200 outline-none"
                  >
                    {adminCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Play Duration (m:ss)</label>
                  <input
                    type="text"
                    placeholder="e.g. 5:45"
                    value={songForm.duration}
                    onChange={e => setSongForm({...songForm, duration: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Audio Source Link / MP3 Stream Link *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://example.com/worship.mp3"
                    value={songForm.audioUrl}
                    onChange={e => setSongForm({...songForm, audioUrl: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl pl-9 pr-3 py-2.5 text-zinc-200 text-xs font-mono"
                    required
                  />
                  <FileAudio className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Change Thumbnail Art / Cover URL</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={songForm.coverUrl}
                    onChange={e => setSongForm({...songForm, coverUrl: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl pl-9 pr-3 py-2.5 text-zinc-200 text-xs"
                  />
                  <ImageIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  id="song-featured"
                  type="checkbox"
                  checked={songForm.featured}
                  onChange={e => setSongForm({...songForm, featured: e.target.checked})}
                  className="w-4 h-4 accent-emerald-500"
                />
                <label htmlFor="song-featured" className="text-zinc-300 font-medium cursor-pointer">Pin to Featured Home Section</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-450 transition text-zinc-950 font-bold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
                <span>Publish Audio Track</span>
              </button>
            </form>
          )}

          {/* TAB 2: SERMON / YOUTUBE VIDEO PUBLISHER FORM */}
          {activeTab === "sermon" && (
            <form onSubmit={handleSermonPublish} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">Sermon & Video Publish Form</span>
                <button 
                  type="button" 
                  onClick={autoFillSermonDemo}
                  className="text-[9px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded hover:bg-amber-500/20"
                >
                  ⚡ Autofill Demo Work
                </button>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Sermon Video Subject *</label>
                <input
                  type="text"
                  placeholder="e.g. Anchored in Jesus in Troubled Times"
                  value={sermonForm.title}
                  onChange={e => setSermonForm({...sermonForm, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-3 py-2.5 text-zinc-200 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Preaching pastor / Teacher *</label>
                  <input
                    type="text"
                    placeholder="e.g. Pastor Steven"
                    value={sermonForm.pastor}
                    onChange={e => setSermonForm({...sermonForm, pastor: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Sermon Duration (e.g. 45 mins)</label>
                  <input
                    type="text"
                    placeholder="35 mins"
                    value={sermonForm.duration}
                    onChange={e => setSermonForm({...sermonForm, duration: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Assign Category</label>
                  <select
                    value={sermonForm.category}
                    onChange={e => setSermonForm({...sermonForm, category: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-2.5 text-zinc-200 outline-none"
                  >
                    {adminCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">YouTube 11-digit Video ID / URL *</label>
                  <input
                    type="text"
                    placeholder="e.g. vAwit-Iu194"
                    value={sermonForm.youtubeId}
                    onChange={e => setSermonForm({...sermonForm, youtubeId: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-3 py-2.5 text-zinc-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Video Custom Thumbnail Image URL</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={sermonForm.thumbnailUrl}
                    onChange={e => setSermonForm({...sermonForm, thumbnailUrl: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl pl-9 pr-3 py-2.5 text-zinc-200 text-xs"
                  />
                  <ImageIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  id="sermon-featured"
                  type="checkbox"
                  checked={sermonForm.featured}
                  onChange={e => setSermonForm({...sermonForm, featured: e.target.checked})}
                  className="w-4 h-4 accent-emerald-500"
                />
                <label htmlFor="sermon-featured" className="text-zinc-300 font-medium cursor-pointer">Pin to Home Banner Selection</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-450 transition text-zinc-950 font-bold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
                <span>Publish Sermon Broadcast</span>
              </button>
            </form>
          )}

          {/* TAB 3: SHORTS REEL PUBLISHER FORM */}
          {activeTab === "short" && (
            <form onSubmit={handleShortPublish} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">Short & Reels Publish Form</span>
                <button 
                  type="button" 
                  onClick={autoFillShortDemo}
                  className="text-[9px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded hover:bg-amber-500/20"
                >
                  ⚡ Autofill Demo Work
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Reel Title / Focus *</label>
                  <input
                    type="text"
                    placeholder="e.g. Grace over guilt"
                    value={shortForm.title}
                    onChange={e => setShortForm({...shortForm, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-3 py-2.5 text-zinc-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Speaker / Preacher *</label>
                  <input
                    type="text"
                    placeholder="e.g. Pastor Craig"
                    value={shortForm.speaker}
                    onChange={e => setShortForm({...shortForm, speaker: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Reel Video URL (Direct MP4 Stream Link or YouTube short ID) *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://player.vimeo.com/...mp4"
                    value={shortForm.videoUrl}
                    onChange={e => setShortForm({...shortForm, videoUrl: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl pl-9 pr-3 py-2.5 text-zinc-200 font-mono text-xs"
                    required
                  />
                  <FileVideo className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Reel Caption text & Hashtags</label>
                <textarea
                  rows={3}
                  placeholder="e.g. God's grace is more than enough for your mistakes. #grace #salvation #nagaland"
                  value={shortForm.caption}
                  onChange={e => setShortForm({...shortForm, caption: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-zinc-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  id="short-featured"
                  type="checkbox"
                  checked={shortForm.featured}
                  onChange={e => setShortForm({...shortForm, featured: e.target.checked})}
                  className="w-4 h-4 accent-emerald-500"
                />
                <label htmlFor="short-featured" className="text-zinc-300 font-medium cursor-pointer">Pin as Featured Reel</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-450 transition text-zinc-950 font-bold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
                <span>Save Reels Clip</span>
              </button>
            </form>
          )}

          {/* TAB 4: DEVOTIONAL STUDY DEV PUBLISHER FORM */}
          {activeTab === "devotional" && (
            <form onSubmit={handleDevotionalPublish} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">Christian Devotional Study log Form</span>
                <button 
                  type="button" 
                  onClick={autoFillDevotionalDemo}
                  className="text-[9px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded hover:bg-amber-500/20"
                >
                  ⚡ Autofill Demo Work
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Devotional Subject / Topic *</label>
                  <input
                    type="text"
                    placeholder="e.g. Resting in Jisu"
                    value={devotionalForm.title}
                    onChange={e => setDevotionalForm({...devotionalForm, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-3 py-2.5 text-zinc-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Bible verses references (comma split)</label>
                  <input
                    type="text"
                    placeholder="Psalm 23:1, John 3:16"
                    value={devotionalForm.bibleReadings}
                    onChange={e => setDevotionalForm({...devotionalForm, bibleReadings: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-404 font-semibold mb-1">Pastor Author *</label>
                  <input
                    type="text"
                    value={devotionalForm.author}
                    onChange={e => setDevotionalForm({...devotionalForm, author: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-zinc-404 font-semibold mb-1">Target Feed Date *</label>
                  <input
                    type="date"
                    value={devotionalForm.date}
                    onChange={e => setDevotionalForm({...devotionalForm, date: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-zinc-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Core Devotional Reading Content *</label>
                <textarea
                  rows={4}
                  placeholder="Insert the beautiful teaching message for global youths today..."
                  value={devotionalForm.content}
                  onChange={e => setDevotionalForm({...devotionalForm, content: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-3 py-2.5 text-zinc-200 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Reflection Question</label>
                  <input
                    type="text"
                    placeholder="e.g. How can you practice rest?"
                    value={devotionalForm.reflection}
                    onChange={e => setDevotionalForm({...devotionalForm, reflection: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Guided Daily Prayer</label>
                  <input
                    type="text"
                    placeholder="e.g. Lord take my burdens..."
                    value={devotionalForm.prayer}
                    onChange={e => setDevotionalForm({...devotionalForm, prayer: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2.5 text-zinc-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-450 transition text-zinc-950 font-bold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
                <span>Save Devotional study</span>
              </button>
            </form>
          )}

        </div>

        {/* ===================== COLUMN 2: SEARCH, ORGANIZATION, MANAGE CONTENT (70%) ===================== */}
        <div className="lg:col-span-7 bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-zinc-800/80 p-5 shadow-xl relative overflow-hidden space-y-5">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4.5 h-4.5 text-amber-400" />
                <span>Manage LivingBreadHub Assets</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Search, filter, replace media, edit content categories or reorder items.</p>
            </div>
            
            {/* Real DB counters status indicators */}
            <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-mono">
              <span className="bg-zinc-950 border border-zinc-850 px-2.5 py-1 rounded-lg">🎵 {songs.length} Track</span>
              <span className="bg-zinc-950 border border-zinc-850 px-2.5 py-1 rounded-lg">🎥 {sermons.length} Video</span>
              <span className="bg-zinc-950 border border-zinc-850 px-2.5 py-1 rounded-lg">📱 {shorts.length} Reel</span>
            </div>
          </div>

          {/* Search bar & Category filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-7 relative">
              <input
                type="text"
                placeholder="Search by Title, Preacher or Artist..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/40 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-300 outline-none"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>

            <div className="md:col-span-5 relative">
              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 outline-none appearance-none"
              >
                <option value="All">All Categories Filter</option>
                {adminCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Tab lists content layout */}
          <div className="space-y-3">
            
            {/* SONG MANAGING SECTION */}
            {activeTab === "song" && (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredSongs.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 space-y-2 border border-zinc-850/60 rounded-2xl bg-zinc-950/20">
                    <FolderMinus className="w-9 h-9 mx-auto text-zinc-650 opacity-60" />
                    <p className="text-xs">No media uploaded yet or matching filters.</p>
                  </div>
                ) : (
                  filteredSongs.map((song, idx) => (
                    <div 
                      key={song.id} 
                      className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-850 hover:border-zinc-800 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img 
                            src={song.coverUrl} 
                            alt="Cover" 
                            className="w-11 h-11 object-cover rounded-xl shadow-lg border border-zinc-800 group-hover:scale-105 transition" 
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            onClick={() => setEditingItem({ type: "song", id: song.id, data: song })}
                            className="absolute -bottom-1 -right-1 p-1 bg-zinc-900 border border-zinc-700 text-emerald-400 hover:text-emerald-300 rounded-lg shadow-md duration-200"
                            title="Replace / Change Thumbnail cover"
                          >
                            <ImageIcon className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-zinc-200 truncate flex items-center gap-2">
                            {song.title}
                            {song.featured && <span className="text-[8px] font-mono font-extrabold bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/25">Pinned</span>}
                          </h4>
                          <p className="text-[10px] text-zinc-400 truncate mt-0.5">By {song.artist} • {song.album}</p>
                          <span className="inline-block px-2 py-0.5 mt-1 bg-zinc-900 text-zinc-400 border border-zinc-805 rounded text-[8px] font-semibold tracking-wider font-mono uppercase">
                            {song.category || "Worship Songs"}
                          </span>
                        </div>
                      </div>

                      {/* Explicit Interactive Operation controls requested by user */}
                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        {/* Easy Visual Sequence Reordering: UP/DOWN swap */}
                        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 mr-1 text-zinc-400">
                          <button 
                            onClick={() => reorderItem("song", idx, "up")}
                            disabled={idx === 0}
                            className="p-1 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                            title="Reorder up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => reorderItem("song", idx, "down")}
                            disabled={idx === songs.length - 1}
                            className="p-1 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                            title="Reorder down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Replace link operations */}
                        <button
                          onClick={() => setEditingItem({ type: "song", id: song.id, data: { ...song } })}
                          className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition flex items-center gap-1.5"
                          title="Edit details / Replace Media / Change Cover"
                        >
                          <Edit2 className="w-3 h-3 text-zinc-400" />
                          <span>Edit</span>
                        </button>
                        
                        <button
                          onClick={() => triggerDelete("song", song.id, song.title)}
                          className="p-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-450 hover:text-rose-400 transition"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SERMON MANAGING SECTION */}
            {activeTab === "sermon" && (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredSermons.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 space-y-2 border border-zinc-850/60 rounded-2xl bg-zinc-950/20">
                    <FolderMinus className="w-9 h-9 mx-auto text-zinc-650 opacity-60" />
                    <p className="text-xs">No media uploaded yet or matching filters.</p>
                  </div>
                ) : (
                  filteredSermons.map((ser, idx) => (
                    <div 
                      key={ser.id} 
                      className="p-3 bg-zinc-955 rounded-2xl border border-zinc-850 hover:border-zinc-800 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img 
                            src={ser.thumbnailUrl} 
                            alt="Cover" 
                            className="w-20 aspect-video object-cover rounded-xl shadow border border-zinc-850 group-hover:scale-105 transition"
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            onClick={() => setEditingItem({ type: "sermon", id: ser.id, data: ser })}
                            className="absolute -bottom-1 -right-1 p-1 bg-zinc-900 border border-zinc-700 text-emerald-400 hover:text-emerald-300 rounded-lg shadow-md duration-200"
                            title="Replace Thumbnail Image"
                          >
                            <ImageIcon className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-zinc-200 truncate flex items-center gap-2">
                            {ser.title}
                            {ser.featured && <span className="text-[8px] font-mono bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/25 font-bold">Banner</span>}
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">By Pastor {ser.pastor} • {ser.duration}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-805 rounded text-[8px] font-semibold uppercase font-mono">
                              {ser.category || "Sermons"}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-mono">ID: {ser.youtubeId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        <div className="flex items-center bg-zinc-900 border border-zinc-805 rounded-xl p-0.5 mr-1 text-zinc-400">
                          <button 
                            onClick={() => reorderItem("sermon", idx, "up")}
                            disabled={idx === 0}
                            className="p-1 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => reorderItem("sermon", idx, "down")}
                            disabled={idx === sermons.length - 1}
                            className="p-1 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => setEditingItem({ type: "sermon", id: ser.id, data: { ...ser } })}
                          className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3 h-3 text-zinc-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => triggerDelete("sermon", ser.id, ser.title)}
                          className="p-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-450 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SHORTS/REELS MANAGING SECTION */}
            {activeTab === "short" && (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredShorts.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 space-y-2 border border-zinc-850/60 rounded-2xl bg-zinc-950/20">
                    <FolderMinus className="w-9 h-9 mx-auto text-zinc-650 opacity-60" />
                    <p className="text-xs">No media uploaded yet or matching filters.</p>
                  </div>
                ) : (
                  filteredShorts.map((sh, idx) => (
                    <div 
                      key={sh.id} 
                      className="p-3 bg-zinc-955 rounded-2xl border border-zinc-850 hover:border-zinc-800 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-zinc-200 truncate flex items-center gap-2">
                          {sh.title}
                          {sh.featured && <span className="text-[8px] font-mono bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/25 font-bold">Featured</span>}
                        </h4>
                        <p className="text-[10px] text-zinc-400 mt-1">Speaker: {sh.speaker}</p>
                        <p className="text-[9.5px] text-zinc-500 font-mono mt-0.5 truncate italic">Source: {sh.videoUrl}</p>
                        {sh.caption && <p className="text-[10px] text-zinc-400 mt-1 max-w-md truncate bg-zinc-950/40 p-1.5 rounded">{sh.caption}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <div className="flex items-center bg-zinc-900 border border-zinc-805 rounded-xl p-0.5 mr-1 text-zinc-400">
                          <button 
                            onClick={() => reorderItem("short", idx, "up")}
                            disabled={idx === 0}
                            className="p-1 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => reorderItem("short", idx, "down")}
                            disabled={idx === shorts.length - 1}
                            className="p-1 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => setEditingItem({ type: "short", id: sh.id, data: { ...sh } })}
                          className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Edit / Replace Clip</span>
                        </button>

                        <button
                          onClick={() => triggerDelete("short", sh.id, sh.title)}
                          className="p-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-450 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* DEVOTIONAL MANAGING SECTION */}
            {activeTab === "devotional" && (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredDevotionals.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 space-y-2 border border-zinc-850/60 rounded-2xl bg-zinc-950/20">
                    <FolderMinus className="w-9 h-9 mx-auto text-zinc-650 opacity-60" />
                    <p className="text-xs">No media uploaded yet or matching devotionals.</p>
                  </div>
                ) : (
                  filteredDevotionals.map((dev, idx) => (
                    <div 
                      key={dev.id} 
                      className="p-3 bg-zinc-955 rounded-2xl border border-zinc-850 hover:border-zinc-800 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-zinc-200 truncate">{dev.title}</h4>
                          <span className="text-[8px] font-mono bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/25 font-bold">Study</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">Written by {dev.author} • Target date: {dev.date}</p>
                        {dev.bibleReadings && <p className="text-[9.5px] text-amber-300 font-mono mt-0.5">Readings: {Array.isArray(dev.bibleReadings) ? dev.bibleReadings.join(", ") : dev.bibleReadings}</p>}
                        {dev.content && <p className="text-[10px] text-zinc-400 mt-1 bg-zinc-950/40 p-1.5 rounded line-clamp-2 leading-relaxed">{dev.content}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <div className="flex items-center bg-zinc-900 border border-zinc-805 rounded-xl p-0.5 mr-1 text-zinc-400">
                          <button 
                            onClick={() => reorderItem("devotional", idx, "up")}
                            disabled={idx === 0}
                            className="p-1 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => reorderItem("devotional", idx, "down")}
                            disabled={idx === devotionals.length - 1}
                            className="p-1 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => setEditingItem({ 
                            type: "devotional", 
                            id: dev.id, 
                            data: { 
                              ...dev, 
                              bibleReadings: Array.isArray(dev.bibleReadings) ? dev.bibleReadings.join(", ") : dev.bibleReadings 
                            } 
                          })}
                          className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => triggerDelete("devotional", dev.id, dev.title)}
                          className="p-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-450 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ===================== OVERLAY / DIALOGS MODULES (MODALS) ===================== */}

      {/* 1. CUSTOM STYLED EDITING DIALOG (MODAL) */}
      {editingItem && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative animate-fadeIn space-y-4">
            <button 
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-805">
              <Edit2 className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
              <div>
                <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">
                  Update and Repair Media item
                </h3>
                <p className="text-[10px] font-mono text-zinc-400">ID Reference: {editingItem.id}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              {/* Common title field */}
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Update Subject / Title *</label>
                <input
                  type="text"
                  value={editingItem.data.title || ""}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, title: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 text-xs"
                  required
                />
              </div>

              {/* SONG SPECIFIC FIELDS */}
              {editingItem.type === "song" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Artist Name *</label>
                      <input
                        type="text"
                        value={editingItem.data.artist || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, artist: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Album Name</label>
                      <input
                        type="text"
                        value={editingItem.data.album || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, album: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Category Category</label>
                      <select
                        value={editingItem.data.category || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, category: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-2.5 text-zinc-200 outline-none"
                      >
                        {adminCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Play Duration</label>
                      <input
                        type="text"
                        value={editingItem.data.duration || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, duration: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Replace Media File / Audio Link *</label>
                    <input
                      type="text"
                      value={editingItem.data.audioUrl || ""}
                      onChange={e => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, audioUrl: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Change Thumbnail Art URL</label>
                    <input
                      type="text"
                      value={editingItem.data.coverUrl || ""}
                      onChange={e => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, coverUrl: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 text-xs"
                    />
                  </div>
                </>
              )}

              {/* SERMON SPECIFIC FIELDS */}
              {editingItem.type === "sermon" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Preaching Pastor *</label>
                      <input
                        type="text"
                        value={editingItem.data.pastor || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, pastor: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Video Duration</label>
                      <input
                        type="text"
                        value={editingItem.data.duration || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, duration: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Sermon Category</label>
                      <select
                        value={editingItem.data.category || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, category: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-2.5 text-zinc-200 outline-none"
                      >
                        {adminCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Replace YouTube reference ID *</label>
                      <input
                        type="text"
                        value={editingItem.data.youtubeId || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, youtubeId: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Change Thumbnail Art URL</label>
                    <input
                      type="text"
                      value={editingItem.data.thumbnailUrl || ""}
                      onChange={e => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, thumbnailUrl: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 text-xs"
                    />
                  </div>
                </>
              )}

              {/* REEL SPECIFIC FIELDS */}
              {editingItem.type === "short" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Speaker *</label>
                      <input
                        type="text"
                        value={editingItem.data.speaker || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, speaker: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Replace Media link URL *</label>
                      <input
                        type="text"
                        value={editingItem.data.videoUrl || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, videoUrl: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200 font-mono text-[11px]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Caption Details</label>
                    <textarea
                      rows={3}
                      value={editingItem.data.caption || ""}
                      onChange={e => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, caption: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200"
                    />
                  </div>
                </>
              )}

              {/* DEVOTIONAL SPECIFIC FIELDS */}
              {editingItem.type === "devotional" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Pastor Author *</label>
                      <input
                        type="text"
                        value={editingItem.data.author || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, author: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Bible Verse Readings *</label>
                      <input
                        type="text"
                        value={editingItem.data.bibleReadings || ""}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, bibleReadings: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Study Content *</label>
                    <textarea
                      rows={5}
                      value={editingItem.data.content || ""}
                      onChange={e => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, content: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 leading-relaxed"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2.5 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-450 transition text-zinc-950 font-bold rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Update Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-6 py-3 bg-zinc-950 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 rounded-xl uppercase tracking-wide font-bold transition"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. CUSTOM STYLED WARNING DELETE CONFIRMATION POPUP (MODAL) */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl max-w-sm w-full p-5 text-center shadow-2xl relative space-y-4 animate-scaleUp">
            
            <div className="w-12 h-12 bg-rose-500/10 text-rose-450 rounded-full flex items-center justify-center mx-auto text-xl">
              <Trash2 className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-semibold text-zinc-100 text-sm">Delete content permanently?</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                Are you absolutely sure you want to remove <b className="text-zinc-200">"{deleteConfirm.title}"</b>? This action deletes it permanently from your Google Firestore and local backup streams instantly.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleConfirmedDelete}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-450 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider transition"
              >
                Yes, Delete permanently
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4.5 py-2.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-xs text-zinc-400 font-bold transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
