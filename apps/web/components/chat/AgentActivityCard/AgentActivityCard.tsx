import {
  ArrowRightCircleIcon,
  BoltIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import type { ComponentType, SVGProps } from "react";

import type { AgentActionKind, AgentActivity } from "@/types/chat";

import styles from "./AgentActivityCard.module.css";

export interface AgentActivityCardProps {
  activities: AgentActivity[];
}

const KIND_ICON: Record<
  AgentActionKind,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  thinking: SparklesIcon,
  web_search: MagnifyingGlassIcon,
  read_document: DocumentTextIcon,
  write_content: PencilSquareIcon,
  build_workflow: Cog6ToothIcon,
  schedule: ClockIcon,
  publish: PaperAirplaneIcon,
  handoff: ArrowRightCircleIcon,
  generic: BoltIcon,
};

function headerState(activities: AgentActivity[]): {
  label: string;
  state: "working" | "error" | "done";
} {
  if (activities.some((a) => a.status === "running"))
    return { label: "Đang làm việc", state: "working" };
  if (activities.some((a) => a.status === "error"))
    return { label: "Gặp lỗi", state: "error" };
  return { label: "Đã hoàn thành", state: "done" };
}

export function AgentActivityCard({ activities }: AgentActivityCardProps) {
  if (activities.length === 0) return null;

  const { label, state } = headerState(activities);
  const doneCount = activities.filter((a) => a.status === "done").length;

  return (
    <div className={styles.row}>
      <div className={styles.card}>
        <div className={styles.header} data-state={state}>
          <span className={styles.headerDot} aria-hidden />
          <span className={styles.headerText}>{label}</span>
          <span className={styles.headerCount}>
            {doneCount}/{activities.length}
          </span>
        </div>

        <ol className={styles.timeline}>
          {activities.map((activity, i) => {
            const Icon = KIND_ICON[activity.kind ?? "generic"];
            const isLast = i === activities.length - 1;
            const next = activities[i + 1];
            const connectorFilled =
              activity.status === "done" &&
              (state === "done" ||
                next?.status === "done" ||
                next?.status === "error");
            const connectorFlowing =
              activity.status === "done" && next?.status === "running";

            return (
              <li
                key={activity.id}
                className={styles.step}
                data-status={activity.status}
              >
                <span className={styles.marker}>
                  <span className={styles.iconBubble}>
                    <Icon className={styles.icon} />
                  </span>
                  {!isLast ? (
                    <span
                      className={styles.connector}
                      data-filled={connectorFilled ? "true" : undefined}
                      data-flowing={connectorFlowing ? "true" : undefined}
                      aria-hidden
                    />
                  ) : null}
                </span>
                <span className={styles.body}>
                  <span className={styles.label}>{activity.label}</span>
                  {activity.detail ? (
                    <span className={styles.detail}>{activity.detail}</span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
