import type { Message, Source } from "../../api/contracts";
import { SourcePanel } from "./SourcePanel";

interface MessageBubbleProps {
  message: Message;
  sources?: Source[];
}

export function MessageBubble({ message, sources = [] }: MessageBubbleProps) {
  const isUser = message.role === "USER";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <time
          className={`mt-1 block text-xs ${
            isUser ? "text-blue-200" : "text-gray-400"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        {!isUser && sources.length > 0 && <SourcePanel sources={sources} />}
      </div>
    </div>
  );
}
