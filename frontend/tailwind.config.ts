import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 10px 15px -3px rgb(24 24 27 / 0.08), 0 4px 6px -4px rgb(24 24 27 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
