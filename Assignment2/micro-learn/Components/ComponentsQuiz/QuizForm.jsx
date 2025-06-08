'use client';

import React from 'react';
import QuizQuestion from './QuizQuestion'; // Import the new QuizQuestion component

export default function QuizForm({
  quiz,
  selectedAnswers,
  handleOptionChange,
  handleSubmitQuiz,
  showResults,
  validationMessage,
  calculateScore
}) {
  return (
    <form
      onSubmit={handleSubmitQuiz}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      {quiz.map((quizItem, index) => (
        <QuizQuestion
          key={index}
          quizItem={quizItem}
          index={index}
          selectedAnswer={selectedAnswers[index]}
          handleOptionChange={handleOptionChange}
          showResults={showResults}
        />
      ))}

      {validationMessage && (
        <p className="text-red-600 text-center text-lg mb-4">
          {validationMessage}
        </p>
      )}

      {!showResults ? (
        <button
          type="submit"
          className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold text-xl shadow hover:bg-orange-600 transition duration-300 mt-8"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="text-center mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Score: {calculateScore()} / {quiz.length}
          </h2>
          <button
            onClick={() => {
              // This logic for retaking quiz is passed up to the parent or managed here
              // For simplicity, we'll assume the parent `QuizPage` will handle resetting states
              // You might want to lift this logic to `QuizPage` or pass a `onRetake` prop
              window.location.reload(); // Simple refresh for retake
            }}
            className="inline-block py-3 px-6 bg-[#293292] text-white rounded-xl font-semibold hover:bg-[#1a1f5d] transition duration-300"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </form>
  );
}
