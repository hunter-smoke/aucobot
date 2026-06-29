import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify email — Aucobot",
  description: "Confirm your Aucobot account email address",
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
