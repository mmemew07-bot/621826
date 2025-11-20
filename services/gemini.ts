import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { SocialPostsResponse, Tone } from '../types';

// Initialize the client
// The API key is guaranteed to be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-3-pro-preview';
const IMAGE_MODEL = 'imagen-4.0-generate-001';

export const generateSocialText = async (idea: string, tone: Tone): Promise<SocialPostsResponse> => {
  const prompt = `
    Create social media content for the following idea: "${idea}".
    Tone: ${tone}.
    
    Generate 3 distinct posts:
    1. Facebook: Long-form, engaging, community-focused.
    2. Twitter/X: Short, punchy, hashtag-optimized (under 280 chars).
    3. Instagram: Visual-focused caption with hashtags.
    
    For each platform, also provide a detailed English image generation prompt that describes an image perfectly suited for that specific post's content and the platform's aesthetic.
  `;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          facebook: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            },
            required: ['text', 'imagePrompt']
          },
          twitter: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            },
            required: ['text', 'imagePrompt']
          },
          instagram: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            },
            required: ['text', 'imagePrompt']
          }
        },
        required: ['facebook', 'twitter', 'instagram']
      }
    }
  });

  if (!response.text) {
    throw new Error("No response text received from Gemini.");
  }

  return JSON.parse(response.text) as SocialPostsResponse;
};

export const generateSocialImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' | '9:16'): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) {
      throw new Error("No image generated.");
    }
    
    return `data:image/png;base64,${imageBytes}`;
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};