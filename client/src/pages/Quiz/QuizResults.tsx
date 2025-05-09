"use client";

import {
  Trophy,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  Loader2,
} from "lucide-react";
import type { Question } from "../../types/quiz";
import { useState, useEffect } from "react";
import { generateQuizAnalytics } from "../../services/groq";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

interface Props {
  questions: Question[];
  userAnswers: string[];
  onRestart: () => void;
  isHistoryView?: boolean;
  quizId?: string | null;
}

export default function QuizResults({
  questions,
  userAnswers,
  onRestart,
  isHistoryView,
  quizId,
}: Props) {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const [generatingAnalytics, setGeneratingAnalytics] = useState(false);
  const [hasAnalytics, setHasAnalytics] = useState(false);

  const score = questions.reduce(
    (acc, q, idx) => (q.correctAnswer === userAnswers[idx] ? acc + 1 : acc),
    0
  );

  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    // Check if analytics exists for this quiz
    const checkAnalytics = async () => {
      if (!quizId) return;

      const { data } = await supabase
        .from("quiz_analytics")
        .select("id")
        .eq("quiz_id", quizId)
        .single();

      setHasAnalytics(!!data);
    };

    checkAnalytics();
  }, [quizId]);

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleGenerateAnalytics = async () => {
    try {
      setGeneratingAnalytics(true);

      // Get the quiz ID from the URL if in history view
      const urlParams = new URLSearchParams(window.location.search);
      const currentQuizId = urlParams.get("id") || quizId;

      if (!currentQuizId) {
        console.error("No quiz ID found");
        return;
      }

      // Generate analytics
      const analysis = await generateQuizAnalytics(questions, userAnswers);

      // Get user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      // if (!user) throw new Error("No user found");

      // Store analytics in Supabase
      const { error } = await supabase.from("quiz_analytics").insert({
        quiz_id: currentQuizId,
        analysis,
      });

      if (error) throw error;

      // Navigate to analytics page
      navigate(`/quiz-analytics/${currentQuizId}`);
    } catch (error) {
      console.error("Error generating analytics:", error);
    } finally {
      setGeneratingAnalytics(false);
    }
  };

  // Determine performance message
  let performanceMessage = "";
  let performanceColor = "";

  if (percentage >= 90) {
    performanceMessage = "Outstanding! You're a master of this topic!";
    performanceColor = "text-green-600";
  } else if (percentage >= 70) {
    performanceMessage = "Great job! You have a solid understanding.";
    performanceColor = "text-green-600";
  } else if (percentage >= 50) {
    performanceMessage = "Good effort! Keep practicing to improve.";
    performanceColor = "text-yellow-600";
  } else {
    performanceMessage = "Keep learning! This topic needs more study.";
    performanceColor = "text-red-600";
  }

  return (
    <div className="p-6">
      <div className="px-0 pt-0 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-4">
          <Trophy className="w-12 h-12 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          {isHistoryView ? "Quiz Results" : "Quiz Complete!"}
        </h2>
        <p className="text-gray-500">
          {isHistoryView ? "Review your performance" : "See how well you did"}
        </p>
      </div>

      <div className="px-0 pb-0">
        <div className="text-center mb-10">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-gray-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="text-blue-500"
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                strokeDasharray="264"
                strokeDashoffset={264 - (percentage / 100) * 264}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold text-gray-800">
                {percentage}%
              </span>
              <span className="text-sm text-gray-500">
                {score} of {questions.length} correct
              </span>
            </div>
          </div>
          <p className={`text-lg font-medium ${performanceColor}`}>
            {performanceMessage}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {questions.map((q, idx) => {
            const isCorrect = q.correctAnswer === userAnswers[idx];
            return (
              <div
                key={idx}
                className="border rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <div className="relative">
                  <div
                    className={`absolute top-0 left-0 w-1 h-full ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 p-1 rounded-full ${
                            isCorrect
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-800">
                            {q.question}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Your answer: {userAnswers[idx]}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleItem(idx)}
                        className="p-0 h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        {openItems[idx] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {openItems[idx] && (
                    <div className="p-4 pt-0">
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm mb-1">
                          <span className="font-medium text-blue-600">
                            Correct answer:
                          </span>{" "}
                          <span className="text-gray-800">
                            {q.correctAnswer}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded-md">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          {quizId && (
            <>
              {hasAnalytics ? (
                <button
                  onClick={() => navigate(`/quiz-analytics/${quizId}`)}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:opacity-90 transition-all"
                >
                  <Brain className="w-5 h-5 mr-2 inline-block" />
                  View Analytics
                </button>
              ) : (
                <button
                  onClick={handleGenerateAnalytics}
                  disabled={generatingAnalytics}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {generatingAnalytics ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" />
                      Generating Analysis...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2 inline-block" />
                      AI Mentor Analysis
                    </>
                  )}
                </button>
              )}
            </>
          )}

          <button
            onClick={onRestart}
            className="w-full py-4 px-6 rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-blue-300 transition-all"
          >
            <RefreshCw className="w-5 h-5 mr-2 inline-block" />
            {isHistoryView ? "Back to History" : "Try Another Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
