import { useState, useCallback } from "react";
import { useConversationsContext } from "../context/useConversationsContext";
import * as chatApi from "../api/chat.api";
import type { Message, SendMessageResponse } from "../api/contracts";

interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
  retryLast: () => Promise<void>;
}

export function useChat(conversationId: string | null): UseChatReturn {
  const { state, dispatch } = useConversationsContext();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastContent, setLastContent] = useState<string | null>(null);

  const messages = conversationId
    ? state.messagesByConversation[conversationId] ?? []
    : [];

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId) return;
      setError(null);
      setLastContent(content);

      const tempUser: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        role: "USER",
        content,
        createdAt: new Date().toISOString(),
      };

      dispatch({
        type: "APPEND_MESSAGES",
        payload: { conversationId, messages: [tempUser] },
      });

      setIsSending(true);
      try {
        const res: SendMessageResponse = await chatApi.sendMessage(
          conversationId,
          content,
        );
        dispatch({
          type: "APPEND_MESSAGES",
          payload: {
            conversationId,
            messages: [res.userMessage, res.assistantMessage],
          },
        });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro ao enviar mensagem";
        setError(msg);
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, dispatch],
  );

  const retryLast = useCallback(async () => {
    if (lastContent && conversationId) {
      await sendMessage(lastContent);
    }
  }, [lastContent, conversationId, sendMessage]);

  return { messages, sendMessage, isSending, error, retryLast };
}
