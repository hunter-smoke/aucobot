import styles from "../MarketingLanding.module.css";

const FOOTER_LINKS = [
  { label: "Tính năng", href: "#tinh-nang" },
  { label: "Tiến độ", href: "#buildinpublic" },
  { label: "Cộng đồng", href: "#cong-dong" },
  { label: "Nhận thông báo", href: "#dang-ky" },
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <span className={styles.logo}>
            <span aria-hidden className={styles.logoDot} />
            Aucobot
          </span>
          <nav className={styles.footerLinks} aria-label="Chân trang">
            {FOOTER_LINKS.map((link) => (
              <a key={link.href} className={styles.footerLink} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} Aucobot · Xây dựng phòng marketing ảo của riêng bạn
        </p>
      </div>
    </footer>
  );
}
