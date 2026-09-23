import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import type {
  AiResult,
  ApiResponse,
  AuthResponse,
  ChatMessage,
  Comment,
  Conversation,
  DashboardStats,
  Guide,
  HousingInquiry,
  HousingListing,
  JobApplication,
  JobListing,
  PageResponse,
  Post,
  Report,
  User,
} from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws";

const ACCESS_TOKEN_KEY = "khelp.accessToken";
const REFRESH_TOKEN_KEY = "khelp.refreshToken";

// ------------------------------------------------------- token persistence ---

export const tokenStore = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  set(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// -------------------------------------------------------------- axios setup ---

export const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/** Attaches the JWT to every outgoing request. */
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

/**
 * On a 401 we try the refresh token once, then replay the original request.
 * Concurrent 401s share a single refresh call to avoid a token stampede.
 */
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retried?: boolean };
    const status = error.response?.status;

    if (status !== 401 || original?._retried || !tokenStore.getRefreshToken()) {
      return Promise.reject(error);
    }

    original._retried = true;

    refreshPromise ??= (async () => {
      try {
        const refreshToken = tokenStore.getRefreshToken();
        const { data } = await axios.post<ApiResponse<AuthResponse>>(
          `${API_URL}/api/auth/refresh`,
          { refreshToken },
        );
        tokenStore.set(data.data.accessToken, data.data.refreshToken);
        return data.data.accessToken;
      } catch {
        tokenStore.clear();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    const newToken = await refreshPromise;
    if (!newToken) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
    return http.request(original);
  },
);

/** Unwraps the {@link ApiResponse} envelope, throwing on a failure flag. */
async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise;
  if (!data.success) {
    throw new Error(data.message || "Request failed");
  }
  return data.data;
}

/** Normalizes backend and network errors into a readable message. */
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as
      | { message?: string; data?: Record<string, string> }
      | undefined;

    if (payload?.data && typeof payload.data === "object") {
      const first = Object.values(payload.data)[0];
      if (first) return String(first);
    }
    if (payload?.message) return payload.message;
    if (!error.response) return "Cannot reach the server. Is the backend running?";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

// ------------------------------------------------------------------- API ---

