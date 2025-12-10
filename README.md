# LangChain ReAct Agent (TypeScript)

A TypeScript project demonstrating advanced LangChain and LangGraph concepts for building intelligent AI agents.

## Concepts Covered

### 1. ReAct Agent Pattern
The project implements the ReAct (Reasoning + Acting) pattern using `createAgent` from LangChain, which enables LLMs to reason about tasks and take actions using tools.

### 2. Tool Calling
Custom tools are defined using the `tool()` function with Zod schemas:
- **execute_sql_query_tool** - Executes SQL queries and returns structured results
- **human_response_tool** - Formats final responses for human consumption

### 3. Structured Output
Tools return typed, structured responses (e.g., `SqlToolResponse`) ensuring consistent data formats for downstream processing.

### 4. Dynamic Prompting
Uses `dynamicSystemPromptMiddleware` to modify system prompts at runtime based on context (e.g., access permissions).

### 5. Human-in-the-Loop (HITL)
Implements `humanInTheLoopMiddleware` to:
- Interrupt execution on specific tool calls
- Request human approval before executing sensitive operations
- Support approve/reject decisions

### 6. Context Schema
Defines runtime context using Zod schemas for type-safe context passing:
```typescript
const contextSchema = zod.object({
  db: zod.any().refine((val) => val instanceof SqlDatabase),
  isPublic: zod.boolean(),
});
```

### 7. State Persistence (Checkpointing)
Uses `MemorySaver` for in-memory state persistence, enabling conversation continuity with `thread_id`.

### 8. Multiple LLM Providers
Supports multiple model providers:
- **Ollama** - Local models (qwen2.5, llama3.1, mistral)
- **Groq** - Cloud-based fast inference
- **Google Gemini** - Google's multimodal models

### 9. MCP (Model Context Protocol) Integration
Integrates with MCP servers using `@langchain/mcp-adapters` for external tool connectivity.

### 10. Streaming
Supports multiple stream modes:
- `values` - Stream state updates
- `custom` - Stream custom events (tool calls)
- `messages` - Stream individual messages

### 11. SQL Database Integration
Uses `SqlDatabase` from `@langchain/classic` with TypeORM and better-sqlite3 for database operations.

## Project Structure

```
src/
├── agents/
│   ├── agent-factory.ts    # Agent creation with middleware
│   ├── prompt-factory.ts   # Dynamic prompts
│   ├── tool-factory.ts     # Custom tool definitions
│   └── mcp-tools.ts        # MCP server integration
├── db/
│   └── datasource.ts       # Database configuration
├── llms/
│   ├── ollamaModel.ts      # Ollama configuration
│   ├── groqModel.ts        # Groq configuration
│   └── googleGemini.ts     # Gemini configuration
├── utils/
│   ├── displayMessage.ts   # Message formatting
│   ├── displayStream.ts    # Stream handling
│   └── drawGraph.ts        # Graph visualization
└── index.ts                # Entry point
```

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
```bash
# For Ollama (local)
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_BASE_URL=http://localhost:11434

# For Groq
GROQ_API_KEY=your_key

# For Google Gemini
GOOGLE_API_KEY=your_key
```

3. Run the agent:
```bash
pnpm dev
```

## Key Dependencies

- `@langchain/langgraph` - Graph-based agent orchestration
- `@langchain/core` - Core LangChain abstractions
- `@langchain/ollama` - Ollama integration
- `@langchain/groq` - Groq integration
- `@langchain/google-genai` - Google Gemini integration
- `@langchain/mcp-adapters` - MCP server integration
- `@langchain/classic` - SQL database utilities
- `zod` - Schema validation
- `typeorm` + `better-sqlite3` - Database layer

## Usage Examples

### Basic Invocation
```typescript
const response = await sqlQueryAgent.invoke(
  { messages: new HumanMessage("List all tables") },
  { context: { db: database, isPublic: false } }
);
```

### With Human-in-the-Loop
```typescript
let response = await sqlQueryAgent.invoke(
  { messages: new HumanMessage("Run this query") },
  { configurable: { thread_id: "1" } }
);

while ("__interrupt__" in response) {
  // Handle approval request
  response = await sqlQueryAgent.invoke(
    new Command({ resume: { decisions: [{ type: "approve" }] } }),
    config
  );
}
```

### Streaming
```typescript
const stream = await sqlQueryAgent.stream(
  { messages: new HumanMessage("Query the database") },
  { streamMode: ["values", "custom"] }
);

for await (const [type, data] of stream) {
  if (type === "values") console.log(data.messages.at(-1));
  if (type === "custom") console.log("Tool:", data);
}
```
