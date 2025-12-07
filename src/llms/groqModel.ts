import { config } from "../utils/config.js";
import { ChatGroq } from "@langchain/groq";

export const groqModel = new ChatGroq({
  model: config.GROQ_MODEL,
  apiKey: config.GROQ_API_KEY,
  temperature: 0.7,
});
