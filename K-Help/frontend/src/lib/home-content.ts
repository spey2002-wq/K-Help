import { CATEGORY_OPTIONS } from "@/lib/job-options";

export interface TopicTone {
  /** Soft background for icon tiles and panels. */
  soft: string;
  /** Strong text color for headings and links. */
  text: string;
  /** Border color for panels. */
  border: string;
  /** Solid dot / bar color. */
  solid: string;
  /** Pill used for "main topic" links. */
  pill: string;
}

export interface MainTopic {
  label: string;
  description?: string;
  /** Deep link that preselects this topic on the module page. */
  href: string;
  icon?: string;
}

export interface Topic {
  id: string;
  href: string;
  icon: string;
  title: string;
  eyebrow: string;
  summary: string;
  highlights: string[];
  topicsTitle: string;
  topics: MainTopic[];
  cta: string;
  tone: TopicTone;
}

export const GUIDE_TOPICS: MainTopic[] = [
  {
    label: "Visa & Immigration",
    description: "ARC, visa extensions, status changes and reporting rules.",
    href: "/info?category=VISA_IMMIGRATION",
    icon: "🛂",
  },
  {
    label: "Visa by Country",
    description: "Visa types, documents and steps for your nationality.",
    href: "/info?category=VISA_BY_COUNTRY",
    icon: "🌏",
  },
  {
    label: "Healthcare",
    description: "National health insurance, clinics, pharmacies and hospital visits.",
    href: "/info?category=HEALTHCARE",
    icon: "🏥",
  },
  {
    label: "Banking",
    description: "Opening accounts, banking apps and links to each bank's official page.",
    href: "/info?category=BANKING",
    icon: "🏦",
  },
  {
    label: "Housing",
    description: "Deposits, monthly rent, contracts and tenant rights.",
    href: "/info?category=HOUSING",
    icon: "🏠",
  },
  {
    label: "Employment",
    description: "Work permissions, contracts, minimum wage and worker rights.",
    href: "/info?category=EMPLOYMENT",
    icon: "💼",
  },
  {
    label: "Education",
    description: "Language courses, university life and study support.",
    href: "/info?category=EDUCATION",
    icon: "🎓",
  },
  {
    label: "Emergency",
    description: "Emergency numbers, hotlines and what to do in a crisis.",
    href: "/info?category=EMERGENCY",
    icon: "🚨",
  },
  {
    label: "Transportation",
    description: "Transit cards, subway and bus tips, and getting around.",
    href: "/info?category=TRANSPORTATION",
    icon: "🚇",
  },
  {
    label: "Daily Life",
    description: "Phones, delivery, shopping and everyday know-how.",
    href: "/info?category=DAILY_LIFE",
    icon: "🛒",
  },
];

export const COMMUNITY_TOPICS: MainTopic[] = [
  { label: "General", href: "/community?category=GENERAL", icon: "💬" },
  { label: "Visa & Immigration", href: "/community?category=VISA_IMMIGRATION", icon: "🛂" },
  { label: "Jobs", href: "/community?category=JOBS", icon: "💼" },
  { label: "Housing", href: "/community?category=HOUSING", icon: "🏠" },
  { label: "Healthcare", href: "/community?category=HEALTHCARE", icon: "🏥" },
  { label: "Banking", href: "/community?category=BANKING", icon: "🏦" },
  { label: "Education", href: "/community?category=EDUCATION", icon: "🎓" },
  { label: "Language Exchange", href: "/community?category=LANGUAGE_EXCHANGE", icon: "🗣️" },
  { label: "Marketplace", href: "/community?category=MARKETPLACE", icon: "🛍️" },
  { label: "Emergency", href: "/community?category=EMERGENCY", icon: "🚨" },
];

const JOB_TOPIC_ICONS: Record<string, string> = {
  RESTAURANT: "🍜",
  CAFE: "☕",
  CONVENIENCE_STORE: "🏪",
  RETAIL: "🛍️",
  DELIVERY_DRIVING: "🛵",
  EDUCATION: "📚",
  OFFICE_ADMIN: "🗂️",
  IT_DESIGN: "💻",
  WAREHOUSE_FACTORY: "🏭",
  CONSTRUCTION: "🏗️",
  BEAUTY_FITNESS: "💪",
  CLEANING: "🧹",
  HOTEL_TOURISM: "🏨",
  HEALTHCARE: "🩺",
  TRANSLATION: "🌐",
  EVENT_PROMOTION: "🎉",
  OTHER: "✨",
};

/** Built from the real job category filter so the home page never drifts from the Jobs page. */
export const JOB_TOPICS: MainTopic[] = CATEGORY_OPTIONS.filter(
  (option) => option.value !== "OTHER",
).map((option) => ({
  label: option.label,
  href: `/jobs?category=${option.value}`,
  icon: JOB_TOPIC_ICONS[option.value],
}));

