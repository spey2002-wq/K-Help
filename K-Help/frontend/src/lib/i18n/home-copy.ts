import type { LocaleCode } from "@/lib/i18n/locales";

export type HomeCopy = {
  badge: string;
  heroTitleBefore: string;
  heroTitleHighlight: string;
  heroTitleAfter: string;
  heroBody: string;
  heroPerks: [string, string, string];
  stats: [string, string, string, string];
  jumpLabel: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutLead: string;
  aboutBody: string;
  aboutBullets: [string, string, string];
  whoTitle: string;
  audiences: { title: string; description: string }[];
  goalsEyebrow: string;
  goalsTitle: string;
  goalsDesc: string;
  goals: { label: string; hint: string }[];
  stepsEyebrow: string;
  stepsTitle: string;
  steps: { title: string; description: string }[];
  topicsEyebrow: string;
  topicsTitle: string;
  topicsDesc: string;
  topicJump: Record<string, string>;
  topics: Record<
    string,
    { eyebrow: string; title: string; summary: string; cta: string; topicsTitle: string; highlights: string[] }
  >;
  extrasEyebrow: string;
  extrasTitle: string;
  extras: { title: string; description: string }[];
  finalTitle: string;
  finalBody: string;
  tryTitle: string;
  tryBody: string;
  ctaCreate: string;
  ctaHaveAccount: string;
  ctaCommunity: string;
  ctaGuides: string;
};

const EN: HomeCopy = {
  badge: "Korea Life Platform for Foreign Residents",
  heroTitleBefore: "Everything you need to",
  heroTitleHighlight: "live in Korea",
  heroTitleAfter: ", in one app",
  heroBody:
    "Living guides, jobs, housing, community answers, real-time chat and an AI translator, so moving to Korea and settling in feels less confusing.",
  heroPerks: ["Free to use", "Works on your phone", "AI translation"],
  stats: ["connected services", "living-guide topics", "job categories", "AI languages"],
  jumpLabel: "What is inside",
  aboutEyebrow: "About the app",
  aboutTitle: "What is K-Help?",
  aboutLead:
    "Starting a life in Korea means dealing with visas, banks, rent deposits, work rules and a language you may not speak yet. The answers exist, but they are scattered across many websites and written for Koreans.",
  aboutBody:
    "K-Help puts the essentials together in one friendly place. Read plain-language guides, find jobs and rooms that fit your visa and budget, ask people who have already been through it, and use AI to read and write Korean. It is built for international students, workers and long-term residents.",
  aboutBullets: [
    "Free to use. Create an account to post, chat and apply.",
    "Available in plain English, with AI help for other languages.",
    "Guides are a starting point. Always confirm important details with the official office.",
  ],
  whoTitle: "Who it is for",
  audiences: [
    {
      title: "International students",
      description:
        "Find part-time jobs that fit your weekly work-hour limit, a place near campus, and guides for ARC and insurance.",
    },
    {
      title: "Workers",
      description:
        "Understand contracts, minimum wage and your rights, then find employers who welcome foreign staff.",
    },
    {
      title: "Families and long-term residents",
      description:
        "Healthcare, banking, schooling and housing information in one place, plus a community of people in the same situation.",
    },
    {
      title: "Newcomers",
      description: "Landing soon? Read the Visa by Country guides and set up your life before you arrive.",
    },
  ],
  goalsEyebrow: "Start here",
  goalsTitle: "What do you want to do?",
  goalsDesc: "Pick the thing on your mind and go straight to the right page.",
  goals: [
    { label: "Understand my visa", hint: "ARC, extensions, status changes" },
    { label: "Open a bank account", hint: "Documents and official bank pages" },
    { label: "Find a part-time job", hint: "Filter by hours, days and pay" },
    { label: "Find a room", hint: "Compare deposit and rent" },
    { label: "See a doctor", hint: "Insurance, clinics, pharmacies" },
    { label: "Translate a Korean notice", hint: "Translate or summarize instantly" },
    { label: "Get emergency help", hint: "Numbers and what to do" },
    { label: "Ask other residents", hint: "Community answers" },
  ],
  stepsEyebrow: "How it works",
  stepsTitle: "From arrival to settled in four steps",
  steps: [
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
  ],
  topicsEyebrow: "Highlights",
  topicsTitle: "Everything K-Help covers",
  topicsDesc:
    "Each service below lists its highlights and its main topics. Select any topic to open it directly.",
  topicJump: {
    info: "Living Guides",
    jobs: "Jobs",
    housing: "Housing",
    community: "Community",
    chat: "Real-time Chat",
    ai: "AI Assistant",
  },
  topics: {
    info: {
      eyebrow: "Learn the basics",
      title: "Living Guides",
      summary:
        "Practical, curated guides for the paperwork and decisions newcomers face, from your first ARC to opening a bank account.",
      cta: "Browse all guides",
      topicsTitle: "Main topics",
      highlights: [
        "Step-by-step guides written for newcomers",
        "Visa by Country: documents and steps for your nationality",
        "Bank directory with official bank links",
        "Search across every guide by keyword",
      ],
    },
    jobs: {
      eyebrow: "Find work",
      title: "Jobs",
      summary:
        "Foreigner-friendly listings with filters that matter for your visa: hours, days, language level and pay.",
      cta: "Search jobs",
      topicsTitle: "Job categories",
      highlights: [
        "Filter by category, city, work days, shift and pay",
        "Weekly-hours limit filter for visa rules",
        "Visa sponsorship and Korean-level filters",
        "Apply and track your applications",
      ],
    },
    housing: {
      eyebrow: "Find a home",
      title: "Housing",
      summary:
        "Compare rooms by deposit, monthly rent and location, and understand Korea's deposit system before you sign.",
      cta: "Find housing",
      topicsTitle: "Property types",
      highlights: [
        "Compare deposit, rent and maintenance fees",
        "Filter by type, city, budget and furnished",
        "Share houses and dormitories for budget stays",
        "Detailed listing pages with house rules",
      ],
    },
    community: {
      eyebrow: "Ask and share",
      title: "Community",
      summary:
        "Real questions and answers from other foreign residents. Post, comment, like helpful replies and learn from people ahead of you.",
      cta: "Join the discussion",
      topicsTitle: "Discussion categories",
      highlights: [
        "Posts organized into topic categories",
        "Comments and likes surface helpful replies",
        "Language exchange and marketplace boards",
        "Report button and moderators keep it safe",
      ],
    },
    chat: {
      eyebrow: "Talk directly",
      title: "Real-time Chat",
      summary:
        "Message other residents, employers and landlords in real time, and keep every conversation in one place.",
      cta: "Open chat",
      topicsTitle: "What you can do",
      highlights: [
        "Instant messages over a live connection",
        "Read receipts so you know it was seen",
        "Full conversation history saved",
        "One inbox for all conversations",
      ],
    },
    ai: {
      eyebrow: "Beat the language barrier",
      title: "AI Assistant",
      summary:
        "Understand Korean notices and messages without a dictionary, and write back politely in Korean when it matters.",
      cta: "Try the assistant",
      topicsTitle: "Three tools",
      highlights: [
        "Translate between English, Korean and more",
        "Summarize long official notices",
        "Draft polite Korean messages",
        "Always double-check legal details officially",
      ],
    },
  },
  extrasEyebrow: "And more",
  extrasTitle: "Built to be trusted and easy to use",
  extras: [
    { title: "Your profile", description: "Photo, skills and work experience that employers can see." },
    { title: "Applications", description: "Track every job you applied to in one list." },
    { title: "Moderation", description: "Reports and admin review keep listings and posts trustworthy." },
    { title: "Works on your phone", description: "Every page is designed to be comfortable on a small screen." },
  ],
  finalTitle: "Ready to make Korea feel like home?",
  finalBody: "Create your free account in under a minute and start with the guides that match your visa.",
  tryTitle: "Try it yourself",
  tryBody:
    "Create a free account to post in the community, apply for jobs, send housing inquiries and chat with other residents. Browsing guides, jobs and housing needs no account.",
  ctaCreate: "Create a free account",
  ctaHaveAccount: "I already have an account",
  ctaCommunity: "Go to the community",
  ctaGuides: "Browse living guides",
};

