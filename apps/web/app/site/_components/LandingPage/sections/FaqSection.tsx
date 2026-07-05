import { FAQ } from "../data/content";

import styles from "../LandingPage.module.css";

export function FaqSection() {
  return (
    <section className={styles.section}>
      <p className={styles.sectionEyebrow}>FAQ</p>
      <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>

      <div className={styles.faqList}>
        {FAQ.map((item) => (
          <details key={item.question} className={styles.faqItem}>
            <summary className={styles.faqQ}>{item.question}</summary>
            <p className={styles.faqA}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
