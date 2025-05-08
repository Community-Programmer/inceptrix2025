// services/geminiService.ts
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Define types for AI insights
export interface SalaryRange {
  role: string;
  min: number;
  max: number;
  median: number;
  location: string;
}

export interface AIInsights {
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  topSkills: string[];
  marketOutlook: 'Positive' | 'Neutral' | 'Negative';
  keyTrends: string[];
  recommendedSkills: string[];
}

// Initialize Gemini AI (recommended: move key to env variable)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model: GenerativeModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate industry insights using Gemini AI
 * @param industry - The industry to analyze
 * @returns JSON object with industry insights
 */
export const generateAIInsights = async (industry: string): Promise<AIInsights> => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
    
    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, '').trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw new Error('Failed to generate industry insights');
  }
};
