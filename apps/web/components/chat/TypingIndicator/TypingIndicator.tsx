import styles from "./TypingIndicator.module.css";

export interface TypingIndicatorProps {
  /** Nhãn phụ trước 3 chấm, vd "Đang nghĩ". */
  label?: string;
}

export function TypingIndicator({ label }: TypingIndicatorProps) {
  return (
    <div className={styles.row}>
      <div className={styles.bubble}>
        {label ? <span className={styles.label}>{label}</span> : null}
        <span className={styles.dots} aria-hidden>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
        <span className={styles.srOnly}>{label ?? "Agent đang trả lời"}</span>
      </div>
    </div>
  );
}
