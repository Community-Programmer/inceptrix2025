"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Upload, Loader2, FileText } from "lucide-react";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";
import { generatePdfChat } from "../../services/groq";
import ReactMarkdown from "react-markdown";
import "pdfjs-dist/build/pdf.worker.mjs";

// Set worker path
//@ts-ignore
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PdfChat() {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedPdfContent = sessionStorage.getItem("pdfContent");
    const storedPdfUrl = sessionStorage.getItem("pdfUrl");
    const storedPdfName = sessionStorage.getItem("pdfName");

    if (storedPdfContent && storedPdfUrl) {
      setPdfText(storedPdfContent);
      setPdfUrl(storedPdfUrl);
      setPdfName(storedPdfName || "Uploaded PDF");

      setMessages([
        {
          role: "assistant",
          content: `I've loaded "${
            storedPdfName || "your PDF"
          }". You can now ask questions about its content.`,
        },
      ]);

      sessionStorage.removeItem("pdfContent");
      sessionStorage.removeItem("pdfUrl");
      sessionStorage.removeItem("pdfName");
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.type !== "application/pdf") {
      return;
    }

    try {
      setUploading(true);
      setPdfName(file.name);

      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);

      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer })
        .promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + " ";
      }

      setPdfText(fullText);
      await pdf.destroy();

      setMessages([
        {
          role: "assistant",
          content: `I've loaded "${file.name}". You can now ask questions about its content.`,
        },
      ]);
    } catch (error) {
      console.error("Error processing PDF:", error);
      setPdfUrl("");
      setPdfText("");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !pdfText) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await generatePdfChat(pdfText, userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
            <MessageSquare className="mx-auto h-16 w-16 text-white" />
            <h2 className="mt-2 text-4xl font-bold text-white">
              Chat with PDF
            </h2>
            <p className="mt-2 text-xl text-blue-100 max-w-2xl mx-auto">
              Upload a PDF and ask questions about its content
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* PDF Preview */}
          <div className="lg:w-1/2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {pdfName || "PDF Preview"}
              </h3>
            </div>
            <div className="p-6">
              {!pdfUrl ? (
                <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8">
                  <Upload className="h-16 w-16 text-blue-400 mb-4" />
                  <p className="text-gray-700 text-lg mb-2">
                    Upload your PDF to get started
                  </p>
                  <p className="text-gray-500 text-sm mb-6 text-center">
                    Drag and drop your file here or click the button below
                  </p>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    onClick={handleUploadClick}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2 inline" />
                        Upload PDF
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
              ) : (
                <div className="h-[600px]">
                  {uploading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full rounded-md bg-white"
                      title="PDF Preview"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:w-1/2 flex flex-col h-[700px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                AI Assistant
              </h3>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden p-0">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-700 text-lg">
                        No conversation yet
                      </p>
                      <p className="text-gray-500 text-sm mt-2 max-w-md">
                        {pdfText
                          ? "Ask a question about your PDF to get started"
                          : "Upload a PDF first, then ask questions about its content"}
                      </p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <ReactMarkdown
                            components={{
                              div: ({ node, ...props }) => (
                                <div
                                  className="prose prose-sm max-w-none"
                                  {...props}
                                />
                              ),
                              strong: ({ node, ...props }) => (
                                <span
                                  className="font-semibold text-blue-600"
                                  {...props}
                                />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className="border-l-4 border-blue-400 pl-4 italic"
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="list-disc pl-4 space-y-1"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-lg font-semibold mt-2 mb-1 text-blue-600"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    pdfText
                      ? "Ask a question about your PDF..."
                      : "Upload a PDF first"
                  }
                  disabled={!pdfText || loading}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!pdfText || loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Animation keyframes */}
        <style jsx>{`
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
    </div>
  );
}
