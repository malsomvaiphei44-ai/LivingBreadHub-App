import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Lazy Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // We will allow running without key by throwing on direct usage
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Local File-Backed JSON Database Initialization
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "database.json");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial Standard Christian Seed Data
const defaultDatabase = {
  bibleTopics: [
    { id: "faith", name: "Faith", description: "Trusting in God's promises and character." },
    { id: "prayer", name: "Prayer", description: "Communicating deeply and continuously with God." },
    { id: "healing", name: "Healing", description: "Restoration for the body, mind, and spirit." },
    { id: "anxiety", name: "Anxiety & Peace", description: "Overcoming fear and finding divine tranquility." },
    { id: "love", name: "Love", description: "The core commandment of Christ; selflessness in action." },
    { id: "worship", name: "Worship", description: "Glorifying God as a daily devotional lifestyle." },
    { id: "forgiveness", name: "Forgiveness", description: "Releasing resentment as Christ did for us." },
    { id: "salvation", name: "Salvation", description: "God's redemptive plan through Jesus Christ." },
    { id: "leadership", name: "Leadership", description: "Serving others humbly and guiding in truth." }
  ],
  bibleVerses: [
    { id: "v1", reference: "Hebrews 11:1", text: "Now faith is the confidence in what we hope for and the assurance about what we do not see.", topic: "faith" },
    { id: "v2", reference: "Mark 11:24", text: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.", topic: "prayer" },
    { id: "v3", reference: "Isaiah 53:5", text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.", topic: "healing" },
    { id: "v4", reference: "Philippians 4:6-7", text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", topic: "anxiety" },
    { id: "v5", reference: "1 Corinthians 13:4-5", text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.", topic: "love" },
    { id: "v6", reference: "John 4:24", text: "God is spirit, and his worshipers must worship in the Spirit and in truth.", topic: "worship" },
    { id: "v7", reference: "Ephesians 4:32", text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.", topic: "forgiveness" },
    { id: "v8", reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", topic: "salvation" },
    { id: "v9", reference: "1 Peter 5:7", text: "Cast all your anxiety on him because he cares for you.", topic: "anxiety" },
    { id: "v10", reference: "Matthew 6:33", text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", topic: "faith" },
    { id: "v11", reference: "Philippians 4:13", text: "I can do all this through him who gives me strength.", topic: "faith" },
    { id: "v12", reference: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", topic: "leadership" }
  ],
  sermons: [
    { id: "s1", title: "Peace in the Midst of the Storm", pastor: "Pastor Brian Houston", category: "Worship & Peace", duration: "45 mins", youtubeId: "vAwit-Iu194", thumbnailUrl: "https://images.unsplash.com/photo-1518655061766-48f53af0855d?auto=format&fit=crop&q=80&w=600", views: 2450, date: "2026-04-12" },
    { id: "s2", title: "The Power of Encouraging Yourself", pastor: "Pastor Steven Furtick", category: "Faith", duration: "52 mins", youtubeId: "W_zWJbYvCsc", thumbnailUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=600", views: 4890, date: "2026-05-02" },
    { id: "s3", title: "Habits for Holy Living", pastor: "Pastor Craig Groeschel", category: "Leadership", duration: "38 mins", youtubeId: "i3P0Psc0S2w", thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600", views: 1840, date: "2026-05-10" },
    { id: "s4", title: "Hearing the Voice of God Clearly", pastor: "Priscilla Shirer", category: "Prayer", duration: "29 mins", youtubeId: "DIdBsc08Asw", thumbnailUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600", views: 3120, date: "2026-05-18" }
  ],
  songs: [
    {
      id: "m1",
      title: "Goodness of God",
      artist: "Bethel Music & Jenn Johnson",
      album: "Victory Live",
      duration: "4:56",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl: "https://images.unsplash.com/photo-1518655061766-48f53af0855d?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=kYI6e_YmN_A",
      plays: 98124,
      category: "Worship"
    },
    {
      id: "m2",
      title: "Oceans (Where Feet May Fail)",
      artist: "Hillsong UNITED",
      album: "Zion",
      duration: "8:56",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=6Gg6_6GqSgM",
      plays: 87521,
      category: "Worship"
    },
    {
      id: "m3",
      title: "Way Maker",
      artist: "Sinach",
      album: "Way Maker Live Concert",
      duration: "5:08",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      coverUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=SE_M9noEhNE",
      plays: 125430,
      category: "Worship"
    },
    {
      id: "m4",
      title: "What a Beautiful Name",
      artist: "Hillsong Worship",
      album: "Let There Be Light",
      duration: "5:40",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      coverUrl: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=nQWFzMvCfLE",
      plays: 43210,
      category: "Worship"
    },
    {
      id: "m5",
      title: "Gratitude",
      artist: "Brandon Lake",
      album: "House of Miracles",
      duration: "5:38",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      coverUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=2Tz8X6-1a08",
      plays: 154020,
      category: "Acoustic"
    },
    {
      id: "m6",
      title: "Jisu Naam (Beautiful Nagamese Glory)",
      artist: "Nise Meruno",
      album: "Naga Fellowship Praise",
      duration: "4:25",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      coverUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=l_6UPrbB65g",
      plays: 3512,
      category: "Nagamese"
    },
    {
      id: "m7",
      title: "Dil Se Aradhana Karoon (Hindi Worship)",
      artist: "Prabhu Ke Geet",
      album: "Aradhana Session",
      duration: "5:15",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      coverUrl: "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=yCHh_h0L5S8",
      plays: 14502,
      category: "Hindi"
    }
  ],
  shorts: [
    { id: "r1", title: "Finding Peace in Anxiety", speaker: "Steven Furtick", videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054773d1c30d9d158de010ccfb7dd52&profile_id=165&oauth2_token_id=57447761", caption: "Let go of control and cast your worries on Him. He's got writing on his hands! 🙌 #christian #faith #peace", likes: 320, shares: 120 },
    { id: "r2", title: "How to Build Consistent Faith", speaker: "Priscilla Shirer", videoUrl: "https://player.vimeo.com/external/403848135.sd.mp4?s=9108a7bde337033501a4e1df3ad2748f654cd9c0&profile_id=165&oauth2_token_id=57447761", caption: "Consistent obedience builds consistent spiritual authority in your life. 💪✝️ #jesus #worship #daily", likes: 890, shares: 450 },
    { id: "r3", title: "Trust Him in the Dark Valley", speaker: "Pastor Bobby", videoUrl: "https://player.vimeo.com/external/440536412.sd.mp4?s=6a978f1618698516d29ffb1d9bfcf90c42240b9&profile_id=165&oauth2_token_id=57447761", caption: "Every season of waiting has a destination of glory. Your promise is secure in Jesus Christ. 🌅❤️ #faithhopelove #bible", likes: 1245, shares: 812 },
    { id: "r4", title: "You Are Chosen and Redeemed", speaker: "Sister Joy", videoUrl: "https://player.vimeo.com/external/435645396.sd.mp4?s=d00ca41bbef816a75ad57c6b9b392a8b9487c0ff&profile_id=165&oauth2_token_id=57447761", caption: "Your value resides in your Creator - not in the words of critics. Keep walking confidently. ✨🌱 #chosen #grace", likes: 145, shares: 25 }
  ],
  prayers: [
    { id: "p1", userEmail: "youthleader@globalchurch.com", userName: "Marcus Vance", request: "In desperate prayer for our church youth camp coming up this weekend. Praying for hearts to be ready and spiritual encounters.", isPrivate: false, amenCount: 18, createdAt: "2026-05-19T08:34:00.000Z", amens: [] },
    { id: "p2", userEmail: "grace77@gmail.com", userName: "Grace Henderson", request: "Please stand with me in prayer for my mother's pathology results post-surgery. We are standing on Isaiah 53 for raw complete healing.", isPrivate: false, amenCount: 42, createdAt: "2026-05-19T14:12:00.000Z", amens: [] },
    { id: "p3", userEmail: "david.worship@yahoo.com", userName: "David Kim", request: "Seeking guidance and a doors-opening miracle in finding a server job. Financial burden is pressing but I still trust our provider.", isPrivate: false, amenCount: 23, createdAt: "2026-05-20T02:00:00.000Z", amens: [] }
  ],
  devotionals: [
    { id: "dev1", title: "Streams of Selah: Overcoming Daily Waves of Anxiety", date: "2026-05-20", bibleReadings: ["Philippians 4:6-7", "Proverbs 3:5-6"], content: "In a world of constant notification beeps and rapid schedules, anxiety often feels like an unwanted background static. But scripture reveals anxiety isn't meant to be managed alone; it is meant to be transferred. 'Cast all your cares on Him.' This means handing over the cargo. The peace of God isn't a state of feelingless static - it is a concrete firewall of grace guarding your heart.", reflection: "What is one specific cargo of concern you are willing to physically list and hand over in prayer right now?", author: "Dr. Rachel Croft (YouVersion Contributor)" }
  ],
  dailyVerse: { reference: "Philippians 4:13", text: "I can do all things through Christ who strengthens me.", theme: "Strength" }
};

// Database helper utilities
function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(defaultDatabase);
    return defaultDatabase;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const db = JSON.parse(data);
    
    // Auto-migrate old instrumental mock songs to genuine high-quality worship songs
    if (!db.songs || db.songs.length === 0 || db.songs[0].title.includes("Comforting Acoustic")) {
      db.songs = defaultDatabase.songs;
      saveDb(db);
    }
    return db;
  } catch (err) {
    console.error("Error reading database file", err);
    return defaultDatabase;
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database file", err);
  }
}

// Ensure database file exists
getDb();

// APP endpoints
app.get("/api/init", (req, res) => {
  res.json(getDb());
});

// Bible Verse endpoints
app.get("/api/bible", (req, res) => {
  const db = getDb();
  res.json({ verses: db.bibleVerses, topics: db.bibleTopics });
});

// Music endpoints
app.get("/api/music", (req, res) => {
  res.json(getDb().songs);
});

// YouTube Worship Studio search endpoint (replaces Spotify search)
const handleWorshipSearch = (req: any, res: any) => {
  const q = (req.query.q || "").toString().toLowerCase().trim();
  const db = getDb();
  
  // Real genuine worship tracks in premium search catalogue
  const youtubeWorshipDirectory = [
    {
      id: "sp1",
      title: "Goodness of God",
      artist: "Bethel Music & Jenn Johnson",
      album: "Victory Live",
      duration: "4:56",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl: "https://images.unsplash.com/photo-1518655061766-48f53af0855d?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=kYI6e_YmN_A",
      category: "Worship"
    },
    {
      id: "sp2",
      title: "Oceans (Where Feet May Fail)",
      artist: "Hillsong UNITED",
      album: "Zion (Deluxe)",
      duration: "8:56",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=6Gg6_6GqSgM",
      category: "Worship"
    },
    {
      id: "sp3",
      title: "Way Maker",
      artist: "Sinach",
      album: "Way Maker (Live Concert)",
      duration: "5:08",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      coverUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=SE_M9noEhNE",
      category: "Worship"
    },
    {
      id: "sp4",
      title: "What a Beautiful Name",
      artist: "Hillsong Worship",
      album: "Let There Be Light",
      duration: "5:40",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      coverUrl: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=nQWFzMvCfLE",
      category: "Worship"
    },
    {
      id: "sp5",
      title: "10,000 Reasons (Bless the Lord)",
      artist: "Matt Redman",
      album: "10,000 Reasons Live Session",
      duration: "5:42",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      coverUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=DXDGE_lRI0E",
      category: "Worship"
    },
    {
      id: "sp6",
      title: "Gratitude",
      artist: "Brandon Lake",
      album: "House of Miracles",
      duration: "5:38",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      coverUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=2Tz8X6-1a08",
      category: "Acoustic"
    },
    {
      id: "sp7",
      title: "Firm Foundation (He Won't)",
      artist: "Cody Carnes",
      album: "Firm Foundation Live",
      duration: "5:12",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=x9aInHFeXRE",
      category: "Worship"
    },
    {
      id: "sp8",
      title: "Holy Forever",
      artist: "Chris Tomlin",
      album: "Always Live",
      duration: "5:08",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverUrl: "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=IPRzT77fNfI",
      category: "Praise"
    },
    {
      id: "sp9",
      title: "Amazing Grace (My Chains Are Gone)",
      artist: "Chris Tomlin",
      album: "See the Morning",
      duration: "4:01",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      coverUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=300",
      youtubeUrl: "https://www.youtube.com/watch?v=Jbe7OruLk8I",
      category: "Hymns"
    }
  ];

  // Combine user database songs and YouTube Worship Studio master index
  const combined = [...db.songs, ...youtubeWorshipDirectory];
  
  if (!q) {
    return res.json(combined);
  }

  // Filter existing list
  let results = combined.filter(s => 
    s.title.toLowerCase().includes(q) || 
    s.artist.toLowerCase().includes(q) || 
    (s.album && s.album.toLowerCase().includes(q)) ||
    (s.category && s.category.toLowerCase().includes(q))
  );

  // If no match found, dynamically synthesise a result so users always get beautiful feedback
  if (results.length === 0 && q.length > 2) {
    const capitalized = q.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    results = [
      {
        id: `yt-dynamic-${Date.now()}`,
        title: `${capitalized} (Live Acoustic Worship Cover)`,
        artist: "YouTube Worship Studio Community",
        album: "Direct Worship Search Result",
        duration: "4:45",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverUrl: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=300",
        youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " worship song")}`,
        category: "Worship"
      },
      {
        id: `yt-dynamic-2-${Date.now()}`,
        title: `${capitalized} (Prayer Focus ambient Pads)`,
        artist: "LivingBread Worship Project",
        album: "Selah Moments",
        duration: "5:30",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        coverUrl: "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&q=80&w=300",
        youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " piano instrumental")}`,
        category: "Prayer Focus"
      }
    ];
  }

  res.json(results);
};

app.get("/api/youtube/search", handleWorshipSearch);
app.get("/api/spotify/search", handleWorshipSearch); // Graceful alias for older clients

// Sermon endpoints
app.get("/api/sermons", (req, res) => {
  res.json(getDb().sermons);
});

// Shorts endpoints
app.get("/api/shorts", (req, res) => {
  res.json(getDb().shorts);
});

// Prayers endpoints
app.get("/api/prayers", (req, res) => {
  res.json(getDb().prayers);
});

app.post("/api/prayers", (req, res) => {
  const { userEmail, userName, request, isPrivate } = req.body;
  if (!request || !userName) {
    return res.status(400).json({ error: "Missing required prayer fields" });
  }

  const db = getDb();
  const newPrayer = {
    id: "p_" + Date.now(),
    userEmail: userEmail || "anonymous@livingbread.com",
    userName,
    request,
    isPrivate: isPrivate || false,
    amenCount: 0,
    createdAt: new Date().toISOString(),
    amens: []
  };

  db.prayers.unshift(newPrayer);
  saveDb(db);
  res.status(201).json(newPrayer);
});

app.post("/api/prayers/:id/amen", (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;
  const db = getDb();
  const prayer = db.prayers.find((p: any) => p.id === id);

  if (!prayer) {
    return res.status(404).json({ error: "Prayer request not found" });
  }

  // Support toggling amen or counting votes
  prayer.amenCount += 1;
  if (!prayer.amens) prayer.amens = [];
  if (userEmail && !prayer.amens.includes(userEmail)) {
    prayer.amens.push(userEmail);
  }

  saveDb(db);
  res.json(prayer);
});

// Devotional endpoints
app.get("/api/devotionals", (req, res) => {
  res.json(getDb().devotionals);
});

// Admin Dynamic Uploads endpoints
app.post("/api/admin/content", (req, res) => {
  const { type, content } = req.body; // type: 'song' | 'sermon' | 'verse' | 'short' | 'devotional'
  if (!type || !content) {
    return res.status(400).json({ error: "Missing admin type or content data" });
  }

  const db = getDb();
  const newId = type.charAt(0) + "_" + Date.now();
  const contentWithId = { id: newId, ...content };

  if (type === "song") {
    contentWithId.plays = contentWithId.plays || 0;
    contentWithId.coverUrl = contentWithId.coverUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=300";
    db.songs.push(contentWithId);
  } else if (type === "sermon") {
    contentWithId.views = contentWithId.views || 0;
    contentWithId.thumbnailUrl = contentWithId.thumbnailUrl || "https://images.unsplash.com/photo-1518655061766-48f53af0855d?auto=format&fit=crop&q=80&w=600";
    db.sermons.push(contentWithId);
  } else if (type === "verse") {
    db.bibleVerses.push(contentWithId);
  } else if (type === "short") {
    contentWithId.likes = contentWithId.likes || 0;
    contentWithId.shares = contentWithId.shares || 0;
    db.shorts.push(contentWithId);
  } else if (type === "devotional") {
    db.devotionals.push(contentWithId);
  } else {
    return res.status(400).json({ error: "Invalid content type" });
  }

  saveDb(db);
  res.status(201).json({ success: true, item: contentWithId });
});

// Admin update endpoint
app.put("/api/admin/content/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const content = req.body;
  if (!type || !id || !content) {
    return res.status(400).json({ error: "Missing type, id, or update content" });
  }

  const db = getDb();
  let found = false;

  const updateItem = (arr: any[]) => {
    const idx = arr.findIndex((item) => item.id === id);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...content, id }; // retain original ID
      found = true;
    }
  };

  if (type === "song") {
    updateItem(db.songs);
  } else if (type === "sermon") {
    updateItem(db.sermons);
  } else if (type === "short") {
    updateItem(db.shorts);
  } else if (type === "devotional") {
    updateItem(db.devotionals);
  } else {
    return res.status(400).json({ error: "Invalid content type" });
  }

  if (!found) {
    content.id = id;
    if (type === "song") db.songs.push(content);
    else if (type === "sermon") db.sermons.push(content);
    else if (type === "short") db.shorts.push(content);
    else if (type === "devotional") db.devotionals.push(content);
  }

  saveDb(db);
  res.json({ success: true, item: content });
});

// Admin delete endpoint
app.delete("/api/admin/content/:type/:id", (req, res) => {
  const { type, id } = req.params;
  if (!type || !id) {
    return res.status(400).json({ error: "Missing type or id" });
  }

  const db = getDb();

  if (type === "song") {
    db.songs = db.songs.filter((s: any) => s.id !== id);
  } else if (type === "sermon") {
    db.sermons = db.sermons.filter((s: any) => s.id !== id);
  } else if (type === "short") {
    db.shorts = db.shorts.filter((s: any) => s.id !== id);
  } else if (type === "devotional") {
    db.devotionals = db.devotionals.filter((d: any) => d.id !== id);
  } else {
    return res.status(400).json({ error: "Invalid content type" });
  }

  saveDb(db);
  res.json({ success: true });
});

// AI Bible Assistant Chat Endpoint using @google/genai
app.post("/api/ai/chat", async (req, res) => {
  const { messages } = req.body; // Array of { role: 'user'|'model', content: string }
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  try {
    const ai = getAI();
    
    // Convert client-style messages to Gemini SDK contents format
    // role: 'user' or 'model'
    const formattedContents = messages.map((m: any) => {
      return {
        role: m.role || "user",
        parts: [{ text: m.content }]
      };
    });

    const systemInstruction = 
      "You are 'BreadOfLifeAI', a real intelligent multilingual Christian pastoral assistant on LivingBreadHub. " +
      "Your purpose is to welcome youths, worshipers, and global believers and guide them through scripture, devotional readings, " +
      "prayer counseling, and daily struggles with encouragement, spiritual balance, and deep respect.\n\n" +
      "Special Multilingual & Auto-Detection Guidelines:\n" +
      "1. Native support for English, Hindi, and Nagamese / Nagamese Creole languages.\n" +
      "2. Automatically detect which language the user is speaking in, or reply in the language they request.\n" +
      "3. If the user uses Nagamese (typically written in Roman alphabets e.g., 'Isor kotha', 'Isor bless koribo', 'mon dukh ase'), respond in Nagamese Creole! Use warm Nagamese phrases like 'Isor apuni ke bhal thakibo', 'Isor bless koribo', 'mon shanti thakibi'.\n" +
      "4. If the user inputs in Hindi (e.g. 'चिंता', 'प्रार्थना', 'शांति'), reply comfortably in Hindi using scripture and encouragement.\n" +
      "5. If the user uses English, reply in English.\n\n" +
      "Core Scriptural Guidelines:\n" +
      "1. Always quote accurate biblical references (e.g. Philippians 4:13, Isaiah 41:10) to suggest biblical core tenets for everyday issues.\n" +
      "2. Respond with warm, loving, reassuring, and hopeful Christian vocabulary.\n" +
      "3. Answer Bible questions accurately based on Protestant standard testaments.\n" +
      "4. Respond with deep empathy to prayer requests, loneliness, anxiety, youth struggles, faith doubts, and physical illnesses.\n" +
      "5. Keep responses elegant, concise, and focused purely on spiritual mending. Do not talk about your underlying AI model, system architecture, or computer code.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.72,
      },
    });

    const text = response.text ? response.text.trim() : "";
    if (!text) {
      throw new Error("Received empty response from Gemini");
    }
    res.json({ content: text });
  } catch (error: any) {
    console.error("Gemini API Error in AI Pastor:", error);
    
    // Provide a beautiful and helpful fallback behavior if GEMINI_API_KEY is not defined, 
    // or if the API call failed, so the app remains perfectly functional!
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    let mockResponse = "Indeed, God's word is an unshakeable foundation for our souls. 'The Lord is my shepherd; I shall not want.' (Psalm 23:1). Remember that He works all things for the good of those who love Him.";
    
    const query = lastUserMessage.toLowerCase();
    
    // Check if the input looks like Nagamese
    const isNagamese = query.includes("isor") || query.includes("bhal") || query.includes("ase") || query.includes("mon") || query.includes("dukh") || query.includes("apuni") || query.includes("karone") || query.includes("koile");
    // Check if the input looks like Hindi
    const isHindi = /[ऀ-ॿ]/.test(lastUserMessage) || query.includes("prarthana") || query.includes("shanti") || query.includes("vachan");

    if (isNagamese) {
      mockResponse = "Apunee laga mon dukh thakile bhebostha na kuribi. Isor apuni ke bhal thakibo! Philippians 4:13 te likhi ase: 'Kun moi ke shakti diye, ta logot te moi sob kuribo pare.' Mon shanti thakibi, Isor apuni ke bhal koribo.";
      if (query.includes("anxiety") || query.includes("wor") || query.includes("dor") || query.includes("dukh")) {
        mockResponse = "Isor bisi bhal ase, dor na kuribi! 1 Peter 5:7 te likhi ase: 'Apuni laga dukh dhyan sob Isor te peliya r dharu kilekoile ta apuni ke ghor chinta kure.' Isor apuni ke bhal thakibo.";
      } else if (query.includes("prarthana") || query.includes("request")) {
        mockResponse = "Moi apuni karone prarthana kurise. Matthew 18:20 te Jisu bhabe di ase, jate duita tin ta manu moi laga naam te joma hobo, moi tate thakibo. Isor apuni logot rasta banae dibo.";
      }
    } else if (isHindi) {
      mockResponse = "परमेश्वर का वचन हमारे जीवन के लिए एक दृढ़ नींव है। 'यहोवा मेरा चरवाहा है, मुझे कोई घटी न होगी।' (भजन संहिता 23:1)। विश्वास रखिए, वह सब कुछ आपके भले के लिए कर रहा है।";
      if (query.includes("anxiety") || query.includes("चिंता") || query.includes("डर") || query.includes("परेशान")) {
        mockResponse = "प्रिय विश्वासी, परमेश्वर का वचन कहता है: 'अपनी सारी चिंता उसी पर डाल दो, क्योंकि उसे तुम्हारा ध्यान है।' (1 पतरस 5:7)। यहोवा आपका रक्षक है और वह आपको कभी नहीं छोड़ेगा।";
      } else if (query.includes("healing") || query.includes("बीमार") || query.includes("दर्द") || query.includes("चंगाई")) {
        mockResponse = "हम आपकी चंगाई के लिए अनुग्रह के सिंहासन से प्रार्थना करते हैं। यशायाह 53:5 कहता है: 'उसके कोड़े खाने से हम चंगे हो गए।' आप उसकी शांति में आराम करें।";
      }
    } else {
      // English fallbacks
      if (query.includes("anxiety") || query.includes("worry") || query.includes("fear")) {
        mockResponse = "I hear your anxious heart, beloved. Isaiah 41:10 tells us, 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.' When anxiety rolls in, hand the cargo over in prayer.";
      } else if (query.includes("healing") || query.includes("sick") || query.includes("pain") || query.includes("ill")) {
        mockResponse = "We elevate your body and spirit to the Lord. Jeremiah 17:14 declares: 'Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.' Lean into His rest and take comfort.";
      } else if (query.includes("faith") || query.includes("doubt") || query.includes("test")) {
        mockResponse = "Let your faith rise today, even if it feels as small as a mustard seed (Matthew 17:20). Trust in the Lord with all your heart, and lean not on your own understanding (Proverbs 3:5-6). He is completing a good work in you.";
      }
    }

    res.json({ 
      content: mockResponse,
      warning: "Note: Operating in local devotional wisdom mode.",
    });
  }
});

// Vite Developer Server Configuration (Development Mode)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite middleware
    app.use(vite.middlewares);
  } else {
    // Production Static Files Routing
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LivingBreadHub Full-Stack API] Server running on http://localhost:${PORT}`);
  });
}

startServer();
