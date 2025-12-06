import * as zod from "zod";
import { SqlDatabase } from "@langchain/classic/sql_db";
import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "../utils/config.js";
import { executeSqlQueryTool } from "./tool-factory.js";
import { executeSqlQueryToolPrompt } from "./prompt-factory.js";

const model = new ChatGoogleGenerativeAI({
  model: config.GOOGLE_GEMINI_CHAT_MODEL,
  apiKey: config.GOOGLE_GEMINI_API_KEY,
  temperature: 0.7,
  streaming: true,
});

const contextSchema = zod.object({
  db: zod.any().refine((val) => val instanceof SqlDatabase, {
    message: "db must be an instance of SqlDatabase",
  }),
});

export const sqlQueryAgent = createAgent({
  model,
  tools: [executeSqlQueryTool],
  contextSchema,
  systemPrompt: executeSqlQueryToolPrompt,
});
