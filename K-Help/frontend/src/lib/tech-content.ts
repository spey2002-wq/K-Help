export interface TechItem {
  name: string;
  /** What it does in K-Help, in plain words. */
  role: string;
}

export interface TechLayer {
  id: string;
  icon: string;
  title: string;
  summary: string;
  items: TechItem[];
  /** Where to look in the project folder. */
  where?: string;
}

export const ARCHITECTURE: { icon: string; title: string; detail: string }[] = [
  { icon: "📱", title: "You", detail: "Phone, installed app or browser" },
  { icon: "🖥️", title: "Website", detail: "Next.js on Vercel" },
  { icon: "⚙️", title: "API", detail: "Spring Boot on Render" },
  { icon: "🗄️", title: "Data", detail: "PostgreSQL and Redis" },
];

export const ALSO_CONNECTS: string[] = [
  "WebSocket (STOMP) for live chat",
  "AI provider (OpenRouter) for translation",
  "Docker for local setup and deployment",
];

export const LAYERS: TechLayer[] = [
  {
    id: "frontend",
    icon: "🖥️",
    title: "Frontend",
    summary:
      "Everything you see and tap. It runs in your browser, calls the API for data, and can be installed like an app.",
    where: "frontend/",
    items: [
      { name: "Next.js 15 (App Router)", role: "The web framework. Every page (home, jobs, housing, guides, chat) is a route." },
      { name: "React 19", role: "Builds the screens from reusable components such as buttons, cards and filters." },
      { name: "TypeScript", role: "JavaScript with types, so mistakes like a wrong field name are caught before the app runs." },
      { name: "Tailwind CSS", role: "Styling with small utility classes. The colors and spacing come from one shared theme." },
      { name: "Axios", role: "Sends requests to the API, attaches the login token, and refreshes it when it expires." },
      { name: "STOMP + SockJS", role: "The live connection used by chat for instant messages and read receipts." },
      { name: "PWA (manifest + service worker)", role: "Lets people install K-Help to the home screen and shows an offline page without internet." },
      { name: "ESLint", role: "Checks the code for mistakes and accessibility problems." },
    ],
  },
  {
    id: "backend",
    icon: "⚙️",
    title: "Backend",
    summary:
      "The server that holds the rules. It checks who you are, validates what you send, and reads and writes the database.",
    where: "backend/",
    items: [
      { name: "Java 21", role: "The programming language of the server." },
      { name: "Spring Boot 3.3", role: "The framework that wires everything together and exposes the REST API." },
      { name: "Spring Web (REST)", role: "Controllers for auth, community, guides, jobs, housing, chat, AI, profile and admin." },
      { name: "Spring Data JPA + Hibernate", role: "Reads and writes database rows as Java objects. Job search filters use JPA Specifications." },
      { name: "Bean Validation", role: "Rejects bad input (empty titles, wrong values) with a clear 400 error." },
      { name: "Spring WebSocket", role: "STOMP messaging for real-time chat." },
      { name: "springdoc OpenAPI", role: "Generates interactive API documentation (Swagger UI)." },
      { name: "Maven", role: "Builds the project, runs the tests and packages one runnable file." },
    ],
  },
  {
    id: "database",
    icon: "🗄️",
    title: "Database",
    summary:
      "Where the permanent information lives: accounts, guides, jobs, housing, posts, messages and profile photos.",
    where: "backend/src/main/resources/db/migration/",
    items: [
      { name: "PostgreSQL 16", role: "The main relational database." },
      { name: "Flyway migrations (V1 to V10)", role: "Versioned SQL files that build and change the schema in order, the same on every machine." },
      { name: "Hibernate validate mode", role: "The app refuses to start if the code and the database disagree, which prevents silent drift." },
      { name: "BYTEA photo storage", role: "Profile photos are stored in the database (5 MB limit, real file type checked) so they survive restarts." },
    ],
  },
  {
    id: "cache",
    icon: "⚡",
    title: "Cache",
    summary: "A fast memory layer in front of the database for data that is read often and rarely changes.",
    where: "GuideService.java",
    items: [
      { name: "Redis 7", role: "Stores the living guides in memory so repeat visits are quick." },
      { name: "Spring Cache", role: "The @Cacheable annotation saves results automatically and expires them after a short time." },
    ],
  },
  {
    id: "security",
    icon: "🔐",
    title: "Security",
    summary: "How K-Help knows who you are and keeps data safe.",
    where: "backend/.../security/",
    items: [
      { name: "JWT login", role: "After login you get a short-lived access token (15 minutes) and a refresh token (7 days). The server keeps no session." },
      { name: "BCrypt", role: "Passwords are stored only as salted hashes, never as plain text." },
      { name: "Roles", role: "USER and ADMIN. Admin pages and actions are blocked for everyone else." },
      { name: "CORS allow-list", role: "Only the real website address may call the API from a browser." },
      { name: "Upload checks", role: "Photos are limited in size and the real file type is checked, not just the file name." },
      { name: "Secrets in environment variables", role: "In production the JWT secret and AI key are set on the host (Render) as environment variables, not stored in Git." },
    ],
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI assistant",
    summary: "Translation, summaries and polite Korean messages.",
    where: "backend/.../ai/",
    items: [
      { name: "OpenRouter (OpenAI-compatible API)", role: "The language model that does the work." },
      { name: "Backend proxy", role: "The browser talks to our API, which calls the AI. This keeps the secret key off the user's device." },
      { name: "Three modes", role: "Translate, summarize and polite message, in 8 languages." },
      { name: "Mock mode", role: "A built-in fallback so the page still works when no API key is set." },
    ],
  },
  {
    id: "devops",
    icon: "🚀",
    title: "Deployment and tooling",
    summary: "How the project runs on a laptop and on the internet.",
    where: "docker-compose.yml, render.yaml",
    items: [
      { name: "Docker + Docker Compose", role: "Starts PostgreSQL, Redis, the API and the website with one command for local development." },
      { name: "Render", role: "Hosts the Spring Boot API, the PostgreSQL database and Redis, defined in a single render.yaml file." },
      { name: "Vercel", role: "Hosts the Next.js website with fast global delivery and HTTPS." },
      { name: "Git + GitHub", role: "Version control. Pushing to the main branch triggers a new deployment." },
      { name: "Automated tests", role: "Maven tests cover job search filters, work-day logic and the image type check." },
    ],
  },
];

