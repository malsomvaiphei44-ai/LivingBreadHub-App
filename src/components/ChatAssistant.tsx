import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, BookOpen, Heart, RefreshCw, Compass, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ChatAssistant: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<Array<{ role: "user" | "model"; content: string; isWarning?: boolean }>>([
    {
      role: "model",
      content: `Welcome in Christ, ${user?.name || "believer"}! I am **BreadOfLifeAI**, your spiritual companion. Tell me what is on your heart—whether you seek bible verse recommendations for anxiety, a moment of healing encouragement, or deep devotional wisdom.`
    }
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // Quick prompt triggers
  const presets = [
    { label: "Overcoming Anxiety", prompt: "I am feeling anxious about tomorrow's challenges. What comforting scriptures can I hold onto?" },
    { label: "Seeking Healing", prompt: "Please share divine verses and an encouraging prayer for continuous bodily healing." },
    { label: "Worship & Praise", prompt: "Give me some scriptures on praise and entering God's courts with thanksgiving." },
    { label: "Youth Strength", prompt: "What wisdom does the Bible offer to young people facing contemporary secular burdens?" }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || chatLoading) return;

    const userMsg = textToSend.trim();
    setInput("");
    
    // Append user message
    const updatedMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(updatedMessages);
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Pass full chat history for conversation flow
          messages: updatedMessages.map(m => ({
  role: m.role,
  content: m.content
}))> ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [
          ...prev, 
          { 
            role: "model", 
            content: data.content,
            isWarning: !!data.warning
          }
        ]);
      } else {
        throw new Error("Chat response failed");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          content: "I am currently reflecting quietly on the Word. In moments of heavy burdens, remember: 'Cast your cares on the Lord and He will sustain you.' (Psalm 55:22). Rest in His presence."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Split message to format **bold** words nicely
  const formatMsg = (txt: string) => {
    const parts = txt.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-amber-300">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div id="ai-chat-assistant-container" className="flex flex-col h-[580px] bg-zinc-950 rounded-3xl border border-zinc-800/80 overflow-hidden relative shadow-2xl">
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header Banner */}
      <div className="px-5 py-4 bg-zinc-900/90 border-b border-zinc-800/90 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-zinc-100 font-display font-medium text-sm flex items-center gap-2">
              BreadOfLife AI
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase font-mono">Pastoral Assistant</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans">Empowered with scriptural wisdom</p>
          </div>
        </div>
        <button 
          id="btn-clear-chat"
          onClick={() => setMessages([{
            role: "model",
            content: `God bless you! Let's start fresh. Tell me what scriptures, devotionals, or spiritual counsel you are looking for today.`
          }])}
          className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors uppercase text-[10px] tracking-wider font-mono bg-zinc-800/40 rounded-lg hover:bg-zinc-800"
          title="Clear Chat History"
        >
          Reset Session
        </button>
      </div>

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar z-10">
        {messages.map((m, idx) => (
          <div 
            key={idx}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
              m.role === "user" 
                ? "bg-zinc-800 text-zinc-100 rounded-tr-none" 
                : "bg-zinc-900/60 text-zinc-300 border border-zinc-800/40 rounded-tl-none font-sans"
            }`}>
              {/* Dynamic rendering */}
              <div className="whitespace-pre-line prose prose-invert prose-xs">
                {formatMsg(m.content)}
              </div>

              {m.isWarning && (
                <div className="mt-2 pt-2 border-t border-zinc-800 text-[10px] text-amber-400/80 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  Devotional offline wisdom mode active.
                </div>
              )}
            </div>
            <span className="text-[9px] text-zinc-500 mt-1 uppercase tracking-wider font-mono px-1">
              {m.role === "user" ? "You" : "BreadOfLifeAI"}
            </span>
          </div>
        ))}

        {chatLoading && (
          <div className="flex items-center gap-3 text-zinc-400 text-xs py-2">
            <div className="flex gap-1 items-center bg-zinc-900/80 border border-zinc-800 px-3.5 py-2.5 rounded-full rounded-tl-none">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
            </div>
            <span className="text-[11px] font-mono animate-pulse text-zinc-500">AI is praying over scriptures...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion Presets */}
      {messages.length === 1 && (
        <div className="px-5 pb-3 z-10 grid grid-cols-2 gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              id={`preset-prompt-${idx}`}
              onClick={() => handleSendMessage(p.prompt)}
              className="text-left text-[11px] p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-700 text-zinc-300 transition-all flex justify-between items-center group"
            >
              <span className="truncate">{p.label}</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 transition-colors shrink-0 ml-1" />
            </button>
          ))}
        </div>
      )}

      {/* Interactive Input Form */}
      <form 
        id="ai-chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 bg-zinc-900/80 border-t border-zinc-800/80 flex items-center gap-2 z-10"
      >
        <input
          id="chat-input-field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask bible verses, seek spiritual encouragement..."
          className="flex-1 bg-zinc-950 text-xs md:text-sm text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500/60 transition-colors"
          disabled={chatLoading}
        />
        <button
          id="btn-chat-submit"
          type="submit"
          disabled={!input.trim() || chatLoading}
          className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 transition-all flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10 active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
