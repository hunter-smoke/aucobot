# `hooks/thread/`

## Planned files

| File | Vai trò |
|------|---------|
| `use-thread-list.ts` | Load `departmentsApi.list()` → `threadStore.setThreads` |
| `use-select-thread.ts` | `selectedDepartmentId` + navigate `/c/[id]` |

MVP: 1 department/user — hook vẫn giữ shape list để scale sau.
