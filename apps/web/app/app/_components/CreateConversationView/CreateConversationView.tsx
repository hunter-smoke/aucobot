"use client";

import { createConversationSchema } from "@aucobot/shared";
import { useState } from "react";

import { conversationsApi, ConversationsApiError } from "@/lib/api/conversations";

import styles from "./CreateConversationView.module.css";

import type { ConversationResponse, ConversationType } from "@aucobot/shared";

interface CreateConversationViewProps {
  type: ConversationType;
  onBack: () => void;
  onCreated: (conversation: ConversationResponse) => void;
}

const COPY = {
  room: {
    heading: "Tạo phòng mới",
    titleLabel: "Tên phòng",
    titlePlaceholder: "Team TikTok Q1",
    helper: "Bạn có thể thêm mô tả cho phòng.",
  },
  session: {
    heading: "Phiên chat mới",
    titleLabel: "Tên phiên",
    titlePlaceholder: "Soạn caption Tết",
    helper: "Mô tả ngắn giúp bạn nhớ mục tiêu phiên này.",
  },
} as const;

export function CreateConversationView({
  type,
  onBack,
  onCreated,
}: CreateConversationViewProps) {
  const copy = COPY[type];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = createConversationSchema.safeParse({
      type,
      title,
      description: description.trim() ? description : undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setBusy(true);

    try {
      const conversation = await conversationsApi.create(parsed.data);
      onCreated(conversation);
    } catch (err) {
      setError(
        err instanceof ConversationsApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Quay lại">
          ←
        </button>
        <h1 className={styles.heading}>{copy.heading}</h1>
      </header>

      <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <label className={styles.field}>
          <span className={styles.label}>{copy.titleLabel}</span>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={copy.titlePlaceholder}
            maxLength={120}
            required
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Mô tả (tùy chọn)</span>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
          />
        </label>

        <p className={styles.helper}>{copy.helper}</p>

        <button
          type="submit"
          className={styles.submit}
          disabled={busy || !title.trim()}
          aria-label="Tạo"
        >
          {busy ? "…" : "→"}
        </button>
      </form>
    </div>
  );
}
