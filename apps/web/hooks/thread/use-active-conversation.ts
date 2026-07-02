"use client";

import { useCallback, useEffect, useState } from "react";

import { conversationsApi, ConversationsApiError } from "@/lib/api/conversations";

import type { ConversationResponse } from "@aucobot/shared";

export function useActiveConversation(conversationId: string | null) {
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await conversationsApi.getById(id);
      setConversation(result);
    } catch (err) {
      setConversation(null);
      const message =
        err instanceof ConversationsApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load conversation";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!conversationId) {
      setConversation(null);
      setError(null);
      setLoading(false);
      return;
    }

    void load(conversationId);
  }, [conversationId, load]);

  return { conversation, loading, error, reload: load };
}
