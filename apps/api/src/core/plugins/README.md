# `plugins/` — Plugin platform (contract)

> **💡 Planned** — chưa có code. Giữ cấu trúc thư mục; triển khai khi feature đầu tiên cần đăng ký MCP tools.

## Vai trò

Contract chung để `src/features/*` cắm vào core: `FeaturePlugin` interface, MCP tool registry, lifecycle `onEnable` / `onDisable`. Agent (`core/agents/`) chỉ đọc tools từ registry — core không biết Facebook/TikTok cụ thể.

## Không nhầm với

| Folder | Vai trò |
|--------|---------|
| [`features/`](../features/README.md) | Bật/tắt `ENABLED_FEATURES`, nạp NestJS module — **✅ đã có** |
| **`plugins/`** (đây) | Contract + registry MCP tools — **💡 planned** |
| [`src/features/`](../../features/README.md) | Code nghiệp vụ từng feature (OAuth, publish, …) |

Loader (`loadEnabledFeatures`) nằm ở `features/`, không phải `plugins/`.

## Files (planned)

| File | Vai trò |
|------|---------|
| `feature-plugin.interface.ts` | Contract mỗi plugin implement |
| `plugin.registry.ts` | Đăng ký MCP tools khi feature bật |

Xem `aucobot-architecture.md`.
