"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import api, { errorMessage } from "@/lib/api";
import type { ExperienceLevel, JobShift, JobType, SalaryPeriod } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/Feedback";
import { humanize } from "@/lib/utils";
import { KOREA_LOCATIONS } from "@/lib/locations";
import { EXPERIENCE_OPTIONS, SALARY_PERIOD_OPTIONS, SHIFT_OPTIONS } from "@/lib/job-options";

const JOB_TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
  "FREELANCE",
];

export default function NewJobPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    jobType: "FULL_TIME" as JobType,
    location: "",
    area: "",
    salaryPeriod: "MONTHLY" as SalaryPeriod,
    salaryMin: "",
    salaryMax: "",
    shift: "" as JobShift | "",
    hoursPerWeek: "",
    experienceLevel: "" as ExperienceLevel | "",
    contactEmail: "",
    deadline: "",
    visaSponsorship: false,
    koreanRequired: true,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  const salaryRangeInvalid =
    form.salaryMin !== "" && form.salaryMax !== "" && Number(form.salaryMin) > Number(form.salaryMax);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (salaryRangeInvalid) {
      setError("Salary minimum cannot be higher than the maximum.");
      return;
    }
    setSubmitting(true);

    try {
      const created = await api.jobs.create({
        title: form.title.trim(),
        company: form.company.trim(),
        description: form.description.trim(),
        requirements: form.requirements.trim() || undefined,
        jobType: form.jobType,
        location:
          [form.location, form.area.trim()].filter(Boolean).join(", ") || undefined,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        salaryPeriod: form.salaryMin || form.salaryMax ? form.salaryPeriod : undefined,
        shift: form.shift || undefined,
        hoursPerWeek: form.hoursPerWeek ? Number(form.hoursPerWeek) : undefined,
        experienceLevel: form.experienceLevel || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
        deadline: form.deadline || undefined,
        visaSponsorship: form.visaSponsorship,
        koreanRequired: form.koreanRequired,
      });
      router.push(`/jobs/${created.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Post a job</h1>
        <p className="mt-1 text-sm text-slate-600">
          Listings are reviewed by an administrator before they appear publicly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        {error && <ErrorState message={error} />}

        <Input
          label="Job title"
          required
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="English-Speaking Cafe Barista"
        />

        <Input
          label="Company"
          required
          value={form.company}
          onChange={(event) => update("company", event.target.value)}
          placeholder="Seoul Brew House"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Job type"
            value={form.jobType}
            onChange={(event) => update("jobType", event.target.value as JobType)}
          >
            {JOB_TYPES.map((value) => (
              <option key={value} value={value}>
                {humanize(value)}
              </option>
            ))}
          </Select>
          <Select
            label="City"
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
          >
            <option value="">Select a city</option>
            {KOREA_LOCATIONS.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Area (optional)"
          value={form.area}
          onChange={(event) => update("area", event.target.value)}
          placeholder="Hongdae, Gangnam, Haeundae..."
          hint="Shown after the city, e.g. Seoul, Hongdae"
        />

        <Textarea
          label="Description"
          required
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="Describe the role, schedule and working conditions..."
        />

        <Textarea
          label="Requirements"
          value={form.requirements}
          onChange={(event) => update("requirements", event.target.value)}
          placeholder="Language level, experience, certifications..."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Salary is paid"
            value={form.salaryPeriod}
            onChange={(event) => update("salaryPeriod", event.target.value as SalaryPeriod)}
          >
            {SALARY_PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            label="Salary minimum (KRW)"
            type="number"
            min={0}
            value={form.salaryMin}
            onChange={(event) => update("salaryMin", event.target.value)}
            placeholder="10000"
          />
          <Input
            label="Salary maximum (KRW)"
            type="number"
            min={0}
            value={form.salaryMax}
            onChange={(event) => update("salaryMax", event.target.value)}
            placeholder="12000"
            error={salaryRangeInvalid ? "Minimum is higher than maximum" : undefined}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Shift"
            value={form.shift}
            onChange={(event) => update("shift", event.target.value as JobShift | "")}
          >
            <option value="">Not specified</option>
            {SHIFT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            label="Hours per week"
            type="number"
            min={1}
            max={80}
            value={form.hoursPerWeek}
            onChange={(event) => update("hoursPerWeek", event.target.value)}
            placeholder="20"
          />
          <Select
            label="Experience"
            value={form.experienceLevel}
            onChange={(event) =>
              update("experienceLevel", event.target.value as ExperienceLevel | "")
            }
          >
            <option value="">Not specified</option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Contact email"
            type="email"
            value={form.contactEmail}
            onChange={(event) => update("contactEmail", event.target.value)}
            placeholder="hire@company.com"
          />
          <Input
            label="Application deadline"
            type="date"
            value={form.deadline}
            onChange={(event) => update("deadline", event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={form.visaSponsorship}
              onChange={(event) => update("visaSponsorship", event.target.checked)}
            />
            Visa sponsorship available
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={form.koreanRequired}
              onChange={(event) => update("koreanRequired", event.target.checked)}
            />
            Korean language required
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Submit for approval
          </Button>
        </div>
      </form>
    </div>
  );
}
