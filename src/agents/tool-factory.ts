import * as zod from "zod";
import { tool } from "langchain";

export const executeSqlQueryTool = tool(
  (input, runtime) => {
    console.log("SQL tool execution -------------------->", input);
    const { query } = input;
    return runtime.context.db.run(query);
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
