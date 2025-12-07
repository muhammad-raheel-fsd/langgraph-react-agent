import * as zod from "zod";
import { SqlDatabase } from "@langchain/classic/sql_db";
import { createAgent } from "langchain";
import { executeSqlQueryTool, humanResponseTool } from "./tool-factory.js";
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

// Agent with tool-based structured responses
// 1. executeSqlQueryTool - returns structured SQL results
// 2. humanResponseTool - formats final human-friendly response
export const sqlQueryAgent = createAgent({
  model: groqModel,
  tools: [executeSqlQueryTool, humanResponseTool],
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
