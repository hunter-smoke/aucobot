import styles from "./ConversationEmptyState.module.css";

interface ConversationEmptyStateProps {
  onCreateRoom: () => void;
  onCreateSession: () => void;
}

export function ConversationEmptyState({
  onCreateRoom,
  onCreateSession,
}: ConversationEmptyStateProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.title}>Chưa có cuộc trò chuyện</p>
      <p className={styles.lead}>
        Tạo phòng để làm việc lâu dài với nhiều agent, hoặc mở phiên chat cho một
        việc cụ thể.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={onCreateRoom}>
          Tạo phòng
        </button>
        <button type="button" className={styles.btnSecondary} onClick={onCreateSession}>
          Phiên chat mới
        </button>
      </div>
    </div>
  );
}
