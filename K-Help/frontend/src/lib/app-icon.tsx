import { ImageResponse } from "next/og";

/**
 * Draws the K-Help app icon (white "K" on the brand gradient).
 * `maskable` icons keep the glyph inside the central safe zone so Android can crop them.
 */
export function renderAppIcon(size: number, maskable = false) {
  const glyph = Math.round(size * (maskable ? 0.46 : 0.58));
  const radius = maskable ? 0 : Math.round(size * 0.22);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4a78f5 0%, #2744b8 100%)",
          borderRadius: radius,
          color: "white",
          fontSize: glyph,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        K
      </div>
    ),
    { width: size, height: size },
  );
}
