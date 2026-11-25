export type LocaleCode =
  | "en"
  | "ko"
  | "zh"
  | "ja"
  | "vi"
  | "ne"
  | "bn"
  | "id"
  | "th"
  | "ru";

export type MessageKey =
  | "nav.community"
  | "nav.guides"
  | "nav.jobs"
  | "nav.housing"
  | "nav.chat"
  | "nav.ai"
  | "nav.admin"
  | "nav.inbox"
  | "nav.home"
  | "nav.more"
  | "nav.signIn"
  | "nav.signOut"
  | "nav.getStarted"
  | "nav.createAccount"
  | "nav.myProfile"
  | "nav.applications"
  | "nav.language"
  | "more.communityHint"
  | "more.chatHint"
  | "more.aiHint"
  | "more.profileHint"
  | "more.inboxHint"
  | "more.applicationsHint"
  | "more.adminHint"
  | "footer.tagline"
  | "footer.team";

export type LocaleOption = {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  flag: string;
};

export const LOCALES: LocaleOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ne", label: "Nepali", nativeLabel: "नेपाली", flag: "🇳🇵" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇧🇩" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th", label: "Thai", nativeLabel: "ไทย", flag: "🇹🇭" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";
export const LOCALE_STORAGE_KEY = "khelp-locale";

const EN: Record<MessageKey, string> = {
  "nav.community": "Community",
  "nav.guides": "Guides",
  "nav.jobs": "Jobs",
  "nav.housing": "Housing",
  "nav.chat": "Chat",
  "nav.ai": "AI Assistant",
  "nav.admin": "Admin",
  "nav.inbox": "Inbox",
  "nav.home": "Home",
  "nav.more": "More",
  "nav.signIn": "Sign in",
  "nav.signOut": "Sign out",
  "nav.getStarted": "Get started",
  "nav.createAccount": "Create account",
  "nav.myProfile": "My profile",
  "nav.applications": "Applications",
  "nav.language": "Language",
  "more.communityHint": "Ask and share",
  "more.chatHint": "Your messages",
  "more.aiHint": "Translate Korean",
  "more.profileHint": "Photo and skills",
  "more.inboxHint": "Inquiries on your posts",
  "more.applicationsHint": "Jobs you applied to",
  "more.adminHint": "Moderation",
  "footer.tagline": "K-Help · Korea Life Platform for Foreign Residents",
  "footer.team": "NP Coders · Capstone Project",
};

const KO: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "커뮤니티",
  "nav.guides": "가이드",
  "nav.jobs": "취업",
  "nav.housing": "주거",
  "nav.chat": "채팅",
  "nav.ai": "AI 도우미",
  "nav.admin": "관리자",
  "nav.inbox": "받은편지함",
  "nav.home": "홈",
  "nav.more": "더보기",
  "nav.signIn": "로그인",
  "nav.signOut": "로그아웃",
  "nav.getStarted": "시작하기",
  "nav.createAccount": "회원가입",
  "nav.myProfile": "내 프로필",
  "nav.applications": "지원 내역",
  "nav.language": "언어",
  "more.communityHint": "질문하고 공유하기",
  "more.chatHint": "내 메시지",
  "more.aiHint": "한국어 번역",
  "more.profileHint": "사진과 스킬",
  "more.inboxHint": "내 게시글 문의",
  "more.applicationsHint": "지원한 채용",
  "more.adminHint": "관리",
  "footer.tagline": "K-Help · 외국인 거주자를 위한 한국 생활 플랫폼",
  "footer.team": "NP Coders · 캡스톤 프로젝트",
};

const ZH: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "社区",
  "nav.guides": "生活指南",
  "nav.jobs": "工作",
  "nav.housing": "住房",
  "nav.chat": "聊天",
  "nav.ai": "AI 助手",
  "nav.admin": "管理",
  "nav.inbox": "收件箱",
  "nav.home": "首页",
  "nav.more": "更多",
  "nav.signIn": "登录",
  "nav.signOut": "退出",
  "nav.getStarted": "开始使用",
  "nav.createAccount": "注册",
  "nav.myProfile": "我的资料",
  "nav.applications": "申请记录",
  "nav.language": "语言",
  "more.communityHint": "提问与分享",
  "more.chatHint": "我的消息",
  "more.aiHint": "翻译韩语",
  "more.profileHint": "照片与技能",
  "more.inboxHint": "帖子相关咨询",
  "more.applicationsHint": "已申请的工作",
  "more.adminHint": "内容管理",
  "footer.tagline": "K-Help · 面向外国居民的韩国生活平台",
  "footer.team": "NP Coders · 毕业设计项目",
};

