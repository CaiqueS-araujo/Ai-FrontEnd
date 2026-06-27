import { Button } from "../ui/Button";

interface NewConversationButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function NewConversationButton({
  onClick,
  disabled = false,
}: NewConversationButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled} className="w-full">
      Nova conversa
    </Button>
  );
}
