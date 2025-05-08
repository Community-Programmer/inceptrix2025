import { useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { getIndustryInsights, refreshIndustryInsights } from '../../lib/api'
import DashboardView from "./DashboardView";

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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Industry Insights</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter industry (e.g., Software Development)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          disabled={loading || !industry.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
        >
          {loading ? "Loading..." : "Get Insights"}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {insights && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{industry} Industry Insights</h2>
            <button
              className="px-4 py-2 bg-gray-200 rounded-md disabled:bg-gray-100"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh Insights"}
            </button>
          </div>
          <DashboardView insights={insights} />
        </div>
      )}

      {!insights && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Enter an industry above to get insights powered by Gemini AI
          </p>
        </div>
      )}
    </div>
  );
}

export default IndustryInsights;
