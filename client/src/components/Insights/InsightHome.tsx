import type React from "react";
import { Link } from "react-router-dom";

const sampleIndustries: string[] = [
  "Software Development",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
];

const InsightHome: React.FC = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-white to-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Industry Insights{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Dashboard
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Get AI-powered insights about salary ranges, demand levels, top
          skills, and market trends for various industries.
        </p>

        <div className="mb-16">
          <Link
            to="/industry-insights"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            aria-label="Explore all industries"
          >
            Explore Industries
          </Link>
        </div>

        <div className="mt-16 relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 blur-3xl"></div>

          <h2 className="text-2xl font-semibold mb-8 text-gray-800 relative z-10">
            Popular Industries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {sampleIndustries.map((industry: string) => (
              <Link
                key={industry}
                to={`/industry-insights?industry=${encodeURIComponent(
                  industry
                )}`}
                className="p-5 bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-gray-800"
                aria-label={`Explore insights for ${industry}`}
              >
                {industry}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightHome;
