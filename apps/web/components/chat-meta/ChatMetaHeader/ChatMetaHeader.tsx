"use client";

import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

import type { ConversationType } from "@aucobot/shared";

import styles from "./ChatMetaHeader.module.css";

const PANEL_TITLE = {
  room: "Thông tin phòng",
  session: "Thông tin phiên",
} as const;

export interface ChatMetaHeaderProps {
  type: ConversationType;
  onClose?: () => void;
  onRename?: () => void;
}

export function ChatMetaHeader({ type, onClose, onRename }: ChatMetaHeaderProps) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.iconBtn}
        onClick={onClose}
        aria-label="Đóng"
        title="Đóng"
      >
        <XMarkIcon className={styles.icon} />
      </button>

      <h2 className={styles.title}>{PANEL_TITLE[type]}</h2>

      <button
        type="button"
        className={styles.iconBtn}
        onClick={onRename}
        aria-label="Đổi tên"
        title="Đổi tên"
      >
        <PencilSquareIcon className={styles.icon} />
      </button>
    </header>
  );
}
