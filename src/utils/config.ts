import dotenv from "dotenv";

dotenv.config();

export const config = {
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY!,
  GOOGLE_GEMINI_CHAT_MODEL: process.env.GOOGLE_GEMINI_CHAT_MODEL || "gemini-2.0-flash",
  GROQ_API_KEY: process.env.GROQ_API_KEY!,
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.1-70b-versatile",
};
