# `schemas/`

Zod — **ưu tiên `@aucobot/shared`**, không duplicate contract API.

## Hiện có (MVP)

- `auth.schema.ts`
- `health.schema.ts`

## Khi API có DTO

1. Thêm schema vào `packages/shared`
2. Web re-export hoặc import trực tiếp
3. Xóa bản duplicate local

Form client dùng cùng schema với API body.
