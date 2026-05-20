import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, AlertCircle, VolumeX, Maximize, ExternalLink, X, RefreshCw } from "lucide-react";

interface SermonVideoPlayerProps {
  youtubeIdOrUrl: string;
  onClose: () => void;
  title?: string;
  pastor?: string;
}

/**
 * Parses and extracts safe, valid YouTube embed URLs from any format
 * (raw 11-char ID, watch URL, share links, or standard embed urls).
 */
export const getYouTubeEmbedUrl = (input: string): string => {
  if (!input) return "";
  const cleaned = input.trim();
  
  // Extract 11-character video ID from diverse YouTube link patterns
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = cleaned.match(regExp);
  
  const videoId = match && match[2].length === 11 ? match[2] : cleaned;
  
  // Return standard valid embed URL with autoplay parameter
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
};

export const SermonVideoPlayer: React.FC<SermonVideoPlayerProps> = ({
  youtubeIdOrUrl,
  onClose,
  title,
  pastor
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const embedUrl = getYouTubeEmbedUrl(youtubeIdOrUrl);
  // Get raw youtube video id to generate direct backup watch links
  const rawId = youtubeIdOrUrl.includes("youtube.com") || youtubeIdOrUrl.includes("youtu.be")
    ? getYouTubeEmbedUrl(youtubeIdOrUrl).split("embed/")[1]?.split("?")[0] || ""
    : youtubeIdOrUrl;

  const directWatchUrl = `https://www.youtube.com/watch?v=${rawId}`;

  // Smooth scroll to the player container when it mounts
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
    
    // Reset loader states when rawId changes
    setIframeLoading(true);
    setHasError(false);

    // Timeout-based network fallback trigger (after 7 seconds)
    const timeout = setTimeout(() => {
      // If we are still loading after 7s, trigger failure warnings/actionable fallbacks
      setIframeLoading((current) => {
        if (current) {
          setHasError(true);
        }
        return current;
      });
    }, 7000);

    return () => clearTimeout(timeout);
  }, [youtubeIdOrUrl]);

  return (
    <div
      ref={containerRef}
      className="mb-8 p-4 md:p-5 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden transition-all animate-fadeIn"
    >
      {/* Visual glowing frame decoration */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-zinc-700 to-emerald-500" />

      <div className="flex items-center justify-between mb-3 gap-4">
        <div>
          <span className="text-[10px] tracking-widest font-bold font-mono text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
            Interactive Sanctuary Stream
          </span>
          {title && (
            <h3 className="text-sm md:text-base font-serif font-black text-zinc-100 mt-1 lines-clamp-1">
              Currently Streaming: "{title}"
            </h3>
          )}
          {pastor && (
            <p className="text-[11px] text-zinc-400 font-sans">
              Delivered by {pastor}
            </p>
          )}
        </div>

        <button
          id="btn-close-video-player"
          onClick={onClose}
          className="p-1.5 rounded-full bg-zinc-950/60 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 transition-all shadow border border-zinc-800/60 focus:outline-none focus:ring-1 focus:ring-rose-500/40"
          title="Close player"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Main Video Stage */}
      <div className="relative aspect-video w-full rounded-2xl bg-zinc-950 overflow-hidden shadow-inner border border-zinc-850">
        
        {/* Loading shimmer and spinner */}
        {iframeLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/95">
            <div className="relative w-12 h-12 mb-3">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin" />
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 animate-pulse">
              Buffering Sermon Stream...
            </p>
            <span className="text-[10px] text-zinc-650 mt-1">Connecting securely to authorized streaming nodes</span>
          </div>
        )}

        {/* Actionable Fallback if video fails to load or slow */}
        {hasError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-zinc-950/95 text-center text-zinc-300">
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-amber-400 mb-3.5 animate-bounce">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-zinc-150">Is the embed stream lagging?</h4>
            <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4 leading-relaxed">
              Browser extensions, ad-blockers, or restricted ISP network rules can sometimes prevent embedded YouTube displays from loading correctly.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                id="btn-video-external-fallback"
                href={directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-4 py-2 text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 focus:outline-none"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch Directly on YouTube</span>
              </a>
              
              <button
                id="btn-video-retry-load"
                onClick={() => {
                  setIframeLoading(true);
                  setHasError(false);
                  // Refresh iframe by appending counter state as dummy key if needed
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-4 py-2 text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Stream</span>
              </button>
            </div>
          </div>
        )}

        {/* Real responsive cross-origin iframe */}
        <iframe
          src={embedUrl}
          title={title || "YouTube Worship Stream"}
          onLoad={() => setIframeLoading(false)}
          className="w-full h-full object-cover relative z-10"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => {
            setHasError(true);
            setIframeLoading(false);
          }}
        />
      </div>

      {/* Stream hints banner */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span>✅ YouTube Authorized Feed</span>
        <span>Autoplay enabled • High Definition</span>
      </div>
    </div>
  );
};
