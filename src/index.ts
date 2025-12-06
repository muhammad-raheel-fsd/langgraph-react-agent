import { sqlQueryAgent } from "./agents/agent-factory.js";
import { drawGraph } from "./utils/drawGraph.js";
import { database } from "./db/datasource.js";
import { displayStream } from "./utils/displayStream.js";
import { HumanMessage } from "langchain";
import { displayMessage } from "./utils/displayMessage.js";

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

const humanMessage = new HumanMessage(
  "Tell me about the most customer Frank please"
);

const response = await sqlQueryAgent.stream(
  {
    // messages: humanMessage, better way to pass message, best type safety
    messages: {
      role: "human",
      content: "Tell me about the most customer Frank Harris please",
    }, // another way to pass message
  },
  {
    streamMode: ["values", "custom"], // messages | values | custom
    context: {
      db: database,
    },
  }
);
// console.log("RESPONSE:::::", response);
// displayStream(response);

// for await (const [message, metadata] of response as any) {
//   console.log(`[${metadata.langgraph_node}]: ${message.content}`);
// }

for await (const [type, stateOrCustomEvent] of response as any) {
  if (type === "values" && stateOrCustomEvent.messages?.length) {
    displayMessage(stateOrCustomEvent.messages.at(-1));
  } else if (type === "custom") {
    displayMessage({ type, content: stateOrCustomEvent });
  }
}
