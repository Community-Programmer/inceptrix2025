import Groq from "groq-sdk";

// Ensure GROQ API key is configured
if (!import.meta.env.VITE_GROQ_API_KEY) {
  throw new Error("GROQ API key is not configured");
}

// Initialize GROQ SDK with proper configuration
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
/**
 * Generate a learning roadmap for a given topic with enhanced detail and structure
 */
export async function generateRoadmap(topic: string): Promise<any> {
  try {
    const prompt = `Create a comprehensive and detailed learning roadmap for "${topic}". The roadmap should be extremely detailed and include:

1. Clear progression from beginner to advanced levels
2. Required skills and technologies with detailed explanations
3. Extensive list of learning resources including:
   - Official documentation
   - Interactive tutorials
   - Video courses
   - Books
   - Practice exercises
4. Best practices and industry standards
5. Common pitfalls and how to avoid them
6. Detailed project ideas with increasing complexity
7. Recommended tools and development environment setup
8. Estimated time frames for each stage
9. Career progression opportunities
10. Industry certifications if applicable

IMPORTANT: Your response must be a valid JSON object. Do not include any text before or after the JSON object.

Format:
{
  "title": "Main topic title",
  "description": "Comprehensive overview of the learning path",
  "stages": [
    {
      "level": "Beginner/Intermediate/Advanced",
      "title": "Stage title",
      "description": "Detailed description of this stage",
      "skills": [
        {
          "name": "Skill name",
          "description": "Detailed explanation of the skill",
          "importance": "Why this skill is crucial"
        }
      ],
      "resources": [
        {
          "name": "Resource name",
          "type": "Documentation/Tutorial/Course/Book/Video",
          "url": "URL if applicable",
          "description": "Detailed description of the resource",
          "format": "Text/Video/Interactive",
          "difficulty": "Beginner/Intermediate/Advanced",
          "estimated_time": "Time to complete this resource",
          "prerequisites": ["Required prerequisites"],
          "cost": "Free/Paid/Subscription"
        }
      ],
      "timeframe": "Estimated time to complete this stage",
      "projects": [
        {
          "name": "Project name",
          "description": "Detailed project description",
          "learning_objectives": ["What you'll learn"],
          "features": ["Key features to implement"],
          "skills_practiced": ["Skills you'll practice"],
          "difficulty": "Beginner/Intermediate/Advanced",
          "estimated_time": "Time to complete",
          "resources": ["Helpful resources for this project"],
          "next_steps": ["How to extend this project"]
        }
      ],
      "best_practices": [
        {
          "title": "Best practice name",
          "description": "Detailed explanation",
          "examples": ["Good and bad examples"]
        }
      ],
      "common_pitfalls": [
        {
          "issue": "Pitfall description",
          "solution": "How to avoid or resolve it"
        }
      ]
    }
  ],
  "tools": [
    {
      "name": "Tool name",
      "category": "Category of tool",
      "description": "Detailed description",
      "url": "Official website/docs",
      "setup_guide": "Basic setup instructions",
      "alternatives": ["Alternative tools"],
      "pros": ["Advantages"],
      "cons": ["Disadvantages"]
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "provider": "Certification provider",
      "level": "Beginner/Intermediate/Advanced",
      "description": "What the certification covers",
      "url": "Official certification page",
      "cost": "Certification cost",
      "validity": "How long it's valid",
      "preparation_resources": ["Study resources"]
    }
  ],
  "career_path": {
    "roles": ["Possible job roles"],
    "skills_required": ["Required skills for each role"],
    "progression": ["Career progression steps"],
    "salary_range": "Typical salary range"
  }
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
      response_format: { type: "json_object" }, // Enforce JSON response
    });

    const response = completion.choices[0]?.message?.content || "{}";

    try {
      const parsedResponse = JSON.parse(response);

      // Validate the required structure
      if (!parsedResponse.stages || !Array.isArray(parsedResponse.stages)) {
        throw new Error(
          "Invalid roadmap structure: missing or invalid stages array"
        );
      }

      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing roadmap JSON:", parseError);
      // Return a minimal valid structure
      return {
        title: topic,
        description: "Unable to generate detailed roadmap at this time.",
        stages: [],
        tools: [],
        certifications: [],
        career_path: {
          roles: [],
          skills_required: [],
          progression: [],
          salary_range: "Not available",
        },
      };
    }
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap");
  }
}



