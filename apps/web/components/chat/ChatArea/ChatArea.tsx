"use client";

import type { AgentState, Message } from "@/types/chat";

import type { ConversationResponse } from "@aucobot/shared";

import { ChatHeader } from "../ChatHeader/ChatHeader";
import { Composer } from "../Composer/Composer";
import { MessageList } from "../MessageList/MessageList";

import styles from "./ChatArea.module.css";

export interface ChatAreaProps {
  conversation: ConversationResponse;
  messages: Message[];
  agentState?: AgentState;
  onSend?: (text: string) => void;
  onOpenInfo?: () => void;
  onRename?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export function ChatArea({
  conversation,
  messages,
  agentState,
  onSend,
  onOpenInfo,
  onRename,
  onArchive,
  onDelete,
  onBack,
}: ChatAreaProps) {
  return (
    <div className={styles.area}>
      <ChatHeader
        conversation={conversation}
        onOpenInfo={onOpenInfo}
        onRename={onRename}
        onArchive={onArchive}
        onDelete={onDelete}
        onBack={onBack}
      />
      <MessageList
        messages={messages}
        showNames={conversation.type === "room"}
        agentState={agentState}
      />
      <Composer onSend={onSend} />
    </div>
  );
}
