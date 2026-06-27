import type { HealthResponse, UserResponse } from "@aucobot/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

async function getUsers(): Promise<UserResponse[]> {
  try {
    const res = await fetch(`${API_URL}/api/users`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
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
  const [health, users] = await Promise.all([getHealth(), getUsers()]);

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

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Users</h2>
          <span className="text-sm text-[var(--muted)]">{users.length} records</span>
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Chưa có user. Tạo thử bằng lệnh:
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {users.map((user) => (
              <li key={user.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{user.name ?? user.email}</p>
                  <p className="text-sm text-[var(--muted)]">{user.email}</p>
                </div>
                <p className="font-mono text-xs text-[var(--muted)]">
                  {user.timezone}
                </p>
              </li>
            ))}
          </ul>
        )}

        <pre className="mt-4 overflow-x-auto rounded-xl bg-black/30 p-4 text-xs text-[var(--muted)]">
{`curl -X POST ${API_URL}/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"email":"demo@aucobot.vn","name":"Demo User"}'`}
        </pre>
      </section>
    </main>
  );
}
