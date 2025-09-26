// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 告诉 Tailwind 扫描这些文件中的类名
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./sidepanel.html",
    "./popup.html",
    "./newtab.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};