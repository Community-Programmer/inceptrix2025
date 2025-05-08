import { useState, useEffect } from 'react';
import { CompanyData, Problem } from '@/types';
import Header from './Header';
import Filters from './Filters';
import ProblemTable from './ProblemTable';
import Charts from './Charts';

const App = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({});
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch('/company_data.json');
        const data = await response.json();
        setCompanyData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading company data:', error);
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      if (selectedCompany && selectedDuration) {
        try {
          const response = await fetch(`/data/LeetCode-Questions-CompanyWise/${selectedCompany}_${selectedDuration}.csv`);
          const csvText = await response.text();
          const parsedProblems = parseCSV(csvText);
          setProblems(parsedProblems);
        } catch (error) {
          console.error('Failed to load problems:', error);
        }
      }
    };

    fetchProblems();
  }, [selectedCompany, selectedDuration]);

  const parseCSV = (csvText: string): Problem[] => {
    const rows = csvText.split('\n').filter(row => row.trim());
    const headers = rows[0].split(',');
    return rows.slice(1).map(row => {
      const values = row.split(',');
      return {
        id: values[0],
        title: values[1],
        difficulty: values[2] as 'Easy' | 'Medium' | 'Hard',
        frequency: parseFloat(values[3]),
        link: values[4],
        attempted: false,
        dateSolved: ''
      };
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />
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
        />
        <ProblemTable
          problems={problems}
          selectedSort={selectedSort}
          selectedDifficulty={selectedDifficulty}
        />
        <Charts problems={problems} />
      </div>
    </div>
  );
};

export default App; 