import { ChatOllama } from "@langchain/ollama";

// Best models for tool calling (pick one):
// - qwen2.5:7b      - Excellent tool calling, fast
// - llama3.1:8b     - Good all-round, native tool calling
// - mistral:7b      - Lighter, decent tool calling
// - hermes3:8b      - Fine-tuned for function calling

export const ollamaModel = new ChatOllama({
  model: process.env.OLLAMA_MODEL || "qwen2.5:7b",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0.7,
});
