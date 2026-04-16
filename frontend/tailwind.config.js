/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "footer-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "city-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "footer-marquee": "footer-marquee 45s linear infinite",
        "city-marquee": "city-marquee 75s linear infinite",
      },
      colors: {
        primary: { DEFAULT: "#CBA38C", light: "#C39C86" },
        secondary: "#C39C86",
        surface: "#0F0E0E",
        panel: "#141313",
        muted: "#C4C4C4",
        overlay: "#0A0A0A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
