// src/app/search/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import SearchHeader from "../../Components/ComponentsSearch/SearchHeader.jsx";
import LoadingState from "../../Components/ComponentsSearch/LoadingState.jsx";
import ResultsSection from "../../Components/ComponentsSearch/ResultsSection.jsx";
import VideoModal from "../../Components/ComponentsSearch/VideoModal.jsx";
import InitialState from "../../Components/ComponentsSearch/InitialState.jsx";
import QuizButton from "../../Components/ComponentsSearch/QuizButton.jsx";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [explanation, setExplanation] = useState(null);
  const [summary, setSummary] = useState(""); // New state for summary
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [category, setCategory] = useState("Other");

  const router = useRouter();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  async function handleSearch(searchQuery) {
    const searchTerm = searchQuery || query;
    if (!searchTerm || !username) return;

    setLoading(true);
    setHasSearched(true);
    setExplanation(null);
    setSummary(""); // Reset summary
    setQuiz([]);

    try {
      

      const explanationRes = await fetch(
        `/api/explanation?query=${encodeURIComponent(searchTerm)}`
      );
      const explanationData = await explanationRes.json();
      const { explanation, summary, quiz, category } = explanationData;
      setCategory(category || "Other");

      const videosRes = await fetch(
        `/api/videos?query=${encodeURIComponent(searchTerm)}`
      );
      const videosData = await videosRes.json();
      setVideos(
        (videosData.videos || []).map((v) => ({
          id: v.id,
          title: v.title,
          url: v.url,
          views: v.views,
          catagory: category
        }))
      );
       
      setExplanation({
        text: explanationData.explanation || "",
        query: explanationData.query || searchTerm,
      });
      setSummary(explanationData.summary || ""); // Set the new summary state

      setQuiz(explanationData.quiz || []);

     await fetch("/api/add/searchHistory", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: username,
    value: {
      value: searchTerm,
      category: category || "Other",
      timestamp: new Date().toISOString(),
    },
  }),
});


    } catch (error) {
      console.error("Search error:", error);
      setExplanation(null);
      setSummary(""); // Clear summary on error
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSearch();
  }

  async function openVideoModal(video) {
    setSelectedVideo(video);

    if (username && video) {
      try {
        await fetch("/api/add/videoHistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            value: {
            value: video.url,
            title:video.title,
            timestamp: new Date().toISOString(),
            category: video.catagory || "Other"
            },
          }),
        });
        console.log("Video history saved successfully!");
      } catch (error) {
        console.error("Error saving video history:", error);
      }
    } else {
      console.warn("Cannot save video history: username or video is missing.");
    }
  }

  function closeVideoModal() {
    setSelectedVideo(null);
  }

  const handleMakeQuiz = () => {
    if (quiz.length > 0) {
      try {
        const quizJsonString = JSON.stringify(quiz);
        const encodedQuiz = encodeURIComponent(quizJsonString);
        router.push(`/quiz?quizData=${encodedQuiz}&username=${username}&category=${encodeURIComponent(category)}`);

      } catch (error) {
        console.error("Error encoding quiz data for URL:", error);
        alert("Could not generate quiz link. Please try again.");
      }
    } else {
      alert(
        "Please perform a search and generate an explanation first to make a quiz."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SearchHeader
        query={query}
        setQuery={setQuery}
        handleSubmit={handleSubmit}
        username={username}
      />

      {loading && <LoadingState />}

      {hasSearched && !loading && (
        <ResultsSection
          explanation={explanation}
          summary={summary} // Pass the summary prop
          videos={videos}
          openVideoModal={openVideoModal}
          quiz={quiz}
          hasSearched={hasSearched}
          loading={loading}
          setQuery={setQuery}
          setHasSearched={setHasSearched}
          setVideos={setVideos}
          setExplanation={setExplanation}
          setQuiz={setQuiz}
        />
      )}

      {!hasSearched && !loading && <InitialState />}

      {selectedVideo && (
        <VideoModal
          selectedVideo={selectedVideo}
          closeVideoModal={closeVideoModal}
        />
      )}

      {username !== "guest" && quiz.length > 0 && (
        <QuizButton handleMakeQuiz={handleMakeQuiz} />
      )}
      {username !== "guest" &&
        hasSearched &&
        !loading &&
        quiz.length === 0 &&
        explanation && (
          <div className="text-center text-gray-500 mt-12 mb-10">
            No quiz could be generated for this topic.
          </div>
        )}
    </div>
  );
}
