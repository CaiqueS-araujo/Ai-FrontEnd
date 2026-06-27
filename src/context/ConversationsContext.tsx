import { createContext, useReducer, useCallback, type ReactNode } from "react";
import type {
  ConversationSummary,
  Message,
} from "../api/contracts";
import * as chatApi from "../api/chat.api";

export interface ConversationsState {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  messagesByConversation: Record<string, Message[]>;
  isLoadingList: boolean;
}

type Action =
  | { type: "SET_CONVERSATIONS"; payload: ConversationSummary[] }
  | { type: "SET_LOADING_LIST"; payload: boolean }
  | { type: "SELECT_CONVERSATION"; payload: string | null }
  | { type: "SET_MESSAGES"; payload: { conversationId: string; messages: Message[] } }
  | { type: "APPEND_MESSAGES"; payload: { conversationId: string; messages: Message[] } }
  | { type: "ADD_CONVERSATION"; payload: ConversationSummary };

const initialState: ConversationsState = {
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {},
  isLoadingList: false,
};

function reducer(
  state: ConversationsState,
  action: Action,
): ConversationsState {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload };
    case "SET_LOADING_LIST":
      return { ...state, isLoadingList: action.payload };
    case "SELECT_CONVERSATION":
      return { ...state, activeConversationId: action.payload };
    case "SET_MESSAGES":
      return {
        ...state,
        messagesByConversation: {
          ...state.messagesByConversation,
          [action.payload.conversationId]: action.payload.messages,
        },
      };
    case "APPEND_MESSAGES": {
      const existing =
        state.messagesByConversation[action.payload.conversationId] ?? [];
      return {
        ...state,
        messagesByConversation: {
          ...state.messagesByConversation,
          [action.payload.conversationId]: [
            ...existing,
            ...action.payload.messages,
          ],
        },
      };
    }
    case "ADD_CONVERSATION":
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    default:
      return state;
  }
}

export interface ConversationsContextValue {
  state: ConversationsState;
  dispatch: React.Dispatch<Action>;
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  createConversation: (title?: string) => Promise<void>;
}

export const ConversationsContext =
  createContext<ConversationsContextValue | null>(null);

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadConversations = useCallback(async () => {
    dispatch({ type: "SET_LOADING_LIST", payload: true });
    try {
      const list = await chatApi.listConversations();
      dispatch({ type: "SET_CONVERSATIONS", payload: list });
    } finally {
      dispatch({ type: "SET_LOADING_LIST", payload: false });
    }
  }, []);

  const selectConversation = useCallback(async (id: string) => {
    dispatch({ type: "SELECT_CONVERSATION", payload: id });
  }, []);

  const createConversationAction = useCallback(async (title?: string) => {
    const conv = await chatApi.createConversation(title);
    const summary: ConversationSummary = {
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messageCount: 0,
      lastMessagePreview: null,
    };
    dispatch({ type: "ADD_CONVERSATION", payload: summary });
    dispatch({ type: "SELECT_CONVERSATION", payload: conv.id });
  }, []);

  return (
    <ConversationsContext.Provider
      value={{
        state,
        dispatch,
        loadConversations,
        selectConversation,
        createConversation: createConversationAction,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
