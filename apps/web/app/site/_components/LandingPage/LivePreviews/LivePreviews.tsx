import styles from "./LivePreviews.module.css";

export function LivePreviews() {
  return (
    <section className={styles.root} id="live-demo" aria-label="Live previews">
      <p className={styles.eyebrow}>Xem trực tiếp</p>
      <h2 className={styles.title}>Một tin nhắn — agent làm từng bước</h2>
      <p className={styles.lead}>
        Gõ yêu cầu, tag <strong>@Trợ Lý</strong>, rồi theo dõi tiến trình làm việc
        như trong app thật.
      </p>

      <div className={styles.frameWrap}>
        <iframe
          className={styles.iframe}
          src="/chat-simulator/index.html"
          title="Mô phỏng chat Aucobot"
          data-testid="demo-frame"
          loading="lazy"
        />
      </div>
    </section>
  );
}
