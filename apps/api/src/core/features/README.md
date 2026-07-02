# `core/features/` — Feature toggle qua config

Bật/tắt từng feature qua env **`ENABLED_FEATURES`** (CSV). MVP: rỗng (chưa có feature module).

```env
ENABLED_FEATURES=facebook,publishing      # bật 2 feature
ENABLED_FEATURES=                          # tắt hết (MVP)
```

Id lạ (typo) → **lỗi ngay lúc boot** (validate ở `env.schema.ts`).

## Files

| File | Vai trò |
|------|---------|
| `feature.constants.ts` | `FEATURE_IDS` (danh mục hợp lệ) + `parseEnabledFeatures()` |
| `feature-flags.service.ts` | `FeatureFlagsService` — `isEnabled` / `assertEnabled` / `getEnabled` (DI-safe, đọc config) |
| `features.module.ts` | Global module export `FeatureFlagsService` |
| `feature-loader.ts` | `FEATURE_REGISTRY` + `loadEnabledFeatures()` — app.module nạp module theo config |

## Hai tầng toggle

1. **Không nạp module** khi tắt — `app.module.ts`:

```ts
imports: [CoreModule, ...loadEnabledFeatures()]
```

2. **Guard runtime** trong feature (nếu chia sẻ route / listener):

```ts
this.featureFlags.assertEnabled("facebook"); // 404 nếu tắt
```

## Thêm feature mới (2 bước)

1. Tạo `features/<id>/<id>.module.ts` (NestJS module thường; **không import feature khác**).
2. Đăng ký vào `FEATURE_REGISTRY` trong `feature-loader.ts`:

```ts
const FEATURE_REGISTRY = {
  facebook: () => FacebookModule,
};
```

→ Thêm `facebook` vào `ENABLED_FEATURES` là chạy. Bỏ khỏi env = không nạp, core không đổi.

## Lưu ý bootstrap

`loadEnabledFeatures()` đọc `process.env.ENABLED_FEATURES` lúc app.module khởi tạo. Prod: env có sẵn từ platform. Dev qua `nest start`: đảm bảo biến có trong shell/`.env` được nạp (ConfigModule nạp `.env`; nếu chạy static loader trước, set biến ở shell). MVP rỗng nên không ảnh hưởng.
