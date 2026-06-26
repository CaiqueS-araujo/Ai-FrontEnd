import { useState, type KeyboardEvent } from "react";
import { Button } from "../ui/Button";

interface MessageComposerProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSend, disabled = false }: MessageComposerProps) {
  const [content, setContent] = useState("");

  function handleSend() {
    const trimmed = content.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setContent("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-2 border-t bg-white p-4">
      <label htmlFor="message-input" className="sr-only">
        Mensagem
      </label>
      <textarea
        id="message-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        className="min-h-[40px] flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        placeholder="Digite sua mensagem…"
      />
      <Button onClick={handleSend} disabled={disabled || !content.trim()}>
        Enviar
      </Button>
    </div>
  );
}
