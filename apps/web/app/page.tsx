import type { HealthResponse } from "@aucobot/shared";
import { API_DEFAULT_PORT } from "@aucobot/shared";

import { AuthDemo } from "./auth-demo";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${API_DEFAULT_PORT}`;

async function getHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function StatusBadge({
  ok,
  label,
}: {
  ok: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        ok
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-red-500/15 text-red-300"
      }`}
    >
      {label}
    </span>
  );
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
          Aucobot MVP
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          AI Agent Cloud
        </h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Next.js + NestJS + PostgreSQL (Prisma). Trang này đọc trực tiếp từ API
          backend để xác nhận stack đã chạy.
        </p>
      </header>

      <AuthDemo />

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">System health</h2>
          <StatusBadge
            ok={health?.status === "ok"}
            label={health?.status === "ok" ? "Online" : "Offline"}
          />
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-[var(--accent-soft)] p-4">
            <dt className="text-[var(--muted)]">API URL</dt>
            <dd className="mt-1 break-all font-mono">{API_URL}</dd>
          </div>
          <div className="rounded-xl bg-[var(--accent-soft)] p-4">
            <dt className="text-[var(--muted)]">Database</dt>
            <dd className="mt-1 font-mono">
              {health?.database ?? "unknown"}
            </dd>
          </div>
          <div className="rounded-xl bg-[var(--accent-soft)] p-4 sm:col-span-2">
            <dt className="text-[var(--muted)]">Timestamp</dt>
            <dd className="mt-1 font-mono">
              {health?.timestamp ?? "—"}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
