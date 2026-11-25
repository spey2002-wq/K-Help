"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { HousingListing } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ErrorState, LoadingState } from "@/components/ui/Feedback";
import { formatKrw, humanize, timeAgo } from "@/lib/utils";
import { OwnerInbox } from "@/components/listings/OwnerInbox";

export default function HousingDetailPage() {
  const params = useParams<{ id: string }>();
  const listingId = Number(params.id);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLocale();

  const [listing, setListing] = useState<HousingListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiry, setInquiry] = useState({
    message: "",
    contactPhone: "",
    preferredMoveInDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setListing(await api.housing.get(listingId));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    if (!Number.isNaN(listingId)) void load();
  }, [load, listingId]);

  async function handleInquiry() {
    if (!inquiry.message.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      await api.housing.inquire(listingId, {
        message: inquiry.message.trim(),
        contactPhone: inquiry.contactPhone || undefined,
        preferredMoveInDate: inquiry.preferredMoveInDate || undefined,
      });
      setNotice(t("detail.inquirySent"));
      setInquiryOpen(false);
      setInquiry({ message: "", contactPhone: "", preferredMoveInDate: "" });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState message={t("ui.loadingProperty")} />;
  if (error && !listing) return <ErrorState message={error} onRetry={load} />;
  if (!listing) return null;

  const details = [
    { label: t("detail.deposit"), value: formatKrw(listing.depositAmount) },
    { label: t("detail.monthlyRent"), value: formatKrw(listing.monthlyRent) },
    { label: t("detail.maintenance"), value: formatKrw(listing.maintenanceFee) },
    { label: t("detail.area"), value: listing.areaSqm ? `${listing.areaSqm} m²` : "-" },
    { label: t("detail.rooms"), value: listing.roomCount ?? "-" },
    { label: t("detail.bathrooms"), value: listing.bathroomCount ?? "-" },
    { label: t("detail.floor"), value: listing.floorNumber ?? "-" },
    {
      label: t("detail.availableFrom"),
      value: listing.availableFrom
        ? new Date(listing.availableFrom).toLocaleDateString()
        : t("detail.immediately"),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/housing" className="text-sm text-brand-600 hover:underline">
        {t("detail.backHousing")}
      </Link>

      {error && <ErrorState message={error} />}
      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      <article className="card overflow-hidden">
        <div className="grid h-52 place-items-center bg-brand-gradient">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/20 text-4xl font-bold text-white backdrop-blur">
            {listing.propertyType.charAt(0)}
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">{humanize(listing.propertyType)}</Badge>
            {listing.furnished && <Badge tone="green">{t("housing.furnished")}</Badge>}
            {listing.petFriendly && <Badge tone="purple">{t("housing.pets")}</Badge>}
            {listing.utilitiesIncluded && <Badge tone="amber">{t("detail.utilities")}</Badge>}
            <Badge tone={statusTone(listing.status)}>{humanize(listing.status)}</Badge>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">{listing.title}</h1>

          <p className="mt-2 text-slate-600">
            {[listing.addressLine, listing.neighborhood, listing.district, listing.city]
              .filter(Boolean)
              .join(", ")}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {t("detail.postedBy")} {listing.listedByUsername} · {timeAgo(listing.createdAt)} ·{" "}
            {listing.viewCount} {t("ui.views")}
          </p>

          <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {details.map((detail) => (
              <div key={detail.label}>
                <p className="text-xs uppercase tracking-wide text-slate-500">{detail.label}</p>
                <p className="mt-1 font-semibold text-slate-900">{detail.value}</p>
              </div>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="font-semibold text-slate-900">{t("detail.description")}</h2>
            <div className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-700">
              {listing.description}
            </div>
          </section>

          <div className="mt-8 border-t border-slate-200 pt-6">
            {user && (user.id === listing.listedById || isAdmin) ? (
              <p className="text-sm text-slate-600">{t("detail.yourListing")}</p>
            ) : isAuthenticated ? (
              listing.status === "AVAILABLE" ? (
                <Button onClick={() => setInquiryOpen((open) => !open)}>
                  {inquiryOpen ? t("page.cancel") : t("detail.sendInquiry")}
                </Button>
              ) : (
                <p className="text-sm text-slate-500">{t("detail.notOpen")}</p>
              )
            ) : (
              <Link href="/login">
                <Button>{t("detail.signInToInquire")}</Button>
              </Link>
            )}
          </div>
        </div>
      </article>

      {user && (user.id === listing.listedById || isAdmin) && (
        <OwnerInbox kind="housing" listingId={listing.id} />
      )}

      {inquiryOpen && (
        <div className="card space-y-4 p-6">
          <h2 className="font-semibold text-slate-900">{t("detail.sendInquiry")}</h2>
          <Textarea
            label={t("detail.message")}
            value={inquiry.message}
            onChange={(event) => setInquiry({ ...inquiry, message: event.target.value })}
            placeholder="Introduce yourself and ask about the property..."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("detail.contactPhone")}
              value={inquiry.contactPhone}
              onChange={(event) => setInquiry({ ...inquiry, contactPhone: event.target.value })}
              placeholder="010-0000-0000"
            />
            <Input
              label={t("detail.moveInDate")}
              type="date"
              value={inquiry.preferredMoveInDate}
              onChange={(event) =>
                setInquiry({ ...inquiry, preferredMoveInDate: event.target.value })
              }
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleInquiry} loading={submitting}>
              {t("detail.sendInquiry")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
