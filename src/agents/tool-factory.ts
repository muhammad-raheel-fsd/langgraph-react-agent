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

export const executeSqlQueryTool = tool(
  (input, runtime) => {
    const rt = runtime as RuntimeWithWriter;
    rt.writer?.({ tool: "execute_sql_query_tool", query: input.query });
    // console.log("SQL tool execution -------------------->", input);
    const { query } = input;
    const context = rt.context as SqlContext;
    return context.db.run(query);
  },
  {
    name: "execute_sql_query_tool",
    description:
      "Executes a SQL query against a database and returns the results.",
    schema: zod.object({
      query: zod.string(),
    }),
  }
);
