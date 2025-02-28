import {
  simulateMcpToolCall,
  createMcpToolRequest,
} from "./utils/mcpTestHelper.js";
import path from "path";

describe("MCP Tool Simulations", () => {
  const fixtureDir = path.resolve("./tests/fixtures/filesystem");

  describe("Math Tools", () => {
    it("should simulate addition tool call", async () => {
      const result = await simulateMcpToolCall("addition", { a: 5, b: 7 });

      expect(result).toHaveProperty("isError", false);
      expect(result.content[0].text).toContain("12");
    });

    it("should simulate square root tool call", async () => {
      const result = await simulateMcpToolCall("squareRoot", { n: 16 });

      expect(result).toHaveProperty("isError", false);
      expect(result.content[0].text).toContain("4");
    });
  });

  describe("Filesystem Tools", () => {
    it("should simulate tree tool call", async () => {
      const result = await simulateMcpToolCall("tree", { path: fixtureDir });

      expect(result).toHaveProperty("isError", false);
      expect(result.content[0].text).toContain("file1.txt");
    });
  });

  describe("MCP Request Format", () => {
    it("should create valid MCP request objects", () => {
      const request = createMcpToolRequest("addition", { a: 5, b: 7 });

      expect(request).toHaveProperty("jsonrpc", "2.0");
      expect(request).toHaveProperty("method", "call_tool");
      expect(request.params).toHaveProperty("name", "addition");
      expect(request.params.arguments).toEqual({ a: 5, b: 7 });
    });
  });
});
