
import { GoogleGenAI } from "@google/genai";

export const transcribeAudio = async (audioBase64: string, mimeType: string, language: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please set the API_KEY environment variable.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = 'gemini-2.5-flash';

  const audioPart = {
    inlineData: {
      data: audioBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `You are an expert audio transcription service. Please transcribe the following audio file accurately. The language spoken in the audio is ${language}. Provide only the transcribed text, without any additional comments or explanations.`,
  };
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, audioPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw new Error("The AI model failed to process the audio. It might be too long or in an unsupported format.");
  }
};
