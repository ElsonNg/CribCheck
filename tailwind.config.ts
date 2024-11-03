import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' }, 
          '100%': { opacity: '1', transform: 'translateY(0)' }, 
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards', 
        fadeInSlower: 'fadeIn 0.8s ease-out forwards',
        fadeInUp: 'fadeInUp 0.6s ease-out forwards', 
      },
    },
  },
  plugins: [],
};
export default config;
