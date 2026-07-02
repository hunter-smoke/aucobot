import { parseEnabledFeatures, type FeatureId } from "./feature.constants";

import type { DynamicModule, Type } from "@nestjs/common";

type FeatureModule = Type<unknown> | DynamicModule;

/**
 * Registry feature → module. **Thêm feature = thêm 1 dòng ở đây.**
 *
 * Rỗng ở MVP (chưa có feature module). Ví dụ tương lai:
 *   facebook: () => FacebookModule,
 *   publishing: () => PublishingModule,
 */
const FEATURE_REGISTRY: Partial<Record<FeatureId, () => FeatureModule>> = {};

/**
 * Trả về các feature module được bật (đọc `ENABLED_FEATURES` lúc bootstrap).
 * Dùng trong `app.module.ts`: `imports: [CoreModule, ...loadEnabledFeatures()]`.
 *
 * Feature tắt (không có trong env) → module **không được nạp** vào app.
 */
export function loadEnabledFeatures(): FeatureModule[] {
  return parseEnabledFeatures(process.env.ENABLED_FEATURES)
    .map((id) => FEATURE_REGISTRY[id]?.())
    .filter((module): module is FeatureModule => Boolean(module));
}
