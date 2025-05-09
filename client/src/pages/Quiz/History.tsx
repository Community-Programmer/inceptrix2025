"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  HistoryIcon,
  X,
  Award,
  Calendar,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import QuizResults from "./QuizResults";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/use-pagination";
import { useBookmarks } from "../../hooks/use-bookmarks";

interface QuizHistory {
  id: string;
  topic: string;
  score: number;
  total_questions: number;
  created_at: string;
  questions: any[];
  answers: string[];
}

const ITEMS_PER_PAGE = 6;

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizHistory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarked, setShowBookmarked] = useState(false);

  const {
    bookmarks,
    loading: bookmarksLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useBookmarks("quiz");

  const {
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
  } = usePagination({
    items: filteredHistory,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = history;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((quiz) =>
        quiz.topic.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply bookmarks filter
    if (showBookmarked) {
      filtered = filtered.filter((quiz) => isBookmarked(quiz.id));
    }

    setFilteredHistory(filtered);
  }, [history, searchQuery, showBookmarked, bookmarks, isBookmarked]);

  const fetchHistory = async () => {
    // if (!user) return;

    const { data, error } = await supabase
      .from("quiz_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setHistory(data);
    }
    setLoading(false);
  };

  const toggleBookmark = async (quizId: string) => {
    if (isBookmarked(quizId)) {
      await removeBookmark(quizId);
    } else {
      await addBookmark(quizId);
    }
  };

  const handleViewQuiz = (quiz: QuizHistory) => {
    setSelectedQuiz({
      ...quiz,
      id: quiz.id,
    });
  };

  if (loading || bookmarksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <HistoryIcon className="mx-auto h-16 w-16 text-blue-500" />
            <h2 className="mt-2 text-4xl font-bold text-gray-800">
              Your Learning Journey
            </h2>
            <p className="mt-2 text-xl text-gray-600">
              Track your progress and revisit your quiz experiences
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative py-16 px-4 sm:px-6 lg:px-8 mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff1a_1px,transparent_1px),linear-gradient(135deg,#ffffff1a_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="absolute inset-0 opacity-30">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: `rgba(255, ${Math.random() * 100 + 155}, ${
                    Math.random() * 100 + 155
                  }, ${Math.random() * 0.5 + 0.5})`,
                  boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, ${
                    Math.random() * 100 + 155
                  }, ${Math.random() * 100 + 155}, ${
                    Math.random() * 0.5 + 0.5
                  })`,
                  animation: `float ${
                    Math.random() * 10 + 20
                  }s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <HistoryIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">
              Your Learning Journey
            </h2>
            <p className="mt-2 text-xl text-blue-100 max-w-2xl mx-auto">
              Track your progress and revisit your quiz experiences
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quizzes..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowBookmarked(!showBookmarked)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              showBookmarked
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            {showBookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-2" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
            {showBookmarked ? "Show All" : "Show Bookmarked"}
          </button>
        </div>

        {selectedQuiz ? (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex flex-row items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedQuiz.topic}
                </h2>
                <p className="text-gray-500">
                  Completed on{" "}
                  {new Date(selectedQuiz.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div>
              <QuizResults
                questions={selectedQuiz.questions}
                userAnswers={selectedQuiz.answers}
                onRestart={() => setSelectedQuiz(null)}
                isHistoryView={true}
                quizId={selectedQuiz.id}
              />
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <HistoryIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl text-gray-700">
              {showBookmarked
                ? "No bookmarked quizzes found"
                : "Your learning journey is about to begin!"}
            </p>
            <p className="mt-2 text-gray-500">
              {showBookmarked
                ? "Bookmark some quizzes to see them here"
                : "Take your first quiz to see your progress here."}
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all">
              <a href="/quiz">Start a Quiz</a>
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleViewQuiz(quiz)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800 truncate pr-8">
                        {quiz.topic}
                      </h3>
                      <button
                        className="p-1 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(quiz.id);
                        }}
                      >
                        {isBookmarked(quiz.id) ? (
                          <BookmarkCheck className="h-5 w-5" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-500 flex items-center mt-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-600">
                          Score:
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {quiz.score} / {quiz.total_questions}
                      </span>
                    </div>
                    <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (quiz.score / quiz.total_questions) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {(() => {
                    const pagesToShow = [];

                    if (totalPages <= 3) {
                      for (let i = 1; i <= totalPages; i++) {
                        pagesToShow.push(i);
                      }
                    } else {
                      pagesToShow.push(1);

                      if (currentPage > 2) {
                        pagesToShow.push("...");
                      }

                      if (currentPage > 1 && currentPage < totalPages) {
                        pagesToShow.push(currentPage);
                      }

                      if (currentPage < totalPages - 1) {
                        pagesToShow.push("...");
                      }

                      if (totalPages !== 1) {
                        pagesToShow.push(totalPages);
                      }
                    }

                    return pagesToShow.map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`dots-${index}`}
                            className="px-2 text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page as number)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
