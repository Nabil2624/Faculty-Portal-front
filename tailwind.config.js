/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      keyframes: {
        // دوران + زووم مستمر بدون توقف
        "spin-zoom-continuous": {
          "0%": {
            transform: "rotate(0deg) scale(1)",
          },
          "25%": {
            transform: "rotate(90deg) scale(1.15)",
          },
          "50%": {
            transform: "rotate(180deg) scale(1.3)",
          },
          "75%": {
            transform: "rotate(270deg) scale(1.15)",
          },
          "100%": {
            transform: "rotate(360deg) scale(1)",
          },
        },
      },
      animation: {
    
        "spin-zoom-continuous": "spin-zoom-continuous 1.3s linear infinite",
      },
    },
  },
  plugins: [],
};
