import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    function ({ addBase, theme }: PluginAPI) {
      addBase({
        "input, textarea, select": {
          color: theme("colors.gray.600"),
        },
      });
    },
  ],
};
export default config;
