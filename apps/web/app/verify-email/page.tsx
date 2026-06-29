"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import type { AuthSuccessResponse } from "@aucobot/shared";

import { API_URL, setAuthSession } from "../fetch-with-auth";

type VerifyState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; email: string }
  | { status: "error"; message: string };

async function verifyToken(token: string): Promise<VerifyState> {
  const res = await fetch(`${API_URL}/api/auth/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = (await res.json()) as AuthSuccessResponse & {
    message?: string | string[];
  };

  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : (data.message ?? "Verification failed.");
    return { status: "error", message };
  }

  if (data.accessExpiresAt) {
    setAuthSession(data.accessExpiresAt);
  }

  return {
    status: "success",
    email: data.user?.email ?? "",
  };
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const [manualToken, setManualToken] = useState("");
  const [state, setState] = useState<VerifyState>({ status: "idle" });

  const runVerify = useCallback(async (token: string) => {
    setState({ status: "loading" });

    try {
      const result = await verifyToken(token.trim());
      setState(result);

      if (result.status === "success") {
        window.setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch {
      setState({ status: "error", message: "Could not reach the API." });
    }
  }, []);

  useEffect(() => {
    if (tokenFromUrl) {
      void runVerify(tokenFromUrl);
    }
  }, [tokenFromUrl, runVerify]);

  const showManualForm = !tokenFromUrl;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-6 py-16">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <h1 className="text-2xl font-semibold">Email verification</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Open the link from your email, or paste the token below to test.
        </p>

        {state.status === "loading" && (
          <p className="mt-4 text-[var(--muted)]">Verifying your email…</p>
        )}

        {state.status === "success" && (
          <div className="mt-4 space-y-2">
            <p className="text-emerald-300">Your email has been verified.</p>
            {state.email && <p className="text-sm text-[var(--muted)]">{state.email}</p>}
            <p className="text-sm text-[var(--muted)]">Redirecting to home…</p>
          </div>
        )}

        {state.status === "error" && (
          <div className="mt-4 space-y-4">
            <p className="text-red-300">{state.message}</p>
            {showManualForm && (
              <button
                type="button"
                onClick={() => setState({ status: "idle" })}
                className="text-sm text-[var(--accent)] underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {showManualForm && state.status !== "loading" && state.status !== "success" && (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!manualToken.trim()) {
                setState({ status: "error", message: "Paste the token from your email link." });
                return;
              }
              void runVerify(manualToken);
            }}
          >
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-[var(--muted)]">Verification token</span>
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste token from ?token=..."
                className="rounded-lg border border-[var(--border)] bg-black/20 px-3 py-2 font-mono text-sm"
                autoComplete="off"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
            >
              Verify email
            </button>
          </form>
        )}

        <p className="mt-6 break-all text-xs text-[var(--muted)]">
          API: <span className="font-mono">{API_URL}</span>
        </p>

        <a href="/" className="mt-4 inline-block text-sm text-[var(--accent)] underline">
          Back to home
        </a>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6">
          <p className="text-[var(--muted)]">Loading…</p>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