const KO: HomeCopy = {
  badge: "외국인 거주자를 위한 한국 생활 플랫폼",
  heroTitleBefore: "한국 생활에 필요한 모든 것,",
  heroTitleHighlight: "하나의 앱",
  heroTitleAfter: "에서",
  heroBody:
    "생활 가이드, 취업, 주거, 커뮤니티, 실시간 채팅, AI 번역까지. 한국에 정착하는 길이 덜 복잡하도록 돕습니다.",
  heroPerks: ["무료 사용", "모바일 최적화", "AI 번역"],
  stats: ["연결 서비스", "생활 가이드 주제", "채용 카테고리", "AI 언어"],
  jumpLabel: "구성 살펴보기",
  aboutEyebrow: "앱 소개",
  aboutTitle: "K-Help란?",
  aboutLead:
    "한국에서의 새 출발은 비자, 은행, 보증금, 근무 규정, 그리고 익숙하지 않은 언어까지 한꺼번에 다가옵니다. 정보는 있지만 여러 사이트에 흩어져 있고 대부분 한국인 기준으로 쓰여 있습니다.",
  aboutBody:
    "K-Help는 꼭 필요한 정보를 한곳에 모았습니다. 쉬운 가이드를 읽고, 비자와 예산에 맞는 일자리·집을 찾고, 먼저 경험한 사람에게 물어보고, AI로 한국어를 읽고 쓸 수 있습니다. 유학생, 근로자, 장기 거주자를 위해 만들었습니다.",
  aboutBullets: [
    "무료입니다. 계정만 만들면 게시, 채팅, 지원이 가능합니다.",
    "쉬운 영어를 기본으로 하고, 다른 언어는 AI로 돕습니다.",
    "가이드는 출발점입니다. 중요한 내용은 반드시 공식 기관에서 확인하세요.",
  ],
  whoTitle: "이런 분께 맞습니다",
  audiences: [
    {
      title: "외국인 유학생",
      description: "주당 근로시간 제한에 맞는 아르바이트, 캠퍼스 근처 주거, ARC·보험 가이드를 찾을 수 있습니다.",
    },
    {
      title: "근로자",
      description: "근로계약, 최저임금, 권리를 이해하고 외국인 채용에 열린 고용주를 찾습니다.",
    },
    {
      title: "가족과 장기 거주자",
      description: "의료, 은행, 교육, 주거 정보를 한곳에서, 같은 상황의 커뮤니티와 함께합니다.",
    },
    {
      title: "신규 입국자",
      description: "곧 입국하시나요? 국가별 비자 가이드를 읽고 도착 전에 준비를 시작하세요.",
    },
  ],
  goalsEyebrow: "여기서 시작",
  goalsTitle: "무엇을 하고 싶나요?",
  goalsDesc: "지금 필요한 일을 고르면 바로 해당 페이지로 이동합니다.",
  goals: [
    { label: "비자 이해하기", hint: "ARC, 연장, 체류자격 변경" },
    { label: "은행 계좌 개설", hint: "필요 서류와 공식 은행 페이지" },
    { label: "아르바이트 찾기", hint: "시간·요일·급여로 필터" },
    { label: "방 구하기", hint: "보증금과 월세 비교" },
    { label: "병원 가기", hint: "보험, 의원, 약국" },
    { label: "한국어 공문 번역", hint: "즉시 번역·요약" },
    { label: "긴급 도움", hint: "번호와 대처 방법" },
    { label: "다른 거주자에게 묻기", hint: "커뮤니티 답변" },
  ],
  stepsEyebrow: "이용 방법",
  stepsTitle: "도착부터 정착까지 네 단계",
  steps: [
    { title: "무료 계정 만들기", description: "국적과 비자 유형을 등록해 맞춤 안내를 받습니다." },
    { title: "기본 알기", description: "비자, 은행, 건강보험, 주거 가이드를 읽습니다." },
    { title: "일과 집 찾기", description: "규정과 예산에 맞는 채용·매물을 필터로 고릅니다." },
    { title: "연결하고 도움받기", description: "작성자와 채팅하고, 커뮤니티에 묻고, AI로 한국어를 처리합니다." },
  ],
  topicsEyebrow: "하이라이트",
  topicsTitle: "K-Help가 다루는 모든 것",
  topicsDesc: "각 서비스의 핵심과 주요 주제를 확인하세요. 주제를 누르면 바로 이동합니다.",
  topicJump: {
    info: "생활 가이드",
    jobs: "취업",
    housing: "주거",
    community: "커뮤니티",
    chat: "실시간 채팅",
    ai: "AI 도우미",
  },
  topics: {
    info: {
      eyebrow: "기본 배우기",
      title: "생활 가이드",
      summary: "ARC부터 계좌 개설까지, 새로 온 사람이 겪는 절차를 쉽게 정리했습니다.",
      cta: "모든 가이드 보기",
      topicsTitle: "주요 주제",
      highlights: [
        "신규 거주자용 단계별 가이드",
        "국가별 비자: 서류와 절차",
        "공식 링크가 있는 은행 안내",
        "키워드로 전체 가이드 검색",
      ],
    },
    jobs: {
      eyebrow: "일 찾기",
      title: "취업",
      summary: "비자·근무시간·언어·급여처럼 외국인에게 중요한 조건으로 채용을 찾습니다.",
      cta: "채용 검색",
      topicsTitle: "직무 카테고리",
      highlights: [
        "업종, 도시, 요일, 교대, 급여 필터",
        "비자 근로시간 제한 필터",
        "비자 스폰서·한국어 수준 필터",
        "지원하고 진행 상황 추적",
      ],
    },
    housing: {
      eyebrow: "집 찾기",
      title: "주거",
      summary: "보증금·월세·위치를 비교하고, 계약 전에 한국식 보증금 제도를 이해합니다.",
      cta: "주거 찾기",
      topicsTitle: "매물 유형",
      highlights: [
        "보증금·월세·관리비 한눈에 비교",
        "유형, 도시, 예산, 가구 필터",
        "셰어하우스·기숙사 등 저렴한 선택",
        "규칙이 있는 상세 매물 페이지",
      ],
    },
    community: {
      eyebrow: "묻고 나누기",
      title: "커뮤니티",
      summary: "다른 외국인 거주자의 실제 질문과 답변. 글을 쓰고, 댓글·좋아요로 도움을 나눕니다.",
      cta: "토론 참여",
      topicsTitle: "토론 카테고리",
      highlights: [
        "주제별 게시글 분류",
        "댓글·좋아요로 유용한 답 강조",
        "언어교환·중고거래 게시판",
        "신고와 관리로 안전한 공간",
      ],
    },
    chat: {
      eyebrow: "바로 대화",
      title: "실시간 채팅",
      summary: "거주자·고용주·집주인과 실시간으로 대화하고 대화를 한곳에서 관리합니다.",
      cta: "채팅 열기",
      topicsTitle: "가능한 일",
      highlights: [
        "새로고침 없는 실시간 메시지",
        "읽음 확인",
        "대화 기록 저장",
        "모든 대화를 하나의 인박스에서",
      ],
    },
    ai: {
      eyebrow: "언어 장벽 넘기",
      title: "AI 도우미",
      summary: "사전 없이 한국어 공문과 메시지를 이해하고, 필요할 때 정중한 한국어로 답합니다.",
      cta: "도우미 사용",
      topicsTitle: "세 가지 도구",
      highlights: [
        "영어·한국어 등 다국어 번역",
        "긴 공문 요약",
        "정중한 한국어 메시지 작성",
        "법적·금전 내용은 공식 확인 필수",
      ],
    },
  },
  extrasEyebrow: "그 외",
  extrasTitle: "믿을 수 있고 쓰기 쉽게",
  extras: [
    { title: "내 프로필", description: "고용주가 볼 수 있는 사진, 스킬, 경력." },
    { title: "지원 내역", description: "지원한 채용을 한 목록에서 추적." },
    { title: "관리·신고", description: "신고와 관리자 검토로 신뢰를 유지." },
    { title: "모바일 최적화", description: "작은 화면에서도 편하게 사용." },
  ],
  finalTitle: "한국이 집처럼 느껴질 준비가 되셨나요?",
  finalBody: "1분 안에 무료 계정을 만들고, 비자에 맞는 가이드부터 시작하세요.",
  tryTitle: "직접 사용해 보세요",
  tryBody:
    "무료 계정으로 커뮤니티 게시, 채용 지원, 주거 문의, 채팅이 가능합니다. 가이드·채용·주거 열람은 계정 없이도 됩니다.",
  ctaCreate: "무료 계정 만들기",
  ctaHaveAccount: "이미 계정이 있어요",
  ctaCommunity: "커뮤니티로 가기",
  ctaGuides: "생활 가이드 보기",
};

