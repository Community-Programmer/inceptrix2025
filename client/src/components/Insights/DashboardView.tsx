import React from "react";
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
  Briefcase as BriefcaseIcon,
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
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(insights.marketOutlook);

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="px-2 py-1 border rounded-full text-sm">
          Last updated: {lastUpdatedDate}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Market Outlook</h3>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </div>
          <div className="text-2xl font-bold">{insights.marketOutlook}</div>
          <p className="text-xs text-gray-500">Next update {nextUpdateDistance}</p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Industry Growth</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(insights.growthRate * 2, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Demand Level</h3>
            <BriefcaseIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{insights.demandLevel}</div>
          <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`}></div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Top Skills</h3>
            <Brain className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-1">
            {insights.topSkills.map((skill) => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-sm rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Chart */}
      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Salary Ranges by Role</h2>
          <p className="text-sm text-gray-500">
            Displaying minimum, median, and maximum salaries (in thousands)
          </p>
        </div>
        <div className="p-4">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Key Industry Trends</h2>
            <p className="text-sm text-gray-500">Current trends shaping the industry</p>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-600" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recommended Skills</h2>
            <p className="text-sm text-gray-500">Skills to consider developing</p>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <span key={skill} className="px-3 py-1 border rounded-full text-sm">
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
