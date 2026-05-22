import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Heart, 
  Music, 
  Square,
  Sparkles,
  ChevronUp,
  X,
  Tv
} from "lucide-react";

// Helper to extract safe, valid YouTube video ID from any format
const getYouTubeId = (url: string): string => {
  if (!url) return "";
  if (url.includes("search_query=") || url.includes("results?")) {
    // If it's a dynamic search result with a query string, fallback to an epic worship song (Oceans)
    return "6Gg6_6GqSgM";
  }
  if (url.length === 11) return url;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
};

export const BottomPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    stopSong,
    user,
    toggleFavoriteSong,
    currentTime,
    duration,
    volume,
    seek,
    changeVolume
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!currentSong) return null;

  const isFav = user?.favorites?.songs?.includes(currentSong.id) || false;
  
  const videoId = getYouTubeId(currentSong.youtubeUrl || "");

  // Synchronize playing states with the YouTube IFrame
  useEffect(() => {
    if (!iframeRef.current) return;
    
    const command = isPlaying ? "playVideo" : "pauseVideo";
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "*"
    );
  }, [isPlaying, videoId]);

  // Synchronize volume level updates with the YouTube IFrame
  useEffect(() => {
    if (!iframeRef.current || volume === undefined) return;
    
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "setVolume", args: [volume * 100] }),
      "*"
    );
  }, [volume, videoId]);

  // Helper to format raw seconds to standard MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleMuteToggle = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      changeVolume(0);
    } else {
      changeVolume(prevVolume || 0.8);
    }
  };

  return (
    <div 
      id="floating-audio-orchestrator" 
      className="fixed bottom-16 md:bottom-3 left-0 right-0 z-50 px-3 pb-3 md:pb-1 animate-fadeIn"
    >
      <div className="max-w-4xl mx-auto glass-panel bg-zinc-950/95 text-white rounded-3xl shadow-2xl p-4 border border-zinc-800/85 transition-all duration-300 relative overflow-hidden">
        {/* Subtle running background glow matching the play state */}
        {isPlaying && (
          <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none animate-pulse" />
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Song info and details */}
          <div className="flex items-center justify-between md:justify-start gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative group w-12 h-12 rounded-2xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-805 cursor-pointer hover:border-amber-500/50 transition-colors"
                title="Expand Visual Praise View"
              >
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? "animate-[spin_12s_linear_infinite]" : ""}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tv className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs md:text-sm font-bold truncate text-zinc-100 font-sans tracking-tight">
                    {currentSong.title}
                  </h4>
                  <span className="text-[8px] bg-red-500/15 border border-red-500/20 text-red-400 font-mono font-black scale-90 px-1 py-0.5 rounded uppercase font-bold tracking-tight">Real Audio</span>
                </div>
                <p className="text-[10px] md:text-xs text-zinc-400 truncate font-sans">
                  {currentSong.artist} • <span className="text-amber-400 italic text-[10px]">{currentSong.album}</span>
                </p>
              </div>
            </div>

            {/* Quick play buttons on mobile layouts */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={isPlaying ? pauseSong : resumeSong}
                className="w-8.5 h-8.5 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center transition active:scale-95 shadow"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-zinc-950 fill-current" /> : <Play className="w-4 h-4 text-zinc-950 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400"
              >
                <ChevronUp className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Interactive media controls */}
          <div className={`flex-1 flex flex-col items-center gap-2 max-w-xl ${isExpanded ? "flex" : "hidden md:flex"}`}>
            
            {/* Real responsive cross-origin YouTube iframe */}
            <div className={isExpanded 
              ? "w-full max-w-sm aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-850 shadow-xl relative z-10 mx-auto animate-fadeIn mb-2 mt-1" 
              : "w-0 h-0 absolute opacity-0 pointer-events-none overflow-hidden"
            }>
              {videoId && (
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&mute=0`}
                  title={currentSong.title}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Control buttons block */}
            <div className="flex items-center gap-4.5">
              <button
                onClick={() => toggleFavoriteSong(currentSong.id)}
                className={`p-1.5 rounded-xl transition ${isFav ? "text-rose-500 bg-rose-500/10" : "text-zinc-500 hover:text-rose-450"}`}
                title="Save track"
              >
                <Heart className={`w-4.5 h-4.5 ${isFav ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={prevSong}
                className="text-zinc-400 hover:text-zinc-100 transition p-1.5 rounded-xl hover:bg-zinc-900"
                aria-label="Previous Track"
              >
                <SkipBack className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={isPlaying ? pauseSong : resumeSong}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center transition active:scale-95 shadow-md"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-zinc-950 fill-current" />
                ) : (
                  <Play className="w-5 h-5 text-zinc-950 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={nextSong}
                className="text-zinc-400 hover:text-zinc-100 transition p-1.5 rounded-xl hover:bg-zinc-900"
                aria-label="Next Track"
              >
                <SkipForward className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={stopSong}
                className="text-zinc-400 hover:text-rose-400 transition p-1.5 rounded-xl hover:bg-zinc-900"
                title="Stop & Dismiss Playback"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Drag Seek Slider with exact Elapsed duration details */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] text-zinc-500 font-mono tracking-tighter w-8 text-right shrink-0">
                {formatTime(currentTime)}
              </span>
              
              <div className="flex-1 relative group flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const secs = Number(e.target.value);
                    seek(secs);
                    if (iframeRef.current) {
                      iframeRef.current.contentWindow?.postMessage(
                        JSON.stringify({ event: "command", func: "seekTo", args: [secs, true] }),
                        "*"
                      );
                    }
                  }}
                  className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-full cursor-pointer appearance-none outline-none focus:outline-none"
                />
                {/* Visual completion tracking fill */}
                <div 
                  className="absolute h-1 bg-amber-400 rounded-full pointer-events-none left-0"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>

              <span className="text-[10px] text-zinc-500 font-mono tracking-tighter w-8 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Interactive Right Volume Deck */}
          <div className={`items-center gap-3.5 shrink-0 ${isExpanded ? "flex justify-between w-full border-t border-zinc-900 pt-3 md:border-0 md:pt-0 md:w-auto" : "hidden md:flex"}`}>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMuteToggle}
                className="text-zinc-500 hover:text-zinc-300 transition"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              </button>
              
              <div className="relative flex items-center w-20">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => changeVolume(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-zinc-850 rounded-full cursor-pointer appearance-none outline-none focus:outline-none"
                />
                <div 
                  className="absolute h-1 bg-amber-400 rounded-full pointer-events-none left-0"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>

            <span className="text-[9px] uppercase font-mono tracking-widest text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/15">
              Stereo Praise
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
