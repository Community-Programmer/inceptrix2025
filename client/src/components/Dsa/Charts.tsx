import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import type { Problem } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ChartsProps {
  problems: Problem[];
}

const Charts = ({ problems }: ChartsProps) => {
  const [difficultyData, setDifficultyData] = useState({
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
      borderColor: ['#16a34a', '#ca8a04', '#dc2626'],
      borderWidth: 1,
    }],
  });

  const [frequencyData, setFrequencyData] = useState({
    labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
    datasets: [{
      label: 'Number of Problems',
      data: [0, 0, 0, 0, 0],
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      borderWidth: 1,
    }],
  });

  useEffect(() => {
    // Calculate difficulty distribution
    const difficultyCounts = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };

    problems.forEach(problem => {
      difficultyCounts[problem.difficulty]++;
    });

    setDifficultyData(prev => ({
      ...prev,
      datasets: [{
        ...prev.datasets[0],
        data: [difficultyCounts.Easy, difficultyCounts.Medium, difficultyCounts.Hard],
      }],
    }));

    // Calculate frequency distribution
    const frequencyRanges = [0, 0, 0, 0, 0];
    problems.forEach(problem => {
      const frequency = problem.frequency;
      if (frequency <= 20) frequencyRanges[0]++;
      else if (frequency <= 40) frequencyRanges[1]++;
      else if (frequency <= 60) frequencyRanges[2]++;
      else if (frequency <= 80) frequencyRanges[3]++;
      else frequencyRanges[4]++;
    });

    setFrequencyData(prev => ({
      ...prev,
      datasets: [{
        ...prev.datasets[0],
        data: frequencyRanges,
      }],
    }));
  }, [problems]);

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Difficulty Distribution</h3>
        <div className="h-64">
          <Pie data={difficultyData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Frequency Distribution</h3>
        <div className="h-64">
          <Bar
            data={frequencyData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: '#9ca3af',
                  },
                  grid: {
                    color: '#374151',
                  },
                },
                x: {
                  ticks: {
                    color: '#9ca3af',
                  },
                  grid: {
                    color: '#374151',
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Charts; 