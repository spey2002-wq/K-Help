"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Badge, statusTone } from "@/components/ui/Badge";
import { humanize, timeAgo } from "@/lib/utils";

interface Entry {
  id: number;
  title: string;
  createdAt: string;
  status?: string;
  category?: string;
}

interface Group {
  key: string;
  label: string;
  href: string;
  emptyText: string;
  items: Entry[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending approval",
  APPROVED: "Live",
  AVAILABLE: "Live",
};

/** Everything the member has posted on K-Help: community posts, jobs and housing. */
export function MyPostsSection() {
  const [groups, setGroups] = useState<Group[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const safe = <T,>(request: Promise<T[]>) => request.catch(() => [] as T[]);
    Promise.all([safe(api.community.mine()), safe(api.jobs.mine()), safe(api.housing.mine())]).then(
      ([posts, jobs, housing]) => {
        if (cancelled) return;
        setGroups([
          {
            key: "community",
            label: "Community posts",
            href: "/community",
            emptyText: "You have not written any community posts yet.",
            items: posts.map((p) => ({
              id: p.id,
              title: p.title,
              createdAt: p.createdAt,
              category: p.category,
            })),
          },
          {
            key: "jobs",
            label: "Job listings",
            href: "/jobs",
            emptyText: "You have not posted any jobs yet.",
            items: jobs.map((j) => ({
              id: j.id,
              title: j.title,
              createdAt: j.createdAt,
              status: j.status,
            })),
          },
          {
            key: "housing",
            label: "Housing listings",
            href: "/housing",
            emptyText: "You have not listed any property yet.",
            items: housing.map((h) => ({
              id: h.id,
              title: h.title,
              createdAt: h.createdAt,
              status: h.status,
            })),
          },
        ]);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="card p-5 sm:p-6" aria-label="My posts">
      <h2 className="text-lg font-semibold text-slate-900">My posts</h2>
      <p className="mt-1 text-sm text-slate-600">
        What you have posted on K-Help. Jobs and housing listings are checked by an
        administrator before everyone can see them.
      </p>

      {!groups ? (
        <p className="mt-4 text-sm text-slate-500">Loading your posts...</p>
      ) : (
        <div className="mt-4 space-y-5">
          {groups.map((group) => (
            <div key={group.key}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                {group.label}
                <Badge tone="slate">{group.items.length}</Badge>
              </h3>
              {group.items.length === 0 ? (
                <p className="mt-1 text-sm text-slate-500">{group.emptyText}</p>
              ) : (
                <ul className="mt-1 divide-y divide-slate-100">
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-2"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`${group.href}/${item.id}`}
                          className="font-medium text-slate-900 hover:text-brand-700"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-slate-500">Posted {timeAgo(item.createdAt)}</p>
                      </div>
                      {item.status ? (
                        <Badge tone={statusTone(item.status)}>
                          {STATUS_LABELS[item.status] ?? humanize(item.status)}
                        </Badge>
                      ) : item.category ? (
                        <Badge tone="brand">{humanize(item.category)}</Badge>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}