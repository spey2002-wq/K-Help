"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import api, { errorMessage } from "@/lib/api";
import { isAllowedImage, MAX_UPLOAD_BYTES, prepareImage } from "@/lib/image";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface ProfileHeaderProps {
  user: User;
  onUserUpdated: (user: User) => void;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
}

export function ProfileHeader({ user, onUserUpdated, onError, onNotice }: ProfileHeaderProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user.fullName ?? "",
    nationality: user.nationality ?? "",
    visaType: user.visaType ?? "",
    bio: user.bio ?? "",
  });

  function startEditing() {
    setForm({
      fullName: user.fullName ?? "",
      nationality: user.nationality ?? "",
      visaType: user.visaType ?? "",
      bio: user.bio ?? "",
    });
    setEditing(true);
  }

  async function handleAvatarPicked(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isAllowedImage(file)) {
      onError("Please choose a JPEG, PNG, WebP or GIF image.");
      return;
    }
    setUploading(true);
    try {
      const prepared = await prepareImage(file, 512, 0.88);
      if (prepared.size > MAX_UPLOAD_BYTES) {
        onError("That image is too large. Please choose one under 5 MB.");
        return;
      }
      onUserUpdated(await api.profile.uploadAvatar(prepared));
      onNotice("Profile picture updated.");
    } catch (err) {
      onError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function removeAvatar() {
    if (!window.confirm("Remove your profile picture?")) return;
    setUploading(true);
    try {
      onUserUpdated(await api.profile.deleteAvatar());
      onNotice("Profile picture removed.");
    } catch (err) {
      onError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      onUserUpdated(
        await api.auth.updateProfile({
          fullName: form.fullName.trim(),
          nationality: form.nationality.trim(),
          visaType: form.visaType.trim(),
          bio: form.bio.trim(),
        }),
      );
      setEditing(false);
      onNotice("Profile saved.");
    } catch (err) {
      onError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="card overflow-hidden">
      <div className="h-28 bg-brand-gradient sm:h-36" />

      <div className="px-5 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-wrap items-end justify-between gap-4 sm:-mt-16">
          <div className="relative">
            <Avatar
              user={user}
              className="h-28 w-28 text-3xl ring-4 ring-white sm:h-32 sm:w-32 sm:text-4xl"
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              title="Change profile picture"
              aria-label="Change profile picture"
              className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-soft transition hover:bg-slate-50 disabled:opacity-60"
            >
              {uploading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              )}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarPicked}
            />
          </div>

          {!editing && (
            <div className="flex gap-2">
              {user.profileImageUrl && (
                <Button variant="ghost" size="sm" onClick={removeAvatar} disabled={uploading}>
                  Remove photo
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={startEditing}>
                Edit profile
              </Button>
            </div>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full name"
                value={form.fullName}
                maxLength={120}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              />
              <Input
                label="Nationality"
                value={form.nationality}
                maxLength={60}
                placeholder="e.g. Nepal"
                onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
              />
              <Input
                label="Visa type"
                value={form.visaType}
                maxLength={20}
                placeholder="e.g. D-2, E-9, F-6"
                onChange={(e) => setForm((f) => ({ ...f, visaType: e.target.value }))}
              />
            </div>
            <Textarea
              label="About me"
              value={form.bio}
              maxLength={500}
              placeholder="Tell others a little about yourself, your interests and what you are looking for in Korea."
              hint={`${form.bio.length}/500`}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button type="submit" loading={saving}>
                Save changes
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-slate-900">
              {user.fullName || user.username}
            </h1>
            <p className="text-sm text-slate-500">@{user.username}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {user.nationality && <Badge tone="slate">{user.nationality}</Badge>}
              {user.visaType && <Badge tone="brand">Visa {user.visaType}</Badge>}
              <span className="text-xs text-slate-500">Member since {memberSince}</span>
            </div>

            {user.bio ? (
              <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {user.bio}
              </p>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Add a short intro so other members can get to know you.{" "}
                <button type="button" onClick={startEditing} className="font-medium text-brand-600 hover:underline">
                  Write your bio
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
