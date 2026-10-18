"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import api, { errorMessage } from "@/lib/api";
import { isAllowedImage, MAX_UPLOAD_BYTES, prepareImage } from "@/lib/image";
import type { ProfilePhoto } from "@/types";
import { Button } from "@/components/ui/Button";
import { ProtectedImage } from "@/components/ui/Avatar";

const MAX_PHOTOS = 12;

interface PhotosSectionProps {
  photos: ProfilePhoto[];
  onChange: () => Promise<void>;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
}

export function PhotosSection({ photos, onChange, onError, onNotice }: PhotosSectionProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState<ProfilePhoto | null>(null);

  // Close the viewer with Escape.
  useEffect(() => {
    if (!viewing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewing(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  async function handlePicked(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      onError(`You can upload up to ${MAX_PHOTOS} photos. Delete one to add another.`);
      return;
    }
    const batch = files.slice(0, room);
    if (files.length > room) {
      onNotice(`Only ${room} more photo(s) fit, so the first ${room} were used.`);
    }

    setUploading(true);
    let added = 0;
    try {
      for (const file of batch) {
        if (!isAllowedImage(file)) {
          onError(`"${file.name}" is not a JPEG, PNG, WebP or GIF image.`);
          continue;
        }
        const prepared = await prepareImage(file);
        if (prepared.size > MAX_UPLOAD_BYTES) {
          onError(`"${file.name}" is too large. Please choose an image under 5 MB.`);
          continue;
        }
        await api.profile.addPhoto(prepared);
        added += 1;
      }
    } catch (err) {
      onError(errorMessage(err));
    } finally {
      setUploading(false);
      if (added > 0) {
        onNotice(added === 1 ? "Photo added." : `${added} photos added.`);
        await onChange();
      }
    }
  }

  async function handleDelete(photo: ProfilePhoto) {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await api.profile.deletePhoto(photo.id);
      setViewing(null);
      onNotice("Photo deleted.");
      await onChange();
    } catch (err) {
      onError(errorMessage(err));
    }
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Photos</h2>
          <span className="text-xs text-slate-500">
            {photos.length}/{MAX_PHOTOS}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          loading={uploading}
          disabled={photos.length >= MAX_PHOTOS}
          onClick={() => fileInput.current?.click()}
        >
          + Add photos
        </Button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handlePicked}
        />
      </div>

      {photos.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="mt-4 flex w-full flex-col items-center gap-1 rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 hover:border-brand-400 hover:text-brand-700"
        >
          <span className="font-medium">Add your first photo</span>
          <span className="text-xs">JPEG, PNG, WebP or GIF. Large photos are resized automatically.</span>
        </button>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo) => (
            <li key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
              <button
                type="button"
                onClick={() => setViewing(photo)}
                className="h-full w-full"
                aria-label={photo.caption ? `Open photo: ${photo.caption}` : "Open photo"}
              >
                <ProtectedImage
                  src={photo.url}
                  alt={photo.caption || "Profile photo"}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(photo)}
                aria-label="Delete photo"
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {viewing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setViewing(null)}
        >
          <div className="relative max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <ProtectedImage
              src={viewing.url}
              alt={viewing.caption || "Profile photo"}
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />
            <div className="absolute right-2 top-2 flex gap-2">
              <button
                type="button"
                onClick={() => void handleDelete(viewing)}
                className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setViewing(null)}
                aria-label="Close"
                className="grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
