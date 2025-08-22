const config = {
  darkMode: "class", // <-- important
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: ["@tailwindcss/postcss"],
};

export default config;
