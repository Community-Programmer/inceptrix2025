"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Upload, FileText, Lightbulb, Zap } from "lucide-react";
import type { QuizConfig } from "../../types/quiz";
import { extractTextFromPdf } from "../../utils/pdfExtractor";

interface Props {
  onStart: (config: QuizConfig) => void;
  initialConfig?: QuizConfig;
}

export default function QuizSetup({ onStart, initialConfig }: Props) {
  const [topic, setTopic] = useState(initialConfig?.topic || "");
  const [difficulty, setDifficulty] = useState(
    initialConfig?.difficulty || "medium"
  );
  const [numQuestions, setNumQuestions] = useState(
    initialConfig?.numQuestions || 5
  );
  const [quizType, setQuizType] = useState<"topic" | "pdf">("topic");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedPdfContent = sessionStorage.getItem("pdfContent");
    const storedPdfName = sessionStorage.getItem("pdfName");
    const storedTopic = sessionStorage.getItem("quizTopic");

    if (storedPdfContent && storedPdfName) {
      setQuizType("pdf");
      onStart({
        topic: storedPdfName,
        difficulty,
        numQuestions,
        pdfContent: storedPdfContent,
      });
      sessionStorage.removeItem("pdfContent");
      sessionStorage.removeItem("pdfName");
      sessionStorage.removeItem("pdfUrl");
    } else if (storedTopic) {
      setTopic(storedTopic);
      sessionStorage.removeItem("quizTopic");
      sessionStorage.removeItem("quizContent");
    }
  }, []);

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file");
      return;
    }

    try {
      setLoading(true);
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(file);
      const pdfText = await extractTextFromPdf(file);
      onStart({
        topic: file.name,
        difficulty,
        numQuestions,
        pdfContent: pdfText,
      });
    } catch (error) {
      setError("Error processing PDF file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (quizType === "pdf" && pdfFile) {
        const pdfText = await extractTextFromPdf(pdfFile);
        onStart({
          topic: pdfFile.name,
          difficulty,
          numQuestions,
          pdfContent: pdfText,
        });
      } else {
        onStart({ topic, difficulty, numQuestions });
      }
    } catch (error) {
      setError("Error processing PDF file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const popularTopics = [
    { name: "JavaScript Fundamentals", icon: <Zap className="h-4 w-4" /> },
    {
      name: "Machine Learning Basics",
      icon: <Lightbulb className="h-4 w-4" />,
    },
    { name: "World History", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="p-6">
      <div className="px-0 pt-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Setup</h2>
        <p className="text-gray-500">
          Choose a topic or upload a PDF to generate quiz questions
        </p>
      </div>
      <div className="px-0 pb-0 mt-6">
        <div className="mb-6">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuizType("topic")}
              className={`flex-1 py-3 px-4 flex items-center justify-center ${
                quizType === "topic"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              By Topic
            </button>
            <button
              onClick={() => setQuizType("pdf")}
              className={`flex-1 py-3 px-4 flex items-center justify-center ${
                quizType === "pdf"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              From PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {quizType === "topic" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700"
              >
                Topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                readOnly={!!initialConfig?.topic}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a topic for your quiz"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Popular Topics
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {popularTopics.map((popularTopic, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setTopic(popularTopic.name)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  >
                    {popularTopic.icon}
                    <span className="ml-2">{popularTopic.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="numQuestions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Questions
                </label>
                <input
                  type="number"
                  id="numQuestions"
                  min="1"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !topic}
              className={`w-full py-4 px-6 rounded-xl text-white text-lg font-medium transition-all ${
                loading || !topic
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:opacity-90"
              }`}
            >
              {loading ? "Processing..." : "Start Quiz"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="pdf-upload"
                className="block text-sm font-medium text-gray-700"
              >
                Upload PDF
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="pdf-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 mb-3 rounded-full bg-blue-50">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="mb-2 text-sm text-gray-700">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                  </div>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handlePdfChange}
                    required={quizType === "pdf"}
                  />
                </label>
              </div>
              {pdfFile && (
                <div className="flex items-center mt-2 p-2 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <p className="text-sm text-gray-700 truncate">
                    {pdfFile.name}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="numQuestions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Questions
                </label>
                <input
                  type="number"
                  id="numQuestions"
                  min="1"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !pdfFile}
              className={`w-full py-4 px-6 rounded-xl text-white text-lg font-medium transition-all ${
                loading || !pdfFile
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:opacity-90"
              }`}
            >
              {loading ? "Processing..." : "Start Quiz"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
