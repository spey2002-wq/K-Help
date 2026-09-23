"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import api, { errorMessage } from "@/lib/api";
import type { JobType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/Feedback";
import { humanize } from "@/lib/utils";

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
    salaryMin: "",
    salaryMax: "",
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const created = await api.jobs.create({
        title: form.title.trim(),
        company: form.company.trim(),
        description: form.description.trim(),
        requirements: form.requirements.trim() || undefined,
        jobType: form.jobType,
        location: form.location.trim() || undefined,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
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
          <Input
            label="Location"
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="Seoul, Hongdae"
          />
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Salary minimum (KRW)"
            type="number"
            value={form.salaryMin}
            onChange={(event) => update("salaryMin", event.target.value)}
            placeholder="10000"
          />
          <Input
            label="Salary maximum (KRW)"
            type="number"
            value={form.salaryMax}
            onChange={(event) => update("salaryMax", event.target.value)}
            placeholder="12000"
          />
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
