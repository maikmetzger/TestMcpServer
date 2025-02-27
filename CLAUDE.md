# MCP-Server Development Guide

## Build & Development Commands
- `npm run build` - Build the TypeScript project
- `npm run dev` - Watch for changes, rebuild and run inspector (localhost:5173)
- `npm run watch` - Watch TypeScript files and rebuild on change
- `npm run inspector` - Run MCP inspector on the built server
- `node build/index.js` - Run the server directly
- `npm run sse` - Run server with SSE transport on http://localhost:9999/sse
- `npm run dev-sse` - Watch for changes and restart SSE server automatically

## Tool Usage
- **Maths Tools** - Perform arithmetic operations like addition, subtraction, etc.
- **Image Tools** - Convert and resize images to different formats
- **Filesystem Tools**:
  - `tree` - Get directory structure in JSON format (for browsing)
  - `search` - Find file paths by name pattern or content matches (does NOT return file contents)
  - `read` - Read the contents of a file at a specific path (with line limit options)

## Code Style Guidelines

### TypeScript Patterns
- Use strict typing with proper interfaces/types
- Controllers should inherit validation methods for input checking
- Each tool exports a constant with name, description, and schema
- Handle errors consistently with try/catch and properly format error messages

### Structure & Naming
- Tools are organized by category (maths, filesystem, image)
- Tool names use camelCase (e.g., `squareRoot`, `imageConversion`)
- Handler methods use "handle" prefix + PascalCase (e.g., `handleSquareRoot`)
- Register each tool in the controllerMap in toolRegistry.ts

### Adding New Tools
1. Create tool definition in appropriate category folder
2. Add it to category's main.ts
3. Implement handler method in controller
4. Register in toolRegistry.ts controllerMap
5. Test the tool

### Error Handling
- Use validateNumericInputs() and similar validation methods
- Check for edge cases (division by zero, negative square roots)
- Return consistent isError: true/false with descriptive messages