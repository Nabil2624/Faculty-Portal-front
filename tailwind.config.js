/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px", // breakpoint جديد للشاشات الكبيرة جداً
        "4xl": "2560px",
        "5xl": "3840px",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
         statusPulse: {
          "0%": {
            boxShadow: "0 0 0 0 rgba(25,53,90,.45)",
          },
          "70%": {
            boxShadow: "0 0 0 14px rgba(25,53,90,0)",
          },
          "100%": {
            boxShadow: "0 0 0 0 rgba(25,53,90,0)",
          },
        },
      },
      animation: {
        spin: "spin 1.3s linear infinite",
        "spin-reverse": "spin-reverse 2.5s linear infinite",
        fadeIn: "fadeIn 0.18s ease-out",
        statusPulse: "statusPulse 2s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};




