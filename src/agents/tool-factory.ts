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
