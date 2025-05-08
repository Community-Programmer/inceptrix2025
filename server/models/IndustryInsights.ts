// models/IndustryInsight.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// TypeScript interface for a salary range
interface SalaryRange {
  role: string;
  min: number;
  max: number;
  median: number;
  location: string;
}

// Interface for the entire IndustryInsight document
export interface IndustryInsightDocument extends Document {
  industry: string;
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  topSkills: string[];
  marketOutlook: 'Positive' | 'Neutral' | 'Negative';
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: Date;
  nextUpdate: Date;
}

// Schema for salary ranges
const salaryRangeSchema = new Schema<SalaryRange>({
  role: { type: String, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  median: { type: Number, required: true },
  location: { type: String, required: true }
});

// Schema for industry insights
const industryInsightSchema = new Schema<IndustryInsightDocument>({
  industry: {
    type: String,
    required: true,
    index: true
  },
  salaryRanges: [salaryRangeSchema],
  growthRate: { type: Number, required: true },
  demandLevel: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  topSkills: { type: [String], required: true },
  marketOutlook: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
    required: true
  },
  keyTrends: { type: [String], required: true },
  recommendedSkills: { type: [String], required: true },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  nextUpdate: {
    type: Date,
    default: (): Date => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});

const IndustryInsight: Model<IndustryInsightDocument> = mongoose.model<IndustryInsightDocument>('IndustryInsight', industryInsightSchema);
export default IndustryInsight;
