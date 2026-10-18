"use client";

import { useState, type FormEvent } from "react";
import api, { errorMessage } from "@/lib/api";

const MAX_SKILLS = 20;
const MAX_LENGTH = 40;

const SUGGESTIONS = [
  "Korean",
  "English",
  "Cooking",
  "Driving",
  "Customer service",
  "Teaching",
  "Cleaning",
  "Computer skills",
  "Translation",
  "Sales",
];

interface SkillsSectionProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  onError: (message: string) => void;
}

export function SkillsSection({ skills, onChange, onError }: SkillsSectionProps) {
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const has = (name: string) => skills.some((s) => s.toLowerCase() === name.toLowerCase());

  async function save(next: string[]) {
    setSaving(true);
    try {
      onChange(await api.profile.setSkills(next));
    } catch (err) {
      onError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function add(raw: string) {
    const name = raw.trim().replace(/\s+/g, " ");
    if (!name) return;
    if (name.length > MAX_LENGTH) {
      onError(`A skill can be at most ${MAX_LENGTH} characters.`);
      return;
    }
    if (has(name)) {
      onError(`"${name}" is already in your skills.`);
      return;
    }
    if (skills.length >= MAX_SKILLS) {
      onError(`You can add up to ${MAX_SKILLS} skills.`);
      return;
    }
    setInput("");
    await save([...skills, name]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void add(input);
  }

  const suggestions = SUGGESTIONS.filter((s) => !has(s));

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
        <span className="text-xs text-slate-500">
          {skills.length}/{MAX_SKILLS}
        </span>
      </div>

      {skills.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          Add skills like languages, jobs you can do or tools you know. Employers and friends can
          see what you are good at.
        </p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1 text-sm font-medium text-brand-700"
            >
              {skill}
              <button
                type="button"
                aria-label={`Remove ${skill}`}
                disabled={saving}
                onClick={() => save(skills.filter((s) => s !== skill))}
                className="grid h-5 w-5 place-items-center rounded-full text-brand-600 hover:bg-brand-100 disabled:opacity-50"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          className="input flex-1"
          value={input}
          maxLength={MAX_LENGTH}
          placeholder="Type a skill and press Enter"
          aria-label="Add a skill"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={saving || !input.trim()}
          className="rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {suggestions.length > 0 && skills.length < MAX_SKILLS && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Quick add:</span>
          {suggestions.slice(0, 6).map((name) => (
            <button
              key={name}
              type="button"
              disabled={saving}
              onClick={() => void add(name)}
              className="rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-xs text-slate-600 hover:border-brand-400 hover:text-brand-700 disabled:opacity-50"
            >
              + {name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
