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
        // Event Official Color Identity: Ruby & Light Beige
        ruby: {
          50: '#FDF2F4',
          100: '#FBE8EB',
          200: '#F7D0D7',
          300: '#F0A4B3',
          400: '#E46B84',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B', // Primary Ruby
          800: '#7F1D1D',
          900: '#450A0A',
          950: '#0C0203', // Deep Wine / Dark Ruby
        },
        beige: {
          50: '#FAF6F0',  // Light Beige Canvas Background
          100: '#F5EFE6',
          200: '#F2E8DC', // Card / Surface Beige
          300: '#E8DEC8', // Beige Border Subtle
          400: '#D6C7AE',
          500: '#C2AE91',
          600: '#A89274',
          700: '#8C7760',
          800: '#57463A', // Muted Text
          900: '#1F1612', // Deep Espresso Main Text
        },
        brand: {
          // Unified Brand Tokens (Mapped to Ruby & Beige)
          navy: '#991B1B',         // Primary Ruby
          navyDark: '#0C0203',     // Deepest Ruby Wine (Hero / Sidebar)
          navyLight: '#B91C1C',    // Vibrant Ruby Hover
          gold: '#D4A373',         // Warm Amber/Gold Accent
          goldHover: '#C2905D',
          goldLight: '#F5EFE6',    // Soft Beige Tint
          crimson: '#7F1D1D',
          crimsonLight: '#FDF2F4',
          ruby: '#991B1B',
          rubyDark: '#0C0203',
          rubyLight: '#B91C1C',
          beige: '#FAF6F0',
          beigeSurface: '#F2E8DC',
          beigeBorder: '#E8DEC8',
        },
      },
      fontFamily: {
        sans: [
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
          "Cairo",
          "Tajawal",
          "-apple-system",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
