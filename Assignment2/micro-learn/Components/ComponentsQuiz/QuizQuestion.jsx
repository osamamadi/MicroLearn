import React from 'react';

export default function QuizQuestion({
  quizItem,
  index,
  selectedAnswer,
  handleOptionChange,
  showResults
}) {
  return (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg">
      <p className="text-xl font-semibold text-gray-800 mb-4">
        {index + 1}. {quizItem.question}
      </p>
      <ul className="list-none pl-0">
        {quizItem.options.map((option, optionIndex) => (
          <li key={optionIndex} className="mb-3">
            <label
              className={`flex items-center p-3 rounded-md cursor-pointer transition-colors duration-200
                ${
                  showResults && optionIndex === quizItem.correctIndex
                    ? 'bg-green-100 border border-green-500'
                    : ''
                }
                ${
                  showResults &&
                  selectedAnswer === optionIndex &&
                  optionIndex !== quizItem.correctIndex
                    ? 'bg-red-100 border border-red-500'
                    : ''
                }
                ${
                  selectedAnswer === optionIndex && !showResults
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
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
              <span className="text-lg text-gray-700">{option}</span>
            </label>
          </li>
        ))}
      </ul>
      {showResults && selectedAnswer !== -1 && (
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">Correct Answer:</span>{' '}
          {quizItem.options[quizItem.correctIndex]}
        </p>
      )}
    </div>
  );
}
