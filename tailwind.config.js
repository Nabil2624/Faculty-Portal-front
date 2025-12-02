/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },

        /* ✅ GitHub-style floating search animation */
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        spin: "spin 1.3s linear infinite",
        "spin-reverse": "spin-reverse 2.5s linear infinite",

        /* ✅ Add animation class */
        fadeIn: "fadeIn 0.18s ease-out",
      },
    },
  },
  plugins: [],
};