const ZH: HomeCopy = {
  ...EN,
  badge: "面向外国居民的韩国生活平台",
  heroTitleBefore: "在韩国生活所需的一切，",
  heroTitleHighlight: "一个应用",
  heroTitleAfter: "全部搞定",
  heroBody: "生活指南、工作、住房、社区问答、实时聊天和 AI 翻译，让你在韩国安顿下来不再那么混乱。",
  heroPerks: ["免费使用", "手机可用", "AI 翻译"],
  stats: ["连接服务", "生活指南主题", "工作类别", "AI 语言"],
  jumpLabel: "内容导航",
  aboutEyebrow: "关于应用",
  aboutTitle: "什么是 K-Help？",
  aboutLead: "在韩国开始新生活，意味着签证、银行、押金、工作规定，以及你可能还不熟悉的语言。信息散落在许多网站，而且多为韩语读者编写。",
  aboutBody: "K-Help 把关键信息集中在一个友好的地方。阅读通俗指南，找到符合签证和预算的工作和住房，向过来人提问，并用 AI 读写韩语。",
  aboutBullets: [
    "免费使用。注册后即可发帖、聊天和申请。",
    "以简明英语为主，其他语言可用 AI 辅助。",
    "指南仅供参考，重要事项请向官方机构确认。",
  ],
  whoTitle: "适合谁",
  audiences: [
    { title: "国际学生", description: "找到符合周工时限制的兼职、校园附近住房，以及 ARC 与保险指南。" },
    { title: "工作者", description: "了解合同、最低工资与权利，寻找欢迎外籍员工的雇主。" },
    { title: "家庭与长期居民", description: "医疗、银行、教育与住房信息集中一处，还有同行社区。" },
    { title: "新来者", description: "即将入境？先阅读按国家分类的签证指南并提前准备。" },
  ],
  goalsEyebrow: "从这里开始",
  goalsTitle: "你想做什么？",
  goalsDesc: "选择当前最关心的事，直接进入对应页面。",
  goals: [
    { label: "了解我的签证", hint: "ARC、延期、身份变更" },
    { label: "开银行账户", hint: "材料与官方银行页面" },
    { label: "找兼职", hint: "按工时、日期和薪资筛选" },
    { label: "找房", hint: "比较押金和月租" },
    { label: "看医生", hint: "保险、诊所、药房" },
    { label: "翻译韩文通知", hint: "即时翻译或摘要" },
    { label: "紧急帮助", hint: "电话与应对方法" },
    { label: "询问其他居民", hint: "社区回答" },
  ],
  stepsEyebrow: "如何使用",
  stepsTitle: "从抵达到处安定居的四步",
  steps: [
    { title: "创建免费账户", description: "登记国籍与签证类型，获得更贴合的指引。" },
    { title: "了解基础", description: "阅读签证、银行、医保与住房指南。" },
    { title: "找工作和住房", description: "用详细筛选找到符合规定和预算的选项。" },
    { title: "连接并获得帮助", description: "与发布者聊天、向社区提问，让 AI 处理韩语。" },
  ],
  topicsEyebrow: "亮点",
  topicsTitle: "K-Help 覆盖的全部内容",
  topicsDesc: "每个服务都列出亮点与主题，点击即可直达。",
  topicJump: {
    info: "生活指南",
    jobs: "工作",
    housing: "住房",
    community: "社区",
    chat: "实时聊天",
    ai: "AI 助手",
  },
  topics: {
    info: {
      eyebrow: "学习基础",
      title: "生活指南",
      summary: "从 ARC 到开户，为新来者整理实用手续指南。",
      cta: "浏览全部指南",
      topicsTitle: "主要主题",
      highlights: ["面向新来者的分步指南", "按国家提供签证材料与步骤", "含官方链接的银行目录", "关键词搜索全部指南"],
    },
    jobs: {
      eyebrow: "找工作",
      title: "工作",
      summary: "按签证相关条件筛选：工时、日期、语言和薪资。",
      cta: "搜索工作",
      topicsTitle: "工作类别",
      highlights: ["类别、城市、班次、薪资筛选", "签证周工时限制筛选", "签证担保与韩语水平", "申请并跟踪进度"],
    },
    housing: {
      eyebrow: "找房",
      title: "住房",
      summary: "比较押金、月租与位置，签约前了解韩国押金制度。",
      cta: "寻找住房",
      topicsTitle: "房源类型",
      highlights: ["押金、租金、管理费对比", "类型、城市、预算筛选", "合租与宿舍等经济选择", "含房屋规则的详情页"],
    },
    community: {
      eyebrow: "提问与分享",
      title: "社区",
      summary: "来自其他外国居民的真实问答。发帖、评论、点赞并互相帮助。",
      cta: "加入讨论",
      topicsTitle: "讨论分类",
      highlights: ["按主题分类帖子", "评论和点赞突出有用回复", "语言交换与市集版块", "举报与管理保障安全"],
    },
    chat: {
      eyebrow: "直接沟通",
      title: "实时聊天",
      summary: "与居民、雇主、房东实时沟通，对话集中管理。",
      cta: "打开聊天",
      topicsTitle: "你可以做什么",
      highlights: ["实时即时消息", "已读回执", "保存完整对话记录", "一个收件箱管理全部对话"],
    },
    ai: {
      eyebrow: "跨越语言障碍",
      title: "AI 助手",
      summary: "无需词典理解韩文通知，并在需要时用礼貌韩语回复。",
      cta: "试用助手",
      topicsTitle: "三个工具",
      highlights: ["多语言翻译", "长通知摘要", "起草礼貌韩语消息", "法律财务请向官方核实"],
    },
  },
  extrasEyebrow: "更多",
  extrasTitle: "可信、好用",
  extras: [
    { title: "个人资料", description: "雇主可见的照片、技能与经历。" },
    { title: "申请记录", description: "在一个列表跟踪所有求职申请。" },
    { title: "内容管理", description: "举报与管理员审核维护可信度。" },
    { title: "手机友好", description: "每个页面都适合小屏使用。" },
  ],
  finalTitle: "准备好让韩国像家一样吗？",
  finalBody: "一分钟创建免费账户，从匹配你签证的指南开始。",
  tryTitle: "亲自试试",
  tryBody: "免费账户可发帖、申请工作、咨询住房并聊天。浏览指南、工作与住房无需账户。",
  ctaCreate: "创建免费账户",
  ctaHaveAccount: "我已有账户",
  ctaCommunity: "前往社区",
  ctaGuides: "浏览生活指南",
};

