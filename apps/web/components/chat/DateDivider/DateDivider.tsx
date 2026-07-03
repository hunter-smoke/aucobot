import { formatDateDivider } from "@/utils/chat/format-time";

import styles from "./DateDivider.module.css";

export interface DateDividerProps {
  /** ISO string của ngày. */
  date: string;
}

export function DateDivider({ date }: DateDividerProps) {
  return (
    <div className={styles.divider}>
      <span className={styles.label}>{formatDateDivider(date)}</span>
    </div>
  );
}
