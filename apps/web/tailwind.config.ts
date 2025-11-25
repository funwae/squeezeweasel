import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sw: {
          bg: "#050608",
          "bg-elevated": "#0b0f14",
          "border-subtle": "#181c22",
          "border-strong": "#262b35",
          text: {
            primary: "#ffffff",
            secondary: "#b3bfd4",
            muted: "#6c7385",
          },
          accent: {
            green: "#26f68c",
            "green-soft": "#1cae62",
            red: "#ff3355",
            amber: "#ffc857",
          },
          state: {
            success: "#26f68c",
            error: "#ff3355",
            warning: "#ffc857",
            info: "#5ad1ff",
          },
        },
      },
      boxShadow: {
        "sw-glow-green":
          "0 0 0 1px rgba(38, 246, 140, 0.5), 0 0 32px rgba(38, 246, 140, 0.2)",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Inter",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

