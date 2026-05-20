import React from "react";
import { Info, Award, Heart, Users, Flame, ArrowLeft, Church } from "lucide-react";
import { useApp } from "../context/AppContext";

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const { themeMode, engagementStats } = useApp();

  return (
    <div id="about-us-page-view" className="space-y-8 animate-fadeIn">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          id="btn-about-back"
          onClick={onBack}
          className={`p-2 rounded-xl transition ${
            themeMode === "dark" 
              ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800" 
              : "bg-stone-200 border border-stone-300 text-zinc-700 hover:bg-stone-300"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest font-bold">Who We Are</span>
          <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">About LivingBreadHub</h2>
        </div>
      </div>

      {/* Hero Mission */}
      <section className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-zinc-900 border border-zinc-800 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-serif font-bold tracking-tight text-amber-300">
            Our Mission: Nourishing Souls with the Bread of Life
          </h3>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            LivingBreadHub is a sanctified digital sanctuary designed to build an atmosphere of unceasing worship, biblical instruction, and fervent prayer. Under the administrative supervision of global pastors and evangelists, our platform enables believers to access anointed preachings, stream serene acoustic music, share burdens on our community prayer wall, and receive pastoral guidance with secure local persistence.
          </p>
          <blockquote className="border-l-2 border-amber-500/50 pl-4 py-1 italic font-serif text-xs md:text-sm text-zinc-400">
            "Jesus said to them, 'I am the bread of life; whoever comes to me shall not hunger, and whoever believes in me shall never thirst.'" 
            <span className="block text-[11px] font-sans font-semibold text-amber-400 mt-1">— John 6:35</span>
          </blockquote>
        </div>
      </section>

      {/* Core Values Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-3 shadow-md hover:border-zinc-800 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Church className="w-5 h-5 text-emerald-450" />
          </div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-200">Worship Centered</h4>
          <p className="text-xs text-zinc-450 leading-relaxed">
            Every audio song, live vertical clip, and scripture verse featured on LivingBreadHub is strictly chosen to guide you into sincere praise, direct contemplation, and heartfelt communion.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-3 shadow-md hover:border-zinc-800 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-amber-400" />
          </div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-200">Community Focused</h4>
          <p className="text-xs text-zinc-450 leading-relaxed">
            Our interactive fellowship prayer wall connects thousands globally. Lift hands together, hit "AMEN" on petitions, and support brothers and sisters in their hours of need.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-3 shadow-md hover:border-zinc-800 transition">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-200">Nagaland & Global Roots</h4>
          <p className="text-xs text-zinc-440 leading-relaxed">
            With a unique Nagamese scriptural toggle and Hindi/English multilingual audio feeds, we unify tribes and nations in adoration of Jesus King of Kings.
          </p>
        </div>
      </div>

      {/* About Our Ministry */}
      <section className="space-y-4">
        <div>
          <h3 className="font-display font-semibold text-zinc-105 uppercase tracking-wider text-xs">About Our Ministry</h3>
          <p className="text-[10px] text-zinc-550">Dedicated servants sharing the light of Christ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-850 flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 font-display font-black text-lg flex items-center justify-center shadow">
              MV
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-zinc-100">Mr. Malsom Vaiphei</h4>
              <p className="text-[11px] text-amber-400">Digital Ministry & Encouragement</p>
              <p className="text-[10px] text-zinc-500 mt-1">Serving through digital ministry, worship, and daily encouragement in God’s Word.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Fellowship Engagement Statistics */}
      <section className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Fellowship Engagement Statistics
            </h3>
            <p className="text-[10px] text-zinc-505">Real-time counts of actions recorded during this session</p>
          </div>
          {(() => {
            const { prayersSubmitted = 0, worshipSongsPlayed = 0, dailyVerseViews = 0, registeredUsers = 0, sermonsWatched = 0 } = engagementStats || {};
            const totalActivity = prayersSubmitted + worshipSongsPlayed + dailyVerseViews + registeredUsers + sermonsWatched;
            if (totalActivity === 0) {
              return (
                <span className="text-[10px] font-bold text-emerald-450 uppercase font-mono tracking-wider bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg animate-pulse shrink-0">
                  Growing with the community
                </span>
              );
            }
            return null;
          })()}
        </div>

        {(() => {
          const { prayersSubmitted = 0, worshipSongsPlayed = 0, dailyVerseViews = 0, registeredUsers = 0, sermonsWatched = 0 } = engagementStats || {};
          const totalActivity = prayersSubmitted + worshipSongsPlayed + dailyVerseViews + registeredUsers + sermonsWatched;

          if (totalActivity === 0) {
            return (
              <div className="p-6 bg-zinc-950/60 rounded-2xl border border-zinc-900 text-center py-10 space-y-3">
                <p className="text-xs font-serif italic text-zinc-400 max-w-sm mx-auto">
                  "For where two or three are gathered in my name, there am I among them." — Matthew 18:20
                </p>
                <div className="h-0.5 w-6 bg-zinc-850 mx-auto" />
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-black font-mono">
                  Growing with the community.
                </p>
                <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">
                  Stream worship audio, read scripture selections, or post to the communal prayer tab to populate real-time activity statistics!
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner">
                <div className="text-lg md:text-xl font-mono font-black text-emerald-400">{prayersSubmitted}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Prayers Posted</div>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner">
                <div className="text-lg md:text-xl font-mono font-black text-amber-400">{worshipSongsPlayed}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Audio Played</div>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner">
                <div className="text-lg md:text-xl font-mono font-black text-indigo-400">{dailyVerseViews}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Scripture Views</div>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner">
                <div className="text-lg md:text-xl font-mono font-black text-teal-400">{sermonsWatched}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Sermon Streams</div>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner col-span-2 md:col-span-1">
                <div className="text-lg md:text-xl font-mono font-black text-purple-400">{registeredUsers}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Active Users</div>
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
};
