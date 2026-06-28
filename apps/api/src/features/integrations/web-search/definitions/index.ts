import { webFetchTool, webSearchTool } from "./web-search.tool";

export const WEB_SEARCH_TOOLS = [webSearchTool, webFetchTool] as const;
