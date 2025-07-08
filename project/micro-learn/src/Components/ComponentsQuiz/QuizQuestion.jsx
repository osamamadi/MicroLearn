import React from "react";
/**
 * QuizQuestion Component
 *
 * Displays a single quiz question with its options.
 * Shows visual feedback based on whether results are being shown.
 *
 * Props:
 * - quizItem: Object containing question, options, and correct index.
 * - index: Index of the question in the quiz array.
 * - selectedAnswer: Currently selected answer index for this question.
 * - handleOptionChange: Function to update selected answer for this question.
 * - showResults: Boolean flag indicating whether to show correct/wrong highlights.
 */
export default function QuizQuestion({
  quizItem,
  index,
  selectedAnswer,
  handleOptionChange,
  showResults,
}) {
  return (
    <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
      {/* Question Title */}
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {index + 1}. {quizItem.question}
      </p>
      {/* Options List */}
      <ul className="list-none pl-0">
        {quizItem.options.map((option, optionIndex) => {
          const isCorrect =
            showResults && optionIndex === quizItem.correctIndex;
          const isWrong =
            showResults &&
            selectedAnswer === optionIndex &&
            optionIndex !== quizItem.correctIndex;
          const isSelected = selectedAnswer === optionIndex && !showResults;

          return (
            <li key={optionIndex} className="mb-3">
              <label
                className={`flex items-center p-3 rounded-md cursor-pointer transition-colors duration-200
                  ${
                    isCorrect
                      ? "bg-green-100 border border-green-500 dark:bg-green-900 dark:border-green-400"
                      : ""
                  }
                  ${
                    isWrong
                      ? "bg-red-100 border border-red-500 dark:bg-red-900 dark:border-red-400"
                      : ""
                  }
                  ${
                    isSelected
                      ? "bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={optionIndex}
                  checked={selectedAnswer === optionIndex}
                  onChange={() => handleOptionChange(index, optionIndex)}
                  className="mr-3 h-4 w-4 text-[#293292] focus:ring-[#293292]"
                  disabled={showResults}
                />
                <span className="text-lg text-gray-700 dark:text-gray-200">
                  {option}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {/* Show correct answer if results are displayed */}
      {showResults && selectedAnswer !== -1 && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Correct Answer:</span>{" "}
          {quizItem.options[quizItem.correctIndex]}
        </p>
      )}
    </div>
  );
}
