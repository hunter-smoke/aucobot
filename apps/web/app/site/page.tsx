import Link from "next/link";

import styles from "./page.module.css";

export default function MarketingHomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Aucobot</p>
        <h1 className={styles.title}>AI agent cho marketing trên Facebook &amp; TikTok</h1>
        <p className={styles.lead}>
          Quản lý nội dung, duyệt bài và chat với agent — giao diện gọn như Telegram.
        </p>
      </header>

      <div className={styles.actions}>
        <Link className={styles.btnPrimary} href="/login">
          Đăng nhập
        </Link>
        <Link className={styles.btnSecondary} href="/register">
          Đăng ký miễn phí
        </Link>
      </div>
    </main>
  );
}
