# Integrations

Third-party APIs using **platform-managed keys** (not per-user OAuth). Exposes agent tools and HTTP helpers.

| Plugin id | Folder | Tools / API | Status |
|-----------|--------|-------------|--------|
| `web-search` | `web-search/` | `web_search`, `web_fetch` (Tavily) | wired |

Env: `TAVILY_API_KEY`

HTTP (dev): `POST /api/integrations/web-search/search`, `POST /api/integrations/web-search/fetch`