const JA: HomeCopy = {
  ...EN,
  badge: "外国人住民のための韓国生活プラットフォーム",
  heroTitleBefore: "韓国生活に必要なものすべてを、",
  heroTitleHighlight: "ひとつのアプリ",
  heroTitleAfter: "で",
  heroBody:
    "生活ガイド、仕事、住まい、コミュニティ、リアルタイムチャット、AI翻訳。韓国でのスタートをもっと分かりやすくします。",
  heroPerks: ["無料で使える", "スマホ対応", "AI翻訳"],
  stats: ["連携サービス", "生活ガイド項目", "職種カテゴリ", "AI言語"],
  jumpLabel: "中身を見る",
  aboutEyebrow: "アプリについて",
  aboutTitle: "K-Helpとは？",
  aboutLead:
    "韓国での新生活は、ビザ、銀行、敷金、就労ルール、そしてまだ慣れていない言葉への対応が必要です。情報はありますが、多くのサイトに分散し、韓国語話者向けです。",
  aboutBody:
    "K-Helpは必要な情報を一つの場所にまとめます。わかりやすいガイドを読み、ビザと予算に合う仕事や部屋を探し、経験者に聞き、AIで韓国語を読み書きできます。",
  aboutBullets: [
    "無料です。アカウントを作れば投稿・チャット・応募ができます。",
    "わかりやすい英語を基本に、他言語はAIで支援します。",
    "ガイドは出発点です。重要な内容は必ず公式機関で確認してください。",
  ],
  whoTitle: "こんな方に",
  audiences: [
    { title: "留学生", description: "週の労働時間制限に合うバイト、キャンパス近くの住まい、ARC・保険ガイド。" },
    { title: "労働者", description: "契約・最低賃金・権利を理解し、外国人を歓迎する雇用主を探せます。" },
    { title: "家族・長期滞在者", description: "医療・銀行・教育・住まいの情報と、同じ立場のコミュニティ。" },
    { title: "新規入国者", description: "入国前に国別ビザガイドを読んで準備を始めましょう。" },
  ],
  goalsEyebrow: "ここから",
  goalsTitle: "何をしたいですか？",
  goalsDesc: "今気になることを選ぶと、すぐ該当ページへ移動します。",
  goals: [
    { label: "ビザを理解する", hint: "ARC、延長、在留資格変更" },
    { label: "銀行口座を開く", hint: "必要書類と公式ページ" },
    { label: "アルバイトを探す", hint: "時間・曜日・給与で絞り込み" },
    { label: "部屋を探す", hint: "敷金と家賃を比較" },
    { label: "病院に行く", hint: "保険、医院、薬局" },
    { label: "韓国語の通知を翻訳", hint: "すぐ翻訳・要約" },
    { label: "緊急時の助け", hint: "番号と対処法" },
    { label: "他の住民に聞く", hint: "コミュニティの回答" },
  ],
  stepsEyebrow: "使い方",
  stepsTitle: "到着から定着までの4ステップ",
  steps: [
    { title: "無料アカウント作成", description: "国籍とビザ種別を登録し、状況に合う案内を受けます。" },
    { title: "基本を学ぶ", description: "ビザ、銀行、健康保険、住まいのガイドを読みます。" },
    { title: "仕事と住まいを探す", description: "ルールと予算に合う求人・物件をフィルタで絞ります。" },
    { title: "つながり助けを得る", description: "投稿者とチャットし、コミュニティに聞き、AIで韓国語を扱います。" },
  ],
  topicsEyebrow: "ハイライト",
  topicsTitle: "K-Helpがカバーすること",
  topicsDesc: "各サービスの要点と主なトピック。選ぶとそのページへ移動します。",
  topicJump: {
    info: "生活ガイド",
    jobs: "求人",
    housing: "住まい",
    community: "コミュニティ",
    chat: "リアルタイムチャット",
    ai: "AIアシスタント",
  },
  topics: {
    info: {
      eyebrow: "基本を学ぶ",
      title: "生活ガイド",
      summary: "ARCから口座開設まで、新しく来た人向けの実務ガイドです。",
      cta: "すべてのガイドを見る",
      topicsTitle: "主なトピック",
      highlights: ["新来者向けの手順ガイド", "国別ビザの書類と手順", "公式リンク付き銀行案内", "キーワードでガイド検索"],
    },
    jobs: {
      eyebrow: "仕事を探す",
      title: "求人",
      summary: "ビザに関わる条件（時間・曜日・言語・給与）で求人を探せます。",
      cta: "求人を検索",
      topicsTitle: "職種カテゴリ",
      highlights: ["職種・都市・シフト・給与フィルタ", "ビザの週労働時間制限", "ビザスポンサー・韓国語レベル", "応募と進捗の追跡"],
    },
    housing: {
      eyebrow: "住まいを探す",
      title: "住まい",
      summary: "敷金・家賃・立地を比較し、契約前に韓国の敷金制度を理解します。",
      cta: "住まいを探す",
      topicsTitle: "物件タイプ",
      highlights: ["敷金・家賃・管理費の比較", "タイプ・都市・予算フィルタ", "シェアハウスや寮などの選択肢", "ルール付き詳細ページ"],
    },
    community: {
      eyebrow: "聞いて共有",
      title: "コミュニティ",
      summary: "他の外国人住民のリアルなQ&A。投稿、コメント、いいねで助け合えます。",
      cta: "議論に参加",
      topicsTitle: "議論カテゴリ",
      highlights: ["トピック別の投稿", "役立つ返信を目立たせる", "言語交換・フリマ掲示板", "通報と管理で安全に"],
    },
    chat: {
      eyebrow: "直接話す",
      title: "リアルタイムチャット",
      summary: "住民・雇用主・大家とリアルタイムで話し、会話を一か所で管理します。",
      cta: "チャットを開く",
      topicsTitle: "できること",
      highlights: ["ライブ接続の即時メッセージ", "既読確認", "会話履歴の保存", "すべての会話を一つの受信箱で"],
    },
    ai: {
      eyebrow: "言葉の壁を越える",
      title: "AIアシスタント",
      summary: "辞書なしで韓国語の通知を理解し、必要なときは丁寧な韓国語で返信できます。",
      cta: "アシスタントを試す",
      topicsTitle: "3つのツール",
      highlights: ["多言語翻訳", "長い通知の要約", "丁寧な韓国語メッセージ作成", "法的・金銭内容は公式確認を"],
    },
  },
  extrasEyebrow: "その他",
  extrasTitle: "信頼できて使いやすい",
  extras: [
    { title: "プロフィール", description: "雇用主が見られる写真・スキル・経験。" },
    { title: "応募履歴", description: "応募した求人を一覧で追跡。" },
    { title: "モデレーション", description: "通報と管理で信頼性を維持。" },
    { title: "スマホ対応", description: "小さい画面でも使いやすい設計。" },
  ],
  finalTitle: "韓国をホームに感じる準備はできましたか？",
  finalBody: "1分で無料アカウントを作り、ビザに合うガイドから始めましょう。",
  tryTitle: "自分で試す",
  tryBody: "無料アカウントで投稿・応募・問い合わせ・チャットが可能。ガイド・求人・住まいの閲覧にアカウントは不要です。",
  ctaCreate: "無料アカウントを作成",
  ctaHaveAccount: "すでにアカウントがある",
  ctaCommunity: "コミュニティへ",
  ctaGuides: "生活ガイドを見る",
};

