# TestMcpServer

# MCP Server - Adding New Tools

This guide explains how to add new tools to the MCP server. The process involves four main components:

## 1. Tool Definition (`/src/definitions/`)

First, create your tool definition in the appropriate category folder (e.g., `maths/`):

```typescript
// Example: src/definitions/maths/multiply.ts
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const MULTIPLY: Tool = {
  name: "multiply",
  description: "Multiply two numbers together",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number to multiply",
      },
      b: {
        type: "number",
        description: "Second number to multiply",
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
import { MULTIPLY } from "./multiply.js";

const MATHS_TOOLS = [ADDITION, MULTIPLY] as const;

export default MATHS_TOOLS;
```

## 2. Controller Implementation (`/src/controllers/`)

Add the handler method to the appropriate controller:

```typescript
// src/controllers/MathsController.ts
class MathsController {
  // Existing methods...

  async handleMultiply(a: number, b: number) {
    try {
      const result = a * b;
      return {
        content: [
          {
            type: "text",
            text: `Product: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating product: ${
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
    handlerMethod: "handleCalculateSum",
  },
  multiply: {
    controller: MathsController,
    handlerMethod: "handleMultiply",
  },
};
```

If you're adding a new category of tools, also update `getToolDefinitions()`:

```typescript
export function getToolDefinitions() {
  return {
    MATHS_TOOLS,
    // NEW_CATEGORY_TOOLS,  // Add new categories here
  };
}
```

## 4. Server Configuration (`/src/index.ts`)

The server configuration in `index.ts` doesn't need modification for new tools, as it's already set up to handle tools dynamically through the registry.

## Conventions

1. **Tool Names**: Use lowercase with underscores (e.g., `calculate_sum`, `multiply`)
2. **Handler Methods**: Name them as `handle` + PascalCase of the tool name (e.g., `handleCalculateSum`, `handleMultiply`)
3. **Tool Categories**: Group related tools in their own directory under `definitions/`
4. **Controllers**: Group related handlers in a controller class named after the category (e.g., `MathsController`, `HttpController`)

## Example Flow

1. Create tool definition in `src/definitions/category/toolname.ts`
2. Add tool to category's `main.ts`
3. Add handler method to appropriate controller
4. Register tool in `toolRegistry.ts`
5. Test the new tool
