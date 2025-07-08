"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import LoadingState from "../../Components/ComponentsQuiz/LoadingState";
import ErrorState from "../../Components/ComponentsQuiz/ErrorState";
import NoQuizAvailable from "../../Components/ComponentsQuiz/NoQuizAvailable";
import QuizForm from "../../Components/ComponentsQuiz/QuizForm";

export default function ClientQuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const category=searchParams.get("category")
  useEffect(() => {
    try {
      const quizDataParam = searchParams.get("quizData");

      if (quizDataParam) {
        const decodedQuiz = decodeURIComponent(quizDataParam);
        const parsedQuiz = JSON.parse(decodedQuiz);
        setQuiz(parsedQuiz);
        setSelectedAnswers(new Array(parsedQuiz.length).fill(-1));
      } else {
        setError(
          "No quiz found in URL. Please go back to the search page and generate one."
        );
      }
    } catch (e) {
      console.error("Failed to parse quiz:", e);
      setError("Failed to load quiz data. It might be corrupted.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleOptionChange = useCallback(
    (questionIndex, optionIndex) => {
      const newAnswers = [...selectedAnswers];
      newAnswers[questionIndex] = optionIndex;
      setSelectedAnswers(newAnswers);
      if (validationMessage) setValidationMessage(null);
    },
    [selectedAnswers, validationMessage]
  );

  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    return quiz.reduce((score, q, index) => {
      return score + (selectedAnswers[index] === q.correctIndex ? 1 : 0);
    }, 0);
  }, [quiz, selectedAnswers]);

  const handleSubmitQuiz = useCallback(
    async (e) => {
      e.preventDefault();

      if (!quiz) return;

      const allAnswered = selectedAnswers.every((a) => a !== -1);

      if (allAnswered) {
        setShowResults(true);
        const score = calculateScore();

        

        if (username) {
          try {
            const res = await fetch("/api/add/quizHistory", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, value:{
                score,
               totalQuestions: quiz.length,
               fullQuizContent: quiz,
               userAnswers: selectedAnswers,
               dateTaken: new Date().toISOString(),
               category:category
              } }),
            });

            if (!res.ok) {
              const err = await res.json();
              console.error("Error saving history:", err.error);
            }
          } catch (err) {
            console.error("Network error:", err);
          }
        }
      } else {
        setValidationMessage("Please answer all questions.");
        setShowResults(false);
      }
    },
    [quiz, selectedAnswers, username, calculateScore]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!quiz || quiz.length === 0) return <NoQuizAvailable />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
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
