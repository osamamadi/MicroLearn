import React from "react";
/**
 * QuizButton Component
 *
 * Renders a styled button that, when clicked, triggers the `handleMakeQuiz` callback.
 * Typically used to navigate the user to the quiz creation or quiz view section.
 *
 * Props:
 * - handleMakeQuiz (function): Function to be executed when the button is clicked.
 */
export default function QuizButton({ handleMakeQuiz }) {
  return (
    <div className="text-center mt-12 mb-10 ">
      <button
        onClick={handleMakeQuiz}
        className="inline-block bg-[#202774] text-white px-6 py-3 rounded-xl font-semibold text-lg shadow hover:bg-[#1a1f5d] transition duration-300 dark:bg-[#202774] dark:hover:bg-[#1a1f5d]"
      >
        Go to Quiz
      </button>
    </div>
  );
}
