"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import api, { errorMessage } from "@/lib/api";
import type { PropertyType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/Feedback";
import { humanize } from "@/lib/utils";

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

export default function NewHousingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "ONE_ROOM" as PropertyType,
    city: "",
    district: "",
    neighborhood: "",
    addressLine: "",
    depositAmount: "",
    monthlyRent: "",
    maintenanceFee: "",
    areaSqm: "",
    roomCount: "",
    bathroomCount: "",
    floorNumber: "",
    availableFrom: "",
    contactPhone: "",
    contactEmail: "",
    furnished: false,
    petFriendly: false,
    utilitiesIncluded: false,
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
      const created = await api.housing.create({
        title: form.title.trim(),
        description: form.description.trim(),
        propertyType: form.propertyType,
        city: form.city.trim() || undefined,
        district: form.district.trim() || undefined,
        neighborhood: form.neighborhood.trim() || undefined,
        addressLine: form.addressLine.trim() || undefined,
        depositAmount: form.depositAmount ? Number(form.depositAmount) : undefined,
        monthlyRent: form.monthlyRent ? Number(form.monthlyRent) : undefined,
        maintenanceFee: form.maintenanceFee ? Number(form.maintenanceFee) : undefined,
        areaSqm: form.areaSqm ? Number(form.areaSqm) : undefined,
        roomCount: form.roomCount ? Number(form.roomCount) : undefined,
        bathroomCount: form.bathroomCount ? Number(form.bathroomCount) : undefined,
        floorNumber: form.floorNumber ? Number(form.floorNumber) : undefined,
        availableFrom: form.availableFrom || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
        furnished: form.furnished,
        petFriendly: form.petFriendly,
        utilitiesIncluded: form.utilitiesIncluded,
      });
      router.push(`/housing/${created.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">List a property</h1>
        <p className="mt-1 text-sm text-slate-600">
          Listings are reviewed by an administrator before they appear publicly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        {error && <ErrorState message={error} />}

        <Input
          label="Listing title"
          required
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Cozy one-room near Hongik University"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Property type"
            value={form.propertyType}
            onChange={(event) => update("propertyType", event.target.value as PropertyType)}
          >
            {PROPERTY_TYPES.map((value) => (
              <option key={value} value={value}>
                {humanize(value)}
              </option>
            ))}
          </Select>
          <Input
            label="Available from"
            type="date"
            value={form.availableFrom}
            onChange={(event) => update("availableFrom", event.target.value)}
          />
        </div>

        <Textarea
          label="Description"
          required
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="Describe the property, nearby transport and included appliances..."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="City"
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            placeholder="Seoul"
          />
          <Input
            label="District"
            value={form.district}
            onChange={(event) => update("district", event.target.value)}
            placeholder="Mapo-gu"
          />
          <Input
            label="Neighborhood"
            value={form.neighborhood}
            onChange={(event) => update("neighborhood", event.target.value)}
            placeholder="Seogyo-dong"
          />
        </div>

        <Input
          label="Street address"
          value={form.addressLine}
          onChange={(event) => update("addressLine", event.target.value)}
          placeholder="Building, street, postal code"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Deposit (KRW)"
            type="number"
            value={form.depositAmount}
            onChange={(event) => update("depositAmount", event.target.value)}
            placeholder="5000000"
          />
          <Input
            label="Monthly rent (KRW)"
            type="number"
            value={form.monthlyRent}
            onChange={(event) => update("monthlyRent", event.target.value)}
            placeholder="550000"
          />
          <Input
            label="Maintenance fee (KRW)"
            type="number"
            value={form.maintenanceFee}
            onChange={(event) => update("maintenanceFee", event.target.value)}
            placeholder="70000"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Input
            label="Area (m²)"
            type="number"
            step="0.1"
            value={form.areaSqm}
            onChange={(event) => update("areaSqm", event.target.value)}
          />
          <Input
            label="Rooms"
            type="number"
            value={form.roomCount}
            onChange={(event) => update("roomCount", event.target.value)}
          />
          <Input
            label="Bathrooms"
            type="number"
            value={form.bathroomCount}
            onChange={(event) => update("bathroomCount", event.target.value)}
          />
          <Input
            label="Floor"
            type="number"
            value={form.floorNumber}
            onChange={(event) => update("floorNumber", event.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Contact phone"
            value={form.contactPhone}
            onChange={(event) => update("contactPhone", event.target.value)}
            placeholder="010-0000-0000"
          />
          <Input
            label="Contact email"
            type="email"
            value={form.contactEmail}
            onChange={(event) => update("contactEmail", event.target.value)}
            placeholder="owner@example.com"
          />
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={form.furnished}
              onChange={(event) => update("furnished", event.target.checked)}
            />
            Furnished
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={form.petFriendly}
              onChange={(event) => update("petFriendly", event.target.checked)}
            />
            Pet friendly
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={form.utilitiesIncluded}
              onChange={(event) => update("utilitiesIncluded", event.target.checked)}
            />
            Utilities included
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
