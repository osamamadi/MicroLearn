// componentsSearch/VideoModal.js
'use client'; // This directive is important for Next.js client components

import React, { useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
import { X, Clock, Eye, GraduationCap } from 'lucide-react';
import { useSearchParams } from 'next/navigation'; // useRouter is not used in the provided snippet

export default function VideoModal({ selectedVideo, closeVideoModal }) {
  // If no video is selected, don't render the modal
  if (!selectedVideo) return null;

  // Get search parameters from the URL
  const searchParams = useSearchParams();
  // Extract the username from the URL parameters
  const username = searchParams.get('username');

  // Use useEffect to perform side effects like saving data to the database
  useEffect(() => {
    // Define an async function to handle the API call
    const saveVideoHistory = async () => {
      // Only proceed if a video is selected and a username is available
      if (selectedVideo && username) {
        try {
          // Send a POST request to your API endpoint to save video history
          await fetch('/api/add/videoHistory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: username,
              // Send the video's ID to your backend. Adjust if you need to send title or other data.
              value: selectedVideo.id,
            }),
          });
          console.log('Video history saved successfully!');
        } catch (error) {
          console.error('Error saving video history:', error);
          // You might want to add more robust error handling here,
          // like showing a notification to the user.
        }
      }
    };

    // Call the async function when the component mounts or dependencies change
    saveVideoHistory();
  }, [selectedVideo, username]); // Dependencies: Re-run effect if selectedVideo or username changes

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
          <button
            onClick={closeVideoModal}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="aspect-video bg-black">
          {/* Embed the YouTube video using an iframe */}
          <iframe
            // Corrected YouTube embed URL: `http://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`
            src={`http://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">{selectedVideo.title}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>Under 6 minutes</span>
              <span className="mx-2">•</span>
              <Eye className="w-4 h-4 mr-2" />
              <span>YouTube</span>
            </div>
            {/* Conditionally render the "Sign Up" link only if the username is "guest" */}
            {username === 'guest' && (
              <Link
                href="/signup"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Sign Up to Save Progress
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}