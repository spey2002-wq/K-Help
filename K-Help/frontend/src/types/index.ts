/**
 * Shared TypeScript contracts mirroring the Spring Boot DTOs.
 * Keeping them in one file makes API drift obvious at compile time.
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type Role = "USER" | "ADMIN" | "MODERATOR";

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  nationality?: string;
  visaType?: string;
  preferredLanguage?: string;
  profileImageUrl?: string;
  bio?: string;
  role: Role;
  enabled: boolean;
  suspended: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  nationality?: string;
  visaType?: string;
  preferredLanguage?: string;
}

// ------------------------------------------------------------- community ---

export type PostCategory =
  | "GENERAL"
  | "VISA_IMMIGRATION"
  | "JOBS"
  | "HOUSING"
  | "HEALTHCARE"
  | "BANKING"
  | "EDUCATION"
  | "LANGUAGE_EXCHANGE"
  | "MARKETPLACE"
  | "EMERGENCY";

export interface Post {
  id: number;
  title: string;
  content?: string;
  category: PostCategory;
  authorId: number;
  authorUsername: string;
  authorFullName?: string;
  authorProfileImageUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  pinned: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  authorUsername: string;
  authorFullName?: string;
  authorProfileImageUrl?: string;
  parentId?: number;
  replies: Comment[];
  createdAt: string;
}

// ------------------------------------------------------------------ info ---

export type GuideCategory =
  | "VISA_IMMIGRATION"
  | "HEALTHCARE"
  | "BANKING"
  | "HOUSING"
  | "EMPLOYMENT"
  | "EDUCATION"
  | "EMERGENCY"
  | "TRANSPORTATION"
  | "DAILY_LIFE";

export interface Guide {
  id: number;
  title: string;
  summary: string;
  content?: string;
  category: GuideCategory;
  languageCode: string;
  sourceUrl?: string;
  viewCount: number;
  updatedAt: string;
}

// ------------------------------------------------------------------ jobs ---

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY"
  | "FREELANCE";

export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";

export interface JobListing {
  id: number;
  title: string;
  company: string;
  description?: string;
  requirements?: string;
  jobType: JobType;
  location?: string;
  visaSponsorship: boolean;
  koreanRequired: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  contactEmail?: string;
  deadline?: string;
  postedById: number;
  postedByUsername: string;
  status: ListingStatus;
  viewCount: number;
  createdAt: string;
}

export type ApplicationStatus =
  | "SUBMITTED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface JobApplication {
  id: number;
  jobListingId: number;
  jobTitle: string;
  company: string;
  applicantId: number;
  applicantUsername: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  employerNote?: string;
  createdAt: string;
  updatedAt: string;
}

// --------------------------------------------------------------- housing ---

export type PropertyType =
  | "ONE_ROOM"
  | "TWO_ROOM"
  | "APARTMENT"
  | "VILLA"
  | "OFFICETEL"
  | "STUDIO"
  | "SHARE_HOUSE"
  | "DORMITORY"
  | "JEONSE"
  | "WOLSE";

export type PropertyStatus = "PENDING" | "AVAILABLE" | "RESERVED" | "RENTED" | "REJECTED";

export interface HousingListing {
  id: number;
  title: string;
  description?: string;
  propertyType: PropertyType;
  city?: string;
  district?: string;
  neighborhood?: string;
  addressLine?: string;
  depositAmount?: number;
  monthlyRent?: number;
  maintenanceFee?: number;
  currency?: string;
  areaSqm?: number;
  roomCount?: number;
  bathroomCount?: number;
  floorNumber?: number;
  availableFrom?: string;
  furnished: boolean;
  petFriendly: boolean;
  utilitiesIncluded: boolean;
  imageUrls: string[];
  contactPhone?: string;
  contactEmail?: string;
  listedById: number;
  listedByUsername: string;
  status: PropertyStatus;
  viewCount: number;
  createdAt: string;
}

export interface HousingInquiry {
  id: number;
  housingListingId: number;
  listingTitle: string;
  inquirerId: number;
  inquirerUsername: string;
  message: string;
  contactPhone?: string;
  preferredMoveInDate?: string;
  status: "NEW" | "CONTACTED" | "VIEWING_SCHEDULED" | "COMPLETED" | "DECLINED";
  ownerReply?: string;
  createdAt: string;
}

// ------------------------------------------------------------------ chat ---

export interface Conversation {
  id: number;
  otherParticipantId: number;
  otherParticipantUsername: string;
  otherParticipantFullName?: string;
  otherParticipantProfileImageUrl?: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount: number;
  contextType?: string;
  contextId?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderUsername: string;
  content: string;
  translatedContent?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  readAt?: string;
  createdAt: string;
}

// -------------------------------------------------------------------- ai ---

export interface AiResult {
  result: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  model: string;
  mock: boolean;
  generatedAt: string;
}

// ----------------------------------------------------------------- admin ---

export interface DashboardStats {
  totalUsers: number;
  suspendedUsers: number;
  totalPosts: number;
  publishedGuides: number;
  pendingJobs: number;
  approvedJobs: number;
  pendingHousing: number;
  availableHousing: number;
  pendingReports: number;
}

export interface Report {
  id: number;
  targetType: "POST" | "COMMENT" | "JOB" | "HOUSING" | "USER";
  targetId: number;
  reason: string;
  details?: string;
  reporterId: number;
  reporterUsername: string;
  status: "PENDING" | "REVIEWING" | "RESOLVED" | "REJECTED";
  resolutionNote?: string;
  createdAt: string;
}
