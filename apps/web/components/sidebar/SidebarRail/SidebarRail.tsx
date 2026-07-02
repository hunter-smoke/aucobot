import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { Avatar } from "@/components/ui/Avatar/Avatar";

import styles from "./SidebarRail.module.css";

export type RailView = "chats" | "contacts";

interface SidebarRailProps {
  userName: string;
  activeView?: RailView;
  onSelectView?: (view: RailView) => void;
  onOpenSettings?: () => void;
}

const NAV: {
  view: RailView;
  label: string;
  Icon: typeof ChatBubbleLeftRightIcon;
}[] = [
  { view: "chats", label: "Đoạn chat", Icon: ChatBubbleLeftRightIcon },
  { view: "contacts", label: "Agent", Icon: UserGroupIcon },
];

export function SidebarRail({
  userName,
  activeView = "chats",
  onSelectView,
  onOpenSettings,
}: SidebarRailProps) {
  return (
    <nav className={styles.rail} aria-label="Điều hướng chính">
      <button
        type="button"
        className={styles.avatarBtn}
        aria-label={userName}
        title={userName}
      >
        <Avatar name={userName} seed={userName} size="sm" />
      </button>

      <div className={styles.nav}>
        {NAV.map(({ view, label, Icon }) => (
          <button
            key={view}
            type="button"
            className={`${styles.navBtn} ${
              activeView === view ? styles.navActive : ""
            }`}
            onClick={() => onSelectView?.(view)}
            aria-label={label}
            title={label}
            aria-current={activeView === view}
          >
            <Icon className={styles.navIcon} />
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.navBtn}
        onClick={onOpenSettings}
        aria-label="Cài đặt"
        title="Cài đặt"
      >
        <Cog6ToothIcon className={styles.navIcon} />
      </button>
    </nav>
  );
}
