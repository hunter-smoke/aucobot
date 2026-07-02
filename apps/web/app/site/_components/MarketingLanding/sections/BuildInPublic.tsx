import { CheckCircleIcon, ClockIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

import {
  CURRENT_SPRINT,
  DEMO_TIMELINE,
  LAST_UPDATED,
  ROADMAP,
  mvpProgressPercent,
  type ItemStatus,
} from "../data/roadmap";

import styles from "../MarketingLanding.module.css";

const STATUS_ICON: Record<ItemStatus, typeof CheckCircleIcon> = {
  done: CheckCircleIcon,
  "in-progress": ClockIcon,
  planned: MinusCircleIcon,
};

const STATUS_CLASS: Record<ItemStatus, string> = {
  done: styles.statusDone,
  "in-progress": styles.statusProgress,
  planned: styles.statusPlanned,
};

export function BuildInPublic() {
  const percent = mvpProgressPercent();

  return (
    <section className={styles.section} id="buildinpublic">
      <p className={styles.sectionEyebrow}>Xây dựng công khai</p>
      <h2 className={styles.sectionTitle}>Dự án đang sống — theo dõi tiến độ thật</h2>
      <p className={styles.sectionLead}>
        Không deadline ảo. Đây là trạng thái thật của sản phẩm, cập nhật theo tiến độ.
      </p>

      <div className={styles.bipTop}>
        <div className={styles.progressCard}>
          <div className={styles.progressHead}>
            <span className={styles.progressPct}>{percent}%</span>
            <span className={styles.progressLabel}>Tiến độ MVP</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className={styles.sprintCard}>
          <p className={styles.sprintTitle}>Đang làm</p>
          {CURRENT_SPRINT.map((item) => (
            <p key={item} className={styles.sprintItem}>
              <ArrowRightIcon aria-hidden className={styles.sprintArrow} />
              {item}
            </p>
          ))}
          <p className={styles.lastUpdated}>
            Cập nhật gần nhất: <b>{LAST_UPDATED}</b>
          </p>
        </div>
      </div>

      <div className={styles.roadmap}>
        {ROADMAP.map((phase) => (
          <article key={phase.id} className={styles.phaseCard}>
            <h3 className={styles.phaseName}>{phase.name}</h3>
            <p className={styles.phaseTagline}>{phase.tagline}</p>
            <ul className={styles.phaseItems}>
              {phase.items.map((item) => {
                const StatusIcon = STATUS_ICON[item.status];

                return (
                  <li
                    key={item.label}
                    className={`${styles.phaseItem} ${
                      item.status === "done"
                        ? styles.phaseItemDone
                        : styles.phaseItemPlanned
                    }`}
                  >
                    <StatusIcon
                      aria-hidden
                      className={`${styles.itemState} ${STATUS_CLASS[item.status]}`}
                    />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      <div className={styles.timeline} aria-label="Lộ trình ra mắt">
        {DEMO_TIMELINE.map((stage) => (
          <span
            key={stage.label}
            className={`${styles.timelineStage} ${
              stage.current
                ? styles.timelineCurrent
                : stage.reached
                  ? styles.timelineReached
                  : ""
            }`}
          >
            {stage.reached ? "●" : "○"} {stage.label}
          </span>
        ))}
      </div>
    </section>
  );
}
