# Integrations

Third-party APIs using **platform-managed keys** (not per-user OAuth). Exposes agent tools such as web search.

| Plugin id | Folder | Status |
|-----------|--------|--------|
| `web-search` | `web-search/` | planned |

Credential model:

- **Integrations** — Aucobot holds `TAVILY_API_KEY`, quota per tenant
- **Channels** (`../channels/`) — user connects Facebook/TikTok via OAuth
