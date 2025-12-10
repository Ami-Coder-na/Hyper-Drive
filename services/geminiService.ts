import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    // Safely access process.env to prevent ReferenceError: process is not defined in browser environments
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const generateVehicleInsight = async (vehicleName: string, query: string): Promise<string> => {
  try {
    const ai = getClient();
    const modelId = 'gemini-2.5-flash'; 
    
    const prompt = `You are a futuristic vehicle expert and mechanic for a high-tech marketplace called HyperDrive. 
    The user is asking about a specific vehicle: ${vehicleName}.
    User Query: ${query}
    
    Provide a concise, enthusiastic, and technical answer. Focus on specs, reliability, and "cool factor".
    Keep it under 100 words.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Systems are offline. Unable to retrieve vehicle data.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with the HyperDrive AI Core.";
  }
};

export const analyzeMarketTrends = async (): Promise<string> => {
   try {
    const ai = getClient();
    const modelId = 'gemini-2.5-flash';
    
    const prompt = `Generate a short, futuristic market flash update for a vehicle marketplace. 
    Mention a trend about Electric Vehicles or Classic Restomods. 
    Use cyberpunk slang (e.g., "Credits", "Flux", "Grid"). 
    Keep it under 50 words.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Market data stream interrupted.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Market data unavailable.";
  }
}