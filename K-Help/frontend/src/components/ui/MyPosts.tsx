"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { humanize, timeAgo } from "@/lib/utils";

type Kind = "jobs" | "housing";

interface Item {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

const LABELS: Record<string, string> = {
  PENDING: "Pending approval",
  APPROVED: "Live",
  AVAILABLE: "Live",
};

/**
 * Shows the signed-in member the listings they posted themselves, including
 * ones that are still waiting for an administrator to approve them (those are
 * not yet visible in the public list below).
 */
export function MyPosts({ kind }: { kind: Kind }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    let cancelled = false;
    const request = kind === "jobs" ? api.jobs.mine() : api.housing.mine();
    request
      .then((data) => {
        if (!cancelled) setItems(data as Item[]);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, kind]);

  if (!isAuthenticated || items.length === 0) return null;

  const base = kind === "jobs" ? "/jobs" : "/housing";
  const hasPending = items.some((item) => item.status === "PENDING");

  return (
    <section className="card space-y-3 border-brand-100 p-4" aria-label="Your posts">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Your posts</h2>
        {hasPending && (
          <p className="mt-1 text-xs text-slate-600">
            New posts are checked by an administrator first. Pending posts are visible only to
            you until they are approved.
          </p>
        )}
      </div>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div className="min-w-0">
              <Link
                href={`${base}/${item.id}`}
                className="font-medium text-slate-900 hover:text-brand-700"
              >
                {item.title}
              </Link>
              <p className="text-xs text-slate-500">Posted {timeAgo(item.createdAt)}</p>
            </div>
            <Badge tone={statusTone(item.status)}>{LABELS[item.status] ?? humanize(item.status)}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}