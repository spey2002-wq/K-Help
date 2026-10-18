"use client";

import type { KeyboardEvent, ReactNode } from "react";
import type { JobType } from "@/types";
import { Input, Select } from "@/components/ui/Input";
import { Chip } from "@/components/jobs/Chip";
import {
  DAY_OPTIONS,
  EXPERIENCE_OPTIONS,
  MAX_HOURS_OPTIONS,
  POSTED_WITHIN_OPTIONS,
  SALARY_PERIOD_OPTIONS,
  SHIFT_OPTIONS,
  WEEKDAYS,
  WEEKEND,
  WORK_PERIOD_OPTIONS,
} from "@/lib/job-options";
import { salaryRangeInvalid, toggleDay, toggleItem, type JobFilters } from "@/lib/job-filters";
import { humanize } from "@/lib/utils";

const JOB_TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
  "FREELANCE",
];

/** Monthly / hourly pay shortcuts so people don't have to type amounts. */
const PAY_PRESETS: { label: string; period: string; min: string; max: string }[] = [
  { label: "₩10,320+ / hr (min. wage)", period: "HOURLY", min: "10320", max: "" },
  { label: "₩12,000+ / hr", period: "HOURLY", min: "12000", max: "" },
  { label: "₩15,000+ / hr", period: "HOURLY", min: "15000", max: "" },
  { label: "₩2,500,000+ / month", period: "MONTHLY", min: "2500000", max: "" },
  { label: "₩3,000,000+ / month", period: "MONTHLY", min: "3000000", max: "" },
];

type PerkKey =
  | "mealsProvided"
  | "housingProvided"
  | "insuranceProvided"
  | "transportProvided"
  | "visaSponsorship"
  | "urgent";

const PERKS: { key: PerkKey; label: string }[] = [
  { key: "mealsProvided", label: "Meals provided" },
  { key: "housingProvided", label: "Housing / dormitory" },
  { key: "insuranceProvided", label: "4 major insurances" },
  { key: "transportProvided", label: "Transport pay" },
  { key: "visaSponsorship", label: "Visa sponsorship" },
  { key: "urgent", label: "Hiring now" },
];

interface JobFilterPanelProps {
  filters: JobFilters;
  onChange: (next: JobFilters) => void;
  onApply: () => void;
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function sameDays(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((day) => b.includes(day));
}

/** The full filter list that opens under the quick filters. */
export function JobFilterPanel({ filters, onChange, onApply }: JobFilterPanelProps) {
  const set = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const rangeInvalid = salaryRangeInvalid(filters);

  function applyOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") onApply();
  }

  return (
    <div className="space-y-6 border-t border-slate-100 pt-5">
      <Section title="Job type">
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((type) => (
            <Chip
              key={type}
              selected={filters.jobTypes.includes(type)}
              onClick={() => set("jobTypes", toggleItem(filters.jobTypes, type))}
            >
              {humanize(type)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section
        title="Days I can work"
        hint="Shows jobs that only need you on the days you pick. Jobs with flexible days always appear."
      >
        <div className="flex flex-wrap items-center gap-2">
          {DAY_OPTIONS.map((day) => (
            <Chip
              key={day.value}
              selected={filters.availableDays.includes(day.value)}
              onClick={() => set("availableDays", toggleDay(filters.availableDays, day.value))}
            >
              {day.label}
            </Chip>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" aria-hidden="true" />
          <Chip
            selected={sameDays(filters.availableDays, WEEKDAYS)}
            onClick={() =>
              set("availableDays", sameDays(filters.availableDays, WEEKDAYS) ? [] : [...WEEKDAYS])
            }
          >
            Weekdays
          </Chip>
          <Chip
            selected={sameDays(filters.availableDays, WEEKEND)}
            onClick={() =>
              set("availableDays", sameDays(filters.availableDays, WEEKEND) ? [] : [...WEEKEND])
            }
          >
            Weekends only
          </Chip>
        </div>
      </Section>

      <Section title="How long is the job?">
        <div className="flex flex-wrap gap-2">
          {WORK_PERIOD_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={filters.workPeriods.includes(option.value)}
              onClick={() => set("workPeriods", toggleItem(filters.workPeriods, option.value))}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </Section>

      <Section
        title="Pay"
        hint="Choose Per hour or Per month first, so hourly wages and monthly salaries aren't compared with each other."
      >
        <div className="flex flex-wrap gap-2">
          {PAY_PRESETS.map((preset) => {
            const selected =
              filters.salaryPeriod === preset.period &&
              filters.minSalary === preset.min &&
              filters.maxSalary === preset.max;
            return (
              <Chip
                key={preset.label}
                selected={selected}
                onClick={() =>
                  onChange(
                    selected
                      ? { ...filters, salaryPeriod: "", minSalary: "", maxSalary: "" }
                      : {
                          ...filters,
                          salaryPeriod: preset.period,
                          minSalary: preset.min,
                          maxSalary: preset.max,
                        },
                  )
                }
              >
                {preset.label}
              </Chip>
            );
          })}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Select
            aria-label="Salary period"
            value={filters.salaryPeriod}
            onChange={(event) => set("salaryPeriod", event.target.value)}
          >
            <option value="">Any pay type</option>
            {SALARY_PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            aria-label="Minimum salary in won"
            type="number"
            min={0}
            step={1000}
            inputMode="numeric"
            value={filters.minSalary}
            onChange={(event) => set("minSalary", event.target.value)}
            onKeyDown={applyOnEnter}
            placeholder="Min ₩ (e.g. 10000)"
          />
          <Input
            aria-label="Maximum salary in won"
            type="number"
            min={0}
            step={1000}
            inputMode="numeric"
            value={filters.maxSalary}
            onChange={(event) => set("maxSalary", event.target.value)}
            onKeyDown={applyOnEnter}
            placeholder="Max ₩ (e.g. 15000)"
            error={rangeInvalid ? "Minimum is higher than maximum" : undefined}
          />
        </div>
      </Section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Shift" value={filters.shift} onChange={(event) => set("shift", event.target.value)}>
          <option value="">Any shift</option>
          {SHIFT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          label="Working hours"
          value={filters.maxHoursPerWeek}
          onChange={(event) => set("maxHoursPerWeek", event.target.value)}
        >
          <option value="">Any hours</option>
          {MAX_HOURS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          label="Experience"
          value={filters.experienceLevel}
          onChange={(event) => set("experienceLevel", event.target.value)}
        >
          <option value="">Any experience</option>
          {EXPERIENCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          label="Posted"
          value={filters.postedWithinDays}
          onChange={(event) => set("postedWithinDays", event.target.value)}
        >
          <option value="">Any time</option>
          {POSTED_WITHIN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <Section title="Korean language">
        <div className="flex flex-wrap gap-2">
          <Chip selected={filters.koreanRequired === ""} onClick={() => set("koreanRequired", "")}>
            Any
          </Chip>
          <Chip selected={filters.koreanRequired === "false"} onClick={() => set("koreanRequired", "false")}>
            No Korean needed
          </Chip>
          <Chip selected={filters.koreanRequired === "true"} onClick={() => set("koreanRequired", "true")}>
            Korean required
          </Chip>
        </div>
      </Section>

      <Section title="Benefits & extras">
        <div className="flex flex-wrap gap-2">
          {PERKS.map((perk) => (
            <Chip
              key={perk.key}
              selected={filters[perk.key]}
              onClick={() => onChange({ ...filters, [perk.key]: !filters[perk.key] })}
            >
              {perk.label}
            </Chip>
          ))}
        </div>
      </Section>
    </div>
  );
}
