/**
 * Danh mục feature plugin (💡 north-star). Bật/tắt qua env `ENABLED_FEATURES`.
 *
 * MVP chưa có feature module nào — list dùng để **validate config** (chặn typo)
 * và làm registry key khi thêm feature sau (xem `feature-loader.ts`).
 */
export const FEATURE_IDS = [
  "facebook",
  "tiktok",
  "publishing",
  "approvals",
  "documents",
  "web-search",
  "ai-orchestration",
] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

export function isFeatureId(value: string): value is FeatureId {
  return (FEATURE_IDS as readonly string[]).includes(value);
}

/** Parse chuỗi CSV `ENABLED_FEATURES` → danh sách id hợp lệ (bỏ id lạ / rỗng). */
export function parseEnabledFeatures(raw: string | undefined): FeatureId[] {
  return (raw ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .filter(isFeatureId);
}
