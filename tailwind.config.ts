import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export const galaxyColors = {
  primary: '#6c2bd9',
  accent: '#50c7c9',
  info: '#3291ff',
  glow: '#00f0ff',
  base: '#0c0a1b',
  border: '#4b445e',
  light: '#e4e4e7',
  danger: '#ff4d4f',
};

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        galaxy: galaxyColors,
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
