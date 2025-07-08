import React from "react";
import { Search } from "lucide-react";
/**
 * LoadingState Component
 *
 * Displays a loading animation while the app is fetching video results.
 * It is used during the search process to provide visual feedback to the user.
 */
export default function LoadingState() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Searching for videos...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Finding the best short videos for you
          </p>
        </div>
      </div>
    </section>
  );
}
