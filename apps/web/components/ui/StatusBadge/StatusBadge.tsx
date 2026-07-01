import styles from "./StatusBadge.module.css";

export function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={ok ? styles.badgeOk : styles.badgeError}>{label}</span>
  );
}
