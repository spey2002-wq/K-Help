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
          50: "#eef4ff",
          100: "#d9e5ff",
          200: "#bcd2ff",
          300: "#8eb4ff",
          400: "#598bff",
          500: "#3563f5",
          600: "#2344e0",
          700: "#1d35b5",
          800: "#1d308f",
          900: "#1d2e71",
        },
        accent: {
          500: "#e0559a",
          600: "#c93d80",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1280px" },
      },
    },
  },
  plugins: [],
};

export default config;
