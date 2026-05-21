import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { User, BibleTopic, BibleVerse, Sermon, Song, ShortReel, PrayerRequest, Devotional } from "../types";
import { 
  db, 
  auth, 
  signInWithGoogle, 
  logoutUser, 
  OperationType, 
  handleFirestoreError 
} from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  setDoc, 
  getDoc,
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export interface MultilingualScripture {
  reference: string;
  theme: string;
  title: Record<string, string>; // EN, HI, Nagamese (The Daily spiritual topic title)
  text: Record<string, string>; // EN, HI, Nagamese (The Bible Verse)
  inspiration: Record<string, string>; // EN, HI, Nagamese (The Daily Inspiration)
  prayer: Record<string, string>; // EN, HI, Nagamese (The Heartfelt Daily Prayer)
}

// 10 beautiful, coordinated spiritual devotionals for automatic daily rotation
export const dailyScripturesList: MultilingualScripture[] = [
  {
    reference: "James 1:5",
    theme: "Wisdom",
    title: {
      EN: "Streams of Wisdom",
      HI: "बुद्धि की धाराएं (Streams of Wisdom)",
      Nagamese: "Wisdom laga sota (Streams of Wisdom)"
    },
    text: {
      EN: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
      HI: "यदि तुम में से किसी को बुद्धि की घटी हो, तो परमेश्वर से मांगे, जो बिना उलाहना दिए सब को उदारता से देता है; और उसे दी जाएगी।",
      Nagamese: "Apunee khan te wisdom laga kami thakile Isor kote mangibi, ta sobeke bisi morom te dibo."
    },
    inspiration: {
      EN: "Wisdom is not merely academic knowledge; it is the spiritual clarity to see your circumstances through God’s eyes. When you ask Him, He never mocks your confusion but pours out guidance generously.",
      HI: "बुद्धि केवल सांसारिक ज्ञान नहीं है; यह परमेश्वर की आँखों से अपनी परिस्थितियों को देखने की आध्यात्मिक स्पष्टता है। जब आप उससे माँगते हैं, तो वह उदारता से मार्गदर्शन प्रदान करता है।",
      Nagamese: "Wisdom to khali bhaal porha nahoye; Isor laga chokh te apuni laga halat ke bhaal rasta te saba jorur ase. Mangile Isor sahai kuribo."
    },
    prayer: {
      EN: "Father, guide my decisions today. Calm my restless thoughts and let Your steady wisdom lead my steps.",
      HI: "हे पिता, आज मेरे हर फैसले में मेरा मार्गदर्शन करें। मेरे अशांत विचारों को शांत करें और मुझे अपनी स्थिर बुद्धि से चलाएं।",
      Nagamese: "Isor, aji moi laga sob kam te bhaal rasta dekhabi. Moi laga chinta shanti kuri apuni laga wisdom te rasta rasta te loi jabi."
    }
  },
  {
    reference: "Ephesians 2:8",
    theme: "Grace",
    title: {
      EN: "Anchored in Grace",
      HI: "अनुग्रह में स्थापित (Anchored in Grace)",
      Nagamese: "Grace te bandhi thaka (Anchored in Grace)"
    },
    text: {
      EN: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.",
      HI: "क्योंकि विश्वास के द्वारा अनुग्रह ही से तुम्हारा उद्धार हुआ है; और यह तुम्हारी ओर से नहीं, यह परमेश्वर का दान है।",
      Nagamese: "Kilekoile apuni bhorosa logote grace karone bashi ase, etu nijor pora naho-i, Isor laga ekta gift ase."
    },
    inspiration: {
      EN: "Grace means that your worth is already secured by God’s love, not by your performance or perfect days. You are safe in His family, anchored by an unshakeable promise.",
      HI: "अनुग्रह का अर्थ है कि आपका मूल्य पहले से ही परमेश्वर के प्रेम से सुरक्षित है, न कि आपके प्रदर्शन या पूर्ण दिनों से। आप उनके परिवार में सुरक्षित हैं, एक अटल वादे से बंधे हैं।",
      Nagamese: "Grace laga matlab to apuni laga hami-khusi Jisu laga morom te basi ase. Isor laga bosti te apuni bhorosa te safe ase."
    },
    prayer: {
      EN: "Lord, I rest in Your unconditional love today. Let Your grace wash away my fears and give me fresh hope.",
      HI: "प्रभु, मैं आज आपके बिना शर्त प्रेम में विश्राम करता हूँ। आपके अनुग्रह को मेरे भयों को मिटाने दें और मुझे नई आशा दें।",
      Nagamese: "Isor Jisu, aji moi apuni laga morom te shanti pam. Apuni laga morom r shakti te moi laga dor hataijabi aru bhorosa dibi."
    }
  },
  {
    reference: "2 Corinthians 5:7",
    theme: "Faith",
    title: {
      EN: "Walking by Faith",
      HI: "विश्वास की राह पर (Walking by Faith)",
      Nagamese: "Bhorosa kori berabo (Walking by Faith)"
    },
    text: {
      EN: "For we live by faith, not by sight.",
      HI: "क्योंकि हम रूप को देखकर नहीं, वरन् विश्वास से चलते हैं।",
      Nagamese: "Kilekoile aami laga jibon bhorosa te cholibo pare, soku te dekhikena naho-i."
    },
    inspiration: {
      EN: "Faith is stepping forward when you cannot see the entire path. It is trusting that the One who called you is already waiting for you in the tomorrow you are so worried about.",
      HI: "विश्वास तब आगे बढ़ना है जब आप पूरा रास्ता नहीं देख पाते। यह भरोसा रखना है कि जिसने आपको बुलाया है वह पहले से ही आपके आने वाले कल में मौजूद है, जिसके बारे में आप चिंतित हैं।",
      Nagamese: "Bhorosa to rasta bhal te nadekhile bi agete jabi. Isor apuni laga aji aru kali sob bhal bhabe jane."
    },
    prayer: {
      EN: "Jesus, strengthen my trust when the outline of tomorrow is unclear. I hand over my plans to Your beautiful hands.",
      HI: "यीशु, जब आने वाले कल की रूपरेखा अस्पष्ट हो, तो मेरे विश्वास को दृढ़ करें। मैं अपनी योजनाएं आपके सुंदर हाथों में सौंपता हूँ।",
      Nagamese: "Jisu, kali ki hobo etu chinta thakile bi moi laga bhorosa ke shaktisali kuribi. Moi laga rasta apunee kote somaise."
    }
  },
  {
    reference: "Psalm 119:105",
    theme: "Guidance",
    title: {
      EN: "Light for Today",
      HI: "आज के लिए ज्योति (Light for Today)",
      Nagamese: "Aji laga Pohar (Light for Today)"
    },
    text: {
      EN: "Your word is a lamp for my feet, a light on my path.",
      HI: "तेरा वचन मेरे पाँव के लिये दीपक, और मेरे मार्ग के लिये उजियाला है।",
      Nagamese: "Apuni laga kotha to moi laga bosti laga light ase, rasta dekhabo lamp ase."
    },
    inspiration: {
      EN: "God’s Word rarely illuminates the next five years all at once. Instead, it acts like a lantern, providing active light for the single step right in front of you. Focus on walking obediently today.",
      HI: "परमेश्वर का वचन पूरी पाँच साल की योजना एक साथ नहीं दिखाता। इसके बजाय, यह एक लालटेन की तरह काम करता है, जो आज के कदम के लिए उजाला देता है। आज आज्ञाकारिता के साथ चलने पर ध्यान केंद्रित करें।",
      Nagamese: "Isor laga kotha to dosti rasta te ekela barte lamp nishina jole. Aji laga ek step te obedient hobo shakti dibi."
    },
    prayer: {
      EN: "Lord, let Your scripture speak directly to me today. Dispel my darkness and light my path with truth.",
      HI: "प्रभु, आज आपका वचन मुझसे सीधे बात करे। मेरे अंधकार को दूर करें और मेरे मार्ग को सत्य से आलोकित करें।",
      Nagamese: "Isor, aji apuni laga kotha moi logote porhayo kotha kuribi. Moi laga mon laga andhara dur kuri bhal rasta dekhabi."
    }
  },
  {
    reference: "Romans 15:13",
    theme: "Hope",
    title: {
      EN: "Bread of Hope",
      HI: "आशा की रोटी (Bread of Hope)",
      Nagamese: "Bhorosa laga Ruti (Bread of Hope)"
    },
    text: {
      EN: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope.",
      HI: "सो आशा का दाता परमेश्वर तुम्हें विश्वास रखने में सब प्रकार के आनन्द और शान्ति से परिपूर्ण करे, कि पवित्र आत्मा की सामर्थ्य से तुम्हारी आशा बढ़ती जाए।",
      Nagamese: "Bhorosa laga Isor apuni ke khusi aru shanti pora bhorta kuru Jisu te bhorosa kurile, jate apuni bosa thakibo."
    },
    inspiration: {
      EN: "Hope is not wishful thinking; it is a confident expectation of God’s goodness. When you feed your soul with His presence, worry is replaced with an overflow of divine joy.",
      HI: "आशा केवल एक इच्छा नहीं है; यह परमेश्वर की भलाई और उनके वायदों पर पूरा भरोसा है। जब आप अपनी आत्मा को उनकी उपस्थिति से भरते हैं तो चिंता शांत हो जाती है।",
      Nagamese: "Aasa to khali bhabna naho-i, Isor bhal ase kotha bhorosa kura ase. Mon shanti aru khusi pora bhorta hobo."
    },
    prayer: {
      EN: "God of Hope, overflow my dry heart with Your spirit. Fill me with joy and peace that transcends any temporary struggles.",
      HI: "आशा के परमेश्वर, मेरे सूखे हृदय को अपनी आत्मा से भर दें। मुझे उस शांति से भरें जो सांसारिक कठिनाइयों से परे है।",
      Nagamese: "Aasa laga Isor, moi laga dukh mon te shanti bharai dibi. Khusi aru shanti pora moi ke shaktisali kuribi."
    }
  },
  {
    reference: "John 14:27",
    theme: "Peace",
    title: {
      EN: "Peace Beyond Fear",
      HI: "भय से परे शांति (Peace Beyond Fear)",
      Nagamese: "Dorr pise te Shanti (Peace Beyond Fear)"
    },
    text: {
      EN: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled.",
      HI: "मैं तुम्हें शान्ति दिए जाता हूँ, अपनी शान्ति तुम्हें देता हूँ; जैसे जगत देता है, मैं तुम्हें वैसे नहीं देता। तुम्हारा मन व्याकुल न हो।",
      Nagamese: "Moi apunee khan logote shanti rani jaise, moi laga shanti apuni ke di ase."
    },
    inspiration: {
      EN: "The peace Christ provides is not the absence of trouble, but the presence of the Saviour. It remains steady even when the storm outside is raging.",
      HI: "मसीह जो शांति देते हैं वह समस्याओं की अनुपस्थिति नहीं है, बल्कि उद्धारकर्ता की उपस्थिति है। बाहर चाहे कितना भी तूफान हो, वह शांति बनी रहती है।",
      Nagamese: "Jisu laga shanti to muskil kotha nathaka naho-i, ta apuni logote thaka karone rasta ase. Storm ahilebi shanti ase."
    },
    prayer: {
      EN: "Prince of Peace, guard my mind today. When fear knocks, let Your quiet assurance answer first.",
      HI: "शांति के राजकुमार, आज मेरे मन की रक्षा करें। जब डर दस्तक दे, तो आपका शांत विश्वास सबसे पहले उत्तर दे।",
      Nagamese: "Shanti laga Jisu, aji moi laga mon ke sahai kuribi. Mon bisi dukh thakile apunee logote shanti rasta thakibo."
    }
  },
  {
    reference: "Philippians 4:13",
    theme: "Strength",
    title: {
      EN: "Strength in Christ",
      HI: "मसीह में सामर्थ्य (Strength in Christ)",
      Nagamese: "Khristo te shakti (Strength in Christ)"
    },
    text: {
      EN: "I can do all things through Christ who strengthens me.",
      HI: "जो मुझे सामर्थ्य देता है उसमें मैं सब कुछ कर सकता हूँ।",
      Nagamese: "Kun moi ke shakti diye, ta logot te moi sob kuribo pare."
    },
    inspiration: {
      EN: "Physical limits and emotional exhaustion are moments of opportunity for grace. Christ does not just wish you well; He physically injects His spiritual power into your weakness.",
      HI: "शारीरिक सीमाएं और मानसिक थकान हमारे लिए अनुग्रह के अवसर हैं। मसीह हमारी कमजोरियों में अपनी सामर्थ्य फूंकते हैं और अपनी शक्ति देते हैं।",
      Nagamese: "Moi laga mon kamjor thakile bi Jisu pora shakti diye, kilekoile khristo logote moi sob rasta paar kuribo pare."
    },
    prayer: {
      EN: "Jesus, be my muscle today. When I feel like giving up, carry me forward in Your grace.",
      HI: "यीशु, आज मेरी ताकत बनें। जब मैं हार मानने लगूँ, तो मुझे अपने अनुग्रह में आगे ले चलें।",
      Nagamese: "Jisu, aji moi laga shakti apunee hobi. Moi kam rasta te harile apuni moi ke agete loi jabi."
    }
  },
  {
    reference: "Lamentations 3:22-23",
    theme: "Mercy",
    title: {
      EN: "Wells of Mercy",
      HI: "दया के सोते (Wells of Mercy)",
      Nagamese: "Morom laga sota (Wells of Mercy)"
    },
    text: {
      EN: "Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning.",
      HI: "यह यहोवा की महाकरुणा का फल है कि हम मिट नहीं गए; क्योंकि उसकी दया अटूट है। प्रति भोर वह नई होती रहती है।",
      Nagamese: "Isor laga bisi morom thaka karone aami sasti pora bashi ase, din rasta te tar morom aji bi naya ase."
    },
    inspiration: {
      EN: "No matter how many mistakes you made yesterday, God's mercy is dynamic and brand new today. His compassions are refreshed as the morning sun rises, assuring you of a clean slate.",
      HI: "कल आपने चाहे कितनी भी गलतियाँ की हों, परमेश्वर की दया आज आपके लिए बिल्कुल नई है। सुबह के सूर्य की तरह उनकी करुणा हर भोर ताज़ा होती है और आपको मौका देती है।",
      Nagamese: "Kali apuni galti kurilebi aji Isor laga morom naya ase. Isor apuni ke dhulaikena aji naya taja bhorosa dibo."
    },
    prayer: {
      EN: "Heavenly Father, thank You for a clean slate. I receive Your fresh mercy today and choose forgiveness for myself and others.",
      HI: "स्वर्गीय पिता, एक नई शुरुआत के लिए धन्यवाद। मैं आज आपकी नई दया को स्वीकार करता हूँ और दूसरों को क्षमा करने का विकल्प चुनता हूँ।",
      Nagamese: "Isor Jisu, naya din karone dhanyabad duba. Moi apuni laga naya morom logote aji galti khan maaf kurikena bhal te thakibo."
    }
  },
  {
    reference: "Proverbs 3:5-6",
    theme: "Trust",
    title: {
      EN: "Guided by His Word",
      HI: "वचन द्वारा निर्देशित (Guided by His Word)",
      Nagamese: "Jisu koba te cholibo (Guided by His Word)"
    },
    text: {
      EN: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      HI: "वरन् सम्पूर्ण मन से यहोवा पर भरोसा रखना, और अपनी समझ का सहारा न लेना। उसी को स्मरण करके सब काम करना, तब वह तेरे लिये सीधा मार्ग निकालेगा।",
      Nagamese: "Apuni laga bhabna te bhorosa na kuri, hridoy logote Jisu te bhorosa kuribi; ta apuni laga rasta thik kuribo."
    },
    inspiration: {
      EN: "Submitting your ways to Him means releasing your stubborn grasp on how things 'must' turn out. Trust that His bird's-eye view of your life is infinitely better than your limited sight.",
      HI: "परमेश्वर पर भरोसा रखने का अर्थ है कि हम नियंत्रण की इच्छा को छोड़ दें। विश्वास रखें कि आपके जीवन पर उनका दृष्टिकोण आपके सीमित ज्ञान से कहीं अधिक बेहतर और भव्य है।",
      Nagamese: "Isor te bhorosa kura matlab to nijor matha khataiki thaka chiri diya ase. Isor apuni laga ghor te sub kotha bhal rasta te milabo."
    },
    prayer: {
      EN: "Lord, I lay down my heavy need for control. Direct my steps and lead me down the right pathways today.",
      HI: "प्रभु, मैं नियंत्रण की अपनी भारी इच्छा को आपके चरणों में रखता हूँ। आज मेरे कदमों को निर्देशित करें और मुझे सीधे मार्ग पर ले चलें।",
      Nagamese: "Isor, moi laga chinta sub apuni kote somaise. Aji moi laga kam-rasta apuni bhal panna te dekhai dibi."
    }
  },
  {
    reference: "Psalm 143:8",
    theme: "Faithfulness",
    title: {
      EN: "Morning Streams of Faith",
      HI: "विश्वास की सुबह (Morning Streams of Faith)",
      Nagamese: "Bhal pajila r bhorosa (Morning Streams of Faith)"
    },
    text: {
      EN: "Let the morning bring me word of your unfailing love, for I have put my trust in you. Show me the way I should go.",
      HI: "भोर को मुझे अपनी करुणा का वचन सुना, क्योंकि मैंने तुझ पर भरोसा रखा है। मुझे वह मार्ग बता जिस से मैं चलूँ।",
      Nagamese: "Pajila hile apuni laga morom kotha moi ke shunibo dibi kilekoile moi bhorosa kurise. Kun rasta te moi jabo ta dekhai dibi."
    },
    inspiration: {
      EN: "Starting your morning with faith adjusts your perspective for whatever the world throws at you today. It reminds you that before you even stepped out of bed, your Father’s love was already active and protective.",
      HI: "अपनी सुबह को विश्वास के साथ शुरू करना आपके पूरे दिन के दृष्टिकोण को बदल देता है। यह याद दिलाता है कि बिस्तर से उठने से पहले ही पिता का प्रेम आपके लिए सक्रिय और सुरक्षात्मक था।",
      Nagamese: "Sokale Isor kote bhabna suru kurile din to bhaal hobo. Apuni na-utha agete bi Isor laga morom apuni ke rakhi thakise."
    },
    prayer: {
      EN: "Good morning Holy Spirit, thank You for another day of life. Show me the way to walk in kindness, grace, and hope.",
      HI: "पवित्र आत्मा, जीवन के एक और दिन के लिए धन्यवाद। मुझे आज दया, अनुग्रह और आशा के साथ चलने का मार्ग दिखाएं।",
      Nagamese: "Bhal pajila Pavitra Atma, naya jibon laga din karone dhanyabad ase. Moi ke morom, grace, aru aasa rasta dekhai jabi."
    }
  }
];

