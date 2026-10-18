import type {
  ExperienceLevel,
  JobCategory,
  JobShift,
  JobSortOption,
  SalaryPeriod,
  WorkDay,
  WorkPeriod,
} from "@/types";

interface Option<T extends string> {
  value: T;
  label: string;
}

export const SHIFT_OPTIONS: Option<JobShift>[] = [
  { value: "DAY", label: "Day (morning - afternoon)" },
  { value: "EVENING", label: "Evening" },
  { value: "NIGHT", label: "Night" },
  { value: "ROTATING", label: "Rotating shifts" },
  { value: "FLEXIBLE", label: "Flexible hours" },
];

export const SALARY_PERIOD_OPTIONS: Option<SalaryPeriod>[] = [
  { value: "HOURLY", label: "Per hour" },
  { value: "MONTHLY", label: "Per month" },
  { value: "YEARLY", label: "Per year" },
];

export const EXPERIENCE_OPTIONS: Option<ExperienceLevel>[] = [
  { value: "NO_EXPERIENCE", label: "No experience needed" },
  { value: "JUNIOR", label: "Junior (1-2 years)" },
  { value: "MID", label: "Mid-level (3-5 years)" },
  { value: "SENIOR", label: "Senior (5+ years)" },
];

/** "Up to N hours per week" choices. 20 matches the usual D-2 student work limit. */
export const MAX_HOURS_OPTIONS: Option<string>[] = [
  { value: "10", label: "Up to 10 hrs / week" },
  { value: "15", label: "Up to 15 hrs / week" },
  { value: "20", label: "Up to 20 hrs / week" },
  { value: "30", label: "Up to 30 hrs / week" },
  { value: "40", label: "Up to 40 hrs / week" },
];

export const POSTED_WITHIN_OPTIONS: Option<string>[] = [
  { value: "1", label: "Last 24 hours" },
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

const SHIFT_SHORT: Record<JobShift, string> = {
  DAY: "Day shift",
  EVENING: "Evening shift",
  NIGHT: "Night shift",
  ROTATING: "Rotating shifts",
  FLEXIBLE: "Flexible hours",
};

const EXPERIENCE_SHORT: Record<ExperienceLevel, string> = {
  NO_EXPERIENCE: "No experience needed",
  JUNIOR: "Junior",
  MID: "Mid-level",
  SENIOR: "Senior",
};

export function shiftLabel(shift?: JobShift | null): string {
  return shift ? SHIFT_SHORT[shift] : "";
}

export function experienceLabel(level?: ExperienceLevel | null): string {
  return level ? EXPERIENCE_SHORT[level] : "";
}

export const CATEGORY_OPTIONS: Option<JobCategory>[] = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "CAFE", label: "Cafe" },
  { value: "CONVENIENCE_STORE", label: "Convenience store" },
  { value: "RETAIL", label: "Retail & sales" },
  { value: "DELIVERY_DRIVING", label: "Delivery & driving" },
  { value: "EDUCATION", label: "Teaching & tutoring" },
  { value: "OFFICE_ADMIN", label: "Office & admin" },
  { value: "IT_DESIGN", label: "IT & design" },
  { value: "WAREHOUSE_FACTORY", label: "Warehouse & factory" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "BEAUTY_FITNESS", label: "Beauty & fitness" },
  { value: "CLEANING", label: "Cleaning" },
  { value: "HOTEL_TOURISM", label: "Hotel & tourism" },
  { value: "HEALTHCARE", label: "Healthcare & care" },
  { value: "TRANSLATION", label: "Translation" },
  { value: "EVENT_PROMOTION", label: "Events & promotion" },
  { value: "OTHER", label: "Other" },
];

export const WORK_PERIOD_OPTIONS: Option<WorkPeriod>[] = [
  { value: "ONE_DAY", label: "One day" },
  { value: "UNDER_1_MONTH", label: "Under 1 month" },
  { value: "ONE_TO_3_MONTHS", label: "1-3 months" },
  { value: "THREE_TO_6_MONTHS", label: "3-6 months" },
  { value: "OVER_6_MONTHS", label: "6 months +" },
];

export const DAY_OPTIONS: Option<WorkDay>[] = [
  { value: "MON", label: "Mon" },
  { value: "TUE", label: "Tue" },
  { value: "WED", label: "Wed" },
  { value: "THU", label: "Thu" },
  { value: "FRI", label: "Fri" },
  { value: "SAT", label: "Sat" },
  { value: "SUN", label: "Sun" },
];

export const WEEKDAYS: WorkDay[] = ["MON", "TUE", "WED", "THU", "FRI"];
export const WEEKEND: WorkDay[] = ["SAT", "SUN"];

export const SORT_OPTIONS: Option<JobSortOption>[] = [
  { value: "NEWEST", label: "Newest first" },
  { value: "MOST_VIEWED", label: "Most viewed" },
  { value: "DEADLINE_SOON", label: "Deadline soon" },
  { value: "PAY_HIGH", label: "Highest pay" },
  { value: "PAY_LOW", label: "Lowest pay" },
];

/** Tap-to-search ideas shown under the search box. */
export const POPULAR_SEARCHES: string[] = [
  "Cafe",
  "English teacher",
  "Weekend",
  "Night shift",
  "Delivery",
  "Hongdae",
  "Interpreter",
  "Hotel",
];

export function categoryLabel(category?: JobCategory | null): string {
  return CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? "";
}

export function workPeriodLabel(period?: WorkPeriod | null): string {
  return WORK_PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? "";
}

/** "Mon - Fri", "Sat, Sun" or "" when the days are flexible. */
export function formatWorkDays(days?: WorkDay[] | null): string {
  if (!days || days.length === 0) return "";
  const order = DAY_OPTIONS.map((option) => option.value);
  const sorted = [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const label = (day: WorkDay) => DAY_OPTIONS.find((option) => option.value === day)?.label ?? day;

  const first = order.indexOf(sorted[0]);
  const isRun = sorted.every((day, index) => order.indexOf(day) === first + index);
  if (sorted.length >= 3 && isRun) {
    return `${label(sorted[0])} - ${label(sorted[sorted.length - 1])}`;
  }
  return sorted.map(label).join(", ");
}
/** National minimum hourly wage for 2026, in KRW. */
export const MIN_HOURLY_WAGE_KRW = 10320;
