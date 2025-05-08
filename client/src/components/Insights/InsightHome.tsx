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
    <div className="py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Industry Insights Dashboard</h1>
        <p className="text-xl mb-8">
          Get AI-powered insights about salary ranges, demand levels, top skills,
          and market trends for various industries.
        </p>

        <div className="mb-12">
          <Link
            to="/industry-insights"
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            aria-label="Explore all industries"
          >
            Explore Industries
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Popular Industries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleIndustries.map((industry: string) => (
              <Link
                key={industry}
                to={`/industry-insights?industry=${encodeURIComponent(industry)}`}
                className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
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
