import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#182249",
          navyDark: "#0F1631",
          navyLight: "#26356E",
          gold: "#E6B441",
          goldHover: "#D4A333",
          goldLight: "#FBF3DC",
          crimson: "#8C1D24",
          crimsonLight: "#FBECEE",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-ibm-plex-arabic)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        arabic: [
          "var(--font-ibm-plex-arabic)",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
