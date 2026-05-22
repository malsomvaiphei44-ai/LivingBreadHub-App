import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, BookOpen, Heart, RefreshCw, Compass, ArrowRight, BookMarked, ShieldAlert } from "lucide-react";
import { useApp } from "../context/AppContext";

interface Message {
  role: "user" | "model";
  content: string;
  isWarning?: boolean;
}

export const ChatAssistant: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `Welcome in Christ, ${user?.name || "believer"}! I am **BreadOfLifeAI**, your spiritual companion. Tell me what is on your heart today. Whether you seek comforting scriptures for anxieties, a moment of healing prayer, or deep pastoral wisdom, I am here to guide you through God's holy Word.`
    }
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"struggles" | "healing" | "praise" | "wisdom">("struggles");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // Categories of high-grade spiritual presets
  const presetCategories = {
    struggles: {
      title: "🕊️ Struggles & Peace",
      items: [
        { label: "Overcoming Anxiety", prompt: "I am feeling anxious about tomorrow's challenges. What comforting scriptures can I hold onto?" },
        { label: "Finding Hope in Grief", prompt: "I am going through a season of grief and loss. How does God comfort a broken heart according to scripture?" },
        { label: "Conquering Fear", prompt: "I feel overwhelmed by fear and uncertainty. Please share scripture verses that give strength and mental clarity." },
        { label: "Dealing with Loneliness", prompt: "I feel lonely and isolated from fellowship. What promises in the Word reveal God's near presence?" }
      ]
    },
    healing: {
      title: "🩹 Healing & Comfort",
      items: [
        { label: "Seeking Body Healing", prompt: "Please share divine verses and an encouraging prayer for bodily healing and recovery from illness." },
        { label: "Mending Broken Hearts", prompt: "Is there scriptural restoration and guidance for emotional pain and wounds of betrayal?" },
        { label: "Mental Rest & Sleep", prompt: "I struggle to find peaceful sleep because of overthinking. What verses promise the Lord's quiet rest?" },
        { label: "Physical Exhaustion", prompt: "My body is tired and my soul is weary. What promises declare renewal of physical and spiritual strength?" }
      ]
    },
    praise: {
      title: "🎻 Worship & Thanksgiving",
      items: [
        { label: "Thanksgiving Verses", prompt: "Give me some profound scriptures on praise and entering God's courts with thanksgiving." },
        { label: "Acoustic Praise Ideas", prompt: "Suggest some beautiful worship song chords, acoustic setlists, or themes for morning devotionals." },
        { label: "Worshipping in Trials", prompt: "How can I worship God when going through heavy trials and difficulties? Share some encouraging verses." },
        { label: "Ascribing Glory", prompt: "Show me royal verses of praise from the Psalms to read aloud as my daily offering to the King." }
      ]
    },
    wisdom: {
      title: "📖 Wisdom & Commandments",
      items: [
        { label: "Decision Making Guide", prompt: "I need to make a major decision about my future. What steps of biblical wisdom should I walk after?" },
        { label: "Youth Secular Pressure", prompt: "What wisdom does the Bible offer to young people facing contemporary peer pressures and secular doubts?" },
        { label: "Daily Holy Habits", prompt: "What are key biblical practices for establishing spiritual discipline and regular prayer routines?" },
        { label: "Quiet Devotional Manna", prompt: "Synthesize a clean, short morning devotional schema that I can recite every day for spiritual focus." }
      ]
    }
  };

  const currentPresets = presetCategories[activeCategory].items;

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || chatLoading) return;

    const userMsg = textToSend.trim();
    setInput("");
    
    const updatedMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(updatedMessages);
    setChatLoading(true);

    try {
    const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  }),
});

const data = await response.json();

