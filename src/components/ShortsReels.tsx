import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, Share2, Award, ArrowUp, ArrowDown, Play, Pause, Compass, Send, AlertCircle } from "lucide-react";

export const ShortsReels: React.FC = () => {
  const { shorts } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>({});
  const [isPlayingLocal, setIsPlayingLocal] = useState(false); // Default to false so it autoplays ONLY when clicked
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  if (!shorts || shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-zinc-950 rounded-2xl border border-zinc-800 animate-pulse">
        <Compass className="w-12 h-12 text-zinc-500 animate-spin mb-3" />
        <p className="text-sm text-zinc-400">Loading inspiring gospel short clips...</p>
      </div>
    );
  }

  const currentReel = shorts[currentIndex];

  const handleLike = (reelId: string) => {
    const currentState = likesState[reelId] || { count: currentReel.likes, liked: false };
    if (currentState.liked) {
      setLikesState({
        ...likesState,
        [reelId]: { count: currentState.count - 1, liked: false }
      });
    } else {
      setLikesState({
        ...likesState,
        [reelId]: { count: currentState.count + 1, liked: true }
      });
    }
  };

  const handleShare = (social: string) => {
    const text = `Inspired by "${currentReel.title}" by ${currentReel.speaker} on LivingBreadHub! ✝️✨ Watch now.`;
    if (social === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    } else {
      alert(`Shared dynamically to ${social}! Thank you for spreading the gospel.`);
    }
  };

  const getLikesCount = (reelId: string, defaultLikes: number) => {
    return likesState[reelId] ? likesState[reelId].count : defaultLikes;
  };

  const isLiked = (reelId: string) => {
    return likesState[reelId] ? likesState[reelId].liked : false;
  };

  return (
    <div id="vertical-shorts-container" className="max-w-md mx-auto w-full aspect-[9/16] h-[640px] bg-zinc-950 rounded-3xl overflow-hidden relative border border-zinc-805 shadow-2xl flex flex-col justify-between">
      {/* Absolute Header Overlay */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs uppercase font-bold tracking-widest text-zinc-200">Inspire Reels</span>
        </div>
        <div className="text-xs font-mono text-zinc-300">
          {currentIndex + 1} / {shorts.length}
        </div>
      </div>

      {/* Video Area */}
      <div className="absolute inset-0 z-10 w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden">
        <video
          key={currentReel.id}
          src={currentReel.videoUrl}
          className="w-full h-full object-cover"
          autoPlay={isPlayingLocal}
          loop
          muted
          playsInline
          onLoadStart={() => {
            setVideoLoading(true);
            setVideoError(false);
          }}
          onWaiting={() => setVideoLoading(true)}
          onCanPlayThrough={() => setVideoLoading(false)}
          onPlaying={() => setVideoLoading(false)}
          onError={() => {
            setVideoLoading(false);
            setVideoError(true);
          }}
        />

        {/* Ambient Dark overlay filter */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35 pointer-events-none" />

        {/* Stateful Buffering Indicator */}
        {videoLoading && (
          <div className="absolute inset-x-0 z-20 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm h-full pointer-events-none transition-opacity">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-2" />
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-300">Streaming Buffers...</span>
          </div>
        )}

        {/* Stateful Fallback Error Panel */}
        {videoError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-zinc-950/95 text-center transition-all">
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-full text-rose-500 mb-3 animate-pulse">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-zinc-200">Stream Connection Timed Out</h4>
            <p className="text-[10px] text-zinc-400 max-w-[200px] mt-1 mb-4 leading-relaxed">
              We couldn't initialize this media frame. It might be blocked or temporarily offline.
            </p>
            <button
              id="btn-retry-reel-play"
              onClick={() => {
                setVideoError(false);
                setVideoLoading(true);
                // Trigger video refresh
                const v = document.querySelector("video");
                if (v) {
                  v.load();
                }
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-bold text-amber-300 tracking-wide transition-all active:scale-95 shadow"
            >
              Retry Stream
            </button>
          </div>
        )}

        {/* Floating play & pause indicator button on desktop & mobile */}
        <button
          id="btn-toggle-reel-play"
          onClick={() => {
            setIsPlayingLocal(!isPlayingLocal);
            // Dynamic target action triggers browser video node programmatically
            const v = document.querySelector("video");
            if (v) {
              if (isPlayingLocal) {
                v.pause();
              } else {
                v.play().catch(err => console.log("Direct play deferred till user interaction: ", err));
              }
            }
          }}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/5 hover:bg-black/20 focus:bg-black/10 transition-all focus:outline-none"
        >
          {/* Constantly visible play overlay when paused to direct click behavior cleanly */}
          <div className={`p-4 rounded-full border border-white/20 bg-zinc-950/75 backdrop-blur-md shadow-2xl transition-all duration-300 transform active:scale-90 ${
            !isPlayingLocal ? "opacity-100 scale-100 ring-4 ring-emerald-500/20" : "opacity-0 scale-90"
          }`}>
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </button>
      </div>

      {/* Extreme Navigation Right Toolbar */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-5 items-center">
        {/* Prev Clip */}
        <button
          id="btn-prev-reel"
          disabled={currentIndex === 0}
          onClick={() => {
            setCurrentIndex(Math.max(0, currentIndex - 1));
            setIsPlayingLocal(false); // Reset to confirm autoplay-only-on-click rules
            setVideoError(false);
          }}
          className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition-colors disabled:opacity-40"
          title="Previous Reel"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Like action */}
        <div className="flex flex-col items-center">
          <button
            id={`btn-like-reel-${currentReel.id}`}
            onClick={() => handleLike(currentReel.id)}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
              isLiked(currentReel.id)
                ? "bg-rose-500/20 border-rose-500 text-rose-500"
                : "bg-black/40 border-zinc-700/60 text-white hover:text-rose-400"
            }`}
          >
            <Heart className={`w-5.5 h-5.5 ${isLiked(currentReel.id) ? "fill-current" : ""}`} />
          </button>
          <span className="text-[11px] font-mono text-zinc-300 mt-1.5 shadow-sm">
            {getLikesCount(currentReel.id, currentReel.likes)}
          </span>
        </div>

        {/* Share Action dropdown */}
        <div className="flex flex-col items-center">
          <button
            id="btn-share-whatsapp"
            onClick={() => handleShare("whatsapp")}
            className="w-12 h-12 rounded-full bg-black/40 border border-zinc-700/60 text-white hover:text-emerald-400 flex items-center justify-center transition-all"
            title="Share to WhatsApp"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <span className="text-[10px] text-zinc-400 mt-1 uppercase font-mono tracking-wider">Share</span>
        </div>

        {/* Speaker Profile Badge */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-[2px]">
          <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-xs text-amber-300 font-bold">
            {currentReel.speaker.substring(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Next Clip */}
        <button
          id="btn-next-reel"
          disabled={currentIndex === shorts.length - 1}
          onClick={() => {
            setCurrentIndex(Math.min(shorts.length - 1, currentIndex + 1));
            setIsPlayingLocal(true);
          }}
          className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-805 text-white flex items-center justify-center transition-colors disabled:opacity-40"
          title="Next Reel"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Absolute Bottom Information Card Overlay */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-5 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 text-white">
        <div className="max-w-[80%]">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md font-bold">
              {currentReel.speaker}
            </span>
            {isPlayingLocal && (
              <span className="text-[10px] text-zinc-500 italic flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Playing Loop
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">
            {currentReel.title}
          </h3>
          <p className="text-xs text-zinc-300/90 mt-1 line-clamp-2 leading-relaxed">
            {currentReel.caption}
          </p>
        </div>

        {/* Quick Social Action triggers simulated */}
        <div className="mt-4 flex items-center gap-2 border-t border-zinc-800/60 pt-3 text-[11px] text-zinc-500">
          <span>Spread hope:</span>
          <button id="btn-share-facebook-sim" onClick={() => handleShare("facebook")} className="text-amber-400 hover:underline">Facebook</button>
          <span>•</span>
          <button id="btn-share-instagram-sim" onClick={() => handleShare("instagram")} className="text-amber-400 hover:underline">Instagram</button>
        </div>
      </div>
    </div>
  );
};