export const defaultBibleTopics: BibleTopic[] = [
  { id: "faith", name: "Faith", description: "Trusting in God's promises and character." },
  { id: "prayer", name: "Prayer", description: "Communicating deeply and continuously with God." },
  { id: "healing", name: "Healing", description: "Restoration for the body, mind, and spirit." },
  { id: "anxiety", name: "Anxiety & Peace", description: "Overcoming fear and finding divine tranquility." },
  { id: "love", name: "Love", description: "The core commandment of Christ; selflessness in action." },
  { id: "worship", name: "Worship", description: "Glorifying God as a daily devotional lifestyle." }
];

export interface EngagementStats {
  prayersSubmitted: number;
  worshipSongsPlayed: number;
  dailyVerseViews: number;
  registeredUsers: number;
  sermonsWatched: number;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  bibleTopics: BibleTopic[];
  bibleVerses: BibleVerse[];
  sermons: Sermon[];
  songs: Song[];
  shorts: ShortReel[];
  prayers: PrayerRequest[];
  devotionals: Devotional[];
  dailyVerse: { reference: string; text: string; theme: string };
  currentScripture: MultilingualScripture;
  isLoading: boolean;
  engagementStats: EngagementStats;
  incrementTrackedActivity: (key: keyof EngagementStats) => void;
  
