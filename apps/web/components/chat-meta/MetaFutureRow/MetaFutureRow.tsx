import type { ComponentType, SVGProps } from "react";

import styles from "./MetaFutureRow.module.css";

export interface MetaFutureRowProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  /** Kiểu phần đuôi: công tắc tắt (disabled) hoặc nhãn "Sắp có". */
  trailing?: "toggle" | "badge";
}

export function MetaFutureRow({
  icon: Icon,
  label,
  trailing = "badge",
}: MetaFutureRowProps) {
  return (
    <div className={styles.row} aria-disabled>
      <Icon className={styles.icon} />
      <span className={styles.label}>{label}</span>
      {trailing === "toggle" ? (
        <span className={styles.toggle} aria-hidden>
          <span className={styles.knob} />
        </span>
      ) : (
        <span className={styles.badge}>Sắp có</span>
      )}
    </div>
  );
}
