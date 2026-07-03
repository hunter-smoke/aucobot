"use client";

import { BellIcon, CpuChipIcon } from "@heroicons/react/24/outline";

import {
  formatConversationTime,
  formatFullDate,
} from "@/utils/chat/format-time";

import type { ConversationResponse } from "@aucobot/shared";

import { ChatMetaHeader } from "../ChatMetaHeader/ChatMetaHeader";
import { ChatMetaIdentity } from "../ChatMetaIdentity/ChatMetaIdentity";
import { MetaActions } from "../MetaActions/MetaActions";
import { MetaFutureRow } from "../MetaFutureRow/MetaFutureRow";
import { MetaInfoRow } from "../MetaInfoRow/MetaInfoRow";
import { MetaSection } from "../MetaSection/MetaSection";

import styles from "./ChatMetaPanel.module.css";

const TYPE_LABEL = {
  room: "Phòng",
  session: "Phiên",
} as const;

export interface ChatMetaPanelProps {
  conversation: ConversationResponse;
  onClose?: () => void;
  onRename?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ChatMetaPanel({
  conversation,
  onClose,
  onRename,
  onArchive,
  onDelete,
}: ChatMetaPanelProps) {
  const { id, type, lastMessageAt, createdAt } = conversation;

  return (
    <aside className={styles.panel} aria-label="Thông tin hội thoại">
      <ChatMetaHeader
        type={type}
        onClose={onClose}
        onRename={onRename ? () => onRename(id) : undefined}
      />

      <div className={styles.body}>
        <ChatMetaIdentity conversation={conversation} />

        <MetaSection>
          <MetaInfoRow label="Loại" value={TYPE_LABEL[type]} />
          <MetaInfoRow label="Tạo lúc" value={formatFullDate(createdAt)} />
          <MetaInfoRow
            label="Hoạt động"
            value={
              lastMessageAt ? formatConversationTime(lastMessageAt) : "Chưa có"
            }
          />
          <MetaInfoRow label="ID" value={id} copyable mono />
        </MetaSection>

        <MetaSection>
          <MetaFutureRow icon={BellIcon} label="Thông báo" trailing="toggle" />
          <MetaFutureRow icon={CpuChipIcon} label="Agent trong phòng" />
        </MetaSection>

        <MetaActions
          type={type}
          onArchive={onArchive ? () => onArchive(id) : undefined}
          onDelete={onDelete ? () => onDelete(id) : undefined}
        />
      </div>
    </aside>
  );
}
