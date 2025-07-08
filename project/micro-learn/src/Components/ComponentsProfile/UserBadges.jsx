// src/Components/ComponentsProfile/UserBadges.jsx

'use client';

import React, { useState } from 'react';
import { getUserBadges } from '@/lib/badgeUtils'; // <-- ADD THIS LINE

// DELETE the entire 'function getUserBadges(quizHistory) { ... }' block from here.
// It now lives in src/lib/badgeUtils.js

const UserBadges = ({ user }) => {
  // This line remains the same and will now use the imported function
  const { badges, badgeProgress, allBadges } = getUserBadges(user?.quizHistory);
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="mt-6 text-center ">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        🏅 Achievements
      </h3>

      {/* Earned Badges */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {badges.map((b, i) => (
          <span
            key={i}
            className="flex items-center bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm"
          >
            {b.emoji} {b.label}
          </span>
        ))}
      </div>

      {/* Progress bar to next badge */}
      {badgeProgress ? (
        <div className="max-w-xs mx-auto text-sm text-gray-700 dark:text-gray-200 mb-4">
          <p className="mb-2">
            Progress to:{' '}
            <strong>
              {badgeProgress.emoji} {badgeProgress.label}
            </strong>
          </p>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-yellow-400 h-4 transition-all duration-300 ease-in-out"
              style={{ width: `${badgeProgress.progress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-center">
            {badgeProgress.progress}% completed
          </p>
        </div>
      ) : (
        <p className="text-sm text-green-500 mb-4">
          🎉 All quiz badges unlocked!
        </p>
      )}

      {/* Show/Hide Toggle */}
      <button
        onClick={() => setShowTable((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-yellow-800
hover:bg-blue-700 text-white rounded-lg text-sm transition"
      >
        {showTable ? 'Hide Badge Table' : 'Show All Badge Goals'}
      </button>

      {/* Badge Table */}
      {showTable && (
        <div className="flex justify-center">
          <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-md border dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-blue-200 dark:bg-blue-900 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="p-3 text-left">Badge</th>
                  <th className="p-3 text-left">Requirement</th>
                  <th className="p-3 text-left w-32">Progress</th>
                </tr>
              </thead>
              <tbody>
                {allBadges.map((b, i) => (
                  <tr
                    key={i}
                    className={`border-t dark:border-gray-700 ${
                      b.earned
                        ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {b.emoji} {b.label}{' '}
                      {b.earned && (
                        <span className="ml-1 text-green-600 dark:text-green-400">
                          ✅
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {b.special === 'perfect'
                        ? 'Scored 100% on at least one quiz'
                        : b.special === 'streak'
                        ? 'Completed quizzes 3 days in a row'
                        : `Completed ${
                            b.requiredQuizzes
                          }+ quizzes with avg score ≥ ${Math.floor(
                            b.requiredScore * 100
                          )}%`}
                    </td>
                    <td className="p-3">
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-yellow-400 h-3 rounded-full transition-all"
                          style={{ width: `${b.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{b.progress}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBadges;
