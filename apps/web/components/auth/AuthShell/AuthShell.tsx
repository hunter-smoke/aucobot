import styles from "./AuthShell.module.css";

import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className={styles.authShell}>
      <div className={styles.card}>
        <p className={styles.logo}>Aucobot</p>
        {children}
      </div>
    </div>
  );
}
