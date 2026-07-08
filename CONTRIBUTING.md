## Commit message

Format: `<type>: <short description>`

Types: `feat` | `fix` | `refactor` | `docs` | `test` | `chore`

Examples:

- feat: auto-bind AucoAgent when creating session
- fix: return 400 for room messages in Phase A
- docs: add Postman collection for local API test

Rules:

- One logical change per commit (or per PR)
- Do not commit `.env` or secrets
- Run before PR: `pnpm --filter @aucobot/api lint:ci && pnpm --filter @aucobot/api test`
