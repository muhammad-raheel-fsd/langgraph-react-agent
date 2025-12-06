import { BaseMessage, AIMessage } from "@langchain/core/messages";

interface CustomEvent {
  type: string;
  content: unknown;
}

type DisplayableMessage = BaseMessage | CustomEvent;

export const displayMessage = (message: DisplayableMessage) => {
  const icons = {
    human: "👤",
    ai: "🤖",
    tool: "🔧",
    custom: "💡",
  };

  const colors = {
    human: "\x1b[36m", // Cyan
    ai: "\x1b[35m", // Magenta
    tool: "\x1b[33m", // Yellow
    custom: "\x1b[31m", // Red
    reset: "\x1b[0m",
  };

  const icon = icons[message.type as keyof typeof icons] || "💬";
  const color = colors[message.type as keyof typeof colors] || "";
  const reset = colors.reset;

  // Header
  console.log(`\n${color}┌${"─".repeat(60)}┐${reset}`);
  console.log(
    `${color}│ ${icon} ${message.type.toUpperCase()} MESSAGE${" ".repeat(
      60 - message.type.length - 12
    )}│${reset}`
  );
  console.log(`${color}└${"─".repeat(60)}┘${reset}`);

  // Content
  if (message.content) {
    if (typeof message.content === "string") {
      console.log(message.content);
    } else {
      console.log(JSON.stringify(message.content, null, 2));
    }
  } else if (
    message instanceof AIMessage &&
    message.tool_calls &&
    message.tool_calls.length > 0
  ) {
    console.log("Tool Calls:");
    message.tool_calls.forEach((call, idx) => {
      console.log(`  ${idx + 1}. ${call.name}()`);
      console.log(
        `     ${JSON.stringify(call.args, null, 2).split("\n").join("\n     ")}`
      );
    });
  }
};
