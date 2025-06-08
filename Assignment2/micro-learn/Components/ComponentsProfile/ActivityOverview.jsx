'use client';

import React, { useState } from 'react';
import { Search, Play, FileText, X } from 'lucide-react';

const ActivityOverview = ({ user }) => {
  const [activeModal, setActiveModal] = useState(null); // 'search', 'video', 'quiz'
  const [selectedVideo, setSelectedVideo] = useState(null); // for popup video

  const getIcon = (type) => {
    switch (type) {
      case 'search':
        return <Search className="inline w-5 h-5 mr-2 text-purple-600" />;
      case 'video':
        return <Play className="inline w-5 h-5 mr-2 text-blue-600" />;
      case 'quiz':
        return <FileText className="inline w-5 h-5 mr-2 text-green-600" />;
      default:
        return null;
    }
  };

  const renderList = (type) => {
  const items = user[`${type}History`] || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md max-h-[70vh] overflow-y-auto p-6 rounded-xl shadow-xl relative border border-gray-200 custom-scroll">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={() => setActiveModal(null)}
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
          {getIcon(type)} {type} History
        </h2>
        {items.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 pr-2">
            {items.map((item, i) => {
              // ❌ Skip invalid video links
              if (
                type === 'video' &&
                (typeof item !== 'string' || !item.startsWith('http'))
              ) {
                return null;
              }

              return (
                <li key={i} className="text-gray-700 mb-6">
                  {type === 'video' ? (
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      🎥 {item}
                    </button>
                  ) : typeof item === 'object' &&
                    item !== null &&
                    item.fullQuizContent ? (
                    <div className="p-4 bg-gray-100 rounded shadow">
                      <div className="font-bold text-blue-700 mb-2">
                        📅 {new Date(item.dateTaken).toLocaleString()}
                      </div>
                      <div className="mb-2 text-green-700 font-semibold">
                        ✅ Score: {item.score} / {item.totalQuestions}
                      </div>

                      {item.fullQuizContent.map((q, index) => (
                        <div key={index} className="mb-4">
                          <div className="font-medium text-gray-800 mb-1">
                            Q{index + 1}: {q.question}
                          </div>
                          <ul className="list-disc pl-6 text-gray-700">
                            {q.options.map((opt, j) => (
                              <li
                                key={j}
                                className={
                                  j === q.correctIndex
                                    ? 'text-green-700 font-semibold'
                                    : j === item.userAnswers[index]
                                    ? 'text-red-500'
                                    : 'text-gray-700'
                                }
                              >
                                {opt}
                              </li>
                            ))}
                          </ul>
                          <div className="text-sm mt-1">
                            Your Answer:{' '}
                            <span
                              className={
                                item.userAnswers[index] === q.correctIndex
                                  ? 'text-green-700'
                                  : 'text-red-500'
                              }
                            >
                              {q.options[item.userAnswers[index]]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>{item}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
};

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {/* Searches */}
        <div className="flex flex-col items-center bg-purple-50 border border-purple-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <Search className="w-6 h-6 text-purple-600 mb-2" />
          <p className="text-lg font-semibold text-purple-700">
            {user.searchHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 mb-2">Searches</p>
          <button
            onClick={() => setActiveModal('search')}
            className="text-sm px-3 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            View Searches
          </button>
        </div>

        {/* Videos */}
        <div className="flex flex-col items-center bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <Play className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-lg font-semibold text-blue-700">
            {user.videoHistory?.filter(v => typeof v === 'string' && v.startsWith('http')).length || 0}

          </p>
          <p className="text-sm text-gray-700 mb-2">Videos Watched</p>
          <button
            onClick={() => setActiveModal('video')}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            View Videos
          </button>
        </div>

        {/* Quizzes */}
        <div className="flex flex-col items-center bg-green-50 border border-green-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <FileText className="w-6 h-6 text-green-600 mb-2" />
          <p className="text-lg font-semibold text-green-700">
            {user.quizHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 mb-2">Quizzes Completed</p>
          <button
            onClick={() => setActiveModal('quiz')}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            View Quizzes
          </button>
        </div>
      </div>

      {/* Modal Renderer */}
      {activeModal && renderList(activeModal)}

      {/* Embedded Video Popup */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 relative w-full max-w-2xl shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setSelectedVideo(null)}
            >
              <X />
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={selectedVideo.replace('watch?v=', 'embed/')}
                className="w-full h-96 rounded"
                title="Video Player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityOverview;
