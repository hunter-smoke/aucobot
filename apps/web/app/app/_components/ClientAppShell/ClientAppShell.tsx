"use client";

import { useDepartmentIdFromHash } from "@/hooks/thread/use-department-id-from-hash";

import styles from "./ClientAppShell.module.css";

/** Placeholder threads — thay bằng `use-thread-list` khi có API departments. */
const PLACEHOLDER_THREADS = [
  { id: "1244557231", title: "Marketing chính" },
  { id: "9876543210", title: "TikTok campaigns" },
] as const;

export function ClientAppShell({ userName }: { userName: string }) {
  const { departmentId, openDepartment } = useDepartmentIdFromHash();

  return (
    <div className={styles.shell} data-chat-shell>
      <aside className={styles.panel}>
        <header className={styles.panelHeader}>
          <p className={styles.panelEyebrow}>Aucobot</p>
          <p className={styles.panelUser}>{userName}</p>
        </header>

        <ul className={styles.threadList}>
          {PLACEHOLDER_THREADS.map((thread) => {
            const active = departmentId === thread.id;

            return (
              <li key={thread.id}>
                <button
                  type="button"
                  className={active ? styles.threadActive : styles.threadItem}
                  onClick={() => openDepartment(thread.id)}
                >
                  {thread.title}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className={styles.chat}>
        {departmentId ? (
          <>
            <header className={styles.chatHeader}>
              <h1 className={styles.chatTitle}>Department {departmentId}</h1>
            </header>
            <div className={styles.chatBody}>
              <p className={styles.chatPlaceholder}>
                Message list + composer sẽ mount ở đây.
              </p>
            </div>
          </>
        ) : (
          <div className={styles.chatEmpty}>
            <p className={styles.chatEmptyTitle}>Chọn một phòng chat</p>
            <p className={styles.chatEmptyLead}>
              Chọn phòng bên trái hoặc mở link{" "}
              <code className={styles.hashExample}>#1244557231</code>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
