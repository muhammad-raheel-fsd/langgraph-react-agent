import * as fs from "fs";
import * as path from "path";
import type { CompiledGraph } from "@langchain/langgraph";
import type { ReactAgent } from "langchain";

const GRAPHS_DIR = path.join(process.cwd(), "src", "graphs");

type DrawableGraph = CompiledGraph<any, any> | ReactAgent<any, any, any, any>;

/**
 * Draws a LangGraph and saves it as PNG with the executing file's name
 * @param graph - The compiled LangGraph or ReactAgent
 * @param callerPath - Pass `import.meta.url` from the calling file
 */
export async function drawGraph(
  graph: DrawableGraph,
  callerPath: string
): Promise<void> {
  // Ensure graphs directory exists
  if (!fs.existsSync(GRAPHS_DIR)) {
    fs.mkdirSync(GRAPHS_DIR, { recursive: true });
  }

  // Extract filename without extension from caller path
  const filename = path.basename(callerPath.replace("file://", ""), ".ts");
  const outputPath = path.join(GRAPHS_DIR, `${filename}.png`);

  // Print Mermaid diagram
  console.log("\n--- Graph Visualization (Mermaid) ---\n");
  const mermaidDiagram = await graph.drawMermaid();
  console.log(mermaidDiagram);

  // Save as PNG
  console.log("\n--- Saving graph as PNG... ---\n");
  const pngData = await graph.drawMermaidPng();
  console.log("pngData type:", typeof pngData, pngData?.constructor?.name);
  fs.writeFileSync(outputPath, pngData as any);
  console.log(`Graph saved to ${outputPath}`);
}
