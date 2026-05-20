import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Heart, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const { themeMode } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Prayer Request Feedback");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) return;
    setSuccess(true);
    setName("");
    setEmail("");
    setDescription("");
  };

  return (
    <div id="contact-us-page-view" className="space-y-8 animate-fadeIn">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          id="btn-contact-back"
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
          <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-widest font-bold">Connect with Us</span>
          <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100">Contact Fellowship</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Info Cards (40% width) */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-400 font-mono">Fellowship Offices</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Have questions, feedback about sermons, Nagamese translations, or need specialized pastoral counseling? Our global communication hub is ready to respond.
            </p>

            <div className="space-y-3 pt-2 text-xs text-zinc-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email Address</p>
                  <a href="mailto:malsomvaiphei44@gmail.com" className="hover:underline hover:text-emerald-300">
                    malsomvaiphei44@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Counseling Support Line</p>
                  <p className="font-mono text-zinc-250">+91 8787488733</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Coordinates</p>
                  <p className="text-zinc-250">Dimapur, Nagaland, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-tr from-amber-500/10 via-emerald-500/5 to-transparent border border-amber-500/20 text-center space-y-2">
            <Heart className="w-6 h-6 text-rose-500 mx-auto fill-current animate-pulse" />
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-300">Urgent Prayer Intercession</h4>
            <p className="text-[11px] text-zinc-440 leading-relaxed">
              If you have immediate operational prayer requests, please post directly onto our global <strong>Fellowship Prayer Wall</strong> for instant community intercession.
            </p>
          </div>
        </div>

        {/* Contact Form Details (70% width) */}
        <form onSubmit={handleSubmit} className="md:col-span-7 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-xs tracking-wider uppercase text-zinc-300">Submit Fellowship Inquiry</h3>

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl p-4 space-y-1">
              <p className="font-bold">Message sent through successfully! ✝️🕊️</p>
              <p className="text-zinc-400 text-[11px]">The LivingBreadHub administration has registered your query. A designated pastor will reach out via email shortly.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs md:text-sm">
              <label className="block text-zinc-450 font-semibold mb-0.5">Your Name *</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Malsom Vaiphei"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1 text-xs md:text-sm">
              <label className="block text-zinc-450 font-semibold mb-0.5">Email Address *</label>
              <input
                id="contact-email"
                type="email"
                placeholder="malsomvaiphei44@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1 text-xs md:text-sm">
            <label className="block text-zinc-450 font-semibold mb-0.5">Subject Type</label>
            <select
              id="contact-subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="General Feedback">General Feedback</option>
              <option value="Prayer Request Feedback">Prayer Support & Counseling</option>
              <option value="Media Submission">Media/Song Upload Request</option>
              <option value="Nagamese Toggle Error">Nagamese/Hindi Translations Correction</option>
              <option value="Corporate Partnership">Fellowship Partnership</option>
            </select>
          </div>

          <div className="space-y-1 text-xs md:text-sm">
            <label className="block text-zinc-450 font-semibold mb-0.5">Message / Inquiry Details *</label>
            <textarea
              id="contact-message"
              rows={4}
              placeholder="Tell us what is on your heart..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500 px-3 py-2.5 rounded-xl text-xs text-zinc-100 resize-none font-sans"
              required
            />
          </div>

          <button
            id="btn-contact-submit"
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2 font-display"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};
