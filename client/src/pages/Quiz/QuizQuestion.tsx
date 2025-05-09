"use client";

import { useState } from "react";
import type { Question } from "../../types/quiz";
import { CheckCircle, Clock } from "lucide-react";

interface Props {
  question: Question;
  onAnswer: (answer: string) => void;
  currentQuestion: number;
  totalQuestions: number;
}

export default function QuizQuestion({
  question,
  onAnswer,
  currentQuestion,
  totalQuestions,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAnswer(selectedOption);
      setSelectedOption(null);
      setIsSubmitting(false);
    }, 500);
  };

  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl mb-6 p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {question.question}
        </h3>
        <p className="text-gray-500">Select the best answer</p>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`w-full justify-start text-left h-auto py-4 px-4 rounded-xl border transition-all ${
              selectedOption === option
                ? "bg-blue-50 border-blue-500 text-gray-800"
                : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            <div className="flex items-center w-full">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border ${
                  selectedOption === option
                    ? "border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600"
                    : "border-gray-300"
                } mr-3 flex items-center justify-center`}
              >
                {selectedOption === option && (
                  <CheckCircle className="h-3 w-3 text-white" />
                )}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedOption || isSubmitting}
        className={`w-full py-4 px-6 rounded-xl text-white text-lg font-medium transition-all ${
          !selectedOption || isSubmitting
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:opacity-90"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </button>
    </div>
  );
}
