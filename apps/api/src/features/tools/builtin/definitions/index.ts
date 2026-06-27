import { createDraftPostTool } from "./create-draft-post.tool";
import { handoffToAgentTool } from "./handoff-to-agent.tool";
import { listDepartmentAgentsTool } from "./list-department-agents.tool";
import { updateAgentMemoryTool } from "./update-agent-memory.tool";

export const BUILTIN_TOOLS = [
  createDraftPostTool,
  handoffToAgentTool,
  updateAgentMemoryTool,
  listDepartmentAgentsTool,
] as const;
