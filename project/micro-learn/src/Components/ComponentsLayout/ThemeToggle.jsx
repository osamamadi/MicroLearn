"use client"; // Enables React Client Component behavior

import { useTheme } from "next-themes"; // Hook for accessing and setting the current theme (light/dark)
import { useEffect, useState } from "react";

// Component for toggling between light and dark themes
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // Get current theme and method to change it
  const [mounted, setMounted] = useState(false); // Used to avoid hydration mismatch on first render

  // Set mounted to true after the component mounts (client-side only)
  useEffect(() => setMounted(true), []);

  // Prevent rendering on server to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <button
      className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-2 rounded"
      // Toggle theme when clicked
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {/* Display icon and text based on current theme */}
      {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
