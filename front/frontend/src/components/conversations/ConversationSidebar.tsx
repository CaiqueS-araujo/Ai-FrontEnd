import type { ConversationSummary } from "../../api/contracts";
import { Spinner } from "../ui/Spinner";
import { ConversationItem } from "./ConversationItem";
import { NewConversationButton } from "./NewConversationButton";

interface ConversationSidebarProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  isLoading: boolean;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  isLoading,
}: ConversationSidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r bg-white">
      <div className="border-b p-3">
        <NewConversationButton onClick={onCreate} disabled={isLoading} />
      </div>
      <nav className="flex-1 overflow-y-auto" aria-label="Conversas">
        {isLoading && conversations.length === 0 ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : conversations.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-gray-500">
            Nenhuma conversa ainda
          </p>
        ) : (
          <ul role="list" className="divide-y divide-gray-100">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <ConversationItem
                  conversation={conv}
                  isActive={conv.id === activeId}
                  onSelect={onSelect}
                />
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
