import type React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, formatDistanceToNow } from "date-fns";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";

// Define expected types for insights props
interface SalaryRange {
  role: string;
  min: number;
  max: number;
  median: number;
  location: string;
}

interface IndustryInsights {
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: "High" | "Medium" | "Low";
  topSkills: string[];
  marketOutlook: "Positive" | "Neutral" | "Negative";
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: string;
  nextUpdate: string;
}

interface DashboardViewProps {
  insights: IndustryInsights;
}

const DashboardView: React.FC<DashboardViewProps> = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-gradient-to-r from-green-400 to-green-500";
      case "medium":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500";
      case "low":
        return "bg-gradient-to-r from-red-400 to-red-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook: string) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(
    insights.marketOutlook
  );

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm shadow-sm">
          Last updated: {lastUpdatedDate}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-medium text-gray-600">
              Market Outlook
            </h3>
            <OutlookIcon className={`h-5 w-5 ${outlookColor}`} />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {insights.marketOutlook}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Next update {nextUpdateDistance}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-medium text-gray-600">
              Industry Growth
            </h3>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {insights.growthRate.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full"
              style={{ width: `${Math.min(insights.growthRate * 2, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-medium text-gray-600">Demand Level</h3>
            <BriefcaseIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {insights.demandLevel}
          </div>
          <div
            className={`h-2.5 w-full rounded-full mt-3 ${getDemandLevelColor(
              insights.demandLevel
            )}`}
          ></div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-medium text-gray-600">Top Skills</h3>
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {insights.topSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-gray-50 text-sm rounded-full border border-gray-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Chart */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Salary Ranges by Role
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Displaying minimum, median, and maximum salaries (in thousands)
          </p>
        </div>
        <div className="p-5">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-gray-800">{label}</p>
                          {payload.map((item) => (
                            <p
                              key={item.name}
                              className="text-sm text-gray-600"
                            >
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trends and Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Key Industry Trends
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Current trends shaping the industry
            </p>
          </div>
          <div className="p-5">
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                  <span className="text-gray-700">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Recommended Skills
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Skills to consider developing
            </p>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-sm shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