setMessages((prev) => [
  ...prev,
  {
    role: "model",
    content: data.reply,
    isWarning: !!data.warning,
  },
]);
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
        throw new Error("Chat response failed on status " + response.status);
      }
    } catch (err) {
      console.error("AI Assistant Endpoint Error:", err);
      // Premium graceful scriptural fallback message
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          content: "Beloved inquirer, I am currently reflecting quietly on the eternal Word. In times of difficulty or connection limits, remember His everlasting word is secure: 'Cast your burden upon the Lord and He will sustain you; He will never allow the righteous to be shaken.' (Psalm 55:22). Rest in His peace.",
          isWarning: true
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Upgraded Markdown pastoral list-formatter
  const formatMsg = (txt: string) => {
    if (!txt) return null;

    // First handle double asterisks bolding
    const parseBold = (str: string) => {
      const parts = str.split(/\*\*([^*]+)\*\*/g);
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="font-extrabold text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">{part}</strong>;
        }
        return part;
      });
    };

    const lines = txt.split("\n");
    return lines.map((line, idx) => {
      const trimmedLine = line.trim();
      
      // Determine if this is a standard bullet point starting with asterisk or dash
      if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
        const listText = trimmedLine.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc pl-1.5 text-zinc-350 my-1 font-sans leading-relaxed text-xs md:text-sm">
            {parseBold(listText)}
          </li>
        );
      }

      // Determine if a numbered list item
      const numMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        const num = numMatch[1];
        const content = numMatch[2];
        return (
          <div key={idx} className="flex gap-2.5 my-1.5 text-zinc-350 text-xs md:text-sm leading-relaxed pl-1 font-sans">
            <span className="font-mono font-bold text-amber-400 select-none">{num}.</span>
            <div className="flex-1">{parseBold(content)}</div>
          </div>
        );
      }

      // Regular line: check if empty to insert line spacing
      if (trimmedLine === "") {
        return <div key={idx} className="h-2.5" />;
      }

      return (
        <p key={idx} className="text-zinc-300 text-xs md:text-sm leading-relaxed my-1 font-sans">
          {parseBold(line)}
        </p>
      );
    });
  };

  return (
    <div id="ai-chat-assistant-container" className="flex flex-col h-[600px] bg-zinc-950 rounded-3xl border border-zinc-800/80 overflow-hidden relative shadow-2xl">
      {/* Subtle ambient light splash in header background */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      {/* 1. Header Navigation Console */}
      <div className="px-5 py-4 bg-zinc-900/90 border-b border-zinc-800/95 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-zinc-100 font-display font-bold text-sm flex items-center gap-1.5">
              BreadOfLife AI
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md uppercase font-mono font-black tracking-wider">Pastoral AI Counsel</span>
            </h3>
            <p className="text-[10px] text-zinc-500 font-sans tracking-wide">Grace-centered scripture guide & counseling chat</p>
          </div>
        </div>
        <button 
          id="btn-clear-chat"
          onClick={() => setMessages([{
            role: "model",
            content: `Worship and peace to you! Let's start fresh. Tell me what scriptures, promise verses, or spiritual counsel you are looking for today.`
          }])}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 transition-all uppercase text-[9px] tracking-wider font-mono bg-zinc-800/60 border border-zinc-800 rounded-lg hover:bg-zinc-800 max-w-[120px] self-end sm:self-auto"
          title="Reset Chat Session"
        >
          Reset Session
        </button>
      </div>

      {/* 2. Messages Live Drawer */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar z-10">
        {messages.map((m, idx) => (
          <div 
            key={idx}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-sm transition-all duration-300 ${
              m.role === "user" 
                ? "bg-gradient-to-br from-zinc-800 to-zinc-850 text-zinc-100 rounded-tr-none border border-zinc-750" 
                : "bg-zinc-900/60 text-zinc-300 border border-zinc-850/80 rounded-tl-none font-sans"
            }`}>
              {/* Parsed dynamic content */}
              <div className="space-y-0.5">
                {formatMsg(m.content)}
              </div>

              {m.isWarning && (
                <div className="mt-3 pt-2.5 border-t border-zinc-800/85 text-[10px] text-amber-400/80 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Operating in local devotional wisdom mode.</span>
                </div>
              )}
            </div>
            <span className="text-[8.5px] uppercase tracking-widest font-mono text-zinc-550 mt-1 px-1.5 select-none">
              {m.role === "user" ? "You" : "BreadOfLifeAI"}
            </span>
          </div>
        ))}

        {chatLoading && (
          <div className="flex items-center gap-3 text-zinc-400 text-xs py-2">
            <div className="flex gap-1 items-center bg-zinc-900/80 border border-zinc-850 px-4 py-3 rounded-2xl rounded-tl-none shadow-md">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 animate-pulse">AI is meditating on scripture promises...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 3. Category swapper & helper cards */}
      <div className="px-4 pt-2 pb-1.5 bg-zinc-900/40 border-t border-zinc-900/85 z-10 space-y-2">
        {/* Swapper Category Tags */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setActiveCategory("struggles")}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
              activeCategory === "struggles" ? "bg-amber-400 text-zinc-950" : "bg-zinc-900 hover:bg-zinc-850 text-zinc-500"
            }`}
          >
            🕊️ Struggles
          </button>
          <button
            onClick={() => setActiveCategory("healing")}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
              activeCategory === "healing" ? "bg-amber-400 text-zinc-950" : "bg-zinc-900 hover:bg-zinc-850 text-zinc-500"
            }`}
          >
            🩹 Healing
          </button>
          <button
            onClick={() => setActiveCategory("praise")}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
              activeCategory === "praise" ? "bg-amber-400 text-zinc-950" : "bg-zinc-900 hover:bg-zinc-850 text-zinc-500"
            }`}
          >
            🎻 Praise
          </button>
          <button
            onClick={() => setActiveCategory("wisdom")}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
              activeCategory === "wisdom" ? "bg-amber-400 text-zinc-950" : "bg-zinc-900 hover:bg-zinc-850 text-zinc-500"
            }`}
          >
            📖 Wisdom
          </button>
        </div>

        {/* suggestion items */}
        <div className="grid grid-cols-2 gap-2">
          {currentPresets.map((p, idx) => (
            <button
              key={idx}
              id={`preset-prompt-${activeCategory}-${idx}`}
              onClick={() => handleSendMessage(p.prompt)}
              className="text-left py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-450 hover:text-zinc-200 transition-all flex justify-between items-center group cursor-pointer max-w-full"
            >
              <span className="text-[10px] md:text-[11px] truncate font-sans font-medium">{p.label}</span>
              <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-amber-450 transition-colors shrink-0 ml-1.5" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Interactive Keyboard Input Field */}
      <form 
        id="ai-chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 bg-zinc-900/95 border-t border-zinc-850/90 flex items-center gap-2.5 z-10"
      >
        <input
          id="chat-input-field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask bible verses, seek spiritual encouragement..."
          className="flex-1 bg-zinc-955 text-xs md:text-sm text-zinc-150 placeholder-zinc-650 rounded-xl px-4 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500/70 transition-colors"
          disabled={chatLoading}
        />
        <button
          id="btn-chat-submit"
          type="submit"
          disabled={!input.trim() || chatLoading}
          className="p-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-850 disabled:text-zinc-700 text-zinc-950 transition-all flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/5 active:scale-95 cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
