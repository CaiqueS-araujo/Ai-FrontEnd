import { useCallback, useEffect } from "react";
import { useConversationsContext } from "../context/useConversationsContext";
import * as chatApi from "../api/chat.api";

export function useConversations() {
  const { state, dispatch, loadConversations, selectConversation, createConversation } =
    useConversationsContext();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelect = useCallback(
    async (id: string) => {
      dispatch({ type: "SET_LOADING_LIST", payload: true });
      try {
        const messages = await chatApi.getMessages(id);
        dispatch({
          type: "SET_MESSAGES",
          payload: { conversationId: id, messages },
        });
        await selectConversation(id);
      } finally {
        dispatch({ type: "SET_LOADING_LIST", payload: false });
      }
    },
    [dispatch, selectConversation],
  );

  return {
    conversations: state.conversations,
    activeId: state.activeConversationId,
    isLoading: state.isLoadingList,
    selectConversation: handleSelect,
    createConversation,
  };
}
