import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { authApi, AuthApiError } from "@/lib/api/auth";

import type { AuthFlowStore } from "@/stores/auth-flow/auth-flow.store";

const RESEND_COOLDOWN_MS = 60_000;

export function useEmailOtpFlow(store: AuthFlowStore) {
  const router = useRouter();
  const mode = store((s) => s.mode);
  const step = store((s) => s.step);
  const email = store((s) => s.email);
  const resendEndsAt = store((s) => s.resendEndsAt);
  const setStep = store((s) => s.setStep);
  const setEmail = store((s) => s.setEmail);
  const setResendEndsAt = store((s) => s.setResendEndsAt);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown) => {
    if (err instanceof AuthApiError) {
      setError(err.message);
      return;
    }

    setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
  }, []);

  const submitEmail = useCallback(
    async (nextEmail: string) => {
      setBusy(true);
      clearError();

      try {
        const result = await authApi.sendEmailCode(nextEmail, mode);
        setEmail(nextEmail.trim().toLowerCase());
        setResendEndsAt(Date.now() + RESEND_COOLDOWN_MS);
        void result;
        setStep("code");
      } catch (err) {
        handleApiError(err);
      } finally {
        setBusy(false);
      }
    },
    [clearError, handleApiError, mode, setEmail, setResendEndsAt, setStep],
  );

  const verifyCode = useCallback(
    async (code: string) => {
      setBusy(true);
      clearError();

      try {
        await authApi.verifyEmailCode(email, code, mode);
        router.push("/");
        router.refresh();
      } catch (err) {
        handleApiError(err);
      } finally {
        setBusy(false);
      }
    },
    [clearError, email, handleApiError, mode, router],
  );

  const resendCode = useCallback(async () => {
    setBusy(true);
    clearError();

    try {
      const result = await authApi.resendEmailCode(email, mode);
      setResendEndsAt(Date.now() + RESEND_COOLDOWN_MS);
      void result;
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusy(false);
    }
  }, [clearError, email, handleApiError, mode, setResendEndsAt]);

  const goBackToEmail = useCallback(() => {
    clearError();
    setStep("email");
  }, [clearError, setStep]);

  return {
    mode,
    step,
    email,
    resendEndsAt,
    busy,
    error,
    submitEmail,
    verifyCode,
    resendCode,
    goBackToEmail,
  };
}
