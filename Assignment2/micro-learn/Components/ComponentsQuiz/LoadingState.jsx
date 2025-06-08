import React from 'react';

export default function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      <p className="ml-4 text-gray-700">Loading quiz...</p>
    </div>
  );
}
