# `lib/api/`

Mirror **`apps/api` REST** — mỗi file = 1 resource domain.

## Files

| File | API endpoints | Trạng thái |
|------|---------------|------------|
| `auth.ts` | `/api/auth/*` | ✅ |
| `departments.ts` | `/api/departments` | 🔜 |
| `agents.ts` | `/api/departments/:id/agents` | 🔜 |
| `messages.ts` | chat REST (nếu có) | 🔜 |
| `approvals.ts` | `/api/approvals/*` | 🔜 |
| `scheduled-posts.ts` | `/api/scheduled-posts` | 🔜 |
| `documents.ts` | upload/list docs | 🔜 defer |

## Pattern

```ts
export const departmentsApi = {
  list: async () => schema.parse(await http.get(...)),
  create: async (body) => ...,
};
```

Chỉ Zod parse + HTTP. **Không** `if` nghiệp vụ.
