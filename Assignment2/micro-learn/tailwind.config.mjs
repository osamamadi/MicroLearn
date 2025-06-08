/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    // Ensure this path is correct for your ComponentsLayout folder
    // If ComponentsLayout is a direct child of your project root:
    './ComponentsLayout/**/*.{js,ts,jsx,tsx,mdx}',
    // If you also have a 'Components' folder with other components, keep this:
    './Components/**/*.{js,ts,jsx,tsx,mdx}',
    './componentsSearch/**/*.{js,ts,jsx,tsx,mdx}',
    './ComponentsQuiz/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  plugins: []
};