export const HOUSING_TOPICS: MainTopic[] = [
  { label: "One-room", href: "/housing?type=ONE_ROOM", icon: "🛏️" },
  { label: "Studio", href: "/housing?type=STUDIO", icon: "🪟" },
  { label: "Officetel", href: "/housing?type=OFFICETEL", icon: "🏙️" },
  { label: "Share house", href: "/housing?type=SHARE_HOUSE", icon: "🧑‍🤝‍🧑" },
  { label: "Dormitory", href: "/housing?type=DORMITORY", icon: "🎒" },
  { label: "Apartment", href: "/housing?type=APARTMENT", icon: "🏢" },
  { label: "Villa", href: "/housing?type=VILLA", icon: "🏡" },
  { label: "Two-room", href: "/housing?type=TWO_ROOM", icon: "🚪" },
  { label: "Jeonse (deposit lease)", href: "/housing?type=JEONSE", icon: "🔑" },
  { label: "Wolse (monthly rent)", href: "/housing?type=WOLSE", icon: "📅" },
];

export const CHAT_TOPICS: MainTopic[] = [
  { label: "Instant messages", href: "/chat", icon: "⚡" },
  { label: "Read receipts", href: "/chat", icon: "✅" },
  { label: "Saved history", href: "/chat", icon: "🗂️" },
  { label: "One inbox", href: "/chat", icon: "📥" },
];

export const AI_TOPICS: MainTopic[] = [
  {
    label: "Translate",
    description: "Turn Korean text into your language, or your message into Korean.",
    href: "/ai",
    icon: "🔤",
  },
  {
    label: "Summarize",
    description: "Paste a long official notice and get the key points and deadlines.",
    href: "/ai",
    icon: "📝",
  },
  {
    label: "Polite message",
    description: "Write respectful Korean for landlords, employers and offices.",
    href: "/ai",
    icon: "🙇",
  },
];

export const AI_LANGUAGES = [
  "English",
  "Korean",
  "Nepali",
  "Vietnamese",
  "Chinese",
  "Japanese",
  "Thai",
  "Uzbek",
] as const;

/** One calm palette for every topic; the interface stays quiet and the content leads. */
const TONE: TopicTone = {
  soft: "bg-brand-50",
  text: "text-brand-700",
  border: "border-brand-100",
  solid: "bg-brand-600",
  pill: "bg-brand-50 text-brand-800 hover:bg-brand-100",
};
export const TOPICS: Topic[] = [
  {
    id: "info",
    href: "/info",
    icon: "📘",
    title: "Living Guides",
    eyebrow: "Learn the basics",
    summary:
      "Practical, curated guides for the paperwork and decisions newcomers face, from your first ARC to opening a bank account. Search them, or jump straight to a topic.",
    highlights: [
      "Step-by-step guides written for newcomers, not for lawyers",
      "Visa by Country: documents and steps for your nationality",
      "Bank directory with a link to each bank's official page",
      "Search across every guide by keyword (ARC, insurance, deposit...)",
    ],
    topicsTitle: "Main topics",
    topics: GUIDE_TOPICS,
    cta: "Browse all guides",
    tone: TONE,
  },
  {
    id: "jobs",
    href: "/jobs",
    icon: "💼",
    title: "Jobs",
    eyebrow: "Find work",
    summary:
      "Foreigner-friendly listings with the filters that actually matter when you have a visa to respect: hours per week, days you can work, language level and pay.",
    highlights: [
      "Filter by category, city, work days, shift, pay type and experience",
      "Weekly-hours limit filter to stay within your visa's work rules",
      "Visa sponsorship, Korean-level and perks filters",
      "Sort by newest or pay, apply from the listing and track your applications",
    ],
    topicsTitle: "Job categories",
    topics: JOB_TOPICS,
    cta: "Search jobs",
    tone: TONE,
  },
  {
    id: "housing",
    href: "/housing",
    icon: "🏠",
    title: "Housing",
    eyebrow: "Find a home",
    summary:
      "Compare rooms side by side by deposit, monthly rent and location, and understand Korea's deposit system before you sign anything.",
    highlights: [
      "Compare deposit, monthly rent and maintenance fee at a glance",
      "Filter by property type, city, budget, furnished and pet-friendly",
      "Share houses and dormitories for short or budget stays",
      "Detailed listing pages with rent, fees, location and house rules",
    ],
    topicsTitle: "Property types",
    topics: HOUSING_TOPICS,
    cta: "Find housing",
    tone: TONE,
  },
  {
    id: "community",
    href: "/community",
    icon: "💬",
    title: "Community",
    eyebrow: "Ask and share",
    summary:
      "Real questions and real answers from other foreign residents. Post your own question, comment, like helpful replies, and learn from people a few steps ahead of you.",
    highlights: [
      "Posts organized into topic categories so answers are easy to find",
      "Comments and likes to surface the most helpful replies",
      "Language exchange and marketplace boards, not just Q&A",
      "Report button and moderators keep discussions safe",
    ],
    topicsTitle: "Discussion categories",
    topics: COMMUNITY_TOPICS,
    cta: "Join the discussion",
    tone: TONE,
  },
  {
    id: "chat",
    href: "/chat",
    icon: "⚡",
    title: "Real-time Chat",
    eyebrow: "Talk directly",
    summary:
      "Skip the middleman. Message other residents, employers and landlords in real time, and keep every conversation in one place.",
    highlights: [
      "Instant messages over a live connection, no refreshing",
      "Read receipts so you know your message was seen",
      "Full conversation history saved for later",
      "One inbox for all your conversations",
    ],
    topicsTitle: "What you can do",
    topics: CHAT_TOPICS,
    cta: "Open chat",
    tone: TONE,
  },
  {
    id: "ai",
    href: "/ai",
    icon: "🤖",
    title: "AI Assistant",
    eyebrow: "Beat the language barrier",
    summary:
      "Understand Korean notices, contracts and messages without a dictionary, and write back politely in Korean when it matters.",
    highlights: [
      "Translate between English, Korean and six more languages",
      "Summarize long official notices into the key points",
      "Draft polite Korean messages for landlords and employers",
      "Always double-check legal or financial details with an official source",
    ],
    topicsTitle: "Three tools",
    topics: AI_TOPICS,
    cta: "Try the assistant",
    tone: TONE,
  },
];

