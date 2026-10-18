"use client";

import { useState, type FormEvent } from "react";
import api, { errorMessage } from "@/lib/api";
import type { Experience, ExperienceInput, ExperienceKind } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";

const KIND_LABELS: Record<ExperienceKind, string> = {
  WORK: "Work",
  EDUCATION: "Education",
  OTHER: "Other",
};

const KIND_STYLES: Record<ExperienceKind, string> = {
  WORK: "bg-indigo-100 text-indigo-700",
  EDUCATION: "bg-emerald-100 text-emerald-700",
  OTHER: "bg-amber-100 text-amber-700",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats an ISO date (yyyy-mm-dd) as "Mar 2024" without timezone shifts. */
function monthYear(iso?: string | null): string {
  if (!iso) return "";
  const [year, month] = iso.split("-");
  const index = Number(month) - 1;
  return index >= 0 && index < 12 ? `${MONTHS[index]} ${year}` : year;
}

function dateRange(e: Experience): string {
  const start = monthYear(e.startDate);
  const end = e.current ? "Present" : monthYear(e.endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end;
}

interface FormState {
  kind: ExperienceKind;
  title: string;
  organization: string;
  location: string;
  start: string; // yyyy-mm
  end: string; // yyyy-mm
  current: boolean;
  description: string;
}

const EMPTY_FORM: FormState = {
  kind: "WORK",
  title: "",
  organization: "",
  location: "",
  start: "",
  end: "",
  current: false,
  description: "",
};

function toForm(e: Experience): FormState {
  return {
    kind: e.kind,
    title: e.title,
    organization: e.organization ?? "",
    location: e.location ?? "",
    start: e.startDate?.slice(0, 7) ?? "",
    end: e.endDate?.slice(0, 7) ?? "",
    current: e.current,
    description: e.description ?? "",
  };
}

function toInput(form: FormState): ExperienceInput {
  return {
    kind: form.kind,
    title: form.title.trim(),
    organization: form.organization.trim() || undefined,
    location: form.location.trim() || undefined,
    startDate: form.start ? `${form.start}-01` : undefined,
    endDate: !form.current && form.end ? `${form.end}-01` : undefined,
    current: form.current,
    description: form.description.trim() || undefined,
  };
}

interface ExperienceSectionProps {
  experiences: Experience[];
  onChange: () => Promise<void>;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
}

export function ExperienceSection({ experiences, onChange, onError, onNotice }: ExperienceSectionProps) {
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function openNew() {
    setForm(EMPTY_FORM);
    setFormError("");
    setEditingId("new");
  }

  function openEdit(experience: Experience) {
    setForm(toForm(experience));
    setFormError("");
    setEditingId(experience.id);
  }

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!form.title.trim()) {
      setFormError("Please enter a title.");
      return;
    }
    if (!form.current && form.start && form.end && form.end < form.start) {
      setFormError("The end date cannot be before the start date.");
      return;
    }

    setSaving(true);
    try {
      const body = toInput(form);
      if (editingId === "new") {
        await api.profile.addExperience(body);
        onNotice("Experience added.");
      } else if (editingId !== null) {
        await api.profile.updateExperience(editingId, body);
        onNotice("Experience updated.");
      }
      setEditingId(null);
      await onChange();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(experience: Experience) {
    if (!window.confirm(`Delete "${experience.title}"?`)) return;
    try {
      await api.profile.deleteExperience(experience.id);
      onNotice("Experience deleted.");
      await onChange();
    } catch (err) {
      onError(errorMessage(err));
    }
  }

  const formView = (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Type" value={form.kind} onChange={(e) => update("kind", e.target.value as ExperienceKind)}>
          {(Object.keys(KIND_LABELS) as ExperienceKind[]).map((kind) => (
            <option key={kind} value={kind}>
              {KIND_LABELS[kind]}
            </option>
          ))}
        </Select>
        <Input
          label={form.kind === "EDUCATION" ? "Course or degree *" : "Title *"}
          value={form.title}
          maxLength={120}
          placeholder={form.kind === "EDUCATION" ? "e.g. Korean Language Course" : "e.g. Barista"}
          onChange={(e) => update("title", e.target.value)}
        />
        <Input
          label={form.kind === "EDUCATION" ? "School" : "Company or organization"}
          value={form.organization}
          maxLength={120}
          onChange={(e) => update("organization", e.target.value)}
        />
        <Input
          label="Location"
          value={form.location}
          maxLength={120}
          placeholder="e.g. Seoul"
          onChange={(e) => update("location", e.target.value)}
        />
        <Input
          label="Start"
          type="month"
          value={form.start}
          onChange={(e) => update("start", e.target.value)}
        />
        <Input
          label="End"
          type="month"
          value={form.current ? "" : form.end}
          disabled={form.current}
          onChange={(e) => update("end", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.current}
          onChange={(e) => update("current", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600"
        />
        I currently do this
      </label>

      <Textarea
        label="Description"
        value={form.description}
        maxLength={1000}
        className="[&_textarea]:min-h-[90px]"
        placeholder="What did you do? What did you learn?"
        hint={`${form.description.length}/1000`}
        onChange={(e) => update("description", e.target.value)}
      />

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={saving}>
          {editingId === "new" ? "Add experience" : "Save changes"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Experience</h2>
        {editingId === null && (
          <Button variant="outline" size="sm" onClick={openNew}>
            + Add experience
          </Button>
        )}
      </div>

      {experiences.length === 0 && editingId === null && (
        <p className="mt-3 text-sm text-slate-500">
          Share your work, study or volunteer history. It helps employers and other members trust
          your profile.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {editingId === "new" && formView}

        {experiences.map((experience) =>
          editingId === experience.id ? (
            <div key={experience.id}>{formView}</div>
          ) : (
            <article key={experience.id} className="flex gap-3">
              <span
                className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold ${KIND_STYLES[experience.kind]}`}
                title={KIND_LABELS[experience.kind]}
              >
                {KIND_LABELS[experience.kind].charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{experience.title}</h3>
                    {(experience.organization || experience.location) && (
                      <p className="text-sm text-slate-600">
                        {[experience.organization, experience.location].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {dateRange(experience) && (
                      <p className="text-xs text-slate-500">{dateRange(experience)}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(experience)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(experience)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {experience.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {experience.description}
                  </p>
                )}
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
