"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useLayoutEffect, useRef, useState } from "react";

import styles from "./Composer.module.css";

export interface ComposerProps {
  onSend?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MAX_ROWS_PX = 200;

export function Composer({
  onSend,
  placeholder = "Nhắn tin…",
  disabled = false,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_ROWS_PX)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !disabled;

  function send() {
    if (!canSend) return;
    onSend?.(value.trim());
    setValue("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className={styles.composer}>
      <div className={styles.card}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={send}
          disabled={!canSend}
          aria-label="Gửi"
          title="Gửi"
          data-active={canSend ? "true" : undefined}
        >
          <PaperAirplaneIcon className={styles.sendIcon} />
        </button>
      </div>
    </div>
  );
}
