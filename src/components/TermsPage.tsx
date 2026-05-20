import React from "react";
import { Scroll, CheckCircle2, ShieldAlert, Heart, HelpCircle, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  const { themeMode } = useApp();

  return (
    <div id="terms-and-conditions-view" className="space-y-8 animate-fadeIn text-xs md:text-sm">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          id="btn-terms-back"
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
          <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest font-bold">Fellowship Covenant</span>
          <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">Terms & Conditions</h2>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6 text-zinc-300 leading-relaxed font-sans">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Scroll className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h3 className="font-bold text-sm text-zinc-100">platform guidelines & Covenant</h3>
            <p className="text-[10px] text-zinc-555 font-mono font-bold">Last Updated: May 20, 2026</p>
          </div>
        </div>

        <p className="text-xs">
          By accessing or utilizing LivingBreadHub, you enter into a cooperative agreement to support a respectful, spiritually encouraging, and safe sanctuary environment for all users.
        </p>

        <section className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-450 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            1. Sacred Prayer Wall Etiquette
          </h4>
          <p className="text-xs text-zinc-400">
            The community prayer wall is a space for vulnerability, intercession, and fellowship support. Users are strictly prohibited from posting:
          </p>
          <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1 block">
            <li>Abusive, mocking, hateful, or derogatory comments.</li>
            <li>Spam, third-party promotional material, or solicitations.</li>
            <li>Explicit harassment or political campaigns disguised as prayer.</li>
          </ul>
          <p className="text-xs text-rose-450 italic">
            Note: The platform administrator (malsomvaiphei44@gmail.com) holds full capability to dynamically delete any inappropriate prayer requests instantly.
          </p>
        </section>

        <section className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-450 flex items-center gap-2 font-mono">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            2. Intellectual Property & Copyrights
          </h4>
          <p className="text-xs text-zinc-400">
            LivingBreadHub respects the spiritual copyrights of composers, pastors, and churches:
          </p>
          <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1 block">
            <li>Worship songs are loaded utilizing open-source audio archives or public sound domains. If you are a copyright owner and request removal, please write to us directly.</li>
            <li>Preaching feeds are integrated via public YouTube embeds. We do not claim ownership of video assets. Views and likes are recorded in favor of original creators directly.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-450 flex items-center gap-2 font-mono">
            <Heart className="w-4 h-4 text-rose-500" />
            3. Disclaimer of Liability
          </h4>
          <p className="text-xs text-zinc-400">
            All theological responses provided by our integrated <strong>BreadOfLifeAI (Gemini scriptural feedback)</strong> are structured strictly for mental rest and scriptural reference. They do not substitute professional psychological or psychiatric healthcare consultancy. Lean on pastoral counselors and community support in critical situations.
          </p>
        </section>

        <section className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-450 flex items-center gap-2 font-mono">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            4. Terms Updates
          </h4>
          <p className="text-xs text-zinc-400">
            LivingBreadHub may update this covenant periodically to align with further platform advancements. Continued login represents your alignment with refreshed guidelines.
          </p>
        </section>

        <div className="border-t border-zinc-805 pt-4 text-center">
          <p className="text-[11px] text-zinc-500 italic">
            "Let all that you do be done in love." — 1 Corinthians 16:14
          </p>
        </div>
      </div>
    </div>
  );
};
