import { BoltIcon, UsersIcon } from "@heroicons/react/16/solid";

import { Avatar } from "@/components/ui/Avatar/Avatar";
import { formatFullDate } from "@/utils/chat/format-time";

import type { ConversationResponse } from "@aucobot/shared";

import styles from "./ChatMetaIdentity.module.css";

const TYPE_META = {
  room: { label: "Phòng", Icon: UsersIcon },
  session: { label: "Phiên", Icon: BoltIcon },
} as const;

export interface ChatMetaIdentityProps {
  conversation: ConversationResponse;
}

export function ChatMetaIdentity({ conversation }: ChatMetaIdentityProps) {
  const { id, type, title, description, createdAt } = conversation;
  const { label, Icon } = TYPE_META[type];

  return (
    <section className={styles.identity}>
      <Avatar name={title} seed={id} size="lg" />

      <h3 className={styles.name}>{title}</h3>

      <div className={styles.meta}>
        <span className={styles.badge} data-type={type}>
          <Icon className={styles.badgeIcon} />
          {label}
        </span>
        <span className={styles.dot} aria-hidden>
          ·
        </span>
        <span className={styles.created}>Tạo {formatFullDate(createdAt)}</span>
      </div>

      {description ? (
        <p className={styles.description}>{description}</p>
      ) : null}
    </section>
  );
}
