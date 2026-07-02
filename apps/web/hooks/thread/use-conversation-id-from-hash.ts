"use client";

import { useCallback, useEffect, useState } from "react";

import {
  parseConversationIdFromHash,
  toConversationHash,
} from "@/utils/chat/conversation-hash";

export function useConversationIdFromHash() {
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setConversationId(parseConversationIdFromHash(window.location.hash));
    };

    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const openConversation = useCallback((id: string) => {
    window.location.hash = toConversationHash(id);
  }, []);

  const clearConversation = useCallback(() => {
    const url = new URL(window.location.href);
    url.hash = "";
    window.history.replaceState(null, "", url.pathname + url.search);
    setConversationId(null);
  }, []);

  return { conversationId, openConversation, clearConversation };
}
