import {
  MagnifyingGlassIcon,
  PaintBrushIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { ArrowDownIcon } from "@heroicons/react/24/solid";

import styles from "../LandingPage.module.css";

const AGENTS = [
  { Icon: PencilSquareIcon, name: "Content AI" },
  { Icon: MagnifyingGlassIcon, name: "Research AI" },
  { Icon: PaintBrushIcon, name: "Designer AI" },
  { Icon: PaperAirplaneIcon, name: "Publisher AI" },
] as const;

const PLATFORMS = ["Facebook", "TikTok", "Google Drive"] as const;

export function SolutionSection() {
  return (
    <section className={styles.section}>
      <p className={styles.sectionEyebrow}>Giải pháp</p>
      <h2 className={styles.sectionTitle}>Một phòng — cả team AI phối hợp</h2>

      <div className={styles.flow}>
        <div className={styles.flowNode}>Bạn</div>
        <ArrowDownIcon aria-hidden className={styles.flowArrow} />
        <div className={`${styles.flowNode} ${styles.flowNodeAccent}`}>
          Marketing Room
        </div>
        <ArrowDownIcon aria-hidden className={styles.flowArrow} />
        <div className={styles.agentGrid}>
          {AGENTS.map((agent) => (
            <div key={agent.name} className={styles.flowAgent}>
              <span aria-hidden className={styles.flowAgentIcon}>
                <agent.Icon className={styles.glyph} />
              </span>
              <span className={styles.flowAgentName}>{agent.name}</span>
            </div>
          ))}
        </div>
        <ArrowDownIcon aria-hidden className={styles.flowArrow} />
        <div className={styles.platformRow}>
          {PLATFORMS.map((platform) => (
            <span key={platform} className={styles.platformChip}>
              {platform}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
