import Link from "next/link";
import { redirect } from "next/navigation";

import { StatusBadge } from "@/app/_components/StatusBadge/StatusBadge";
import { getApiBaseUrl } from "@/lib/http/api-base-url";
import { getServerHealth } from "@/lib/http/health-server";
import { getServerUser } from "@/lib/http/server-auth";

import styles from "./page.module.css";

export default async function HomePage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  const health = await getServerHealth();
  const apiUrl = getApiBaseUrl();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Aucobot</p>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.lead}>
          Signed in as <strong>{user.name ?? user.email}</strong>.{" "}
          <Link href="/login">Account</Link>
        </p>
      </header>

      <section className={styles.healthCard}>
        <div className={styles.healthHeader}>
          <h2 className={styles.healthTitle}>System health</h2>
          <StatusBadge
            ok={health?.status === "ok"}
            label={health?.status === "ok" ? "Online" : "Offline"}
          />
        </div>

        <dl className={styles.healthGrid}>
          <div className={styles.healthItem}>
            <dt className={styles.healthLabel}>API URL</dt>
            <dd className={styles.healthValue}>{apiUrl}</dd>
          </div>
          <div className={styles.healthItem}>
            <dt className={styles.healthLabel}>Database</dt>
            <dd className={styles.healthValue}>{health?.database ?? "unknown"}</dd>
          </div>
          <div className={styles.healthItemWide}>
            <dt className={styles.healthLabel}>Timestamp</dt>
            <dd className={styles.healthValue}>{health?.timestamp ?? "—"}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
