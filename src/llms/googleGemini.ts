import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "../utils/config.js";

export const googleGeminiModel = new ChatGoogleGenerativeAI({
  model: config.GOOGLE_GEMINI_CHAT_MODEL,
  apiKey: config.GOOGLE_GEMINI_API_KEY,
  temperature: 0.7,
  streaming: true,
});
