export type Language = "EN" | "HI" | "Nagamese";

export interface TranslationSet {
  welcomeTitle: string;
  welcomeSubtitle: string;
  verseOfTheDaySection: string;
  bookmarkPromise: string;
  shareTitle: string;
  whatappShareTip: string;
  dailyDevotionalSection: string;
  talkWithAi: string;
  streamPlaylist: string;
  shortsSection: string;
  sermonsSection: string;
  prayersSection: string;
  postPrayerButton: string;
  prayerInputPlaceholder: string;
  privateCheckbox: string;
  amenCountBadge: string;
  amenCastButton: string;
  aboutTitle: string;
  navHome: string;
  navMusic: string;
  navSermons: string;
  navShorts: string;
  navPrayers: string;
  navDevotionals: string;
  navAssistant: string;
  adminConsole: string;
  searchPlaceholder: string;
  pastorPreacher: string;
  allCategories: string;
  categoryWorship: string;
  categorySermons: string;
  categoryYouth: string;
  categoryPrayer: string;
  categoryGospel: string;
  categoryShorts: string;
  featuredBadge: string;
  historyTitle: string;
  profileTitle: string;
  roleAdmin: string;
  roleUser: string;
  signOutButton: string;
  noContentYet: string;
  pinFeatured: string;
  unpinFeatured: string;
  deleteContent: string;
  addContentSuccess: string;
  musicSearchLabel: string;
  sermonDuration: string;
  sermonViews: string;
  devotionalReading: string;
  devotionalReflection: string;
  devotionalAuthor: string;
  devotionalPrayer: string;
}

