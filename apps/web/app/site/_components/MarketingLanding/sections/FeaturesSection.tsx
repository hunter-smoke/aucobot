import { FEATURES } from "../data/content";

import styles from "../MarketingLanding.module.css";

export function FeaturesSection() {
  return (
    <section className={styles.section} id="tinh-nang">
      <p className={styles.sectionEyebrow}>Tính năng</p>
      <h2 className={styles.sectionTitle}>Không phải một chatbot — một phòng ban</h2>

      <div className={styles.featureGrid}>
        {FEATURES.map((feature, index) => (
          <article key={feature.title} className={styles.featureCard}>
            <span className={styles.featureNum}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureBody}>{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