const JA: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "コミュニティ",
  "nav.guides": "ガイド",
  "nav.jobs": "求人",
  "nav.housing": "住居",
  "nav.chat": "チャット",
  "nav.ai": "AIアシスタント",
  "nav.admin": "管理",
  "nav.inbox": "受信箱",
  "nav.home": "ホーム",
  "nav.more": "もっと",
  "nav.signIn": "ログイン",
  "nav.signOut": "ログアウト",
  "nav.getStarted": "始める",
  "nav.createAccount": "新規登録",
  "nav.myProfile": "マイプロフィール",
  "nav.applications": "応募履歴",
  "nav.language": "言語",
  "more.communityHint": "質問・共有",
  "more.chatHint": "メッセージ",
  "more.aiHint": "韓国語を翻訳",
  "more.profileHint": "写真とスキル",
  "more.inboxHint": "投稿への問い合わせ",
  "more.applicationsHint": "応募した求人",
  "more.adminHint": "モデレーション",
  "footer.tagline": "K-Help · 外国人住民のための韓国生活プラットフォーム",
  "footer.team": "NP Coders · キャップストーン",
};

const VI: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "Cộng đồng",
  "nav.guides": "Hướng dẫn",
  "nav.jobs": "Việc làm",
  "nav.housing": "Nhà ở",
  "nav.chat": "Trò chuyện",
  "nav.ai": "Trợ lý AI",
  "nav.admin": "Quản trị",
  "nav.inbox": "Hộp thư",
  "nav.home": "Trang chủ",
  "nav.more": "Thêm",
  "nav.signIn": "Đăng nhập",
  "nav.signOut": "Đăng xuất",
  "nav.getStarted": "Bắt đầu",
  "nav.createAccount": "Tạo tài khoản",
  "nav.myProfile": "Hồ sơ của tôi",
  "nav.applications": "Đơn ứng tuyển",
  "nav.language": "Ngôn ngữ",
  "more.communityHint": "Hỏi và chia sẻ",
  "more.chatHint": "Tin nhắn của bạn",
  "more.aiHint": "Dịch tiếng Hàn",
  "more.profileHint": "Ảnh và kỹ năng",
  "more.inboxHint": "Yêu cầu trên bài đăng",
  "more.applicationsHint": "Việc bạn đã ứng tuyển",
  "more.adminHint": "Kiểm duyệt",
  "footer.tagline": "K-Help · Nền tảng cuộc sống Hàn Quốc cho người nước ngoài",
  "footer.team": "NP Coders · Đồ án tốt nghiệp",
};

const NE: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "समुदाय",
  "nav.guides": "गाइड",
  "nav.jobs": "रोजगार",
  "nav.housing": "आवास",
  "nav.chat": "च्याट",
  "nav.ai": "AI सहायक",
  "nav.admin": "प्रशासक",
  "nav.inbox": "इनबक्स",
  "nav.home": "होम",
  "nav.more": "थप",
  "nav.signIn": "लग इन",
  "nav.signOut": "लग आउट",
  "nav.getStarted": "सुरु गर्नुहोस्",
  "nav.createAccount": "खाता बनाउनुहोस्",
  "nav.myProfile": "मेरो प्रोफाइल",
  "nav.applications": "आवेदनहरू",
  "nav.language": "भाषा",
  "more.communityHint": "सोध्नुहोस् र साझा गर्नुहोस्",
  "more.chatHint": "तपाईंका सन्देशहरू",
  "more.aiHint": "कोरियन अनुवाद",
  "more.profileHint": "फोटो र सीप",
  "more.inboxHint": "तपाईंका पोस्टका सोधपुछ",
  "more.applicationsHint": "आवेदन दिएका जागिरहरू",
  "more.adminHint": "मध्यस्थता",
  "footer.tagline": "K-Help · विदेशी बासिन्दाका लागि कोरिया जीवन प्लेटफर्म",
  "footer.team": "NP Coders · क्यापस्टोन परियोजना",
};

const BN: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "কমিউনিটি",
  "nav.guides": "গাইড",
  "nav.jobs": "চাকরি",
  "nav.housing": "বাসস্থান",
  "nav.chat": "চ্যাট",
  "nav.ai": "AI সহায়ক",
  "nav.admin": "অ্যাডমিন",
  "nav.inbox": "ইনবক্স",
  "nav.home": "হোম",
  "nav.more": "আরও",
  "nav.signIn": "সাইন ইন",
  "nav.signOut": "সাইন আউট",
  "nav.getStarted": "শুরু করুন",
  "nav.createAccount": "অ্যাকাউন্ট তৈরি",
  "nav.myProfile": "আমার প্রোফাইল",
  "nav.applications": "আবেদনসমূহ",
  "nav.language": "ভাষা",
  "more.communityHint": "জিজ্ঞাসা ও শেয়ার",
  "more.chatHint": "আপনার বার্তা",
  "more.aiHint": "কোরিয়ান অনুবাদ",
  "more.profileHint": "ছবি ও দক্ষতা",
  "more.inboxHint": "পোস্টের অনুসন্ধান",
  "more.applicationsHint": "আবেদন করা চাকরি",
  "more.adminHint": "মডারেশন",
  "footer.tagline": "K-Help · বিদেশি বাসিন্দাদের জন্য কোরিয়া লাইফ প্ল্যাটফর্ম",
  "footer.team": "NP Coders · ক্যাপস্টোন প্রকল্প",
};

