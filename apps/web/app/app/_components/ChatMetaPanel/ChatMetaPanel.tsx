import styles from "./ChatMetaPanel.module.css";

import type { ConversationResponse } from "@aucobot/shared";

interface ChatMetaPanelProps {
  conversation: ConversationResponse;
}

const TYPE_LABEL = {
  room: "Phòng",
  session: "Phiên",
} as const;

export function ChatMetaPanel({ conversation }: ChatMetaPanelProps) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <span className={styles.badge}>{TYPE_LABEL[conversation.type]}</span>
          <h1 className={styles.title}>{conversation.title}</h1>
        </div>
        {conversation.description ? (
          <p className={styles.description}>{conversation.description}</p>
        ) : null}
      </header>
      <div className={styles.body}>
        <p className={styles.placeholder}>
          Tin nhắn và AI agent sẽ có ở phase tiếp theo. Phase 1 chỉ quản lý phòng
          và phiên chat.
        </p>
      </div>
    </>
  );
}
