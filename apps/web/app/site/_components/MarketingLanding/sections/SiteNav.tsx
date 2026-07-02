import Link from "next/link";

import styles from "../MarketingLanding.module.css";

const LINKS = [
  { label: "Vấn đề", href: "#van-de" },
  { label: "Tính năng", href: "#tinh-nang" },
  { label: "Tiến độ", href: "#buildinpublic" },
  { label: "Cộng đồng", href: "#cong-dong" },
] as const;

export function SiteNav() {
  return (
    <header className={styles.nav}>
      <Link className={styles.logo} href="/">
        <span aria-hidden className={styles.logoDot} />
        Aucobot
      </Link>
      <nav className={styles.navLinks} aria-label="Điều hướng">
        {LINKS.map((link) => (
          <a key={link.href} className={styles.navLink} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className={styles.navCta} href="#dang-ky">
        Nhận thông báo
      </a>
    </header>
  );
}
