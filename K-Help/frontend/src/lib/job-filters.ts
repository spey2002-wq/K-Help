import type {
  JobCategory,
  JobSortOption,
  JobType,
  WorkDay,
  WorkPeriod,
} from "@/types";
import {
  CATEGORY_OPTIONS,
  DAY_OPTIONS,
  EXPERIENCE_OPTIONS,
  MAX_HOURS_OPTIONS,
  POSTED_WITHIN_OPTIONS,
  SALARY_PERIOD_OPTIONS,
  SHIFT_OPTIONS,
  WORK_PERIOD_OPTIONS,
  formatWorkDays,
} from "@/lib/job-options";
import { formatKrw, humanize } from "@/lib/utils";

/** Everything the job board can filter on. Empty string / empty array = "any". */
export interface JobFilters {
  q: string;
  location: string;
  jobTypes: JobType[];
  categories: JobCategory[];
  workPeriods: WorkPeriod[];
  /** Days the seeker can work. Empty = no restriction. */
  availableDays: WorkDay[];
  salaryPeriod: string;
  minSalary: string;
  maxSalary: string;
  shift: string;
  maxHoursPerWeek: string;
  experienceLevel: string;
  postedWithinDays: string;
  /** "" = any, "true" = Korean required, "false" = no Korean needed. */
  koreanRequired: "" | "true" | "false";
  visaSponsorship: boolean;
  mealsProvided: boolean;
  housingProvided: boolean;
  insuranceProvided: boolean;
  transportProvided: boolean;
  urgent: boolean;
  sort: JobSortOption;
}

export const EMPTY_FILTERS: JobFilters = {
  q: "",
  location: "",
  jobTypes: [],
  categories: [],
  workPeriods: [],
  availableDays: [],
  salaryPeriod: "",
  minSalary: "",
  maxSalary: "",
  shift: "",
  maxHoursPerWeek: "",
  experienceLevel: "",
  postedWithinDays: "",
  koreanRequired: "",
  visaSponsorship: false,
  mealsProvided: false,
  housingProvided: false,
  insuranceProvided: false,
  transportProvided: false,
  urgent: false,
  sort: "NEWEST",
};

/** Filters that live in the "Filters" panel (everything except search, city, category and sort). */
const PANEL_KEYS: (keyof JobFilters)[] = [
  "jobTypes",
  "workPeriods",
  "availableDays",
  "salaryPeriod",
  "minSalary",
  "maxSalary",
  "shift",
  "maxHoursPerWeek",
  "experienceLevel",
  "postedWithinDays",
  "koreanRequired",
  "visaSponsorship",
  "mealsProvided",
  "housingProvided",
  "insuranceProvided",
  "transportProvided",
  "urgent",
];

function isSet(filters: JobFilters, key: keyof JobFilters): boolean {
  const value = filters[key];
  return Array.isArray(value) ? value.length > 0 : value !== EMPTY_FILTERS[key];
}

/** Number of panel filters currently in use (shown on the Filters button). */
export function countPanelFilters(filters: JobFilters): number {
  return PANEL_KEYS.filter((key) => isSet(filters, key)).length;
}

/** True when anything other than the sort order differs from the defaults. */
export function hasAnyFilter(filters: JobFilters): boolean {
  return (
    filters.q.trim() !== "" ||
    filters.location !== "" ||
    filters.categories.length > 0 ||
    countPanelFilters(filters) > 0
  );
}

export function salaryRangeInvalid(filters: JobFilters): boolean {
  return (
    filters.minSalary !== "" &&
    filters.maxSalary !== "" &&
    Number(filters.minSalary) > Number(filters.maxSalary)
  );
}

/** Converts the UI state into API query parameters, dropping unused ones. */
export function toQueryParams(filters: JobFilters) {
  const csv = (values: string[]) => (values.length > 0 ? values.join(",") : undefined);
  return {
    q: filters.q.trim() || undefined,
    location: filters.location || undefined,
    jobType: csv(filters.jobTypes),
    category: csv(filters.categories),
    workPeriod: csv(filters.workPeriods),
    availableDays: csv(filters.availableDays),
    salaryPeriod: filters.salaryPeriod || undefined,
    minSalary: filters.minSalary ? Number(filters.minSalary) : undefined,
    maxSalary: filters.maxSalary ? Number(filters.maxSalary) : undefined,
    shift: filters.shift || undefined,
    maxHoursPerWeek: filters.maxHoursPerWeek ? Number(filters.maxHoursPerWeek) : undefined,
    experienceLevel: filters.experienceLevel || undefined,
    postedWithinDays: filters.postedWithinDays ? Number(filters.postedWithinDays) : undefined,
    koreanRequired: filters.koreanRequired === "" ? undefined : filters.koreanRequired === "true",
    visaSponsorship: filters.visaSponsorship || undefined,
    mealsProvided: filters.mealsProvided || undefined,
    housingProvided: filters.housingProvided || undefined,
    insuranceProvided: filters.insuranceProvided || undefined,
    transportProvided: filters.transportProvided || undefined,
    urgent: filters.urgent || undefined,
    sort: filters.sort,
  };
}

