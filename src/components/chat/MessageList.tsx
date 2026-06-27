import { useEffect, useRef } from "react";
import type { Message, Source } from "../../api/contracts";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { SourcesMap } from "../../domain/types";

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  fontesData?: SourcesMap;
}

export function MessageList({
  messages,
  isTyping = false,
  fontesData = {},
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Mensagens"
      className="flex flex-col gap-3 overflow-y-auto p-4"
    >
      {messages.map((msg) => {
        const sources: Source[] = fontesData[msg.id] ?? [];
        return <MessageBubble key={msg.id} message={msg} sources={sources} />;
      })}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
