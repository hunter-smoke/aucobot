import { create } from "zustand";

export type AuthFlowMode = "login" | "register";
export type AuthFlowStep = "email" | "code";

interface AuthFlowState {
  mode: AuthFlowMode;
  step: AuthFlowStep;
  email: string;
  resendEndsAt: number | null;
  setMode: (mode: AuthFlowMode) => void;
  setStep: (step: AuthFlowStep) => void;
  setEmail: (email: string) => void;
  setResendEndsAt: (resendEndsAt: number | null) => void;
  reset: () => void;
}

function createInitialState(mode: AuthFlowMode) {
  return {
    mode,
    step: "email" as const,
    email: "",
    resendEndsAt: null,
  };
}

export function createAuthFlowStore(mode: AuthFlowMode) {
  return create<AuthFlowState>((set) => ({
    ...createInitialState(mode),
    setMode: (nextMode) => set({ mode: nextMode }),
    setStep: (step) => set({ step }),
    setEmail: (email) => set({ email }),
    setResendEndsAt: (resendEndsAt) => set({ resendEndsAt }),
    reset: () => set(createInitialState(mode)),
  }));
}

export type AuthFlowStore = ReturnType<typeof createAuthFlowStore>;
