import { COMMUNITY_LINKS } from "../data/content";
import styles from "../MarketingLanding.module.css";
import { WaitlistForm } from "../WaitlistForm";


export function CommunitySection() {
  return (
    <section className={styles.section} id="cong-dong">
      <p className={styles.sectionEyebrow}>Cộng đồng</p>
      <h2 className={styles.sectionTitle}>Tham gia từ những ngày đầu</h2>
      <p className={styles.sectionLead}>
        Chúng tôi xây dựng cùng cộng đồng — góp ý tính năng, theo dõi tiến độ, thử sớm.
      </p>

      <div className={styles.communityGrid}>
        {COMMUNITY_LINKS.map((link) =>
          link.ready ? (
            <a key={link.label} className={styles.communityCard} href={link.href}>
              {link.label}
              <span aria-hidden>→</span>
            </a>
          ) : (
            <span key={link.label} className={styles.communityCardDisabled}>
              {link.label}
              <span className={styles.soonTag}>Sắp có</span>
            </span>
          ),
        )}
      </div>

      <div id="dang-ky" className={styles.waitlistBlock}>
        <h3 className={styles.featureTitle}>Là người đầu tiên trải nghiệm</h3>
        <p className={styles.sectionLead}>
          Để lại email — chúng tôi báo ngay khi MVP mở cửa.
        </p>
        <WaitlistForm variant="block" />
      </div>
    </section>
  );
}
