import type { CompanyData } from '@/types';

interface FiltersProps {
  companyData: CompanyData;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  isLoading?: boolean;
}

const Filters = ({
  companyData,
  selectedCompany,
  setSelectedCompany,
  selectedDuration,
  setSelectedDuration,
  selectedSort,
  setSelectedSort,
  selectedDifficulty,
  setSelectedDifficulty,
  isLoading = false,
}: FiltersProps) => {
  const formatDuration = (duration: string) => {
    return duration.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const selectClasses = "bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700 transition-all duration-200 hover:bg-gray-700 min-w-[200px]";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-8 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm">
      <div className="relative">
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className={`${selectClasses} ${isLoading ? disabledClasses : ''}`}
          disabled={isLoading}
        >
          <option value="">Select a Company</option>
          {Object.keys(companyData).map((company) => (
            <option key={company} value={company}>
              {company.charAt(0).toUpperCase() + company.slice(1)}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <select
        value={selectedDuration}
        onChange={(e) => setSelectedDuration(e.target.value)}
        className={`${selectClasses} ${(!selectedCompany || isLoading) ? disabledClasses : ''}`}
        disabled={!selectedCompany || isLoading}
      >
        <option value="">Select Duration</option>
        {selectedCompany &&
          companyData[selectedCompany].map((duration) => (
            <option key={duration} value={duration}>
              {formatDuration(duration)}
            </option>
          ))}
      </select>

      <select
        value={selectedSort}
        onChange={(e) => setSelectedSort(e.target.value)}
        className={`${selectClasses} ${isLoading ? disabledClasses : ''}`}
        disabled={isLoading}
      >
        <option value="">Sort By</option>
        <option value="difficulty-asc">Difficulty Ascending</option>
        <option value="difficulty-desc">Difficulty Descending</option>
        <option value="frequency-asc">Frequency Ascending</option>
        <option value="frequency-desc">Frequency Descending</option>
      </select>

      <select
        value={selectedDifficulty}
        onChange={(e) => setSelectedDifficulty(e.target.value)}
        className={`${selectClasses} ${isLoading ? disabledClasses : ''}`}
        disabled={isLoading}
      >
        <option value="">Filter by Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
};

export default Filters; 