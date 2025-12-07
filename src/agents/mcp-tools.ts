import { MultiServerMCPClient } from "@langchain/mcp-adapters";

let mcpTools: Awaited<ReturnType<MultiServerMCPClient["getTools"]>> = [];

// Lazy initialization - only connects when needed
export async function getMcpTools() {
  if (mcpTools.length > 0) return mcpTools;

  try {
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
    mcpTools = await mcpClient.getTools();
  } catch (error) {
    console.warn("MCP tools failed to load:", error);
    mcpTools = [];
  }

  return mcpTools;
}

// Export empty array for now - use getMcpTools() for lazy loading
export { mcpTools };
