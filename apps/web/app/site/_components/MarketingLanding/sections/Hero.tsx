import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import styles from "../MarketingLanding.module.css";
import { WaitlistForm } from "../WaitlistForm";


const AGENTS = [
  {
    Icon: Squares2X2Icon,
    name: "Orchestrator",
    task: "Nhận yêu cầu, chia việc",
    status: "đang điều phối",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "Research",
    task: "Tìm trend, đối thủ",
    status: "đang tìm",
  },
  {
    Icon: PencilSquareIcon,
    name: "Content",
    task: "Viết caption Tết",
    status: "đang viết",
  },
  {
    Icon: PaperAirplaneIcon,
    name: "Publisher",
    task: "Chờ duyệt để đăng",
    status: "chờ duyệt",
  },
] as const;

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.badge}>
          <span aria-hidden className={styles.badgeDot} />
          Đang xây dựng công khai
        </span>
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
            <a className={styles.btnGhost} href="#san-pham">
              Xem cách hoạt động ↓
            </a>
            <span className={styles.btnDisabled}>
              Xem demo
              <span className={styles.soonTag}>Sắp có</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.agents} aria-label="Các agent đang làm việc">
        <p className={styles.agentsHead}>Marketing Room · đang hoạt động</p>
        {AGENTS.map((agent) => (
          <div key={agent.name} className={styles.agentRow}>
            <span aria-hidden className={styles.agentIcon}>
              <agent.Icon className={styles.glyph} />
            </span>
            <span>
              <span className={styles.agentName}>{agent.name}</span>
              <br />
              <span className={styles.agentTask}>{agent.task}</span>
            </span>
            <span className={styles.agentStatus}>
              {agent.status}
              <span aria-hidden className={styles.agentDots} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