export const api = {
  auth: {
    register: (body: {
      username: string;
      email: string;
      password: string;
      fullName?: string;
      nationality?: string;
      visaType?: string;
    }) => unwrap<AuthResponse>(http.post("/api/auth/register", body)),

    login: (body: { username: string; password: string }) =>
      unwrap<AuthResponse>(http.post("/api/auth/login", body)),

    me: () => unwrap<User>(http.get("/api/auth/me")),

    updateProfile: (body: Partial<User>) =>
      unwrap<User>(http.put("/api/auth/me", body)),
  },

  community: {
    list: (params?: { category?: string; q?: string; page?: number; size?: number }) =>
      unwrap<PageResponse<Post>>(http.get("/api/posts", { params })),

    get: (id: number) => unwrap<Post>(http.get(`/api/posts/${id}`)),

    create: (body: { title: string; content: string; category: string }) =>
      unwrap<Post>(http.post("/api/posts", body)),

    update: (id: number, body: { title: string; content: string; category: string }) =>
      unwrap<Post>(http.put(`/api/posts/${id}`, body)),

    remove: (id: number) => unwrap<void>(http.delete(`/api/posts/${id}`)),

    toggleLike: (id: number) => unwrap<Post>(http.post(`/api/posts/${id}/like`)),

    comments: (id: number) => unwrap<Comment[]>(http.get(`/api/posts/${id}/comments`)),

    addComment: (id: number, body: { content: string; parentId?: number }) =>
      unwrap<Comment>(http.post(`/api/posts/${id}/comments`, body)),

    report: (body: {
      targetType: string;
      targetId: number;
      reason: string;
      details?: string;
    }) => unwrap<Report>(http.post("/api/posts/reports", body)),
  },

  info: {
    list: (params?: {
      category?: string;
      language?: string;
      q?: string;
      page?: number;
      size?: number;
    }) => unwrap<PageResponse<Guide>>(http.get("/api/guides", { params })),

    get: (id: number) => unwrap<Guide>(http.get(`/api/guides/${id}`)),
  },

  jobs: {
    list: (params?: {
      q?: string;
      jobType?: string;
      location?: string;
      visaSponsorship?: boolean;
      koreanRequired?: boolean;
      minSalary?: number;
      page?: number;
      size?: number;
    }) => unwrap<PageResponse<JobListing>>(http.get("/api/jobs", { params })),

    get: (id: number) => unwrap<JobListing>(http.get(`/api/jobs/${id}`)),

    create: (body: Partial<JobListing>) => unwrap<JobListing>(http.post("/api/jobs", body)),

    apply: (id: number, body: { coverLetter?: string; resumeUrl?: string }) =>
      unwrap<JobApplication>(http.post(`/api/jobs/${id}/applications`, body)),

    myApplications: () =>
      unwrap<JobApplication[]>(http.get("/api/jobs/applications/me")),

    applicationsFor: (id: number) =>
      unwrap<JobApplication[]>(http.get(`/api/jobs/${id}/applications`)),

    updateApplication: (applicationId: number, body: { status: string; employerNote?: string }) =>
      unwrap<JobApplication>(http.put(`/api/jobs/applications/${applicationId}`, body)),
  },

  housing: {
    list: (params?: {
      q?: string;
      propertyType?: string;
      city?: string;
      district?: string;
      maxDeposit?: number;
      maxRent?: number;
      minArea?: number;
      furnished?: boolean;
      petFriendly?: boolean;
      page?: number;
      size?: number;
    }) => unwrap<PageResponse<HousingListing>>(http.get("/api/housing", { params })),

    get: (id: number) => unwrap<HousingListing>(http.get(`/api/housing/${id}`)),

    create: (body: Partial<HousingListing>) =>
      unwrap<HousingListing>(http.post("/api/housing", body)),

    inquire: (
      id: number,
      body: { message: string; contactPhone?: string; preferredMoveInDate?: string },
    ) => unwrap<HousingInquiry>(http.post(`/api/housing/${id}/inquiries`, body)),

    myInquiries: () => unwrap<HousingInquiry[]>(http.get("/api/housing/inquiries/me")),

    inquiriesFor: (id: number) =>
      unwrap<HousingInquiry[]>(http.get(`/api/housing/${id}/inquiries`)),

    reply: (inquiryId: number, body: { status: string; ownerReply?: string }) =>
      unwrap<HousingInquiry>(http.put(`/api/housing/inquiries/${inquiryId}`, body)),
  },

  chat: {
    conversations: (params?: { page?: number; size?: number }) =>
      unwrap<PageResponse<Conversation>>(http.get("/api/chat/conversations", { params })),

    start: (body: { recipientId: number; contextType?: string; contextId?: number }) =>
      unwrap<Conversation>(http.post("/api/chat/conversations", body)),

    messages: (id: number, params?: { page?: number; size?: number }) =>
      unwrap<PageResponse<ChatMessage>>(
        http.get(`/api/chat/conversations/${id}/messages`, { params }),
      ),

    send: (id: number, body: { content: string; targetLanguage?: string }) =>
      unwrap<ChatMessage>(http.post(`/api/chat/conversations/${id}/messages`, body)),

    markRead: (id: number) => unwrap<number>(http.post(`/api/chat/conversations/${id}/read`)),
  },

  ai: {
    translate: (body: { text: string; sourceLanguage?: string; targetLanguage: string }) =>
      unwrap<AiResult>(http.post("/api/ai/translate", body)),

    summarize: (body: { text: string; outputLanguage?: string }) =>
      unwrap<AiResult>(http.post("/api/ai/summarize", body)),

    politeMessage: (body: { text: string; recipientType?: string; formality?: string }) =>
      unwrap<AiResult>(http.post("/api/ai/polite-message", body)),
  },

  admin: {
    stats: () => unwrap<DashboardStats>(http.get("/api/admin/stats")),

    users: (params?: { q?: string; page?: number; size?: number }) =>
      unwrap<PageResponse<User>>(http.get("/api/admin/users", { params })),

    moderateUser: (
      id: number,
      body: { enabled?: boolean; suspended?: boolean; role?: string; reason?: string },
    ) => unwrap<User>(http.put(`/api/admin/users/${id}`, body)),

    pendingJobs: (params?: { page?: number; size?: number }) =>
      unwrap<PageResponse<JobListing>>(http.get("/api/admin/jobs/pending", { params })),

    approveJob: (id: number, body: { approved: boolean; note?: string }) =>
      unwrap<void>(http.put(`/api/admin/jobs/${id}/approval`, body)),

    pendingHousing: (params?: { page?: number; size?: number }) =>
      unwrap<PageResponse<HousingListing>>(http.get("/api/admin/housing/pending", { params })),

    approveHousing: (id: number, body: { approved: boolean; note?: string }) =>
      unwrap<void>(http.put(`/api/admin/housing/${id}/approval`, body)),

    reports: (params?: { status?: string; page?: number; size?: number }) =>
      unwrap<PageResponse<Report>>(http.get("/api/admin/reports", { params })),

    resolveReport: (id: number, body: { status: string; resolutionNote?: string }) =>
      unwrap<Report>(http.put(`/api/admin/reports/${id}`, body)),
  },
};

export default api;
