
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, SimulationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateFutureScenarios(profile: UserProfile): Promise<SimulationResult> {
  const prompt = `
    Act as "FutureMe," an advanced AI that represents the user's future self. 
    Based on the following profile, generate 3 distinct, creative, and realistic life scenarios 5-10 years from now.
    
    User Profile:
    - Current Age: ${profile.age}
    - Occupation: ${profile.occupation}
    - Education: ${profile.education}
    - Goals: ${profile.goals}
    - Challenges: ${profile.challenges}

    Speak directly to the user in a conversational and motivating tone. 
    Each scenario needs a skill radar chart mapping with 5 categories relevant to that path (value 0-100).
  `;

  // Fix: Using gemini-3-pro-preview for complex text tasks involving reasoning and creative roleplay
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scenarios: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING, description: "Memorable name like 'The Tech Maven'" },
                age: { type: Type.STRING, description: "Projected age in this scenario" },
                careerPath: { type: Type.STRING },
                achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
                lifestyle: { type: Type.STRING },
                personalGrowth: { type: Type.STRING },
                advice: { type: Type.STRING, description: "Personalized advice from future self" },
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      subject: { type: Type.STRING },
                      value: { type: Type.NUMBER },
                      fullMark: { type: Type.NUMBER }
                    }
                  }
                },
                actionPlan: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 practical steps" }
              },
              required: ["id", "name", "age", "careerPath", "achievements", "lifestyle", "personalGrowth", "advice", "skills", "actionPlan"]
            }
          }
        },
        required: ["scenarios"]
      }
    }
  });

  // Fix: Use response.text property directly and handle potential undefined value
  const text = response.text;
  if (!text) {
    throw new Error("No response generated from the model.");
  }
  return JSON.parse(text.trim());
}
