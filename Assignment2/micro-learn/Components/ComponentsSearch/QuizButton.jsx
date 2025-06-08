// componentsSearch/QuizButton.js
import React from 'react';

export default function QuizButton({ handleMakeQuiz }) {
  return (
    <div className="text-center mt-12 mb-10">
      <button
        onClick={handleMakeQuiz}
        className="inline-block bg-[#202774] text-white px-6 py-3 rounded-xl font-semibold text-lg shadow hover:bg-[#1a1f5d] transition duration-300"
      >
        Go to Quiz
      </button>
    </div>
  );
}
