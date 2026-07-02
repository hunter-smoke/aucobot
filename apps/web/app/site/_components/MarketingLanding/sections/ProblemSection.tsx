import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  FolderIcon,
  MegaphoneIcon,
  SwatchIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

import styles from "../MarketingLanding.module.css";

const TOOLS = [
  { Icon: ChatBubbleLeftRightIcon, label: "ChatGPT để viết" },
  { Icon: SwatchIcon, label: "Canva để thiết kế" },
  { Icon: MegaphoneIcon, label: "Facebook để đăng" },
  { Icon: VideoCameraIcon, label: "TikTok để đăng" },
  { Icon: FolderIcon, label: "Google Drive để đọc tài liệu" },
  { Icon: DocumentTextIcon, label: "Notion để lưu kiến thức" },
] as const;

export function ProblemSection() {
  return (
    <section className={styles.section} id="van-de">
      <p className={styles.sectionEyebrow}>Vấn đề</p>
      <h2 className={styles.sectionTitle}>Marketing ngày nay quá rời rạc</h2>
      <p className={styles.sectionLead}>
        Mỗi việc một công cụ. Bạn là người phải mở tab, copy qua lại và tự kết nối tất cả.
      </p>

      <div className={styles.problemGrid}>
        {TOOLS.map((tool) => (
          <div key={tool.label} className={styles.toolCard}>
            <span aria-hidden className={styles.toolIcon}>
              <tool.Icon className={styles.glyph} />
            </span>
            {tool.label}
          </div>
        ))}
      </div>

      <p className={styles.problemPunch}>
        Bạn phải tự kết nối tất cả. <b>Aucobot làm điều đó tự động.</b>
      </p>
    </section>
  );
}
