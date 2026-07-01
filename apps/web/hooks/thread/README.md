# `hooks/thread/`

## Files

| File | Vai trò |
|------|---------|
| `use-department-id-from-hash.ts` | Đọc / set `window.location.hash` ✅ |
| `use-thread-list.ts` | Load `departmentsApi.list()` → `threadStore` 🔜 |
| `use-select-thread.ts` | `openDepartment(id)` wrapper 🔜 |

## Navigation

Phòng chọn qua hash — **không** `router.push('/c/…')`:

```text
app.aucobot.com/#1244557231
```

MVP: 1 department/user — sau login có thể set hash mặc định từ API.
