import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aucobot",
  description: "AI Agent Cloud — quản lý Facebook & TikTok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
