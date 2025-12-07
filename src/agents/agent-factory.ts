import * as zod from "zod";
import { SqlDatabase } from "@langchain/classic/sql_db";
import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "../utils/config.js";
import { executeSqlQueryTool } from "./tool-factory.js";
import { executeSqlQueryToolPrompt } from "./prompt-factory.js";
import { mcpTools } from "./mcp-tools.js";
import { MemorySaver } from "@langchain/langgraph";
import { groqModel } from "../llms/groqModel.js";

const checkpointer = new MemorySaver();

const contextSchema = zod.object({
  db: zod.any().refine((val) => val instanceof SqlDatabase, {
    message: "db must be an instance of SqlDatabase",
  }),
});

export const sqlQueryAgent = createAgent({
  model: groqModel,
  tools: [executeSqlQueryTool],
  contextSchema,
  systemPrompt: executeSqlQueryToolPrompt,
  checkpointer,
});

export const mcpServerAgent = createAgent({
  model: groqModel,
  tools: mcpTools,
  systemPrompt: "You are a helpful assistant",
  checkpointer,
});
