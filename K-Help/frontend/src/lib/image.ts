/**
 * Client-side image preparation so phone photos (often 5-10 MB) upload quickly and
 * stay under the server's 5 MB limit.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function isAllowedImage(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image"));
    };
    img.src = url;
  });
}

/**
 * Scales the image down so its longest side is at most {@code maxSide} px and re-encodes it as
 * JPEG. Animated GIFs and images that cannot be decoded are returned unchanged.
 */
export async function prepareImage(file: File, maxSide = 1280, quality = 0.85): Promise<File> {
  if (file.type === "image/gif") return file;

  try {
    const img = await loadImage(file);
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    // Small, already-compressed files are not worth re-encoding.
    if (scale === 1 && file.size <= 600 * 1024) return file;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.fillStyle = "#ffffff"; // JPEG has no transparency
    context.fillRect(0, 0, width, height);
    context.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
