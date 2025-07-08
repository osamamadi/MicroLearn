import React from "react";

const UserInsight = ({ user }) => {
  // Extract history counts (fallback to 0 if undefined)
  const searches = user.searchHistory?.length || 0;
  const videos = user.videoHistory?.length || 0;
  const quizzes = user.quizHistory?.length || 0;

  let message = "You're just getting started! 🚀";

  // Determine user insight message based on usage
  if (quizzes >= 10) {
    message = "🧠 Quiz Master: 10+ quizzes completed!";
  } else if (quizzes >= 5) {
    message = "✍️ You're on a roll with quizzes!";
  } else if (videos >= 30) {
    message = "🎉 Milestone unlocked: 30+ videos watched!";
  } else if (searches >= 20) {
    message = "🧠 You've made 20+ searches — curiosity unlocked!";
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100 p-4 rounded-xl shadow-sm text-center">
      <p className="text-lg font-semibold">✨ Insight</p>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default UserInsight;
