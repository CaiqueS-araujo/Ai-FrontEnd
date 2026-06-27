import { useMemo } from "react";
import { useConversations } from "./hooks/useConversations";
import { useChat } from "./hooks/useChat";
import { useFileUpload } from "./hooks/useFileUpload";
import { useHealthCheck } from "./hooks/useHealthCheck";
import { useRagSources } from "./hooks/useRagSources";
import { ConversationSidebar } from "./components/conversations/ConversationSidebar";
import { ChatWindow } from "./components/chat/ChatWindow";
import { HealthBadge } from "./components/system/HealthBadge";
import type { SourcesMap } from "./domain/types";

export default function App() {
  const { conversations, activeId, isLoading, selectConversation, createConversation } =
    useConversations();
  const { messages, sendMessage, isSending } = useChat(activeId);
  const { upload, progress, status, error: uploadError } = useFileUpload(activeId);
  const { status: healthStatus, lastCheckedAt } = useHealthCheck();
  const { getSourcesForMessage } = useRagSources(activeId);

  const fontesData: SourcesMap = useMemo(() => {
    if (!activeId) return {};
    const map: SourcesMap = {};
    for (const msg of messages) {
      const sources = getSourcesForMessage(msg.id);
      if (sources.length > 0) {
        map[msg.id] = sources;
      }
    }
    return map;
  }, [messages, getSourcesForMessage, activeId]);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
        <HealthBadge status={healthStatus} lastCheckedAt={lastCheckedAt} />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={selectConversation}
          onCreate={() => createConversation()}
          isLoading={isLoading}
        />
        <main className="flex flex-1 flex-col">
          {activeId ? (
            <ChatWindow
              messages={messages}
              onSend={sendMessage}
              isSending={isSending}
              onUploadFile={upload}
              uploadState={{ status, progress, error: uploadError }}
              fontesData={fontesData}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-400">
              Selecione ou crie uma conversa
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
