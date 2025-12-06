import dotenv from "dotenv";

dotenv.config();

export const config = {
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY!,
  GOOGLE_GEMINI_CHAT_MODEL: process.env.GOOGLE_GEMINI_CHAT_MODEL || "gemini-2.0-flash",
};
