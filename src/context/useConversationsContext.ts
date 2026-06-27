import { useContext } from "react";
import { ConversationsContext } from "./ConversationsContext";

export function useConversationsContext() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) {
    throw new Error(
      "useConversationsContext deve ser usado dentro de <ConversationsProvider>",
    );
  }
  return ctx;
}
