import type { McpToolDefinition } from "../../../../core/plugins/feature-plugin.interface";

export const webSearchTool: McpToolDefinition = {
  name: "web_search",
  description: "Search the web for trends, competitors, and market references",
};

export const webFetchTool: McpToolDefinition = {
  name: "web_fetch",
  description: "Fetch and extract readable content from a public URL",
};
