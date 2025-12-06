import { sqlQueryAgent } from "./agents/agent-factory.js";
import { drawGraph } from "./utils/drawGraph.js";
import { database } from "./db/datasource.js";
import { displayStream } from "./utils/displayStream.js";

await drawGraph(sqlQueryAgent, "sql-query-agent-graph");

// const response = await sqlQueryAgent.invoke(
//   {
//     messages: "Which table has the largest number of rows?",
//   },
//   {
//     context: {
//       db: database,
//     },
//   }
// );

// console.log("AGENT:", response);

const response = await sqlQueryAgent.stream(
  {
    messages: "Gimme the best songs playlist",
  },
  {
    streamMode: "values",
    context: {
      db: database,
    },
  }
);

displayStream(response);
