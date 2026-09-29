import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          50: "#fdf2f8",
          500: "#ec4899",
          600: "#db2777",
        },
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
        soft: "0 8px 30px -12px rgb(79 70 229 / 0.28)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        "hero-shine":
          "radial-gradient(1200px 500px at 20% -10%, rgb(255 255 255 / 0.16), transparent 60%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;