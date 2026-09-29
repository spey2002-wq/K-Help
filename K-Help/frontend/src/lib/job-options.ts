import type { ExperienceLevel, JobShift, SalaryPeriod } from "@/types";

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
