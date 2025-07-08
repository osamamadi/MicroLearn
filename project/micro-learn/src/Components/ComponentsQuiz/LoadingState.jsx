import React from "react";

// LoadingState component provides a full-page loading spinner.
// Typically shown while a quiz or other page data is being fetched.+
export default function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      <p className="ml-4 text-gray-700 dark:text-gray-300">Loading quiz...</p>
    </div>
  );
}
