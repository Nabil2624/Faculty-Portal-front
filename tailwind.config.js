/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      keyframes: {
        "spin-zoom-pulse": {
          "0%": {
            transform: "rotate(0deg) scale(1)",
            opacity: "1",
          },
          "25%": {
            transform: "rotate(90deg) scale(1.15)",
            opacity: "0.85",
          },
          "50%": {
            transform: "rotate(180deg) scale(1.3)",
            opacity: "1",
          },
          "75%": {
            transform: "rotate(270deg) scale(1.15)",
            opacity: "0.85",
          },
          "100%": {
            transform: "rotate(360deg) scale(1)",
            opacity: "1",
          },
        },
      },
      animation: {
        "spin-zoom-pulse": "spin-zoom-pulse 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
