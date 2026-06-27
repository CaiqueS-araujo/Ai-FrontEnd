import type { ConversationSummary } from "../../api/contracts";
import { truncateText } from "../../lib/format";

interface ConversationItemProps {
  conversation: ConversationSummary;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps) {
  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
        isActive ? "bg-blue-50 font-semibold text-blue-900" : "text-gray-800"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="block truncate">{conversation.title}</span>
      {conversation.lastMessagePreview && (
        <span className="mt-0.5 block truncate text-xs text-gray-500">
          {truncateText(conversation.lastMessagePreview, 40)}
        </span>
      )}
      <span className="mt-0.5 block text-xs text-gray-400">
        {conversation.messageCount} mensagens
      </span>
    </button>
  );
}
