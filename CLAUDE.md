# MCP-Server Development Guide

## Build & Development Commands
- `npm run build` - Build the TypeScript project
- `npm run dev` - Watch for changes, rebuild and run inspector (localhost:5173)
- `npm run watch` - Watch TypeScript files and rebuild on change
- `npm run inspector` - Run MCP inspector on the built server
- `node build/index.js` - Run the server directly
- `npm run sse` - Run server with SSE transport on http://localhost:10021/sse
- `npm run dev-sse` - Watch for changes and restart SSE server automatically

## Tool Usage
- **Maths Tools** - Perform arithmetic operations like addition, subtraction, etc.
- **Image Tools** - Convert and resize images to different formats
- **Filesystem Tools**:
  - `tree` - Get directory structure in JSON format (for browsing)
  - `search` - Find file paths by name pattern or content matches (does NOT return file contents)
  - `read` - Read the contents of a file at a specific path (with line limit options)
- **Browser Tools**:
  - `consoleCapture` - Captures browser console logs from a specified URL, with options to filter by log level
- **Shopware Tools**:
  - `shopwareExec` - Execute commands in a Shopware container
  - `shopwareLogs` - Read logs from a Shopware container
  - `shopwareBuild` - Build Shopware assets or clear cache in a container

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

## Testing

### Running Tests
- `npm test` - Run all tests
- `npm run test:coverage` - Run tests with coverage report
- `npm test -- --testPathPattern=tests/maths/` - Run specific category tests
- `npm test -- --testPathPattern=tests/maths/addition.test.ts` - Run a specific test file

### Test Structure
- Each tool should have unit tests in the appropriate directory under `tests/`
- Specialized validation test files for edge cases (e.g., `validation-edge-cases.test.ts`)
- Use `tests/utils/mcpTestHelper.ts` to simulate MCP tool calls
- Use fixture directories in `tests/fixtures/` for filesystem tests
- For browser tests, use test HTML files

### Writing Tests
1. Test basic functionality first
2. Test edge cases and error handling
3. Test input validation (null, undefined, invalid types)
4. Test extreme values and overflow conditions
5. Use Jest's describe/it blocks to organize tests
6. Test both direct controller calls and MCP-style calls

### Coverage Goals
- Statement coverage: 70%+ for overall codebase
- Function coverage: 60%+ for all controllers
- Line coverage: 70%+ for overall codebase
- Branch coverage: 40%+ (aim to increase this over time)

### Hard-to-Test Components
- ShopwareController relies on external Docker containers and is difficult to test in isolation
- For components with external dependencies, focus on testing the code you can control