import { useState, useEffect } from 'react';
import type { Problem } from '@/types';

interface ProblemTableProps {
  problems: Problem[];
  selectedSort: string;
  selectedDifficulty: string;
}

const ProblemTable = ({ problems, selectedSort, selectedDifficulty }: ProblemTableProps) => {
  const [sortedProblems, setSortedProblems] = useState<Problem[]>(problems);
  const [attemptedProblems, setAttemptedProblems] = useState<Record<string, boolean>>({});
  const [solvedDates, setSolvedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    let filteredProblems = [...problems];

    // Apply difficulty filter
    if (selectedDifficulty) {
      filteredProblems = filteredProblems.filter(
        problem => problem.difficulty === selectedDifficulty
      );
    }

    // Apply sorting
    if (selectedSort) {
      filteredProblems.sort((a, b) => {
        switch (selectedSort) {
          case 'difficulty-asc':
            return difficultyWeight(a.difficulty) - difficultyWeight(b.difficulty);
          case 'difficulty-desc':
            return difficultyWeight(b.difficulty) - difficultyWeight(a.difficulty);
          case 'frequency-asc':
            return a.frequency - b.frequency;
          case 'frequency-desc':
            return b.frequency - a.frequency;
          default:
            return 0;
        }
      });
    }

    setSortedProblems(filteredProblems);
  }, [problems, selectedSort, selectedDifficulty]);

  useEffect(() => {
    // Load attempted problems from localStorage
    const loadAttemptedProblems = () => {
      const attempted = JSON.parse(localStorage.getItem('attemptedProblems') || '{}');
      const dates = JSON.parse(localStorage.getItem('solvedDates') || '{}');
      setAttemptedProblems(attempted);
      setSolvedDates(dates);
    };

    loadAttemptedProblems();
  }, []);

  const difficultyWeight = (difficulty: string): number => {
    switch (difficulty) {
      case 'Easy':
        return 1;
      case 'Medium':
        return 2;
      case 'Hard':
        return 3;
      default:
        return 0;
    }
  };

  const handleAttemptChange = (problemId: string, checked: boolean) => {
    const newAttempted = { ...attemptedProblems, [problemId]: checked };
    const newDates = { ...solvedDates };
    
    if (checked) {
      newDates[problemId] = new Date().toISOString().split('T')[0];
    } else {
      delete newDates[problemId];
    }

    setAttemptedProblems(newAttempted);
    setSolvedDates(newDates);
    localStorage.setItem('attemptedProblems', JSON.stringify(newAttempted));
    localStorage.setItem('solvedDates', JSON.stringify(newDates));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Frequency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Link
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Attempted
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date Solved
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {sortedProblems.map((problem) => (
            <tr key={problem.id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {problem.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {problem.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {problem.frequency.toFixed(2)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <a
                  href={problem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
                  onClick={(e) => {
                    if (!problem.link) {
                      e.preventDefault();
                      return;
                    }
                  }}
                >
                  <span>View</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={attemptedProblems[problem.id] || false}
                  onChange={(e) => handleAttemptChange(problem.id, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {solvedDates[problem.id] || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemTable; 