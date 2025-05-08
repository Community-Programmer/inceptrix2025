// src/lib/api.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Define the expected structure of insights
export interface SalaryRange {
  role: string;
  min: number;
  max: number;
  median: number;
  location: string;
}

export interface IndustryInsights {
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  topSkills: string[];
  marketOutlook: 'Positive' | 'Neutral' | 'Negative';
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: string; // or Date if you convert later
  nextUpdate: string;  // or Date if you convert later
}

/**
 * Fetch industry insights from the API
 * @param industry - The industry to get insights for
 * @returns The industry insights data
 */
export const getIndustryInsights = async (industry: string): Promise<IndustryInsights> => {
  try {
    const response = await fetch(`${API_URL}/industry/insights/${industry}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch industry insights');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching industry insights:', error);
    throw error;
  }
};

/**
 * Force refresh industry insights
 * @param industry - The industry to refresh insights for
 * @returns The updated industry insights data
 */
export const refreshIndustryInsights = async (industry: string): Promise<IndustryInsights> => {
  try {
    const response = await fetch(`${API_URL}/industry/insights/${industry}/refresh`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh industry insights');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error refreshing industry insights:', error);
    throw error;
  }
};
