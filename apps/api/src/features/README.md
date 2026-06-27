# Features

Plugin modules loaded via `ENABLED_FEATURES`. Core never imports feature internals directly.

## Layout

| Folder | Purpose | Credential | Examples |
|--------|---------|------------|----------|
| `tools/` | App-native agent tools | DB / events only | `builtin` |
| `integrations/` | External APIs | Platform API key | `web-search` (planned) |
| `channels/` | Social platforms | Per-user OAuth | `facebook`, `tiktok` |
| `workflow/` | Jobs & business flows | Queue + DB | `publishing`, `approvals` |

## Adding a feature

- Generic agent tool (no external API) → `tools/<name>/`
- SaaS API (Tavily, Firecrawl, …) → `integrations/<name>/`
- Social network → `channels/<name>/`
- Schedule / approve / pipeline → `workflow/<name>/`

## Plugin manifest

All plugins are registered in `index.ts`. Plugin `id` matches `ENABLED_FEATURES` (folder path is for organization only).
