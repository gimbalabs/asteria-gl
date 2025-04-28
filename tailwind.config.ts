import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export const galaxyColors = {
  primary: '#1e3a8a',
  accent: '#facc15',
  info: '#3291ff',
  glow: '#00f0ff',
  base: '#0c0a1b',
  border: '#4b445e',
  light: '#e4e4e7',
  danger: '#ff4d4f',
};

export const galaxyColors2 = {
  primary: '#1e3a8a',
  accent: '#facc15',
  info: '#38bdf8',
  glow: '#22d3ee',
  base: '#0f172a',
  border: '#475569',
  light: '#f1f5f9',
  danger: '#ef4444',
};

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        galaxy: galaxyColors,
        galaxy2: galaxyColors2,
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
