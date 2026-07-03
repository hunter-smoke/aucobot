import type { ReactNode } from "react";

import styles from "./MetaSection.module.css";

export interface MetaSectionProps {
  title?: string;
  children: ReactNode;
}

export function MetaSection({ title, children }: MetaSectionProps) {
  return (
    <section className={styles.section}>
      {title ? <h4 className={styles.title}>{title}</h4> : null}
      {children}
    </section>
  );
}
