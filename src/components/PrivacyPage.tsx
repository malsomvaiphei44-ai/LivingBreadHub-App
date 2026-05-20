import React from "react";
import { Shield, Lock, Eye, EyeOff, Server, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const { themeMode } = useApp();

  return (
    <div id="privacy-policy-view" className="space-y-8 animate-fadeIn text-xs md:text-sm">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          id="btn-privacy-back"
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
          <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest font-bold">Safeguarding Fellowship</span>
          <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">Privacy Policy</h2>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6 text-zinc-300 leading-relaxed font-sans">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Shield className="w-6 h-6 text-emerald-450 shrink-0" />
          <div>
            <h3 className="font-bold text-sm text-zinc-100">Our Covenant of Confidentiality</h3>
            <p className="text-[10px] text-zinc-550 font-mono font-bold">Effective Date: May 20, 2026</p>
          </div>
        </div>

        <p className="text-xs">
          At LivingBreadHub, protecting your digital workspace and personal fellowship history is a sacred responsibility. This Privacy Policy outlines exactly how we manage, store, and secure your personal bookmarks, favorited hymns, prayer request lists, and account credentials.
        </p>

        <section className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 font-mono">
            <Lock className="w-4 h-4" />
            1. Data We Collect & Sync
          </h4>
          <p className="text-xs text-zinc-400">
            For standard browsers, core bookmark references, song play statistics, and theme preferences reside purely inside client-side local cache or localStorage. If you establish authorized login credentials via simulated access or Firebase Google authentication, these parameters are synchronized securely with our Firestore database.
          </p>
          <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1 block">
            <li><strong>Profile Information:</strong> Full name, Email address, and account avatar metadata.</li>
            <li><strong>Favorites Sync Array:</strong> Multi-lingual scriptures, worship track ids, and sermon logs bookmarks.</li>
            <li><strong>Community Prayer Petitions:</strong> Pray requests posted on our community wall (can be explicitly configured as "Post Anonymously").</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 font-mono">
            <Server className="w-4 h-4" />
            2. Server Security & Infrastructure
          </h4>
          <p className="text-xs text-zinc-400">
            All database writing is protected by rigorous Firestore Attribute-Based Access Control security rules. These rules are deployed directly to Firebase servers and restrict cross-account profiling:
          </p>
          <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1 block">
            <li>Only the registered owner or our authorized platform administrator can retrieve, edit, or delete personal profile information.</li>
            <li>Private prayer wall petitions can ONLY be viewed by the creator and admin.</li>
            <li>No analytical data trackers, external advertising agencies, or advertising SDKs are integrated into our services. LivingBreadHub is 100% advertising-free.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 font-mono">
            <EyeOff className="w-4 h-4" />
            3. Third-Party Integrations
          </h4>
          <p className="text-xs text-zinc-400">
            When streaming live preachings, we load dynamic embeds directly from official video streamers (YouTube Player and Vimeo). These platforms process their own terms of cookies once video streams initialize. We recommend reviewing YouTube's standard privacy policies.
          </p>
        </section>

        <section className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 font-mono">
            <Eye className="w-4 h-4" />
            4. User Rights (GDPR & CCPA Compliant)
          </h4>
          <p className="text-xs text-zinc-400">
            You hold total authority over your fellowship data. You can instantly delete your favorited lists inside the Profile tab or contact our system admin at <strong>malsomvaiphei44@gmail.com</strong> to securely request absolute profile purge from our servers.
          </p>
        </section>

        <div className="border-t border-zinc-805 pt-4 text-center">
          <p className="text-[11px] text-zinc-500 italic">
            "For God is not unjust so as to overlook your work and the love that you have shown for his name in serving the saints..." — Hebrews 6:10
          </p>
        </div>
      </div>
    </div>
  );
};
