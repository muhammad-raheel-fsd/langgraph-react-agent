import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const mcpClient = new MultiServerMCPClient({
  mcpServers: {
    time: {
      transport: "stdio",
      command: "npx",
      args: ["-y", "@theo.foobar/mcp-time"],
    },
  },
  useStandardContentBlocks: true,
});

export const mcpTools = await mcpClient.getTools();
