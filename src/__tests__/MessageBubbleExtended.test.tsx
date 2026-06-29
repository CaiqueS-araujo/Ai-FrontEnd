import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MessageBubble } from "../components/chat/MessageBubble";
import type { Message, Source } from "../api/contracts";

vi.mock("../api/chat.api", () => ({}));

const assistantMessage: Message = {
  id: "msg-1",
  conversationId: "conv-1",
  role: "ASSISTANT",
  content: "Resposta com fontes",
  createdAt: "2026-01-01T00:00:00Z",
};

const userMessage: Message = {
  id: "msg-2",
  conversationId: "conv-1",
  role: "USER",
  content: "Minha pergunta",
  createdAt: "2026-01-01T00:00:00Z",
};

const sources: Source[] = [
  {
    id: "src-1",
    title: "Documento A",
    excerpt: "Trecho",
    relevance: 0.92,
    documentUrl: null,
    filename: "doc-a.pdf",
  },
];

describe("MessageBubble (Parte 2 - RAG sources)", () => {
  it("renders SourcePanel when ASSISTANT message has sources", () => {
    render(<MessageBubble message={assistantMessage} sources={sources} />);
    expect(
      screen.getByRole("button", { name: /ver 1 fonte/i }),
    ).toBeInTheDocument();
  });

  it("does not render SourcePanel when ASSISTANT message has no sources", () => {
    render(<MessageBubble message={assistantMessage} sources={[]} />);
    expect(
      screen.queryByRole("button", { name: /fonte/i }),
    ).not.toBeInTheDocument();
  });

  it("does not render SourcePanel when sources prop is undefined", () => {
    render(<MessageBubble message={assistantMessage} />);
    expect(
      screen.queryByRole("button", { name: /fonte/i }),
    ).not.toBeInTheDocument();
  });

  it("does not render SourcePanel for USER messages even with sources", () => {
    render(<MessageBubble message={userMessage} sources={sources} />);
    expect(
      screen.queryByRole("button", { name: /fonte/i }),
    ).not.toBeInTheDocument();
  });

  it("renders message content normally alongside sources", () => {
    render(<MessageBubble message={assistantMessage} sources={sources} />);
    expect(screen.getByText("Resposta com fontes")).toBeInTheDocument();
  });
});
