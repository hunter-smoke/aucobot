"use client";

import { useCallback, useEffect, useState } from "react";

import type { UserResponse } from "@aucobot/shared";
import { API_DEFAULT_PORT } from "@aucobot/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${API_DEFAULT_PORT}`;

type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; user: UserResponse };

export function AuthDemo() {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadMe = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (res.status === 401) {
        setAuth({ status: "anonymous" });
        return;
      }

      if (!res.ok) {
        setAuth({ status: "anonymous" });
        return;
      }

      const user = (await res.json()) as UserResponse;
      setAuth({ status: "authenticated", user });
    } catch {
      setAuth({ status: "anonymous" });
    }
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  async function handleAuthAction(path: "register" | "login") {
    setBusy(true);
    setError(null);

    try {
      const body =
        path === "register"
          ? { email, password, name: name || undefined }
          : { email, password };

      const res = await fetch(`${API_URL}/api/auth/${path}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as { user?: UserResponse; message?: string | string[] };

      if (!res.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(", ")
          : (data.message ?? "Request failed");
        setError(message);
        return;
      }

      if (data.user) {
        setAuth({ status: "authenticated", user: data.user });
      } else {
        await loadMe();
      }
    } catch {
      setError("Không kết nối được API");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    setError(null);

    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setAuth({ status: "anonymous" });
    } catch {
      setError("Không kết nối được API");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium">Auth demo</h2>
        {auth.status === "loading" ? (
          <span className="text-sm text-[var(--muted)]">Đang tải…</span>
        ) : auth.status === "authenticated" ? (
          <span className="text-sm text-emerald-300">Đã đăng nhập</span>
        ) : (
          <span className="text-sm text-[var(--muted)]">Chưa đăng nhập</span>
        )}
      </div>

      {auth.status === "authenticated" && (
        <div className="mb-6 flex items-center gap-4 rounded-xl bg-[var(--accent-soft)] p-4">
          {auth.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- demo avatar from Google
            <img
              src={auth.user.avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-sm font-medium">
              {(auth.user.name ?? auth.user.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">{auth.user.name ?? auth.user.email}</p>
            <p className="text-sm text-[var(--muted)]">{auth.user.email}</p>
          </div>
        </div>
      )}

      {auth.status !== "authenticated" && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-black/20 px-3 py-2"
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Password (min 8)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-black/20 px-3 py-2"
              autoComplete="current-password"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Name (register)</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-black/20 px-3 py-2"
              autoComplete="name"
            />
          </label>
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        {auth.status !== "authenticated" && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleAuthAction("register")}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Đăng ký
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleAuthAction("login")}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Đăng nhập
            </button>
            <a
              href={`${API_URL}/api/auth/google`}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium"
            >
              Login with Google
            </a>
          </>
        )}
        {auth.status === "authenticated" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleLogout()}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Đăng xuất
          </button>
        )}
      </div>
    </section>
  );
}
