"use client";

import Link from "next/link";
import { useState } from "react";

import { authApi } from "@/lib/api/auth";

import styles from "./EmailStep.module.css";

import type { AuthFlowMode } from "@/stores/auth-flow/auth-flow.store";

interface EmailStepProps {
  mode: AuthFlowMode;
  busy: boolean;
  error: string | null;
  onSubmit: (email: string) => void;
}

const COPY = {
  login: {
    title: "Sign in with email",
    cta: "Continue",
    crossText: "Don't have an account?",
    crossLabel: "Sign up",
    crossHref: "/register",
  },
  register: {
    title: "Enter your email",
    cta: "Sign up for free",
    crossText: "Already have an account?",
    crossLabel: "Sign in",
    crossHref: "/login",
  },
} as const;

export function EmailStep({ mode, busy, error, onSubmit }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const copy = COPY[mode];
  const apiUrl = authApi.getApiUrl();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(email);
  }

  return (
    <>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.lead}>We&apos;ll send a 6-digit code to your inbox.</p>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <button type="submit" className={styles.btnPrimary} disabled={busy}>
          {busy ? "Sending…" : copy.cta}
        </button>
      </form>

      <div className={styles.divider}>or</div>

      <a href={`${apiUrl}/api/auth/google`} className={styles.btnGoogle}>
        Continue with Google
      </a>

      <p className={styles.crossLink}>
        {copy.crossText}{" "}
        <Link href={copy.crossHref}>{copy.crossLabel}</Link>
      </p>
    </>
  );
}
