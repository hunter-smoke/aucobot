import styles from "../LandingPage.module.css";
import { LivePreviews } from "../LivePreviews/LivePreviews";
import previewStyles from "../LivePreviews/LivePreviews.module.css";
import { WaitlistForm } from "../WaitlistForm";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.badge}>Đang xây dựng công khai</span>
        <h1 className={styles.heroTitle}>
          Xây dựng <span className={styles.heroTitleAccent}>Phòng Marketing AI</span> của
          riêng bạn
        </h1>
        <p className={styles.heroNot}>Không phải một chatbot.</p>
        <p className={styles.heroLead}>
          Một phòng marketing AI thật sự — nghiên cứu, viết nội dung, lên lịch và đăng bài
          thay bạn trên Facebook &amp; TikTok.
        </p>

        <div className={styles.heroActions}>
          <WaitlistForm variant="hero" />
          <p className={styles.heroHint}>
            Để lại email — nhận thông báo khi MVP mở, và là người trải nghiệm đầu tiên.
          </p>
          <div className={styles.heroActionsRow}>
            <a className={styles.btnPrimary} href="#live-demo">
              Xem AI làm việc ngay ↓
            </a>
            <a className={styles.btnGhost} href="#live-demo">
              Xem demo
            </a>
          </div>
        </div>
      </div>

      <div className={previewStyles.heroWrap} id="live-demo">
        <LivePreviews embedded eager />
      </div>
    </section>
  );
}
