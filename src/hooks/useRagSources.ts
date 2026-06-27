import { useCallback } from "react";
import { useConversationsContext } from "../context/useConversationsContext";
import type { Source } from "../api/contracts";

interface UseRagSourcesReturn {
  getSourcesForMessage: (messageId: string) => Source[];
  hasSources: (messageId: string) => boolean;
}

export function useRagSources(
  _conversationId: string | null,
): UseRagSourcesReturn {
  const { state } = useConversationsContext();

  const getSourcesForMessage = useCallback(
    (messageId: string): Source[] => {
      return state.sourcesByMessageId[messageId] ?? [];
    },
    [state.sourcesByMessageId],
  );

  const hasSources = useCallback(
    (messageId: string): boolean => {
      return getSourcesForMessage(messageId).length > 0;
    },
    [getSourcesForMessage],
  );

  return { getSourcesForMessage, hasSources };
}
