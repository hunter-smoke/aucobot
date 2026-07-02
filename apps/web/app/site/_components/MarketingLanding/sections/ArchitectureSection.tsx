import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

import styles from "../MarketingLanding.module.css";

const NODES = [
  "User",
  "Orchestrator",
  "Content Agent",
  "Publisher Agent",
  "MCP",
  "Facebook / TikTok",
] as const;

export function ArchitectureSection() {
  return (
    <section className={styles.section}>
      <p className={styles.sectionEyebrow}>Dành cho dân kỹ thuật</p>
      <h2 className={styles.sectionTitle}>Kiến trúc</h2>
      <p className={styles.sectionLead}>
        Multi-agent qua orchestrator, tool calling chuẩn MCP, con người duyệt cuối.
      </p>

      <div className={styles.archFlow}>
        {NODES.map((node, index) => (
          <Fragment key={node}>
            <span className={styles.archNode}>{node}</span>
            {index < NODES.length - 1 ? (
              <ArrowRightIcon aria-hidden className={styles.archArrow} />
            ) : null}
          </Fragment>
        ))}
      </div>

      <div className={styles.archActions}>
        <span className={styles.btnDisabled}>
          Xem tài liệu kiến trúc
          <span className={styles.soonTag}>Sắp có</span>
        </span>
      </div>
    </section>
  );
}
