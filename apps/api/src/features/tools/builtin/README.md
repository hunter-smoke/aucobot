# Builtin tools

App-native agent tools — no external OAuth or third-party API keys. Uses DB, events, and core domain only.

| Tool | Description |
|------|-------------|
| `create_draft_post` | Platform-agnostic post draft |
| `handoff_to_agent` | Delegate to another agent in the department |
| `update_agent_memory` | Store agent learning / preferences |
| `list_department_agents` | List agents and roles |

Plugin id: `builtin` — enable via `ENABLED_FEATURES=builtin,...`

Add new tools under `definitions/` and export from `definitions/index.ts`.
