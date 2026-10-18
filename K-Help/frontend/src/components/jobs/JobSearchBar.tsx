"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import api from "@/lib/api";
import { POPULAR_SEARCHES } from "@/lib/job-options";
import { KOREA_LOCATIONS } from "@/lib/locations";

const RECENT_KEY = "khelp.jobs.recentSearches";
const MAX_RECENT = 6;

function loadRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

function saveRecent(items: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  } catch {
    // Storage can be unavailable (private mode); recent searches just won't persist.
  }
}

interface JobSearchBarProps {
  query: string;
  location: string;
  onQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  /** Runs the search. `nextQuery` is passed when a suggestion was picked. */
  onSearch: (nextQuery?: string) => void;
}

/**
 * Search box with type-ahead suggestions, recent searches and popular
 * keywords, plus the city picker.
 */
export function JobSearchBar({
  query,
  location,
  onQueryChange,
  onLocationChange,
  onSearch,
}: JobSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlight, setHighlight] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  // Close the dropdown when clicking elsewhere.
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Debounced type-ahead; stale responses are ignored.
  useEffect(() => {
    const text = query.trim();
    if (!open || text.length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      api.jobs
        .suggestions(text)
        .then((items) => {
          if (!cancelled) setSuggestions(items);
        })
        .catch(() => {
          if (!cancelled) setSuggestions([]);
        });
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, open]);

  const typing = query.trim().length >= 2;
  const items = typing ? suggestions : recent;

  function remember(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())]
      .slice(0, MAX_RECENT);
    setRecent(next);
    saveRecent(next);
  }

  function submit(text?: string) {
    const value = text ?? query;
    if (text !== undefined) onQueryChange(text);
    remember(value);
    setOpen(false);
    setHighlight(-1);
    onSearch(text);
  }

  function clearRecent() {
    setRecent([]);
    saveRecent([]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && items.length > 0) {
      event.preventDefault();
      setOpen(true);
      setHighlight((index) => (index + 1) % items.length);
    } else if (event.key === "ArrowUp" && items.length > 0) {
      event.preventDefault();
      setHighlight((index) => (index <= 0 ? items.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      submit(highlight >= 0 ? items[highlight] : undefined);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div ref={wrapperRef} className="relative flex-1">
          <input
            type="search"
            role="combobox"
            className="input pl-10"
            placeholder="Search jobs, companies or areas"
            aria-label="Search jobs"
            aria-autocomplete="list"
            aria-controls="job-search-suggestions"
            aria-expanded={open && items.length > 0}
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value);
              setHighlight(-1);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" strokeLinecap="round" />
          </svg>

          {open && items.length > 0 && (
            <div
              id="job-search-suggestions"
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            >
              <div className="flex items-center justify-between px-4 pb-1 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {typing ? "Suggestions" : "Recent searches"}
                </p>
                {!typing && (
                  <button
                    type="button"
                    className="text-xs text-slate-500 hover:text-slate-700"
                    onClick={clearRecent}
                  >
                    Clear
                  </button>
                )}
              </div>
              <ul className="pb-2">
                {items.map((item, index) => (
                  <li key={item} role="option" aria-selected={index === highlight}>
                    <button
                      type="button"
                      className={`block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 ${
                        index === highlight ? "bg-slate-100" : ""
                      }`}
                      onClick={() => submit(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <select
          className="input sm:w-56"
          aria-label="City"
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
        >
          <option value="">All of South Korea</option>
          {KOREA_LOCATIONS.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="rounded-xl bg-brand-gradient px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          onClick={() => submit()}
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">Popular:</span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-200"
            onClick={() => submit(term)}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