export const REQUEST_FLOW: { step: string; detail: string }[] = [
  { step: "1. You choose filters", detail: "On the Jobs page you pick Cafe, weekends and 20 hours a week." },
  { step: "2. The page calls the API", detail: "Axios sends GET /api/jobs?category=CAFE&availableDays=SAT,SUN&maxHoursPerWeek=20 with your token." },
  { step: "3. Security checks the request", detail: "The JWT filter confirms who you are, and CORS confirms the website is allowed." },
  { step: "4. The service builds a query", detail: "JobService turns the filters into a database query using JPA Specifications." },
  { step: "5. PostgreSQL answers", detail: "Only matching rows come back, sorted and paged." },
  { step: "6. The page updates", detail: "The JSON is turned into cards, and the filter chips show what is active." },
];

export const FOLDERS: { path: string; note: string }[] = [
  { path: "frontend/src/app", note: "Pages (routes) such as /jobs, /housing, /info" },
  { path: "frontend/src/components", note: "Reusable UI: navbar, filters, cards, bottom tab bar" },
  { path: "frontend/src/lib", note: "API client, login state, filter options, site content" },
  { path: "backend/.../auth, community, info, job, housing", note: "One package per feature: controller, service, repository, entity" },
  { path: "backend/.../chat, ai, profile, admin", note: "Real-time chat, AI proxy, member profile, moderation" },
  { path: "backend/.../security, config, common", note: "JWT, CORS and WebSocket setup, shared helpers and error handling" },
  { path: "backend/src/main/resources/db/migration", note: "Flyway SQL files V1 to V10" },
  { path: "docker-compose.yml, render.yaml", note: "Local stack and cloud blueprint" },
];
