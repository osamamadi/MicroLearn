// src/app/quiz/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import LoadingState from '../../../Components/ComponentsQuiz/LoadingState';
import ErrorState from '../../../Components/ComponentsQuiz/ErrorState';
import NoQuizAvailable from '../../../Components/ComponentsQuiz/NoQuizAvailable';
import QuizForm from '../../../Components/ComponentsQuiz/QuizForm';

export default function QuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  useEffect(() => {
    try {
      const quizDataParam = searchParams.get('quizData');

      if (quizDataParam) {
        const decodedQuiz = decodeURIComponent(quizDataParam);
        const parsedQuiz = JSON.parse(decodedQuiz);
        setQuiz(parsedQuiz);
        setSelectedAnswers(new Array(parsedQuiz.length).fill(-1));
      } else {
        setError(
          'No quiz found in URL. Please go back to the search page and generate one.'
        );
      }
    } catch (e) {
      console.error('Failed to parse quiz from URL parameter:', e);
      setError('Failed to load quiz data. It might be corrupted.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleOptionChange = useCallback(
    (questionIndex, optionIndex) => {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = optionIndex;
      setSelectedAnswers(newSelectedAnswers);
      if (validationMessage) {
        setValidationMessage(null);
      }
    },
    [selectedAnswers, validationMessage]
  );

  // --- START FIX: Move calculateScore BEFORE handleSubmitQuiz ---

  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    let score = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctIndex) {
        score++;
      }
    });
    return score;
  }, [quiz, selectedAnswers]);

  const handleSubmitQuiz = useCallback(
    async (e) => {
      e.preventDefault();

      if (!quiz) return;

      const allAnswered = selectedAnswers.every(answer => answer !== -1);

      if (allAnswered) {
        setValidationMessage(null);
        setShowResults(true);

        // calculateScore is now defined and accessible here
        const score = calculateScore();
        const quizHistoryEntry = {
          
          score: score,
          totalQuestions: quiz.length,
          fullQuizContent: quiz,
          userAnswers: selectedAnswers,
          dateTaken: new Date().toISOString(),
        };

        if (username) {
          console.log('hhh\n\n\n\n\n');
          try {
            const response = await fetch('/api/add/quizHistory', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: username, value: quizHistoryEntry }),
            });

            if (response.ok) {
              console.log('Quiz history saved successfully!');
            } else {
              const errorData = await response.json();
              console.error('Error saving quiz history:', response.status, errorData.error || response.statusText);
            }
          } catch (error) {
            console.error('Network error saving quiz history:', error);
          }
        } else {
          console.warn('Username is missing from URL, quiz history not saved.');
        }
      } else {
        setValidationMessage('Please choose an answer for all questions.');
        setShowResults(false);
      }
    },
    [quiz, selectedAnswers, username, calculateScore]
  );
  // --- END FIX ---


  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!quiz || quiz.length === 0) {
    return <NoQuizAvailable />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Your MicroLearn Quiz
        </h1>

        <QuizForm
          quiz={quiz}
          selectedAnswers={selectedAnswers}
          handleOptionChange={handleOptionChange}
          handleSubmitQuiz={handleSubmitQuiz}
          showResults={showResults}
          validationMessage={validationMessage}
          calculateScore={calculateScore}
        />
      </div>
    </div>
  );
}