export const translations: Record<Language, TranslationSet> = {
  EN: {
    welcomeTitle: "Welcome to LivingBreadHub",
    welcomeSubtitle: "A Daily Place of Worship, Hope, and God’s Word.",
    verseOfTheDaySection: "Verse of the Day",
    bookmarkPromise: "Bookmark Promise",
    shareTitle: "Share Scripture",
    whatappShareTip: "Shared via WhatsApp",
    dailyDevotionalSection: "Today's Devotional",
    talkWithAi: "Reflect with AI Pastor",
    streamPlaylist: "Worship Playlist",
    shortsSection: "Inspire Shorts & Reels",
    sermonsSection: "Sunday Video Sermons",
    prayersSection: "Community Prayer Petitions",
    postPrayerButton: "Submit Prayer Petitions",
    prayerInputPlaceholder: "Share your prayer request here with the community...",
    privateCheckbox: "Make this private (only visible to pasture/admin)",
    amenCountBadge: "Amens Cast",
    amenCastButton: "Cast Amen",
    aboutTitle: "About LivingBreadHub",
    navHome: "Home",
    navMusic: "Worship Player",
    navSermons: "Sermon Streams",
    navShorts: "Reels",
    navPrayers: "Prayers Hub",
    navDevotionals: "Daily Bread",
    navAssistant: "Worship Assistant",
    adminConsole: "Admin Hub Console",
    searchPlaceholder: "Search bible topics, pastor sermons, hymns...",
    pastorPreacher: "Preaching Pastor",
    allCategories: "All Categories",
    categoryWorship: "Worship",
    categorySermons: "Sermons",
    categoryYouth: "Youth",
    categoryPrayer: "Prayer",
    categoryGospel: "Gospel Music",
    categoryShorts: "Shorts",
    featuredBadge: "Featured",
    historyTitle: "Worship Play History",
    profileTitle: "My Sanctuary Profile",
    roleAdmin: "Fellowship Leader (Admin)",
    roleUser: "Fellowship Believer (Worshiper)",
    signOutButton: "Sign Out of Sanctuary",
    noContentYet: "No dynamic logs matching your filters yet. Add as Admin!",
    pinFeatured: "Pin Featured",
    unpinFeatured: "Unpin Content",
    deleteContent: "Exterminate Content",
    addContentSuccess: "Content successfully uploaded to the cloud database",
    musicSearchLabel: "Live search worship tracks...",
    sermonDuration: "Duration",
    sermonViews: "views",
    devotionalReading: "Scripture Readings",
    devotionalReflection: "Daily Reflection Pointer",
    devotionalAuthor: "Devotional Scholar",
    devotionalPrayer: "Devotional Prayer",
  },
  HI: {
    welcomeTitle: "लिविंगब्रेडहब में आपका स्वागत है",
    welcomeSubtitle: "आराधना, आशा और परमेश्वर के वचन का एक दैनिक स्थान।",
    verseOfTheDaySection: "आज का वचन",
    bookmarkPromise: "वचन बुकमार्क करें",
    shareTitle: "वचन साझा करें",
    whatappShareTip: "WhatsApp द्वारा साझा किया गया",
    dailyDevotionalSection: "आज का दैनिक संदेश",
    talkWithAi: "AI पादरी के साथ मन्थन्न करें",
    streamPlaylist: "आराधना प्लेलिस्ट",
    shortsSection: "यूथ लघु वीडियो (Shorts)",
    sermonsSection: "रविवार के वीडियो उपदेश",
    prayersSection: "सामुदायिक प्रार्थना याचिकाएं",
    postPrayerButton: "प्रार्थना प्रस्तुत करें",
    prayerInputPlaceholder: "विश्वास के साथ अपनी प्रार्थना यहाँ लिखें...",
    privateCheckbox: "इसे निजी रखें (केवल एडमिन को दिखेगा)",
    amenCountBadge: "आमीन प्रार्थनाएं",
    amenCastButton: "आमीन कहें (Amen)",
    aboutTitle: "लिविंगब्रेडहब के बारे में",
    navHome: "होम",
    navMusic: "भजन प्लेयर",
    navSermons: "उपदेश स्ट्रीम",
    navShorts: "रील्स (Reels)",
    navPrayers: "प्रार्थना केंद्र",
    navDevotionals: "दैनिक मन्ना",
    navAssistant: "वचन प्रवक्ता AI",
    adminConsole: "कंसोल एडमिन पैनल",
    searchPlaceholder: "विषय, उपदेश या भजनों को खोजें...",
    pastorPreacher: "प्रचारक मार्गदर्शक",
    allCategories: "सभी विषय",
    categoryWorship: "आराधना",
    categorySermons: "उपदेश",
    categoryYouth: "युवा वर्ग",
    categoryPrayer: "प्रार्थना",
    categoryGospel: "सुसमाचार संगीत",
    categoryShorts: "लघु रील्स",
    featuredBadge: "मुख्य",
    historyTitle: "आराधना सुनने का इतिहास",
    profileTitle: "मेरा प्रोफाइल",
    roleAdmin: "फैलोशिप लीडर (एडमिन)",
    roleUser: "फैलोशिप विश्वासी",
    signOutButton: "साइन आउट करें",
    noContentYet: "इस केटेगरी में कोई रिकॉर्ड नहीं है। एडमिन द्वारा जोड़ें!",
    pinFeatured: "मुख्य पेज पर पिन करें",
    unpinFeatured: "पिन से हटाए",
    deleteContent: "सामग्री हटाएं",
    addContentSuccess: "सामग्री क्लाउड डेटाबेस में सफलतापूर्वक अपलोड की गई",
    musicSearchLabel: "भजन एवं गीत खोजें...",
    sermonDuration: "समय",
    sermonViews: "देखा गया",
    devotionalReading: "पवित्र शास्त्र पाठ",
    devotionalReflection: "दैनिक ध्यान विचार",
    devotionalAuthor: "लेखक",
    devotionalPrayer: "आज की प्रार्थना",
  },
  Nagamese: {
    welcomeTitle: "LivingBreadHub te Swagat ase",
    welcomeSubtitle: "Aradhana, Bhorosa aru Jisu r Kotha r roz thakibo jaka.",
    verseOfTheDaySection: "Din laga Kotha",
    bookmarkPromise: "Kotha save kuribi",
    shareTitle: "Kotha share kuribi",
    whatappShareTip: "WhatsApp te share kurise",
    dailyDevotionalSection: "Din laga Chinta",
    talkWithAi: "AI Pastor logote kotha kuribi",
    streamPlaylist: "Aradhana Gaan",
    shortsSection: "Shorts aru Reels",
    sermonsSection: "Sunday Video sermons",
    prayersSection: "Prarthana Hub",
    postPrayerButton: "Prarthana joma kuribi",
    prayerInputPlaceholder: "Apuni laga prarthana request likhibi...",
    privateCheckbox: "Private rakhibi (Kewal Fellowship leader sabo)",
    amenCountBadge: "Amens matise",
    amenCastButton: "Amen kuribi",
    aboutTitle: "LivingBreadHub details",
    navHome: "Ghor",
    navMusic: "Acooustics Gaan",
    navSermons: "Preaching streams",
    navShorts: "Reels video",
    navPrayers: "Prarthana bosti",
    navDevotionals: "Dailly Manna",
    navAssistant: "Manna Assistant AI",
    adminConsole: "Admin Hub Console",
    searchPlaceholder: "Bible topic, pastor preaches, hymns sabybi...",
    pastorPreacher: "Preaching Pastor",
    allCategories: "Sob category",
    categoryWorship: "Worship",
    categorySermons: "Sermon",
    categoryYouth: "Youth logote",
    categoryPrayer: "Prarthana",
    categoryGospel: "Gospel Music",
    categoryShorts: "Shorts video",
    featuredBadge: "Pined",
    historyTitle: "Gaan suna history",
    profileTitle: "Prarthana pitha profile",
    roleAdmin: "Fellowship Leader (Admin)",
    roleUser: "Fellowship Believer (Worshiper)",
    signOutButton: "Sign Out",
    noContentYet: "Etu space te gaan-video khali ase. Admin create kuribi!",
    pinFeatured: "Featured pin kuribi",
    unpinFeatured: "Unpin kuribi",
    deleteContent: "Khatam kuribi",
    addContentSuccess: "Database te dynamic upload hoise",
    musicSearchLabel: "Worship gaan bisi sabo...",
    sermonDuration: "Wakt",
    sermonViews: "views",
    devotionalReading: "Bible porhibo script",
    devotionalReflection: "Din laga chinta dhyan",
    devotionalAuthor: "Pundit bhabna",
    devotionalPrayer: "Din laga prarthana",
  }
};
