import { useState, useEffect } from 'react';
import type { CompanyData, Problem } from '@/types';
import Charts from '@/components/Dsa/Charts';
import Header from '@/components/Dsa/Header';
import Filters from '@/components/Dsa/Filters';
import ProblemTable from '@/components/Dsa/ProblemTable';

const InterviewQues = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({});
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch('/company_data.json');
        if (!response.ok) {
          throw new Error('Failed to load company data');
        }
        const data = await response.json();
        setCompanyData(data);
        setError(null);
      } catch (error) {
        console.error('Error loading company data:', error);
        setError('Failed to load company data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      if (selectedCompany && selectedDuration) {
        setLoadingQuestions(true);
        setError(null);
        try {
          const response = await fetch(`/data/LeetCode-Questions-CompanyWise/${selectedCompany}_${selectedDuration}.csv`);
          if (!response.ok) {
            throw new Error('Failed to load questions');
          }
          const csvText = await response.text();
          const parsedProblems = parseCSV(csvText);
          setProblems(parsedProblems);
        } catch (error) {
          console.error('Failed to load problems:', error);
          setError('Failed to load questions. Please try again later.');
          setProblems([]);
        } finally {
          setLoadingQuestions(false);
        }
      } else {
        setProblems([]);
      }
    };

    fetchProblems();
  }, [selectedCompany, selectedDuration]);

  const parseCSV = (csvText: string): Problem[] => {
    const rows = csvText.split('\n').filter(row => row.trim());
    const headers = rows[0].split(',');
    return rows.slice(1).map(row => {
      const values = row.split(',').map(value => value.trim());
      return {
        id: values[0],
        title: values[1],
        difficulty: values[3] as 'Easy' | 'Medium' | 'Hard',
        frequency: parseFloat(values[4]),
        link: values[5].trim(),
        attempted: false,
        dateSolved: ''
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-lg">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header companyName={selectedCompany} />
        <Filters
          companyData={companyData}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          isLoading={loadingQuestions}
        />
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {loadingQuestions ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-lg">Loading questions...</p>
            </div>
          </div>
        ) : (
          <>
            <ProblemTable
              problems={problems}
              selectedSort={selectedSort}
              selectedDifficulty={selectedDifficulty}
            />
            <Charts problems={problems} />
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewQues;