const VI: HomeCopy = {
  ...EN,
  badge: "Nền tảng cuộc sống Hàn Quốc cho người nước ngoài",
  heroTitleBefore: "Mọi thứ bạn cần để",
  heroTitleHighlight: "sống ở Hàn Quốc",
  heroTitleAfter: ", trong một ứng dụng",
  heroBody:
    "Hướng dẫn sinh hoạt, việc làm, nhà ở, cộng đồng, chat thời gian thực và AI dịch thuật — giúp việc định cư dễ hơn.",
  heroPerks: ["Miễn phí", "Dùng được trên điện thoại", "Dịch AI"],
  stats: ["dịch vụ kết nối", "chủ đề hướng dẫn", "nhóm việc làm", "ngôn ngữ AI"],
  jumpLabel: "Có gì bên trong",
  aboutEyebrow: "Về ứng dụng",
  aboutTitle: "K-Help là gì?",
  aboutLead:
    "Bắt đầu cuộc sống ở Hàn Quốc nghĩa là đối mặt với visa, ngân hàng, tiền đặt cọc, quy định làm việc và ngôn ngữ bạn có thể chưa biết.",
  aboutBody:
    "K-Help gom những điều cần thiết vào một nơi thân thiện. Đọc hướng dẫn dễ hiểu, tìm việc và phòng phù hợp visa/ngân sách, hỏi người đã trải qua, và dùng AI để đọc/viết tiếng Hàn.",
  aboutBullets: [
    "Miễn phí. Tạo tài khoản để đăng bài, chat và ứng tuyển.",
    "Tiếng Anh dễ hiểu là mặc định; ngôn ngữ khác có hỗ trợ AI.",
    "Hướng dẫn chỉ là điểm bắt đầu — hãy xác nhận với cơ quan chính thức.",
  ],
  whoTitle: "Dành cho ai",
  audiences: [
    { title: "Du học sinh", description: "Việc làm bán thời gian đúng giới hạn giờ, chỗ ở gần trường, hướng dẫn ARC và bảo hiểm." },
    { title: "Người lao động", description: "Hiểu hợp đồng, lương tối thiểu và quyền lợi; tìm nhà tuyển dụng chào đón người nước ngoài." },
    { title: "Gia đình & cư dân dài hạn", description: "Y tế, ngân hàng, giáo dục, nhà ở cùng một cộng đồng cùng hoàn cảnh." },
    { title: "Người mới đến", description: "Sắp nhập cảnh? Đọc hướng dẫn visa theo quốc gia và chuẩn bị trước." },
  ],
  goalsEyebrow: "Bắt đầu tại đây",
  goalsTitle: "Bạn muốn làm gì?",
  goalsDesc: "Chọn việc đang cần và đi thẳng tới trang phù hợp.",
  goals: [
    { label: "Hiểu visa của tôi", hint: "ARC, gia hạn, đổi tư cách" },
    { label: "Mở tài khoản ngân hàng", hint: "Giấy tờ và trang ngân hàng chính thức" },
    { label: "Tìm việc bán thời gian", hint: "Lọc theo giờ, ngày và lương" },
    { label: "Tìm phòng", hint: "So sánh đặt cọc và tiền thuê" },
    { label: "Đi khám", hint: "Bảo hiểm, phòng khám, nhà thuốc" },
    { label: "Dịch thông báo tiếng Hàn", hint: "Dịch hoặc tóm tắt ngay" },
    { label: "Trợ giúp khẩn cấp", hint: "Số điện thoại và cách xử lý" },
    { label: "Hỏi cư dân khác", hint: "Câu trả lời cộng đồng" },
  ],
  stepsEyebrow: "Cách dùng",
  stepsTitle: "Từ lúc đến đến lúc ổn định — 4 bước",
  steps: [
    { title: "Tạo tài khoản miễn phí", description: "Đăng ký quốc tịch và loại visa để được hướng dẫn phù hợp." },
    { title: "Học những điều cơ bản", description: "Đọc hướng dẫn về visa, ngân hàng, bảo hiểm và nhà ở." },
    { title: "Tìm việc và chỗ ở", description: "Dùng bộ lọc chi tiết theo quy định và ngân sách." },
    { title: "Kết nối và nhờ giúp", description: "Chat với người đăng, hỏi cộng đồng, để AI xử lý tiếng Hàn." },
  ],
  topicsEyebrow: "Điểm nổi bật",
  topicsTitle: "Mọi thứ K-Help bao phủ",
  topicsDesc: "Mỗi dịch vụ có điểm nổi bật và chủ đề chính. Chọn để mở ngay.",
  topicJump: {
    info: "Hướng dẫn sinh hoạt",
    jobs: "Việc làm",
    housing: "Nhà ở",
    community: "Cộng đồng",
    chat: "Chat thời gian thực",
    ai: "Trợ lý AI",
  },
  topics: {
    info: {
      eyebrow: "Học cơ bản",
      title: "Hướng dẫn sinh hoạt",
      summary: "Hướng dẫn thực tế từ ARC đến mở tài khoản cho người mới.",
      cta: "Xem tất cả hướng dẫn",
      topicsTitle: "Chủ đề chính",
      highlights: ["Hướng dẫn từng bước cho người mới", "Visa theo quốc gia", "Danh mục ngân hàng có link chính thức", "Tìm kiếm theo từ khóa"],
    },
    jobs: {
      eyebrow: "Tìm việc",
      title: "Việc làm",
      summary: "Tin tuyển dụng thân thiện với người nước ngoài, lọc theo điều kiện visa.",
      cta: "Tìm việc",
      topicsTitle: "Nhóm việc",
      highlights: ["Lọc ngành, thành phố, ca, lương", "Giới hạn giờ theo visa", "Bảo lãnh visa & trình độ tiếng Hàn", "Ứng tuyển và theo dõi"],
    },
    housing: {
      eyebrow: "Tìm nhà",
      title: "Nhà ở",
      summary: "So sánh đặt cọc, tiền thuê, vị trí và hiểu hệ thống đặt cọc trước khi ký.",
      cta: "Tìm nhà ở",
      topicsTitle: "Loại nhà",
      highlights: ["So sánh đặt cọc và phí", "Lọc loại, thành phố, ngân sách", "Share house và ký túc xá", "Trang chi tiết có nội quy"],
    },
    community: {
      eyebrow: "Hỏi và chia sẻ",
      title: "Cộng đồng",
      summary: "Câu hỏi và câu trả lời thật từ cư dân nước ngoài khác.",
      cta: "Tham gia thảo luận",
      topicsTitle: "Chủ đề thảo luận",
      highlights: ["Bài viết theo chủ đề", "Bình luận và thích", "Trao đổi ngôn ngữ & chợ", "Báo cáo và kiểm duyệt"],
    },
    chat: {
      eyebrow: "Nói trực tiếp",
      title: "Chat thời gian thực",
      summary: "Nhắn tin với cư dân, nhà tuyển dụng và chủ nhà theo thời gian thực.",
      cta: "Mở chat",
      topicsTitle: "Bạn có thể làm gì",
      highlights: ["Tin nhắn tức thì", "Đã đọc", "Lưu lịch sử hội thoại", "Một hộp thư cho mọi cuộc trò chuyện"],
    },
    ai: {
      eyebrow: "Vượt rào ngôn ngữ",
      title: "Trợ lý AI",
      summary: "Hiểu thông báo tiếng Hàn và viết lại lịch sự khi cần.",
      cta: "Dùng trợ lý",
      topicsTitle: "Ba công cụ",
      highlights: ["Dịch đa ngôn ngữ", "Tóm tắt thông báo dài", "Soạn tin nhắn lịch sự", "Luôn xác minh thông tin pháp lý chính thức"],
    },
  },
  extrasEyebrow: "Thêm nữa",
  extrasTitle: "Đáng tin và dễ dùng",
  extras: [
    { title: "Hồ sơ của bạn", description: "Ảnh, kỹ năng và kinh nghiệm nhà tuyển dụng có thể xem." },
    { title: "Đơn ứng tuyển", description: "Theo dõi mọi việc đã ứng tuyển trong một danh sách." },
    { title: "Kiểm duyệt", description: "Báo cáo và admin giữ nội dung đáng tin." },
    { title: "Tối ưu điện thoại", description: "Mọi trang đều dễ dùng trên màn hình nhỏ." },
  ],
  finalTitle: "Sẵn sàng để Hàn Quốc cảm giác như nhà?",
  finalBody: "Tạo tài khoản miễn phí trong chưa đầy một phút và bắt đầu với hướng dẫn phù hợp visa.",
  tryTitle: "Tự trải nghiệm",
  tryBody: "Tài khoản miễn phí để đăng bài, ứng tuyển, hỏi nhà và chat. Xem hướng dẫn/việc/nhà không cần tài khoản.",
  ctaCreate: "Tạo tài khoản miễn phí",
  ctaHaveAccount: "Tôi đã có tài khoản",
  ctaCommunity: "Vào cộng đồng",
  ctaGuides: "Xem hướng dẫn sinh hoạt",
};

