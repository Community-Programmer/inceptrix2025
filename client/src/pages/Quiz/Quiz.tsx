import React, { useState, useEffect } from "react";
import { Brain, Sparkles } from "lucide-react";
import QuizSetup from "./QuizSetup";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import { generateQuestions } from "../../services/groq";
import { supabase } from "../../lib/supabase";
import type { Question, QuizConfig } from "../../types/quiz";

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);

  useEffect(() => {
    const storedTopic = sessionStorage.getItem("quizTopic");
    const storedContent = sessionStorage.getItem("quizContent");

    if (storedTopic) {
      setQuizConfig({
        topic: storedTopic,
        difficulty: "medium",
        numQuestions: 5,
        ...(storedContent && { pdfContent: storedContent }),
      });

      sessionStorage.removeItem("quizTopic");
      sessionStorage.removeItem("quizContent");
    }
  }, []);

  const handleStart = async (config: QuizConfig) => {
    setLoading(true);
    setError(null);
    setQuizConfig(config);

    try {
      const generatedQuestions = await generateQuestions(config);
      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setUserAnswers([]);
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
    }
    setLoading(false);
  };

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      const score = newAnswers.reduce(
        (acc, ans, idx) =>
          questions[idx].correctAnswer === ans ? acc + 1 : acc,
        0
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (quizConfig) {
        const { data, error } = await supabase
          .from("quiz_history")
          .insert({
            topic: quizConfig.topic,
            score,
            total_questions: questions.length,
            questions,
            answers: newAnswers,
          })
          .select()
          .single();

        if (!error && data) {
          setQuizId(data.id);
        }
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setError(null);
    setQuizConfig(null);
    setQuizId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header with animated background */}
        <div className="relative py-16 px-4 sm:px-6 lg:px-8 mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl">
          {/* Animated grid background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff1a_1px,transparent_1px),linear-gradient(135deg,#ffffff1a_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          {/* Animated particles */}
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
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Quiz Master</h2>
            <p className="mt-2 text-xl text-blue-100 max-w-2xl mx-auto">
              Test your knowledge and challenge yourself on any topic
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-blue-500" />
                </div>
                <p className="mt-6 text-gray-800">Generating your quiz...</p>
                <p className="text-sm text-gray-600 max-w-md text-center mt-2">
                  Our AI is crafting challenging questions based on your
                  selected topic
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
                  <Brain className="w-12 h-12 text-red-500" />
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
                >
                  Try Again
                </button>
              </div>
            ) : questions.length === 0 ? (
              <QuizSetup onStart={handleStart} />
            ) : userAnswers.length === questions.length ? (
              <QuizResults
                questions={questions}
                userAnswers={userAnswers}
                onRestart={handleRestart}
                //@ts-ignore
                quizId={quizId}
              />
            ) : (
              <QuizQuestion
                question={questions[currentQuestion]}
                onAnswer={handleAnswer}
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
              />
            )}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style
        //@ts-ignore
        jsx
      >{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(10px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
