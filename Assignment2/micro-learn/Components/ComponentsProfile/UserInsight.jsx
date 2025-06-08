import React from 'react';

const UserInsight = ({ user }) => {
  const searches = user.searchHistory?.length || 0;
  const videos = user.videoHistory?.length || 0;
  const quizzes = user.quizHistory?.length || 0;

  let message = "You're just getting started! 🚀";

  if (quizzes >= 10) {
    message = "🧠 Quiz Master: 10+ quizzes completed!";
  } 
   if (quizzes >= 5) {
    message = "✍️ You're on a roll with quizzes!";
  } 
   if (videos >= 30) {
    message = "🎉 Milestone unlocked: 30+ videos watched!";
  } 
   if (searches >= 20) {
    message = "🧠 You've made 20+ searches — curiosity unlocked!";
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl shadow-sm text-center">
      <p className="text-lg font-semibold">✨ Insight</p>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default UserInsight;