const ID: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "Komunitas",
  "nav.guides": "Panduan",
  "nav.jobs": "Pekerjaan",
  "nav.housing": "Hunian",
  "nav.chat": "Obrolan",
  "nav.ai": "Asisten AI",
  "nav.admin": "Admin",
  "nav.inbox": "Kotak masuk",
  "nav.home": "Beranda",
  "nav.more": "Lainnya",
  "nav.signIn": "Masuk",
  "nav.signOut": "Keluar",
  "nav.getStarted": "Mulai",
  "nav.createAccount": "Buat akun",
  "nav.myProfile": "Profil saya",
  "nav.applications": "Lamaran",
  "nav.language": "Bahasa",
  "more.communityHint": "Tanya dan bagikan",
  "more.chatHint": "Pesan Anda",
  "more.aiHint": "Terjemahkan Korea",
  "more.profileHint": "Foto dan keahlian",
  "more.inboxHint": "Pertanyaan di postingan",
  "more.applicationsHint": "Lowongan yang dilamar",
  "more.adminHint": "Moderasi",
  "footer.tagline": "K-Help · Platform kehidupan Korea untuk warga asing",
  "footer.team": "NP Coders · Proyek Capstone",
};

const TH: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "ชุมชน",
  "nav.guides": "คู่มือ",
  "nav.jobs": "งาน",
  "nav.housing": "ที่อยู่อาศัย",
  "nav.chat": "แชท",
  "nav.ai": "ผู้ช่วย AI",
  "nav.admin": "ผู้ดูแล",
  "nav.inbox": "กล่องข้อความ",
  "nav.home": "หน้าแรก",
  "nav.more": "เพิ่มเติม",
  "nav.signIn": "เข้าสู่ระบบ",
  "nav.signOut": "ออกจากระบบ",
  "nav.getStarted": "เริ่มต้น",
  "nav.createAccount": "สร้างบัญชี",
  "nav.myProfile": "โปรไฟล์ของฉัน",
  "nav.applications": "ใบสมัคร",
  "nav.language": "ภาษา",
  "more.communityHint": "ถามและแบ่งปัน",
  "more.chatHint": "ข้อความของคุณ",
  "more.aiHint": "แปลภาษาเกาหลี",
  "more.profileHint": "รูปและทักษะ",
  "more.inboxHint": "ข้อความในโพสต์ของคุณ",
  "more.applicationsHint": "งานที่สมัครแล้ว",
  "more.adminHint": "การดูแลเนื้อหา",
  "footer.tagline": "K-Help · แพลตฟอร์มชีวิตในเกาหลีสำหรับชาวต่างชาติ",
  "footer.team": "NP Coders · โปรเจกต์ Capstone",
};

const RU: Record<MessageKey, string> = {
  ...EN,
  "nav.community": "Сообщество",
  "nav.guides": "Гайды",
  "nav.jobs": "Работа",
  "nav.housing": "Жильё",
  "nav.chat": "Чат",
  "nav.ai": "ИИ-помощник",
  "nav.admin": "Админ",
  "nav.inbox": "Входящие",
  "nav.home": "Главная",
  "nav.more": "Ещё",
  "nav.signIn": "Войти",
  "nav.signOut": "Выйти",
  "nav.getStarted": "Начать",
  "nav.createAccount": "Создать аккаунт",
  "nav.myProfile": "Мой профиль",
  "nav.applications": "Отклики",
  "nav.language": "Язык",
  "more.communityHint": "Спрашивайте и делитесь",
  "more.chatHint": "Ваши сообщения",
  "more.aiHint": "Перевод с корейского",
  "more.profileHint": "Фото и навыки",
  "more.inboxHint": "Запросы к вашим объявлениям",
  "more.applicationsHint": "Вакансии, на которые вы откликнулись",
  "more.adminHint": "Модерация",
  "footer.tagline": "K-Help · Платформа жизни в Корее для иностранцев",
  "footer.team": "NP Coders · Capstone-проект",
};

export const MESSAGES: Record<LocaleCode, Record<MessageKey, string>> = {
  en: EN,
  ko: KO,
  zh: ZH,
  ja: JA,
  vi: VI,
  ne: NE,
  bn: BN,
  id: ID,
  th: TH,
  ru: RU,
};

export function isLocaleCode(value: string): value is LocaleCode {
  return LOCALES.some((locale) => locale.code === value);
}

export function translate(locale: LocaleCode, key: MessageKey): string {
  return MESSAGES[locale][key] ?? MESSAGES.en[key] ?? key;
}
