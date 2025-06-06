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

  describe("Git Tools", () => {
    it("should simulate commitHistory tool", async () => {
      const result = await simulateMcpToolCall("commitHistory", { limit: 1 });
      expect(result).toHaveProperty("isError", false);
    });
  });

  describe("Text Tools", () => {
    it("should simulate wordCount tool", async () => {
      const file = path.resolve("./tests/fixtures/text/sample.txt");
      const result = await simulateMcpToolCall("wordCount", { path: file });
      expect(result).toHaveProperty("isError", false);
    });
  });

  describe("Network Tools", () => {
    it("should simulate httpRequest tool", async () => {
      const http = await import("http");
      const server = http.createServer((req, res) => { res.writeHead(200); res.end("ok"); });
      await new Promise<void>(resolve => server.listen(0, () => resolve()));
      const port = (server.address() as any).port;
      const result = await simulateMcpToolCall("httpRequest", { url: `http://127.0.0.1:${port}` });
      server.close();
      expect(result).toHaveProperty("isError", false);
    });
  });

  describe("DateTime Tools", () => {
    it("should simulate timestampConvert tool", async () => {
      const result = await simulateMcpToolCall("timestampConvert", { value: "0" });
      expect(result).toHaveProperty("isError", false);
    });
  });

  describe("Security Tools", () => {
    it("should simulate hash tool", async () => {
      const result = await simulateMcpToolCall("hash", { text: "hello" });
      expect(result).toHaveProperty("isError", false);
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
