"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  Brain,
  Loader2,
  AlertTriangle,
  Download,
  Printer,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function QuizAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      setError("No quiz ID provided");
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("quiz_analytics")
        .select("*")
        .eq("quiz_id", id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          setError("Analytics not found for this quiz");
        } else {
          setError("Error fetching analytics");
        }
        return;
      }

      if (!data?.analysis) {
        setError("No analysis available for this quiz");
        return;
      }

      setAnalytics(data.analysis);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Quiz Analytics",
        text: "Check out my quiz analytics!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDownload = async () => {
    if (!contentRef.current || !analytics) return;

    try {
      // Capture the full content in a canvas
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: "#ffffff", // Light theme background
        logging: false,
      });

      // Convert the canvas to an image
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Set up PDF dimensions for A4
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm

      // Calculate the image height based on the canvas dimensions and scale
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      // Continue adding pages while there is content left
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save("quiz-analytics.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-blue-500" />
          </div>
          <p className="mt-6 text-xl text-gray-800">
            Analyzing Your Performance...
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we generate your detailed report
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/history")}
            className="inline-flex items-center px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to History
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {error}
            </h2>
            <p className="text-gray-600 mb-6">
              Please try again or return to your quiz history.
            </p>
            <button
              onClick={() => navigate("/history")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
            >
              Return to History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/history")}
              className="inline-flex items-center px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">
                AI Mentor Analysis
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-8">
            <div ref={contentRef} className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pb-2"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-semibold mt-12 mb-6 text-gray-800 border-b border-gray-200 pb-2"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-medium mt-8 mb-4 text-blue-600"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      className="text-lg font-medium mt-6 mb-3 text-gray-700"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-4 text-gray-700 leading-relaxed"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="my-6 ml-6 list-disc [&>li]:mt-2 text-gray-700"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="my-6 ml-6 list-decimal [&>li]:mt-2 text-gray-700"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-gray-700" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className="font-semibold text-blue-600"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="mt-6 border-l-4 border-blue-500 pl-6 italic text-gray-600"
                      {...props}
                    />
                  ),
                  //@ts-ignore
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm font-semibold text-blue-600"
                        {...props}
                      />
                    ) : (
                      <pre className="mt-6 mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4">
                        <code className="text-gray-800 text-sm" {...props} />
                      </pre>
                    ),
                  a: ({ node, ...props }) => (
                    <a
                      className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="my-6 w-full overflow-y-auto">
                      <table
                        className="w-full border-collapse border border-gray-200"
                        {...props}
                      />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700 bg-gray-100"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="border border-gray-200 px-4 py-2 text-gray-700"
                      {...props}
                    />
                  ),
                }}
              >
                {analytics || "No analysis available."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
