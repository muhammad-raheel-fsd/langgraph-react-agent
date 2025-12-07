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

const responseFormat = zod.object({
  userRequest: zod.string().describe("The original user question/request"),
  reasoning: zod.string().describe("Your thought process and analysis"),
  toolCalls: zod.array(
    zod.object({
      tool: zod.string().describe("Name of the tool called"),
      query: zod.string().describe("The SQL query executed"),
      purpose: zod.string().describe("Why this query was needed"),
      result: zod.string().describe("Summary of what the query returned"),
    })
  ).describe("List of all tool calls made to answer the request"),
  answer: zod.string().describe("The final answer to the user's question"),
  tablesUsed: zod.array(zod.string()).describe("Database tables that were queried"),
});

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
  responseFormat,
});

export const mcpServerAgent = createAgent({
  model: groqModel,
  tools: mcpTools,
  systemPrompt: "You are a helpful assistant",
  checkpointer,
});
