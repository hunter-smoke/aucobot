# `database/` — PostgreSQL (Prisma)

> **✅ Implemented** — Infra service, không business logic.

## Vai trò

Wrap `@aucobot/database` (`PrismaClient`) thành NestJS provider — connect/disconnect theo lifecycle app.

## Files

| File | Vai trò |
|------|---------|
| `prisma.service.ts` | `PrismaService` extends `PrismaClient` |
| `database.module.ts` | Export global `PrismaService` |

## Quy tắc

| Được | Cấm |
|------|-----|
| Inject `PrismaService` trong **service** | Import `PrismaService` trong **controller** |
| Schema + migrations trong `packages/database/` | Raw SQL rải khắp app (trừ health `SELECT 1`) |

## Models hiện có

`User`, `RefreshToken`, `EmailOtpChallenge`, `Conversation` — xem `packages/database/prisma/schema.prisma`.
