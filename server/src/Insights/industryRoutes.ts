// routes/industryRoutes.ts
import express, { Request, Response } from 'express';
const router = express.Router();
import IndustryInsight from '../../models/IndustryInsights';
import { generateAIInsights, AIInsights } from '../services/geminiServices';

/**
 * Get insights for a specific industry
 * If insights don't exist or are outdated, generate new ones
 */
router.get('/insights/:industry', async (req: Request, res: Response) => {
  try {
    const { industry } = req.params;

    // Find existing insights
    let insights = await IndustryInsight.findOne({ 
      industry: industry.toLowerCase(),
      nextUpdate: { $gt: new Date() } // Only consider insights that aren't outdated
    });

    // If no insights exist or they're outdated, generate new ones
    if (!insights) {
      const aiInsights: AIInsights = await generateAIInsights(industry);

      insights = await IndustryInsight.findOneAndUpdate(
        { industry: industry.toLowerCase() },
        { 
          ...aiInsights,
          industry: industry.toLowerCase(),
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        { new: true, upsert: true }
      );
    }

    res.json(insights);
  } catch (error) {
    console.error('Error fetching industry insights:', error);
    res.status(500).json({ error: 'Failed to fetch industry insights' });
  }
});

/**
 * Force refresh insights for a specific industry
 */
router.post('/insights/:industry/refresh', async (req: Request, res: Response) => {
  try {
    const { industry } = req.params;

    // Generate new insights
    const aiInsights: AIInsights = await generateAIInsights(industry);

    // Update in database
    const insights = await IndustryInsight.findOneAndUpdate(
      { industry: industry.toLowerCase() },
      { 
        ...aiInsights,
        industry: industry.toLowerCase(),
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      { new: true, upsert: true }
    );

    res.json(insights);
  } catch (error) {
    console.error('Error refreshing industry insights:', error);
    res.status(500).json({ error: 'Failed to refresh industry insights' });
  }
});

export default router;
