import * as zod from "zod";
import { tool } from "langchain";
import type { SqlDatabase } from "@langchain/classic/sql_db";

interface SqlContext {
  db: SqlDatabase;
}

interface RuntimeWithWriter {
  writer?: (data: unknown) => void;
  context: unknown;
}

// Structured response from the tool
interface SqlToolResponse {
  success: boolean;
  query: string;
  rowCount: number;
  data: unknown[];
  error?: string;
}

export const executeSqlQueryTool = tool(
  async (input, runtime): Promise<SqlToolResponse> => {
    const rt = runtime as RuntimeWithWriter;
    const { query } = input;
    const context = rt.context as SqlContext;

    rt.writer?.({ tool: "execute_sql_query_tool", query });

    try {
      const result = await context.db.run(query);
      const data = JSON.parse(result);

      return {
        success: true,
        query,
        rowCount: Array.isArray(data) ? data.length : 1,
        data: Array.isArray(data) ? data : [data],
      };
    } catch (error) {
      return {
        success: false,
        query,
        rowCount: 0,
        data: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
  {
    name: "execute_sql_query_tool",
    description:
      "Executes a SQL query against a database and returns structured results with success status, row count, and data.",
    schema: zod.object({
      query: zod.string().describe("The SQL query to execute"),
    }),
  }
);

// Human Response Tool - formats structured data into human-friendly response
export const humanResponseTool = tool(
  (input, runtime) => {
    const rt = runtime as RuntimeWithWriter;

    rt.writer?.({
      tool: "human_response_tool",
      action: "formatting_response"
    });

    // Return structured response that will be shown to user
    return {
      userQuery: input.userQuery,
      summary: input.summary,
      details: input.details,
      suggestions: input.suggestions,
    };
  },
  {
    name: "human_response_tool",
    description: `ALWAYS call this tool as your FINAL step to format your response for the user.
    Takes the analysis results and creates a clear, human-friendly response.
    You MUST call this tool before ending the conversation.`,
    schema: zod.object({
      userQuery: zod.string().describe("The original user question"),
      summary: zod.string().describe("A brief 1-2 sentence answer to the user's question"),
      details: zod.string().describe("Detailed explanation with relevant data points"),
      suggestions: zod.array(zod.string()).optional().describe("Optional follow-up suggestions for the user"),
    }),
  }
);
