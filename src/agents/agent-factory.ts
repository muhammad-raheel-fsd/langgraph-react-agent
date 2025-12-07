import * as zod from "zod";
import { SqlDatabase } from "@langchain/classic/sql_db";
import { createAgent, humanInTheLoopMiddleware } from "langchain";
import { executeSqlQueryTool, humanResponseTool } from "./tool-factory.js";
import {
  dynamicSqlAgentPrompt,
  executeSqlQueryToolPrompt,
} from "./prompt-factory.js";
import { mcpTools } from "./mcp-tools.js";
import { MemorySaver } from "@langchain/langgraph";
import { groqModel } from "../llms/groqModel.js";
import { googleGeminiModel } from "../llms/googleGemini.js";
import { ollamaModel } from "../llms/ollamaModel.js";

const checkpointer = new MemorySaver();

const contextSchema = zod.object({
  db: zod.any().refine((val) => val instanceof SqlDatabase, {
    message: "db must be an instance of SqlDatabase",
  }),
  isPublic: zod
    .boolean()
    .describe("Whether the user has public access or restricted access"),
});

// Agent with tool-based structured responses
// 1. executeSqlQueryTool - returns structured SQL results
// 2. humanResponseTool - formats final human-friendly response
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const sqlQueryAgent: ReturnType<typeof createAgent> = createAgent({
  // model: groqModel,
  // model: googleGeminiModel,
  model: ollamaModel, // Local, free, unlimited!
  tools: [executeSqlQueryTool, humanResponseTool],
  contextSchema,
  // systemPrompt: executeSqlQueryToolPrompt,
  middleware: [
    dynamicSqlAgentPrompt,
    humanInTheLoopMiddleware({
      interruptOn: {
        execute_sql_query_tool: {
          allowedDecisions: ["approve", "reject"],
        },
      },
    }),
  ],
  checkpointer,
});

export const mcpServerAgent = createAgent({
  model: groqModel,
  tools: mcpTools,
  systemPrompt: "You are a helpful assistant",
  checkpointer,
});
