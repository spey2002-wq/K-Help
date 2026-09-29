"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { HousingListing, PageResponse, PropertyType } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import { formatKrw, humanize, timeAgo } from "@/lib/utils";

const PROPERTY_TYPES: PropertyType[] = [
  "ONE_ROOM",
  "TWO_ROOM",
  "APARTMENT",
  "VILLA",
  "OFFICETEL",
  "STUDIO",
  "SHARE_HOUSE",
  "DORMITORY",
  "JEONSE",
  "WOLSE",
];

export default function HousingPage() {
  const { isAuthenticated } = useAuth();

  const [listings, setListings] = useState<PageResponse<HousingListing> | null>(null);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    q: "",
    propertyType: "",
    city: "",
    maxDeposit: "",
    maxRent: "",
    furnished: false,
    petFriendly: false,
  });
  const [applied, setApplied] = useState(filters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setListings(
        await api.housing.list({
          page,
          size: 9,
          q: applied.q || undefined,
          propertyType: applied.propertyType || undefined,
          city: applied.city || undefined,
          maxDeposit: applied.maxDeposit ? Number(applied.maxDeposit) : undefined,
          maxRent: applied.maxRent ? Number(applied.maxRent) : undefined,
          furnished: applied.furnished || undefined,
          petFriendly: applied.petFriendly || undefined,
        }),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Housing Finder</h1>
          <p className="mt-1 text-sm text-slate-600">
            Compare rooms and apartments by deposit, monthly rent and location.
          </p>
        </div>
        {isAuthenticated && (
          <Link href="/housing/new">
            <Button>List a property</Button>
          </Link>
        )}
      </div>

      <div className="card space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Keyword"
            value={filters.q}
            onChange={(event) => setFilters({ ...filters, q: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setPage(0);
                setApplied(filters);
              }
            }}
            placeholder="Title or description"
          />
          <Select
            label="Property type"
            value={filters.propertyType}
            onChange={(event) => setFilters({ ...filters, propertyType: event.target.value })}
          >
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((value) => (
              <option key={value} value={value}>
                {humanize(value)}
              </option>
            ))}
          </Select>
          <Input
            label="City"
            value={filters.city}
            onChange={(event) => setFilters({ ...filters, city: event.target.value })}
            placeholder="Seoul"
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPage(0);
                setApplied(filters);
              }}
            >
              Apply filters
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Max deposit (KRW)"
            type="number"
            value={filters.maxDeposit}
            onChange={(event) => setFilters({ ...filters, maxDeposit: event.target.value })}
            placeholder="5000000"
          />
          <Input
            label="Max monthly rent (KRW)"
            type="number"
            value={filters.maxRent}
            onChange={(event) => setFilters({ ...filters, maxRent: event.target.value })}
            placeholder="600000"
          />
          <div className="flex items-end gap-4 text-sm text-slate-700 sm:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={filters.furnished}
                onChange={(event) => {
                  const next = { ...filters, furnished: event.target.checked };
                  setFilters(next);
                  setPage(0);
                  setApplied(next);
                }}
              />
              Furnished
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={filters.petFriendly}
                onChange={(event) => {
                  const next = { ...filters, petFriendly: event.target.checked };
                  setFilters(next);
                  setPage(0);
                  setApplied(next);
                }}
              />
              Pet friendly
            </label>
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState message="Loading properties..." />
      ) : !listings || listings.content.length === 0 ? (
        <EmptyState
          title="No properties match your filters"
          description="Try increasing your deposit or rent limits."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.content.map((listing) => (
              <article key={listing.id} className="card card-hover flex flex-col overflow-hidden">
                <div className="grid h-36 place-items-center bg-brand-gradient">
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/20 text-2xl font-bold text-white backdrop-blur">
                    {listing.propertyType.charAt(0)}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="brand">{humanize(listing.propertyType)}</Badge>
                    {listing.furnished && <Badge tone="green">Furnished</Badge>}
                    {listing.status !== "AVAILABLE" && (
                      <Badge tone={statusTone(listing.status)}>{humanize(listing.status)}</Badge>
                    )}
                  </div>

                  <Link
                    href={`/housing/${listing.id}`}
                    className="mt-3 font-semibold text-slate-900 hover:text-brand-700"
                  >
                    {listing.title}
                  </Link>

                  <p className="mt-1 text-sm text-slate-600">
                    {[listing.city, listing.district, listing.neighborhood]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}
                  </p>

                  <div className="mt-4 space-y-1 text-sm">
                    <p className="text-slate-700">
                      <span className="text-slate-500">Deposit:</span>{" "}
                      <span className="font-medium">{formatKrw(listing.depositAmount)}</span>
                    </p>
                    <p className="text-slate-700">
                      <span className="text-slate-500">Monthly:</span>{" "}
                      <span className="font-medium">{formatKrw(listing.monthlyRent)}</span>
                    </p>
                    {listing.areaSqm && (
                      <p className="text-slate-700">
                        <span className="text-slate-500">Area:</span> {listing.areaSqm} m²
                      </p>
                    )}
                  </div>

                  <p className="mt-4 flex-1 text-xs text-slate-500">
                    Listed {timeAgo(listing.createdAt)}
                  </p>

                  <Link href={`/housing/${listing.id}`} className="mt-3">
                    <Button variant="outline" size="sm" className="w-full">
                      View details
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <Pagination page={listings.page} totalPages={listings.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
