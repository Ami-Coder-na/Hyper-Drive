import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI | null => {
  if (client) return client;

  try {
    let apiKey = '';
    // Aggressive safety check for process.env
    try {
      if (typeof process !== 'undefined' && process && process.env && process.env.API_KEY) {
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      // Ignore ReferenceError or other access errors in browser
      console.warn("Could not access process.env");
    }

    if (!apiKey) {
      console.warn("HyperDrive: API Key not found. Running in offline simulation mode.");
      return null;
    }

    client = new GoogleGenAI({ apiKey });
    return client;
  } catch (error) {
    console.error("Failed to initialize GenAI client:", error);
    return null;
  }
};

export const generateVehicleInsight = async (vehicleName: string, query: string): Promise<string> => {
  try {
    const ai = getClient();
    if (!ai) {
      return "AI Link Offline. Showing simulated diagnostic data: Vehicle appears to be in peak condition with optimized flux distribution.";
    }

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
    if (!ai) {
      return "MARKET SIMULATION: EV prices stabilizing | Classic Restomods trending up +15% | Credits flush in Neo-Tokyo sector.";
    }

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