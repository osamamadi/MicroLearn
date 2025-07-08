// app/quiz/QuizPageWrapper.jsx
"use client";

import dynamic from "next/dynamic";

const ClientQuizPage = dynamic(() => import("./ClientQuizPage"), {
  ssr: false,
  loading: () => <div>Loading quiz...</div>,
});

export default function QuizPageWrapper() {
  return <ClientQuizPage />;
}
