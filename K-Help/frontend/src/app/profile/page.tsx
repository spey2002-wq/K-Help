"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Profile, User } from "@/types";
import { ErrorState, LoadingState } from "@/components/ui/Feedback";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { PhotosSection } from "@/components/profile/PhotosSection";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, refreshUser } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoadError("");
    try {
      setProfile(await api.profile.get());
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    void load();
  }, [authLoading, isAuthenticated, router, load]);

  // Success messages disappear on their own.
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const showError = useCallback((message: string) => {
    setNotice("");
    setError(message);
  }, []);

  const showNotice = useCallback((message: string) => {
    setError("");
    setNotice(message);
  }, []);

  /** Keeps the page and the navbar avatar in sync after a profile or picture change. */
  const handleUserUpdated = useCallback(
    (user: User) => {
      setProfile((previous) => (previous ? { ...previous, user } : previous));
      void refreshUser();
    },
    [refreshUser],
  );

  if (authLoading || (loading && !loadError)) {
    return <LoadingState message="Loading your profile..." />;
  }
  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {(error || notice) && (
        <div
          role={error ? "alert" : "status"}
          className={
            error
              ? "flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          }
        >
          <span>{error || notice}</span>
          {error && (
            <button
              type="button"
              onClick={() => setError("")}
              className="font-medium underline underline-offset-2"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      <ProfileHeader
        user={profile.user}
        onUserUpdated={handleUserUpdated}
        onError={showError}
        onNotice={showNotice}
      />

      <SkillsSection
        skills={profile.skills}
        onChange={(skills) => setProfile((previous) => (previous ? { ...previous, skills } : previous))}
        onError={showError}
      />

      <ExperienceSection
        experiences={profile.experiences}
        onChange={load}
        onError={showError}
        onNotice={showNotice}
      />

      <PhotosSection
        photos={profile.photos}
        onChange={load}
        onError={showError}
        onNotice={showNotice}
      />
    </div>
  );
}