export interface QuickGoal {
  label: string;
  hint: string;
  href: string;
  icon: string;
}

export const QUICK_GOALS: QuickGoal[] = [
  { icon: "🛂", label: "Understand my visa", hint: "ARC, extensions, status changes", href: "/info?category=VISA_IMMIGRATION" },
  { icon: "🏦", label: "Open a bank account", hint: "Documents and official bank pages", href: "/info?category=BANKING" },
  { icon: "💼", label: "Find a part-time job", hint: "Filter by hours, days and pay", href: "/jobs" },
  { icon: "🏠", label: "Find a room", hint: "Compare deposit and rent", href: "/housing" },
  { icon: "🏥", label: "See a doctor", hint: "Insurance, clinics, pharmacies", href: "/info?category=HEALTHCARE" },
  { icon: "🔤", label: "Translate a Korean notice", hint: "Translate or summarize instantly", href: "/ai" },
  { icon: "🚨", label: "Get emergency help", hint: "Numbers and what to do", href: "/info?category=EMERGENCY" },
  { icon: "🗣️", label: "Ask other residents", hint: "Community answers", href: "/community" },
];

export interface Audience {
  icon: string;
  title: string;
  description: string;
}

export const AUDIENCES: Audience[] = [
  {
    icon: "🎓",
    title: "International students",
    description:
      "Find part-time jobs that fit your weekly work-hour limit, a place near campus, and guides for ARC and insurance.",
  },
  {
    icon: "🛠️",
    title: "Workers",
    description:
      "Understand contracts, minimum wage and your rights, then find employers who welcome foreign staff.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Families and long-term residents",
    description:
      "Healthcare, banking, schooling and housing information in one place, plus a community of people in the same situation.",
  },
  {
    icon: "✈️",
    title: "Newcomers",
    description:
      "Landing soon? Read the Visa by Country guides and set up your life before you arrive.",
  },
];

export interface Step {
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    title: "Create a free account",
    description: "Sign up with your nationality and visa type so the site knows your situation.",
  },
  {
    title: "Learn the basics",
    description: "Read the living guides for your visa, bank, health insurance and housing.",
  },
  {
    title: "Find work and a home",
    description: "Use detailed filters to shortlist jobs and rooms that fit your rules and budget.",
  },
  {
    title: "Connect and get help",
    description: "Chat with posters, ask the community and let the AI assistant handle Korean.",
  },
];

export const ALSO_INCLUDED: { icon: string; title: string; description: string }[] = [
  {
    icon: "🪪",
    title: "Your profile",
    description: "Photo, skills and work experience that employers can see.",
  },
  {
    icon: "📋",
    title: "Applications",
    description: "Track every job you applied to in one list.",
  },
  {
    icon: "🛡️",
    title: "Moderation",
    description: "Reports and admin review keep listings and posts trustworthy.",
  },
  {
    icon: "📱",
    title: "Works on your phone",
    description: "Every page is designed to be comfortable on a small screen.",
  },
];

export const GUIDE_TOPIC_COUNT = GUIDE_TOPICS.length;
export const JOB_CATEGORY_COUNT = CATEGORY_OPTIONS.length - 1; // "Other" is not counted
