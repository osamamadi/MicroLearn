/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    // Existing paths, adjust or remove based on their actual location:
    // './ComponentsLayout/**/*.{js,ts,jsx,tsx,mdx}',
    // './componentsSearch/**/*.{js,ts,jsx,tsx,mdx}',
    // './ComponentsQuiz/**/*.{js,ts,jsx,tsx,mdx}',

    // This is the correct path if your 'Components' folder is directly inside 'src':
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",

    // Keep this for files directly in 'src/app' or its subdirectories:
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--color-accent)",
      },
    },
  },
  plugins: [],
};
