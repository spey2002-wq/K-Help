import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "K-Help — Korea Life Platform",
    short_name: "K-Help",
    description:
      "Living guides, jobs, housing, community, chat and AI translation for foreign residents in South Korea.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f9fc",
    theme_color: "#ffffff",
    categories: ["lifestyle", "utilities", "education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Living guides", url: "/info", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Jobs", url: "/jobs", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Housing", url: "/housing", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "AI Assistant", url: "/ai", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
