import { mcpServerAgent, sqlQueryAgent } from "./agents/agent-factory.js";
import { drawGraph } from "./utils/drawGraph.js";
import { database } from "./db/datasource.js";
import { HumanMessage } from "langchain";
import { displayMessage } from "./utils/displayMessage.js";

await drawGraph(sqlQueryAgent, "sql-query-agent-graph");

// Stream with structured response
const stream = await sqlQueryAgent.stream(
  {
    messages: new HumanMessage("Which table has the largest number of rows?"),
  },
  {
    streamMode: ["values", "custom"],
    context: {
      db: database,
    },
    configurable: { thread_id: "1" },
  }
);

let finalResponse: any = null;

for await (const [type, data] of stream as any) {
  if (type === "values" && data.messages?.length) {
    const lastMessage = data.messages.at(-1);
    displayMessage(lastMessage);

    // Check if this is the final structured response
    if (lastMessage?.content && typeof lastMessage.content === "string") {
      try {
        const parsed = JSON.parse(lastMessage.content);
        if (parsed.answer && parsed.toolCalls) {
          finalResponse = parsed;
        }
      } catch {
        // Not JSON, regular message
      }
    }
  } else if (type === "custom") {
    console.log("\n🔧 Tool Call:", JSON.stringify(data, null, 2));
  }
}

// Pretty print the final structured response
if (finalResponse) {
  console.log("\n" + "=".repeat(60));
  console.log("📊 STRUCTURED RESPONSE");
  console.log("=".repeat(60));
  console.log(JSON.stringify(finalResponse, null, 2));
}

// const humanMessage = new HumanMessage(
//   "Tell me about the most customer Frank please"
// );

// const response = await sqlQueryAgent.stream(
//   {
//     // messages: humanMessage, better way to pass message, best type safety
//     messages: {
//       role: "human",
//       content: "Tell me about the most customer Frank Harris please",
//     }, // another way to pass message
//   },
//   {
//     streamMode: ["values", "custom"], // messages | values | custom
//     context: {
//       db: database,
//     },
//   }
// );
// console.log("RESPONSE:::::", response);
// displayStream(response);

// for await (const [message, metadata] of response as any) {
//   console.log(`[${metadata.langgraph_node}]: ${message.content}`);
// }

// for await (const [type, stateOrCustomEvent] of response as any) {
//   if (type === "values" && stateOrCustomEvent.messages?.length) {
//     displayMessage(stateOrCustomEvent.messages.at(-1));
//   } else if (type === "custom") {
//     displayMessage({ type, content: stateOrCustomEvent });
//   }
// }

// const response = await mcpServerAgent.stream(
//   {
//     messages: new HumanMessage("What is current time in lahore pakistan"),
//   },
//   {
//     streamMode: "values",
//     configurable: { thread_id: "1" },
//   }
// );

// await displayStream(response);

// const response = await sqlQueryAgent.invoke(
//   {
//     messages: new HumanMessage("List the table with largest number of records"),
//   },
//   {
//     context: {
//       db: database,
//     },
//     configurable: { thread_id: "1" },
//   }
// );
// console.log(response);