export interface ActiveFilterChip {
  key: string;
  label: string;
  /** Returns the filters with this one removed. */
  remove: (filters: JobFilters) => JobFilters;
}

function labelOf<T extends string>(options: { value: T; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? humanize(value);
}

/** One removable chip per active filter, shown under the search bar. */
export function activeFilterChips(f: JobFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (f.q.trim()) {
    chips.push({ key: "q", label: `"${f.q.trim()}"`, remove: (x) => ({ ...x, q: "" }) });
  }
  if (f.location) {
    chips.push({ key: "location", label: f.location, remove: (x) => ({ ...x, location: "" }) });
  }
  for (const value of f.categories) {
    chips.push({
      key: `category-${value}`,
      label: labelOf(CATEGORY_OPTIONS, value),
      remove: (x) => ({ ...x, categories: x.categories.filter((item) => item !== value) }),
    });
  }
  for (const value of f.jobTypes) {
    chips.push({
      key: `type-${value}`,
      label: humanize(value),
      remove: (x) => ({ ...x, jobTypes: x.jobTypes.filter((item) => item !== value) }),
    });
  }
  for (const value of f.workPeriods) {
    chips.push({
      key: `period-${value}`,
      label: labelOf(WORK_PERIOD_OPTIONS, value),
      remove: (x) => ({ ...x, workPeriods: x.workPeriods.filter((item) => item !== value) }),
    });
  }
  if (f.availableDays.length > 0) {
    chips.push({
      key: "days",
      label: `Can work ${formatWorkDays(f.availableDays)}`,
      remove: (x) => ({ ...x, availableDays: [] }),
    });
  }
  if (f.minSalary || f.maxSalary) {
    const unit = f.salaryPeriod ? ` ${labelOf(SALARY_PERIOD_OPTIONS, f.salaryPeriod).toLowerCase()}` : "";
    const range =
      f.minSalary && f.maxSalary
        ? `${formatKrw(Number(f.minSalary))} - ${formatKrw(Number(f.maxSalary))}`
        : f.minSalary
          ? `from ${formatKrw(Number(f.minSalary))}`
          : `up to ${formatKrw(Number(f.maxSalary))}`;
    chips.push({
      key: "salary",
      label: `${range}${unit}`,
      remove: (x) => ({ ...x, minSalary: "", maxSalary: "", salaryPeriod: "" }),
    });
  } else if (f.salaryPeriod) {
    chips.push({
      key: "salaryPeriod",
      label: labelOf(SALARY_PERIOD_OPTIONS, f.salaryPeriod),
      remove: (x) => ({ ...x, salaryPeriod: "" }),
    });
  }
  if (f.shift) {
    chips.push({ key: "shift", label: labelOf(SHIFT_OPTIONS, f.shift), remove: (x) => ({ ...x, shift: "" }) });
  }
  if (f.maxHoursPerWeek) {
    chips.push({
      key: "hours",
      label: labelOf(MAX_HOURS_OPTIONS, f.maxHoursPerWeek),
      remove: (x) => ({ ...x, maxHoursPerWeek: "" }),
    });
  }
  if (f.experienceLevel) {
    chips.push({
      key: "experience",
      label: labelOf(EXPERIENCE_OPTIONS, f.experienceLevel),
      remove: (x) => ({ ...x, experienceLevel: "" }),
    });
  }
  if (f.postedWithinDays) {
    chips.push({
      key: "posted",
      label: labelOf(POSTED_WITHIN_OPTIONS, f.postedWithinDays),
      remove: (x) => ({ ...x, postedWithinDays: "" }),
    });
  }
  if (f.koreanRequired) {
    chips.push({
      key: "korean",
      label: f.koreanRequired === "false" ? "No Korean needed" : "Korean required",
      remove: (x) => ({ ...x, koreanRequired: "" }),
    });
  }

  const toggles: [keyof JobFilters, string][] = [
    ["visaSponsorship", "Visa sponsorship"],
    ["mealsProvided", "Meals provided"],
    ["housingProvided", "Housing provided"],
    ["insuranceProvided", "Insurance"],
    ["transportProvided", "Transport pay"],
    ["urgent", "Hiring now"],
  ];
  for (const [key, label] of toggles) {
    if (f[key] === true) {
      chips.push({ key, label, remove: (x) => ({ ...x, [key]: false }) });
    }
  }

  return chips;
}

/** Day buttons use this to keep the DAY_OPTIONS order when toggling. */
export function toggleDay(days: WorkDay[], day: WorkDay): WorkDay[] {
  const next = days.includes(day) ? days.filter((item) => item !== day) : [...days, day];
  return DAY_OPTIONS.map((option) => option.value).filter((value) => next.includes(value));
}

export function toggleItem<T>(items: T[], item: T): T[] {
  return items.includes(item) ? items.filter((existing) => existing !== item) : [...items, item];
}