/** Other locales reuse English structure with localized hero + CTAs for reliability. */
function localizedShell(
  badge: string,
  before: string,
  highlight: string,
  after: string,
  body: string,
  perks: [string, string, string],
  cta: Pick<HomeCopy, "ctaCreate" | "ctaHaveAccount" | "ctaCommunity" | "ctaGuides" | "finalTitle" | "finalBody" | "tryTitle" | "tryBody">,
): HomeCopy {
  return {
    ...EN,
    badge,
    heroTitleBefore: before,
    heroTitleHighlight: highlight,
    heroTitleAfter: after,
    heroBody: body,
    heroPerks: perks,
    ...cta,
  };
}

const HOME: Record<LocaleCode, HomeCopy> = {
  en: EN,
  ko: KO,
  zh: ZH,
  ja: JA,
  vi: VI,
  ne: localizedShell(
    "विदेशी बासिन्दाका लागि कोरिया जीवन प्लेटफर्म",
    "कोरियामा बाँच्न चाहिने सबै कुरा,",
    "एउटै एप",
    "मा",
    "जीवन गाइड, जागिर, आवास, समुदाय, च्याट र AI अनुवाद — कोरियामा बसोबास सजिलो बनाउन।",
    ["निःशुल्क", "फोनमा चल्छ", "AI अनुवाद"],
    {
      ctaCreate: "निःशुल्क खाता बनाउनुहोस्",
      ctaHaveAccount: "मेरो खाता छ",
      ctaCommunity: "समुदायमा जानुहोस्",
      ctaGuides: "जीवन गाइड हेर्नुहोस्",
      finalTitle: "कोरियालाई घर जस्तो बनाउन तयार हुनुहुन्छ?",
      finalBody: "एक मिनेटभित्र निःशुल्क खाता बनाउनुहोस् र आफ्नो भिसाअनुसारका गाइडबाट सुरु गर्नुहोस्।",
      tryTitle: "आफैं प्रयास गर्नुहोस्",
      tryBody: "निःशुल्क खाताले समुदाय पोस्ट, जागिर आवेदन, आवास सोधपुछ र च्याट खोल्छ। गाइड/जागिर/आवास हेर्न खाता चाहिँदैन।",
    },
  ),
  bn: localizedShell(
    "বিদেশি বাসিন্দাদের জন্য কোরিয়া লাইফ প্ল্যাটফর্ম",
    "কোরিয়ায় থাকতে যা লাগে,",
    "এক অ্যাপে",
    "",
    "জীবন গাইড, চাকরি, বাসা, কমিউনিটি, চ্যাট ও AI অনুবাদ — কোরিয়ায় স্থিতি সহজ করতে।",
    ["বিনামূল্যে", "ফোনে চলে", "AI অনুবাদ"],
    {
      ctaCreate: "বিনামূল্যে অ্যাকাউন্ট তৈরি",
      ctaHaveAccount: "আমার অ্যাকাউন্ট আছে",
      ctaCommunity: "কমিউনিটিতে যান",
      ctaGuides: "জীবন গাইড দেখুন",
      finalTitle: "কোরিয়াকে বাড়ির মতো করতে প্রস্তুত?",
      finalBody: "এক মিনিটে বিনামূল্যে অ্যাকাউন্ট তৈরি করুন এবং আপনার ভিসার গাইড দিয়ে শুরু করুন।",
      tryTitle: "নিজে চেষ্টা করুন",
      tryBody: "বিনামূল্যে অ্যাকাউন্টে পোস্ট, আবেদন, বাসা জিজ্ঞাসা ও চ্যাট করা যায়। গাইড/চাকরি/বাসা দেখতে অ্যাকাউন্ট লাগে না।",
    },
  ),
  id: localizedShell(
    "Platform kehidupan Korea untuk warga asing",
    "Semua yang Anda butuhkan untuk",
    "hidup di Korea",
    ", dalam satu aplikasi",
    "Panduan hidup, pekerjaan, hunian, komunitas, chat real-time, dan AI penerjemah — agar menetap di Korea lebih mudah.",
    ["Gratis", "Bisa di ponsel", "Terjemahan AI"],
    {
      ctaCreate: "Buat akun gratis",
      ctaHaveAccount: "Saya sudah punya akun",
      ctaCommunity: "Ke komunitas",
      ctaGuides: "Lihat panduan hidup",
      finalTitle: "Siap membuat Korea terasa seperti rumah?",
      finalBody: "Buat akun gratis dalam kurang dari satu menit dan mulai dari panduan sesuai visa Anda.",
      tryTitle: "Coba sendiri",
      tryBody: "Akun gratis untuk posting, melamar, menanyakan hunian, dan chat. Melihat panduan/pekerjaan/hunian tidak perlu akun.",
    },
  ),
  th: localizedShell(
    "แพลตฟอร์มชีวิตในเกาหลีสำหรับชาวต่างชาติ",
    "ทุกอย่างที่คุณต้องการเพื่อ",
    "ใช้ชีวิตในเกาหลี",
    " ในแอปเดียว",
    "คู่มือการใช้ชีวิต งาน ที่อยู่อาศัย ชุมชน แชทแบบเรียลไทม์ และ AI แปลภาษา — ให้การตั้งถิ่นฐานง่ายขึ้น",
    ["ใช้ฟรี", "ใช้บนมือถือได้", "แปลด้วย AI"],
    {
      ctaCreate: "สร้างบัญชีฟรี",
      ctaHaveAccount: "ฉันมีบัญชีแล้ว",
      ctaCommunity: "ไปที่ชุมชน",
      ctaGuides: "ดูคู่มือการใช้ชีวิต",
      finalTitle: "พร้อมทำให้เกาหลีรู้สึกเหมือนบ้านหรือยัง?",
      finalBody: "สร้างบัญชีฟรีในไม่ถึงนาที แล้วเริ่มจากคู่มือที่ตรงกับวีซ่าของคุณ",
      tryTitle: "ลองด้วยตัวเอง",
      tryBody: "บัญชีฟรีสำหรับโพสต์ สมัครงาน สอบถามที่อยู่ และแชท การดูคู่มือ/งาน/ที่อยู่ไม่ต้องมีบัญชี",
    },
  ),
  ru: localizedShell(
    "Платформа жизни в Корее для иностранцев",
    "Всё необходимое, чтобы",
    "жить в Корее",
    ", в одном приложении",
    "Гайды, работа, жильё, сообщество, чат и ИИ-перевод — чтобы обустроиться в Корее было проще.",
    ["Бесплатно", "Работает на телефоне", "ИИ-перевод"],
    {
      ctaCreate: "Создать бесплатный аккаунт",
      ctaHaveAccount: "У меня уже есть аккаунт",
      ctaCommunity: "В сообщество",
      ctaGuides: "Смотреть гайды",
      finalTitle: "Готовы почувствовать Корею как дом?",
      finalBody: "Создайте бесплатный аккаунт за минуту и начните с гайдов под вашу визу.",
      tryTitle: "Попробуйте сами",
      tryBody: "Бесплатный аккаунт для постов, откликов, запросов по жилью и чата. Просмотр гайдов/работы/жилья без аккаунта.",
    },
  ),
};

export function getHomeCopy(locale: LocaleCode): HomeCopy {
  return HOME[locale] ?? EN;
}
