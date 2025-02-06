# TestMcpServer

# Introduction

This example MCP Server implementation uses Anthropic's open source Model Context Protocol.
I found the existing examples to be unbearable to look at, mostly very long one-filers and very hard to read through.
With this more manageable approach I want users to find examples that are easier to understand and get into than what is currently out there.
Let this be the foundation for your next MCP Server project.

Requires Node, npm, typescript

# Installation

run `npm install` upon cloning the repository.
Check **package.json** for scripts to use.

Run `npm run build` to build the server.
Run `node build/index.js` to run the server.
I suggest the following however:
Run `npm run dev` to watch changes on save and then rebuild and re-run inspector so you can test it in `localhost:5173`

Before being able to run the MCP server in [Cursor](#add-mcp-server-to-cursor) it must be built first.

# MCP Server - Adding New Tools

This guide explains how to add new tools to the MCP server. The process involves four main components:

## 1. Tool Definition (`/src/definitions/`)

First, create your tool definition in the appropriate category folder (e.g., `maths/`):

```typescript
// Example: src/definitions/maths/addition.ts
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ADDITION: Tool = {
  name: "addition",
  description: "Add two numbers together",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number to add",
      },
      b: {
        type: "number",
        description: "Second number to add",
      },
    },
    required: ["a", "b"],
  },
};
```

Then add it to the category's main file:

```typescript
// src/definitions/maths/main.ts
import { ADDITION } from "./addition.js";
import { MULTIPLICATION } from "./multiplication.js";

const MATHS_TOOLS = [ADDITION, MULTIPLICATION] as const;

export default MATHS_TOOLS;
```

## 2. Controller Implementation (`/src/controllers/`)

Add the handler method to the appropriate controller:

```typescript
// src/controllers/MathsController.ts
class MathsController {
  async handleAddition(a: number, b: number) {
    try {
      const result = a + b;
      return {
        content: [
          {
            type: "text",
            text: `Sum: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating sum: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
}
```

## 3. Tool Registry (`/src/utils/toolRegistry.ts`)

Register your tool in the `controllerMap`:

```typescript
const controllerMap: ControllerMap = {
  // Math tools
  addition: {
    controller: MathsController,
    handlerMethod: "handleAddition",
  },
  multiplication: {
    controller: MathsController,
    handlerMethod: "handleMultiplication",
  },
};
```

The registry exports two main functions:

```typescript
// Get tool definitions for server registration
export function getToolDefinitions() {
  return {
    MATHS_TOOLS,
  };
}

// Get handler for tool execution
export function getToolHandler(toolName: string) {
  const mapping = controllerMap[toolName];
  if (!mapping) {
    return null;
  }

  const controllerInstance = new mapping.controller();
  return async (args: any) => {
    return await controllerInstance[mapping.handlerMethod](
      ...Object.values(args)
    );
  };
}
```

## 4. Server Configuration (`/src/index.ts`)

The server is configured to use the tool registry:

```typescript
const tools = getToolDefinitions();

const server = new Server(
  {
    name: "mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: getToolDefinitions(), // Register tools array
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools,
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const handler = getToolHandler(request.params.name);
    if (!handler) {
      return toolController.getUnknownToolResponse(request.params.name);
    }
    return await handler(request.params.arguments);
  } catch (error) {
    return toolController.getErrorResponse(error);
  }
});
```

## Conventions

1. **Tool Names**: Use lowercase (e.g., `addition`, `multiplication`)
2. **Handler Methods**: Name them as `handle` + PascalCase of the tool name (e.g., `handleAddition`, `handleMultiplication`)
3. **Tool Categories**: Group related tools in their own directory under `definitions/`
4. **Controllers**: Group related handlers in a controller class named after the category (e.g., `MathsController`)

## Example Flow

1. Create tool definition in `src/definitions/category/toolname.ts`
2. Add tool to category's `main.ts`
3. Add handler method to appropriate controller
4. Register tool in `toolRegistry.ts`'s `controllerMap`
5. Test the new tool

## Add MCP Server to Cursor

1. Open settings
2. Go to **Features**
3. Scroll to **MCP Servers**
4. Click **Add new MCP server**
5. Give MCP Server a **name** of your preference
6. For **type** use `command`
7. Server URL for local use should be `node <absolute path to project>\build\index.js>`

It should light up green and list the registered tools.
