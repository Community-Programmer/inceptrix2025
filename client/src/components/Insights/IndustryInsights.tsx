"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { getIndustryInsights, refreshIndustryInsights } from "../../lib/api";
import DashboardView from "./DashboardView";
import { RefreshCw } from "lucide-react";

interface SalaryRange {
  role: string;
  min: number;
  max: number;
  median: number;
}

interface IndustryInsightsData {
  marketOutlook: string;
  growthRate: number;
  demandLevel: string;
  topSkills: string[];
  recommendedSkills: string[];
  salaryRanges: SalaryRange[];
  keyTrends: string[];
  lastUpdated: string;
  nextUpdate: string;
}

function IndustryInsights() {
  const [insights, setInsights] = useState<IndustryInsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const industryParam = searchParams.get("industry");
    if (industryParam) {
      setIndustry(industryParam);
      fetchInsights(industryParam);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchInsights = async (industryName: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIndustryInsights(industryName);
      setInsights(data);
    } catch (err) {
      setError("Failed to load industry insights. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (industry.trim()) {
      fetchInsights(industry);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await refreshIndustryInsights(industry);
      setInsights(data);
    } catch (err) {
      setError("Failed to refresh insights. Please try again.");
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
          Industry{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Insights
          </span>
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Enter industry (e.g., Software Development)"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              disabled={loading || !industry.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
            >
              {loading ? "Loading..." : "Get Insights"}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 shadow-sm">
            {error}
          </div>
        )}

        {insights && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {industry} Industry Insights
              </h2>
              <button
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 text-gray-700"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh Insights"}
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-gray-100">
              <DashboardView insights={insights} />
            </div>
          </div>
        )}

        {!insights && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-gray-100">
            <div className="max-w-md mx-auto">
              <p className="text-gray-600">
                Enter an industry above to get insights powered by Gemini AI
              </p>
              <div className="mt-6 w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IndustryInsights;