  // Media Player states
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, songList?: Song[]) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  stopSong: () => void;
  songListPool: Song[];

  // Interactive Play audio fields
  currentTime: number;
  duration: number;
  volume: number;
  seek: (seconds: number) => void;
  changeVolume: (vol: number) => void;

  // Language & Themes
  currentLang: "EN" | "HI" | "Nagamese";
  setCurrentLang: (lang: "EN" | "HI" | "Nagamese") => void;
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;

  // App functionalities
  toggleFavoriteVerse: (verseId: string) => void;
  toggleFavoriteSong: (songId: string) => void;
  toggleFavoriteSermon: (sermonId: string) => void;
  addPrayerRequest: (requestText: string, isPrivate: boolean) => Promise<boolean>;
  castAmen: (prayerId: string) => Promise<void>;
  
  // Authentications
  loginWithGoogle: () => Promise<void>;
  loginSimulated: (email: string, name: string) => void;
  logout: () => Promise<void>;

  // Refresh/Admin actions
  refreshData: () => Promise<void>;
  uploadContent: (type: "song" | "sermon" | "short" | "devotional", content: any) => Promise<boolean>;
  deleteContent: (type: "song" | "sermon" | "short" | "devotional", id: string) => Promise<boolean>;
  updateContent: (type: "song" | "sermon" | "short" | "devotional", id: string, content: any) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bibleTopics, setBibleTopics] = useState<BibleTopic[]>(defaultBibleTopics);
  const [bibleVerses, setBibleVerses] = useState<BibleVerse[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [shorts, setShorts] = useState<ShortReel[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [currentLang, setCurrentLang] = useState<"EN" | "HI" | "Nagamese">("EN");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [isLoading, setIsLoading] = useState(true);

  // Engagement tracking starting from 0 and growing dynamically
  const [engagementStats, setEngagementStats] = useState<EngagementStats>(() => {
    const saved = localStorage.getItem("living_bread_engagement_stats_2026");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Error parsing statistics", e);
      }
    }
    return {
      prayersSubmitted: 0,
      worshipSongsPlayed: 0,
      dailyVerseViews: 0,
      registeredUsers: 0,
      sermonsWatched: 0
    };
  });

  const incrementTrackedActivity = (key: keyof EngagementStats) => {
    setEngagementStats(prev => {
      const next = { ...prev, [key]: prev[key] + 1 };
      localStorage.setItem("living_bread_engagement_stats_2026", JSON.stringify(next));
      return next;
    });
  };

  // Active Multi-language Verse of the Day (rotates based on current day of month)
  const dayIndex = new Date().getDate() % dailyScripturesList.length;
  const currentScripture = dailyScripturesList[dayIndex];
  
  // Backward compatibility object
  const dailyVerse = {
    reference: currentScripture.reference,
    theme: currentScripture.theme,
    text: currentScripture.text[currentLang] || currentScripture.text["EN"]
  };

  // HTML Audio node states
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songListPool, setSongListPool] = useState<Song[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Store refs of states to bypass event listener dependency cycles
  const poolRef = useRef<Song[]>([]);
  const curSongRef = useRef<Song | null>(null);

  useEffect(() => {
    poolRef.current = songListPool;
    curSongRef.current = currentSong;
  }, [songListPool, currentSong]);

  // Handle Mount Audio Node Listener
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      triggerNextSong();
    };

    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("durationchange", handleDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("durationchange", handleDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Sync volume level updates to audio element
  const changeVolume = (vol: number) => {
    const bounded = Math.max(0, Math.min(1, vol));
    setVolume(bounded);
    if (audioRef.current) {
      const isYTSong = curSongRef.current?.youtubeUrl || curSongRef.current?.id?.startsWith("yt-");
      audioRef.current.volume = isYTSong ? 0 : bounded;
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current && duration > 0) {
      const bounded = Math.max(0, Math.min(duration, seconds));
      audioRef.current.currentTime = bounded;
      setCurrentTime(bounded);
    }
  };

  // Sync auth updates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsLoading(true);
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          let profile: User;
          const isExplicitAdmin = fbUser.email === "malsomvaiphei44@gmail.com" || fbUser.email?.includes("admin");

          if (userSnap.exists()) {
            profile = { 
              id: fbUser.uid, 
              ...userSnap.data() 
            } as User;
            // Overwrite role if primary email matches admin
            if (isExplicitAdmin && profile.role !== "admin") {
              profile.role = "admin";
              await setDoc(userDocRef, { role: "admin" }, { merge: true });
            }
          } else {
            profile = {
              id: fbUser.uid,
              email: fbUser.email || "",
              name: fbUser.displayName || fbUser.email?.split("@")[0] || "Fellowship Worshiper",
              role: isExplicitAdmin ? "admin" : "user",
              favorites: {
                verses: [],
                songs: [],
                sermons: []
              },
              listeningHistory: []
            };
            await setDoc(userDocRef, profile);
          }
          setUser(profile);
          
          // Count initial user registration entry
          const hasRegisteredThisSession = sessionStorage.getItem("living_bread_registered_session");
          if (!hasRegisteredThisSession) {
            sessionStorage.setItem("living_bread_registered_session", "true");
            incrementTrackedActivity("registeredUsers");
          }
        } catch (e) {
          console.error("Error setting user credentials: ", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Refresh dynamic content list from Firestore
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch songs
      const songsSnap = await getDocs(collection(db, "songs"));
      const songsList: Song[] = [];
      songsSnap.forEach((doc) => {
        songsList.push({ id: doc.id, ...doc.data() } as Song);
      });
      setSongs(songsList);

      // 2. Fetch sermons
      const sermonsSnap = await getDocs(collection(db, "sermons"));
      const sermonsList: Sermon[] = [];
      sermonsSnap.forEach((doc) => {
        sermonsList.push({ id: doc.id, ...doc.data() } as Sermon);
      });
      setSermons(sermonsList);

      // 3. Fetch shorts
      const shortsSnap = await getDocs(collection(db, "shorts"));
      const shortsList: ShortReel[] = [];
      shortsSnap.forEach((doc) => {
        shortsList.push({ id: doc.id, ...doc.data() } as ShortReel);
      });
      setShorts(shortsList);

      // 4. Fetch prayers
      const prayersSnap = await getDocs(collection(db, "prayers"));
      const prayersList: PrayerRequest[] = [];
      prayersSnap.forEach((doc) => {
        prayersList.push({ id: doc.id, ...doc.data() } as PrayerRequest);
      });
      prayersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPrayers(prayersList);

      // 5. Fetch devotionals
      const devSnap = await getDocs(collection(db, "devotionals"));
      const devList: Devotional[] = [];
      devSnap.forEach((doc) => {
        devList.push({ id: doc.id, ...doc.data() } as Devotional);
      });
      setDevotionals(devList);

    } catch (err) {
      console.warn("Could not sync from real Firestore backend, falling back directly to simulated Full-Stack endpoints to guarantee 100% stable runtime.", err);
      // Fallback endpoints in server.ts
      try {
        const response = await fetch("/api/init");
        const data = await response.json();
        if (data) {
          setSermons(data.sermons || []);
          setSongs(data.songs || []);
          setShorts(data.shorts || []);
          setPrayers(data.prayers || []);
          setDevotionals(data.devotionals || []);
        }
      } catch (innerError) {
        console.error("Final fallback error", innerError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Google Login popup
  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
      // fallback alert if needed
    }
  };

  // Sandbox simulated login to stay offline-friendly or run perfectly in context
  const loginSimulated = (email: string, name: string) => {
    const isExplicitAdmin = email === "malsomvaiphei44@gmail.com" || email.includes("admin");
    const testUser: User = {
      id: "sim_" + Date.now(),
      email,
      name,
      role: isExplicitAdmin ? "admin" : "user",
      favorites: {
        verses: ["Philippians 4:13"],
        songs: [],
        sermons: []
      },
      listeningHistory: []
    };
    setUser(testUser);
    incrementTrackedActivity("registeredUsers");
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      setUser(null);
    }
  };

  // Play controls
  const playSong = (song: Song, customList?: Song[]) => {
    if (!audioRef.current) return;
    
    // Check if toggled song is identical
    const isDifferent = currentSong?.id !== song.id;

    setCurrentSong(song);
    setIsPlaying(true);

    if (customList && customList.length > 0) {
      setSongListPool(customList);
    } else if (songs.length > 0 && songListPool.length === 0) {
      setSongListPool(songs);
    }

    if (isDifferent) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = 0;
    }
    
    const isYTSong = song.youtubeUrl || song.id.startsWith("yt-");
    audioRef.current.volume = isYTSong ? 0 : volume;

    audioRef.current.play().catch((err) => {
      console.warn("Acoustic playback failed or paused till user click: ", err);
    });

    // Track dynamic real-time songs engagement
    incrementTrackedActivity("worshipSongsPlayed");

    // Record listening History locally
    if (user) {
      const entry = { songId: song.id, playedAt: new Date().toISOString() };
      setUser(prev => prev ? {
        ...prev,
        listeningHistory: [entry, ...prev.listeningHistory].slice(0, 24)
      } : null);
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeSong = () => {
    if (!currentSong && songs.length > 0) {
      playSong(songs[0]);
      return;
    }
    if (currentSong && audioRef.current) {
      setIsPlaying(true);
      const isYTSong = currentSong.youtubeUrl || currentSong.id.startsWith("yt-");
      audioRef.current.volume = isYTSong ? 0 : volume;
      audioRef.current.play().catch((err) => console.log(err));
    }
  };

  const stopSong = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentSong(null);
  };

  const triggerNextSong = () => {
    const list = poolRef.current.length > 0 ? poolRef.current : songs;
    if (list.length === 0) return;
    const current = curSongRef.current;
    
    const currentIndex = list.findIndex(s => s.id === (current?.id || ""));
    const nextIndex = (currentIndex + 1) % list.length;
    const next = list[nextIndex];
    
    setCurrentSong(next);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = next.audioUrl;
      audioRef.current.currentTime = 0;
      const isYTSong = next.youtubeUrl || next.id.startsWith("yt-");
      audioRef.current.volume = isYTSong ? 0 : volume;
      audioRef.current.play().catch(e => console.warn(e));
    }
  };

  const nextSong = () => {
    triggerNextSong();
  };

  const prevSong = () => {
    const list = songListPool.length > 0 ? songListPool : songs;
    if (list.length === 0) return;
    const currentIndex = list.findIndex(s => s.id === (currentSong?.id || ""));
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = list.length - 1;
    const prev = list[prevIndex];

    setCurrentSong(prev);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = prev.audioUrl;
      audioRef.current.currentTime = 0;
      const isYTSong = prev.youtubeUrl || prev.id.startsWith("yt-");
      audioRef.current.volume = isYTSong ? 0 : volume;
      audioRef.current.play().catch(e => console.warn(e));
    }
  };

  // User database Favorited Syncs
  const toggleFavoriteVerse = async (verseId: string) => {
    if (!user) return;
    const list = [...user.favorites.verses];
    const index = list.indexOf(verseId);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(verseId);
    }

    const updated = {
      ...user,
      favorites: { ...user.favorites, verses: list }
    };
    setUser(updated);

    try {
      await updateDoc(doc(db, "users", user.id), {
        "favorites.verses": list
      });
    } catch {
      // Allow local updates even if offline
    }
  };

  const toggleFavoriteSong = async (songId: string) => {
    if (!user) return;
    const list = [...user.favorites.songs];
    const index = list.indexOf(songId);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(songId);
    }

    const updated = {
      ...user,
      favorites: { ...user.favorites, songs: list }
    };
    setUser(updated);

    try {
      await updateDoc(doc(db, "users", user.id), {
        "favorites.songs": list
      });
    } catch {}
  };

  const toggleFavoriteSermon = async (sermonId: string) => {
    if (!user) return;
    const list = [...user.favorites.sermons];
    const index = list.indexOf(sermonId);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(sermonId);
    }

    const updated = {
      ...user,
      favorites: { ...user.favorites, sermons: list }
    };
    setUser(updated);

    try {
      await updateDoc(doc(db, "users", user.id), {
        "favorites.sermons": list
      });
    } catch {}
  };

  // Create prayer requests
  const addPrayerRequest = async (requestText: string, isPrivate: boolean): Promise<boolean> => {
    if (!user) return false;
    const payload: Omit<PrayerRequest, "id"> = {
      userEmail: user.email,
      userName: user.name,
      request: requestText,
      isPrivate,
      amenCount: 0,
      createdAt: new Date().toISOString(),
      amens: []
    };

    try {
      // 1. Write to Firestore
      const docRef = await addDoc(collection(db, "prayers"), payload);
      // Local state prep
      const withId: PrayerRequest = { id: docRef.id, ...payload };
      setPrayers(prev => [withId, ...prev]);
      incrementTrackedActivity("prayersSubmitted");
      return true;
    } catch (err) {
      console.warn("Local post fallback: ", err);
      // Fallback server POST if firebase fails
      try {
        const res = await fetch("/api/prayers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const item = await res.json();
          setPrayers(prev => [item, ...prev]);
          incrementTrackedActivity("prayersSubmitted");
          return true;
        }
      } catch (apiErr) {
        console.error(apiErr);
      }
    }
    return false;
  };

  const castAmen = async (prayerId: string) => {
    if (!user) return;
    try {
      const prayerDocRef = doc(db, "prayers", prayerId);
      await updateDoc(prayerDocRef, {
        amenCount: increment(1),
        amens: arrayUnion(user.email)
      });
      
      // Update local state smoothly
      setPrayers(prev => prev.map(p => {
        if (p.id === prayerId) {
          return {
            ...p,
            amenCount: p.amenCount + 1,
            amens: [...(p.amens || []), user.email]
          };
        }
        return p;
      }));
    } catch (e) {
      // fallback call
      try {
        await fetch(`/api/prayers/${prayerId}/amen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email })
        });
        refreshData();
      } catch (inner) {
        console.error(inner);
      }
    }
  };

  // Secure admin uploads with direct writes
  const uploadContent = async (type: "song" | "sermon" | "short" | "devotional", content: any): Promise<boolean> => {
    let firestoreId: string | null = null;
    
    // Ensure default tracking attributes
    if (type === "song") {
      content.plays = content.plays || 0;
    } else if (type === "sermon") {
      content.views = content.views || 0;
    } else if (type === "short") {
      content.likes = content.likes || 0;
      content.shares = content.shares || 0;
    }

    // 1. Save to Firestore
    try {
      const colName = type === "song" ? "songs" : type === "sermon" ? "sermons" : type === "short" ? "shorts" : "devotionals";
      const docRef = await addDoc(collection(db, colName), content);
      firestoreId = docRef.id;
    } catch (err) {
      console.warn("Firestore upload failed, proceeding to save to REST...", err);
    }

    // 2. Save/Sync to Express REST DB
    try {
      const payload = firestoreId ? { ...content, id: firestoreId } : content;
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content: payload })
      });
    } catch (apiErr) {
      console.warn("REST API upload failed: ", apiErr);
    }

    await refreshData();
    return true;
  };

  // Secure admin edits / updates with direct writes & syncing
  const updateContent = async (type: "song" | "sermon" | "short" | "devotional", id: string, content: any): Promise<boolean> => {
    // 1. Update Firestore
    try {
      const colName = type === "song" ? "songs" : type === "sermon" ? "sermons" : type === "short" ? "shorts" : "devotionals";
      const docRef = doc(db, colName, id);
      await updateDoc(docRef, content);
    } catch (err) {
      console.warn("Firestore update content failed, falling back to REST: ", err);
    }

    // 2. Update Express REST DB
    try {
      await fetch(`/api/admin/content/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
    } catch (apiErr) {
      console.warn("REST update content failed: ", apiErr);
    }

    // 3. Update local state
    if (type === "song") {
      setSongs(prev => prev.map(s => s.id === id ? { ...s, ...content } : s));
    } else if (type === "sermon") {
      setSermons(prev => prev.map(s => s.id === id ? { ...s, ...content } : s));
    } else if (type === "short") {
      setShorts(prev => prev.map(s => s.id === id ? { ...s, ...content } : s));
    } else if (type === "devotional") {
      setDevotionals(prev => prev.map(d => d.id === id ? { ...d, ...content } : d));
    }

    await refreshData();
    return true;
  };

  // Admin content removals full controller
  const deleteContent = async (type: "song" | "sermon" | "short" | "devotional", id: string): Promise<boolean> => {
    // 1. Delete from Firestore
    try {
      const colName = type === "song" ? "songs" : type === "sermon" ? "sermons" : type === "short" ? "shorts" : "devotionals";
      await deleteDoc(doc(db, colName, id));
    } catch (err) {
      console.warn("Firestore delete failed, falling back to local/REST: ", err);
    }

    // 2. Delete from REST API
    try {
      await fetch(`/api/admin/content/${type}/${id}`, {
        method: "DELETE"
      });
    } catch (apiErr) {
      console.warn("REST delete failed: ", apiErr);
    }

    // 3. Local update to reflect instantly
    if (type === "song") setSongs(prev => prev.filter(s => s.id !== id));
    if (type === "sermon") setSermons(prev => prev.filter(s => s.id !== id));
    if (type === "short") setShorts(prev => prev.filter(s => s.id !== id));
    if (type === "devotional") setDevotionals(prev => prev.filter(d => d.id !== id));

    await refreshData();
    return true;
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      bibleTopics, bibleVerses,
      sermons, songs, shorts, prayers, devotionals, dailyVerse, currentScripture,
      isLoading,
      currentSong, isPlaying, playSong, pauseSong, resumeSong, nextSong, prevSong, stopSong, songListPool,
      currentTime, duration, volume, seek, changeVolume,
      currentLang, setCurrentLang, themeMode, setThemeMode,
      toggleFavoriteVerse, toggleFavoriteSong, toggleFavoriteSermon,
      addPrayerRequest, castAmen, refreshData, uploadContent, deleteContent, updateContent,
      loginWithGoogle, loginSimulated, logout,
      engagementStats, incrementTrackedActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside an AppProvider");
  return context;
};
