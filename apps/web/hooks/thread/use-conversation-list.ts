"use client";

import { useCallback, useEffect, useState } from "react";

import { conversationsApi, ConversationsApiError } from "@/lib/api/conversations";

import type { ConversationResponse } from "@aucobot/shared";

export function useConversationList() {
  const [items, setItems] = useState<ConversationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await conversationsApi.list();
      setItems(result.items);
    } catch (err) {
      const message =
        err instanceof ConversationsApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load conversations";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, loading, error, refetch };
}
