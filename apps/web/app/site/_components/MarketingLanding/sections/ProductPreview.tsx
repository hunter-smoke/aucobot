import {
  CpuChipIcon,
  FolderOpenIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

import styles from "../MarketingLanding.module.css";

const STEPS = [
  { Icon: CpuChipIcon, text: "Agent đang suy nghĩ", hint: "Phân tích yêu cầu của bạn" },
  { Icon: FolderOpenIcon, text: "Đọc tài liệu từ Google Drive", hint: "Brand brief, sản phẩm" },
  { Icon: PencilSquareIcon, text: "Viết bài theo tone thương hiệu", hint: "3 caption + CTA" },
  { Icon: PaperAirplaneIcon, text: "Đăng lên Facebook", hint: "Sau khi bạn duyệt" },
] as const;

export function ProductPreview() {
  return (
    <section className={styles.section} id="san-pham">
      <p className={styles.sectionEyebrow}>Xem trước sản phẩm</p>
      <h2 className={styles.sectionTitle}>Một luồng làm việc, từ chat đến đăng bài</h2>

      <div className={styles.previewWrap}>
        <div className={styles.previewChrome}>
          <span aria-hidden className={styles.previewDot} />
          <span aria-hidden className={styles.previewDot} />
          <span aria-hidden className={styles.previewDot} />
          <span className={styles.previewLabel}>Campaign Tết · Marketing Room</span>
        </div>
        <div className={styles.previewSteps}>
          {STEPS.map((step, index) => (
            <div key={step.text}>
              <div className={styles.previewStep}>
                <span aria-hidden className={styles.previewStepIcon}>
                  <step.Icon className={styles.glyph} />
                </span>
                <span className={styles.previewStepText}>
                  {step.text}
                  <br />
                  <span>{step.hint}</span>
                </span>
              </div>
              {index === 2 ? (
                <p className={styles.previewApprove}>
                  <CheckCircleIcon aria-hidden className={styles.glyph} />
                  Chờ bạn duyệt · Post #2841 — “Tết sum vầy bắt đầu từ món ngon…”
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
