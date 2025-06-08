import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NoQuizAvailable() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 mb-4">
        <Image
          src="/microlearn-logo.png"
          alt="MicroLearn Logo"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        No Quiz Available
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        It looks like you haven't generated a quiz yet. Please go back to the
        search page.
      </p>
      <Link
        href="/search"
        className="px-6 py-3 bg-[#293292] text-white rounded-xl font-semibold hover:bg-[#1a1f5d] transition duration-300"
      >
        Go to Search Page
      </Link>
    </div>
  );
}
