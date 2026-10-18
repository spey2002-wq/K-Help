/**
 * Official websites of banks and money services that foreign residents use in
 * Korea. Every link points at the company's own homepage.
 */

export interface FinanceLink {
  /** Name shown in the UI. */
  name: string;
  /** Other spellings that should also become links when they appear in guide text. */
  aliases?: string[];
  url: string;
  note: string;
}

export interface FinanceGroup {
  id: string;
  title: string;
  description: string;
  items: FinanceLink[];
}

export const FINANCE_GROUPS: FinanceGroup[] = [
  {
    id: "major",
    title: "Major banks",
    description: "Large nationwide banks with branches in every city and English support in many.",
    items: [
      {
        name: "KB Kookmin Bank",
        aliases: ["KB Bank"],
        url: "https://www.kbstar.com",
        note: "Korea's largest bank; popular with foreign residents.",
      },
      {
        name: "Shinhan Bank",
        url: "https://www.shinhan.com",
        note: "Foreigner support desks and multilingual service.",
      },
      {
        name: "Woori Bank",
        url: "https://www.wooribank.com",
        note: "Branches near many workplaces and universities.",
      },
      {
        name: "Hana Bank",
        url: "https://www.hanabank.com",
        note: "Strong in overseas remittance and foreign-currency services.",
      },
      {
        name: "NH NongHyup Bank",
        aliases: ["NongHyup Bank", "NH Bank"],
        url: "https://www.nhbank.com",
        note: "Widest branch network, including rural areas.",
      },
      {
        name: "IBK Industrial Bank of Korea",
        aliases: ["IBK Bank", "IBK"],
        url: "https://www.ibk.co.kr",
        note: "State-owned; common for workers at small and medium companies.",
      },
      {
        name: "SC First Bank",
        aliases: ["Standard Chartered Korea"],
        url: "https://www.standardchartered.co.kr",
        note: "International bank with English-friendly service.",
      },
      {
        name: "Citibank Korea",
        aliases: ["Citibank"],
        url: "https://www.citibank.co.kr",
        note: "Global bank, mainly for higher-balance customers.",
      },
    ],
  },
  {
    id: "internet",
    title: "Internet-only banks",
    description: "App-based banks with no branches. You usually need your ARC and a phone in your name.",
    items: [
      {
        name: "KakaoBank",
        url: "https://www.kakaobank.com",
        note: "Opens through the KakaoTalk ecosystem; very easy to use.",
      },
      {
        name: "Toss Bank",
        url: "https://www.tossbank.com",
        note: "Simple accounts and transfers inside the Toss app.",
      },
      {
        name: "K bank",
        aliases: ["K Bank"],
        url: "https://www.kbank.co.kr",
        note: "Internet-only bank with a mobile app.",
      },
    ],
  },
  {
    id: "regional",
    title: "Regional and other banks",
    description: "Local banks are handy if you live outside Seoul.",
    items: [
      { name: "Busan Bank", url: "https://www.busanbank.co.kr", note: "Busan and Gyeongnam region." },
      { name: "iM Bank", aliases: ["Daegu Bank"], url: "https://www.imbank.co.kr", note: "Daegu and Gyeongbuk region." },
      { name: "Gwangju Bank", url: "https://www.kjbank.com", note: "Gwangju and Jeonnam region." },
      { name: "Jeonbuk Bank", url: "https://www.jbbank.co.kr", note: "Jeonbuk region." },
      { name: "Jeju Bank", url: "https://www.jejubank.co.kr", note: "Jeju Island." },
      { name: "Suhyup Bank", url: "https://www.suhyup-bank.com", note: "Fishing communities and coastal areas." },
      {
        name: "Post Office Bank",
        aliases: ["Korea Post bank", "Korea Post Bank"],
        url: "https://www.epostbank.go.kr",
        note: "Post office savings accounts, found in almost every town.",
      },
      { name: "KDB Korea Development Bank", aliases: ["KDB"], url: "https://www.kdb.co.kr", note: "State development bank, mainly for companies." },
    ],
  },
  {
    id: "remittance",
    title: "Sending money abroad",
    description: "Remittance services that are often cheaper than a bank wire. Compare rates before sending.",
    items: [
      { name: "GME Remit", url: "https://www.gmeremit.com", note: "Popular for transfers to South and Southeast Asia." },
      { name: "Sentbe", url: "https://www.sentbe.com", note: "App-based overseas remittance." },
      { name: "WireBarley", url: "https://www.wirebarley.com", note: "App-based overseas remittance." },
      { name: "Hanpass", url: "https://www.hanpass.com", note: "Remittance and mobile services for foreign residents." },
    ],
  },
  {
    id: "payments",
    title: "Payment apps",
    description: "Wallets that connect to your Korean bank account for shops, delivery and transfers.",
    items: [
      { name: "Kakao Pay", aliases: ["KakaoPay"], url: "https://www.kakaopay.com", note: "Pay and send money through KakaoTalk." },
      { name: "Naver Pay", aliases: ["NaverPay"], url: "https://pay.naver.com", note: "Used on Naver Shopping and many online stores." },
      { name: "Toss", url: "https://toss.im", note: "Transfers, payments and account overview in one app." },
    ],
  },
  {
    id: "official",
    title: "Official help",
    description: "Government bodies that protect consumers and help with debt.",
    items: [
      {
        name: "Financial Supervisory Service",
        aliases: ["FSS"],
        url: "https://english.fss.or.kr",
        note: "Report scams and complaints (hotline 1332).",
      },
      {
        name: "Credit Counseling and Recovery Service",
        url: "https://www.ccrs.or.kr",
        note: "Free help if debt becomes hard to manage.",
      },
    ],
  },
];

/** Flat list used to turn names inside guide text into links. */
export const FINANCE_LINKS: FinanceLink[] = FINANCE_GROUPS.flatMap((group) => group.items);
