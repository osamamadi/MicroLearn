"use client";
import { useState } from "react";
import {
  Clock,
  Eye,
  Play,
  Lightbulb,
  GraduationCap,
  Search,
} from "lucide-react";
/**
 * ResultsSection component
 *
 * Displays:
 * - AI explanation of the searched topic (full text or summary)
 * - Related YouTube videos with thumbnails
 * - Fallback UI when no videos are found
 *
 * Props:
 * @param {Object} explanation - Full explanation object with { text, query }
 * @param {string} summary - Short summary of explanation
 * @param {Array} videos - Array of video objects ({ id, title })
 * @param {Function} openVideoModal - Handler to open video modal on click
 * @param {boolean} hasSearched - Flag indicating if a search was performed
 * @param {boolean} loading - Flag indicating if search is in progress
 * @param {Function} setQuery - State setter to reset the search query
 * @param {Function} setHasSearched - Setter to update search state
 * @param {Function} setVideos - Setter to update videos list
 * @param {Function} setExplanation - Setter to clear explanation
 * @param {Function} setQuiz - Setter to clear/reset quiz
 * @param {Array} quiz - Current quiz data (if any)
 */
export default function ResultsSection({
  explanation,
  summary,
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
  const [showFullExplanation, setShowFullExplanation] = useState(true);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* If explanation text exists, show the AI explanation card */}
          {explanation?.text && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold dark:text-white">
                  {explanation.query}
                </h2>
                {/* Toggle button for showing summary or full explanation */}
                <div className="flex items-center">
                  {summary && (
                    <button
                      onClick={() =>
                        setShowFullExplanation(!showFullExplanation)
                      }
                      className="px-4 py-2 border border-blue-900 text-blue-900 dark:border-blue-300 dark:text-blue-300 rounded-lg hover:bg-blue-900 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors duration-200 text-sm font-medium mr-4"
                    >
                      {showFullExplanation
                        ? "Show Main Points"
                        : "Show Full Text"}
                    </button>
                  )}
                  {/* AI icon and label */}
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  <span className="font-medium dark:text-white">
                    AI Explanation
                  </span>
                </div>
              </div>
              <div className="prose max-w-none text-lg text-gray-700 dark:text-gray-200">
                {showFullExplanation ? explanation.text : summary}
              </div>
            </div>
          )}

          {/* If videos were found, display them */}
          {videos.length > 0 ? (
            <>
              <h3 className="text-xl md:text-2xl font-bold mb-8 flex items-center dark:text-white">
                <GraduationCap className="w-6 h-6 text-orange-500 mr-3" />
                Related Videos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => openVideoModal(video)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
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
                        className="font-semibold text-lg mb-2 line-clamp-2 dark:text-white"
                        title={video.title}
                      >
                        {video.title}
                      </h3>
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300">
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
            /* If no videos found after searching, show fallback message */
            hasSearched &&
            !loading && (
              <div className="text-center py-16">
                <div className="text-6xl text-gray-300 mb-6">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-white mb-3">
                  No videos found
                </h3>
                <p className="text-gray-500 dark:text-gray-300 mb-8">
                  Try searching for a different topic
                </p>
                {/* Reset search button */}
                <button
                  onClick={() => {
                    setQuery("");
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
