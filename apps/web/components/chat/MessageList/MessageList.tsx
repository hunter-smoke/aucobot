"use client";

import { Fragment, useEffect, useRef } from "react";

import type { AgentState, Message } from "@/types/chat";
import { dayKey } from "@/utils/chat/format-time";

import { AgentActivityCard } from "../AgentActivityCard/AgentActivityCard";
import { DateDivider } from "../DateDivider/DateDivider";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";

import styles from "./MessageList.module.css";

export interface MessageListProps {
  messages: Message[];
  /** Hiện tên người gửi trên bong bóng agent (phòng nhiều thành viên). */
  showNames?: boolean;
  emptyLabel?: string;
  /** Trạng thái agent để hiện cuối thread (đang nghĩ / đang làm việc). */
  agentState?: AgentState;
}

function isSameSender(a: Message, b: Message): boolean {
  return (
    a.senderType !== "system" &&
    a.senderType === b.senderType &&
    a.senderName === b.senderName &&
    dayKey(a.createdAt) === dayKey(b.createdAt)
  );
}

export function MessageList({
  messages,
  showNames = false,
  emptyLabel = "Chưa có tin nhắn nào.",
  agentState = { kind: "idle" },
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, agentState]);

  const agentBusy =
    agentState.kind === "thinking" || agentState.kind === "working";

  const agentNode =
    agentState.kind === "thinking" ? (
      <TypingIndicator />
    ) : agentState.kind === "working" ? (
      <AgentActivityCard activities={agentState.activities} />
    ) : null;

  if (messages.length === 0 && !agentBusy) {
    return (
      <div className={styles.list}>
        <div className={styles.empty}>
          <p className={styles.emptyText}>{emptyLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <div className={styles.inner}>
        {messages.map((message, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];
          const showDivider =
            !prev || dayKey(prev.createdAt) !== dayKey(message.createdAt);
          const isGroupStart =
            showDivider || !prev || !isSameSender(prev, message);
          const isGroupEnd = !next || !isSameSender(message, next);

          return (
            <Fragment key={message.id}>
              {showDivider ? <DateDivider date={message.createdAt} /> : null}
              <MessageBubble
                message={message}
                showName={showNames}
                isGroupStart={isGroupStart}
                isGroupEnd={isGroupEnd}
              />
            </Fragment>
          );
        })}
        {agentNode}
        <div ref={endRef} />
      </div>
    </div>
  );
}
