
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveWordProblem = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful math assistant inside a calculator app. 
      The user has asked the following: "${prompt}". 
      Solve the problem step-by-step. Keep the explanation concise and professional. 
      Use Markdown formatting for readability. 
      If the input is not a math or logic problem, politely redirect them.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    });

    return response.text || "I couldn't generate a solution at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Could not connect to the math assistant. Please check your connection.";
  }
};
