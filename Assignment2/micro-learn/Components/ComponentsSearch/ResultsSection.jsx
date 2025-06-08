// componentsSearch/ResultsSection.jsx
 import { useState } from 'react'; // Corrected: Only import useState directly
 // import Image from 'next/image'; // Not used in this component, can remove
 // import Link from 'next/link';   // Not used in this component, can remove
 import {
  Clock,
  Eye,
  Play,
  Lightbulb,
  GraduationCap,
  Search,
 } from 'lucide-react';

 export default function ResultsSection({
  explanation,
  summary, // New prop for the summary
  videos,
  openVideoModal,
  hasSearched,
  loading,
  setQuery,
  setHasSearched,
  setVideos,
  setExplanation,
  setQuiz,
  quiz,
 }) {
  // New state to toggle between full explanation and summary
  const [showFullExplanation, setShowFullExplanation] = useState(true);

  return (
  <section className="py-16">
  <div className="container mx-auto px-4">
  <div className="max-w-5xl mx-auto">
  {explanation && explanation.text && (
  <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
  <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl md:text-3xl font-bold">
  {explanation.query}
  </h2>
  <div className="flex items-center"> {/* Changed: Removed justify-between from this div */}
  {summary && ( // Only show button if summary is available
  <button
  onClick={() => setShowFullExplanation(!showFullExplanation)}
  className="px-4 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-900 hover:text-white transition-colors duration-200  text-sm font-medium mr-4" //Changed: added mr-4
  >
  {showFullExplanation ? 'Show Main Points' : 'Show Full Text'}
  </button>
  )}
  <Lightbulb className="w-5 h-5 mr-2" />
  <span className="font-medium">AI Explanation</span>
  </div>
  </div>
  <div className="prose max-w-none text-lg text-gray-700">
  {showFullExplanation ? explanation.text : summary}
  </div>
  </div>
  )}

  {videos.length > 0 ? (
  <>
  <h3 className="text-xl md:text-2xl font-bold mb-8 flex items-center">
  <GraduationCap className="w-6 h-6 text-orange-500 mr-3" />
  Related Videos
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {videos.map((video) => (
  <div
  key={video.id}
  onClick={() => openVideoModal(video)}
  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
  >
  <div className="relative">
  <img
  src={`http://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
  alt={video.title}
  className="w-full h-48 object-cover rounded-t-xl"
  />
  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-xl opacity-0 hover:opacity-100 transition-opacity">
  <Play className="w-12 h-12 text-white" />
  </div>
  </div>
  <div className="p-6">
  <h3
  className="font-semibold text-lg mb-2 line-clamp-2"
  title={video.title}
  >
  {video.title}
  </h3>
  <div className="flex justify-between items-center text-sm text-gray-500">
  <span className="flex items-center">
  <Clock className="w-4 h-4 mr-1" />
  Under 6 min
  </span>
  <span className="flex items-center">
  <Eye className="w-4 h-4 mr-1" />
  YouTube
  </span>
  </div>
  </div>
  </div>
  ))}
  </div>
  </>
  ) : (
  hasSearched &&
  !loading && (
  <div className="text-center py-16">
  <div className="text-6xl text-gray-300 mb-6">
  <Search className="w-16 h-16 mx-auto" />
  </div>
  <h3 className="text-2xl font-semibold text-gray-700 mb-3">
  No videos found
  </h3>
  <p className="text-gray-500 mb-8">
  Try searching for a different topic
  </p>
  <button
  onClick={() => {
  setQuery('');
  setHasSearched(false);
  setVideos([]);
  setExplanation(null);
  setQuiz([]);
  }}
  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
  >
  Try Another Search
  </button>
  </div>
  )
  )}
  </div>
  </div>
  </section>
  );
 }