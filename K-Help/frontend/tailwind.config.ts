import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Some colour classes live in data files (e.g. lib/home-content.ts).
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fresh cobalt blue: bright and friendly, still calm.
        brand: {
          50: "#f0f6ff",
          100: "#dfeaff",
          200: "#c2d6ff",
          300: "#96b8ff",
          400: "#6590fb",
          500: "#4170f3",
          600: "#2f56e0",
          700: "#2744b8",
          800: "#243b93",
          900: "#223575",
          950: "#172049",
        },        // Warm brass, used sparingly for small highlights.
        accent: {
          50: "#fbf6ec",
          100: "#f5ead0",
          200: "#ecd7a6",
          300: "#e0c07c",
          400: "#d3a95a",
          500: "#c4923f",
          600: "#a87a30",
        },
        paper: "#f7f9fc",
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          sunken: "#f1f5f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.25rem",
        screens: { "2xl": "1200px" },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        "card-hover": "0 4px 6px -1px rgb(15 23 42 / 0.05), 0 12px 24px -8px rgb(15 23 42 / 0.12)",
        soft: "0 10px 30px -12px rgb(47 86 224 / 0.45)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3b66ee 0%, #2744b8 100%)",
        "hero-shine":
          "radial-gradient(900px 420px at 15% -10%, rgb(152 176 216 / 0.28), transparent 60%), radial-gradient(500px 300px at 100% 110%, rgb(196 146 63 / 0.18), transparent 70%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "scale(0.6)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        float: "float 5s ease-in-out infinite",
        "pop-in": "pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "sheet-up": "sheet-up 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;