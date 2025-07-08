import React from "react";
import Link from "next/link";
import Image from "next/image";

// ErrorState component is used to display a user-friendly error message
// when a quiz fails to load or an unexpected issue occurs.export
export default function ErrorState({ message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-center">
      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center p-1 mb-4">
        <Image
          src="/microlearn-logo.png"
          alt="MicroLearn Logo"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
      {/* Main error heading */}
      <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
        Error Loading Quiz
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{message}</p>
      {/* Navigation link back to search page */}
      <Link
        href="/search"
        className="px-6 py-3 bg-[#293292] hover:bg-[#1a1f5d] text-white rounded-xl font-semibold transition duration-300"
      >
        Go to Search Page
      </Link>
    </div>
  );
}
