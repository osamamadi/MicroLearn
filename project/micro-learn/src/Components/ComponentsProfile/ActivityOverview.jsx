"use client";

import React, { useState, useEffect } from "react";
import { Search, Play, FileText, X, Youtube, BookOpenCheck } from "lucide-react"; // Import BookOpenCheck icon
import { useSearchParams, useRouter } from "next/navigation";

// Helper function to categorize items by a given key (e.g., 'category')
const categorizeItems = (items, key = "category") => {
  const categorized = {};
  (items || []).forEach((item) => {
    const category = item[key] || "Other";
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(item);
  });
  return categorized;
};

const ActivityOverview = ({ user }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Effect to handle direct quiz deep-linking via URL search parameters
  useEffect(() => {
    const quizDateParam = searchParams.get("quizDate");
    if (quizDateParam && user.quizHistory) {
      const matchedQuiz = user.quizHistory.find(
        (q) => q.dateTaken && new Date(q.dateTaken).toISOString() === quizDateParam
      );
      if (matchedQuiz) {
        setActiveModal("quiz");
        setActiveQuiz(matchedQuiz);
        setActiveQuestionIndex(0);
      }
    }
  }, [searchParams, user.quizHistory]);

  // Handler to navigate back to the quiz list view from a detailed quiz view
  const handleBackToQuizList = () => {
    setActiveQuiz(null);
    setActiveQuestionIndex(0);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("quizDate");
    router.replace(`/profile${params.size > 0 ? `?${params}` : ""}`);
  };

  // Helper to get the appropriate icon based on activity type
  const getIcon = (type) => {
    switch (type) {
      case "search":
        return <Search className="inline w-5 h-5 mr-2 text-purple-600" />;
      case "video":
        return <Play className="inline w-5 h-5 mr-2 text-blue-600" />;
      case "quiz":
        return <FileText className="inline w-5 h-5 mr-2 text-green-600" />;
      default:
        return null;
    }
  };

  // Render modal for activity lists (Search, Video, Quiz)
  const renderActivityModal = (type) => {
    const items = user[`${type}History`] || [];
    const categorizedItems = categorizeItems(items, "category");

    // If a quiz is active and we're in the quiz modal, render its details
    if (type === "quiz" && activeQuiz) {
      const currentQuestion = activeQuiz.fullQuizContent[activeQuestionIndex];
      if (!currentQuestion) return null; // Guard against invalid question index

      return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl relative border border-gray-200 custom-scroll text-gray-800 dark:text-gray-100">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:text-gray-400 z-10"
              onClick={() => {
                setActiveModal(null);
                setActiveQuestionIndex(0);
                setActiveQuiz(null);
                setActiveCategory(null);
                router.replace("/profile");
              }}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300 flex items-center">
              {getIcon(type)} Quiz Details
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                📅 Taken on:{" "}
                <span className="font-medium">
                  {new Date(activeQuiz.dateTaken).toLocaleString()}
                </span>
              </p>
              <p className="text-green-700 dark:text-green-400 font-semibold text-lg">
                ✅ Score: {activeQuiz.score} / {activeQuiz.totalQuestions}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow-inner">
              <p className="font-semibold text-gray-800 dark:text-gray-100 mb-3 text-base">
                Question {activeQuestionIndex + 1} of {activeQuiz.fullQuizContent.length}:{" "}
                {currentQuestion.question}
              </p>
              <ul className="list-none pl-0 space-y-2">
                {currentQuestion.options.map((option, idx) => (
                  <li
                    key={idx}
                    className={`p-2 rounded-md ${
                      idx === currentQuestion.correctIndex
                        ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 font-semibold"
                        : idx === activeQuiz.userAnswers[activeQuestionIndex]
                        ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-4 text-gray-700 dark:text-gray-300">
                Your Answer:{" "}
                <span
                  className={
                    activeQuiz.userAnswers[activeQuestionIndex] === currentQuestion.correctIndex
                      ? "text-green-700 dark:text-green-400 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {currentQuestion.options[activeQuiz.userAnswers[activeQuestionIndex]] ||
                    "No Answer"}
                </span>
              </p>

              <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveQuestionIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={activeQuestionIndex === 0}
                  className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={() =>
                    setActiveQuestionIndex((prev) =>
                      Math.min(prev + 1, activeQuiz.fullQuizContent.length - 1)
                    )
                  }
                  disabled={activeQuestionIndex === activeQuiz.fullQuizContent.length - 1}
                  className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>

            <button
              onClick={handleBackToQuizList}
              className="mt-6 text-base text-blue-700 dark:text-blue-400 underline hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
            >
              ← Back to all quizzes
            </button>
          </div>
        </div>
      );
    }

    // Render the list of activities (Search, Video, or Quiz list)
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl relative border border-gray-200 custom-scroll text-gray-800 dark:text-gray-100">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:text-gray-400 z-10"
            onClick={() => {
              setActiveModal(null);
              setActiveCategory(null);
              router.push(`/profile?username=${user.username}`);
            }}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-5 text-blue-700 dark:text-blue-300 flex items-center">
            {getIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)} History
          </h2>

          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No {type} data available. Start exploring!
            </p>
          ) : (
            <>
              {Object.keys(categorizedItems).length > 1 && (
                <div className="mb-6 flex flex-wrap gap-2 justify-center">
                  {Object.keys(categorizedItems)
                    .sort()
                    .map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-sm px-4 py-2 rounded-full border transition-colors duration-200 ${
                          activeCategory === cat
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white dark:bg-gray-800 text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`text-sm px-4 py-2 rounded-full border transition-colors duration-200 ${
                      activeCategory === null
                        ? "bg-gray-600 text-white border-gray-600 shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    All
                  </button>
                </div>
              )}

              <ul className="list-none pl-0 space-y-3 pr-2">
                {(activeCategory ? categorizedItems[activeCategory] || [] : items)
                  .sort((a, b) => {
                    const dateA = new Date(a.timestamp || a.dateTaken);
                    const dateB = new Date(b.timestamp || b.dateTaken);
                    return dateB - dateA;
                  })
                  .map((item, i) => (
                    <li
                      key={i}
                      className="text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
                    >
                      {type === "search" && (
                        <>
                          <div className="flex items-center">
                            🔍{" "}
                            <span className="text-purple-700 dark:text-purple-300 font-medium ml-2">
                              {item.value}
                            </span>
                          </div>
                          <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                            ({new Date(item.timestamp).toLocaleString()})
                          </span>
                        </>
                      )}
                      {type === "video" && (
                        <>
                          <button
                            onClick={() => setSelectedVideo(item.value)}
                            className="flex items-center text-blue-700 dark:text-blue-400 font-medium px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors duration-200 shadow-sm group"
                          >
                            <Youtube className="w-5 h-5 mr-2 text-red-600 group-hover:text-red-500" />{" "}
                            {/* YouTube icon */}
                            {item.title || "Untitled Video"}
                          </button>
                          <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                            ({new Date(item.timestamp).toLocaleString()})
                          </span>
                        </>
                      )}
                      {type === "quiz" && (
                        <>
                          <button
                            className="flex items-center text-green-700 dark:text-green-400 font-medium px-3 py-1 rounded-full bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-200 shadow-sm group"
                            onClick={() => {
                              try {
                                const quizDate = new Date(item.dateTaken).toISOString();
                                setActiveQuiz(item);
                                setActiveQuestionIndex(0);
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("quizDate", quizDate);
                                router.replace(`/profile?${params.toString()}`);
                              } catch (e) {
                                console.warn("Invalid date in quiz entry:", item.dateTaken, e);
                                // Optionally show a user-friendly error message
                              }
                            }}
                          >
                            <BookOpenCheck className="w-5 h-5 mr-2 text-green-600 group-hover:text-green-500" />{" "}
                            {/* Quiz icon */}
                            Quiz on {new Date(item.dateTaken).toLocaleDateString()}{" "}
                            {new Date(item.dateTaken).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </button>
                          <span className={`ml-3 text-sm font-semibold ${item.score / item.totalQuestions > 0.5 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            Score: {item.score}/{item.totalQuestions}
                          </span>
                        </>
                      )}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render video player modal
  const renderVideoPlayerModal = () => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 relative w-full max-w-3xl shadow-2xl">
        <button
          className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors z-10"
          onClick={() => setSelectedVideo(null)}
          aria-label="Close video player"
        >
          <X size={24} />
        </button>
        <div className="aspect-w-16 aspect-h-9 w-full">
          <iframe
            src={selectedVideo.replace("watch?v=", "embed/")}
            className="w-full h-auto min-h-[300px] rounded-lg border border-gray-200 dark:border-gray-700"
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {/* Searches Card */}
        <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900 border border-purple-100 dark:border-purple-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <Search className="w-8 h-8 text-purple-600 mb-3" />
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {user.searchHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Searches</p>
          <button
            onClick={() => setActiveModal("search")}
            className="text-base px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 shadow-sm"
          >
            View Searches
          </button>
        </div>

        {/* Videos Card */}
        <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <Play className="w-8 h-8 text-blue-600 mb-3" />
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {user.videoHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Videos Watched</p>
          <button
            onClick={() => setActiveModal("video")}
            className="text-base px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            View Videos
          </button>
        </div>

        {/* Quizzes Card */}
        <div className="flex flex-col items-center bg-green-50 dark:bg-green-900 border border-green-100 dark:border-green-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <FileText className="w-8 h-8 text-green-600 mb-3" />
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {user.quizHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Quizzes Completed</p>
          <button
            onClick={() => setActiveModal("quiz")}
            className="text-base px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 shadow-sm"
          >
            View Quizzes
          </button>
        </div>
      </div>

      {activeModal && renderActivityModal(activeModal)}
      {selectedVideo && renderVideoPlayerModal()}
    </>
  );
};

export default ActivityOverview;