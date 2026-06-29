import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChat } from "../hooks/useChat";

const mockSendMessage = vi.fn();
const mockDispatch = vi.fn();

vi.mock("../api/chat.api", () => ({
  sendMessage: (...args: unknown[]) => mockSendMessage(...args),
}));

vi.mock("../context/useConversationsContext", () => ({
  useConversationsContext: () => ({
    state: {
      messagesByConversation: {
        "conv-1": [],
      },
      sourcesByMessageId: {},
    },
    dispatch: (...args: unknown[]) => mockDispatch(...args),
  }),
}));

describe("useChat (Parte 2 - RAG sources)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatches SET_SOURCES when response includes sources", async () => {
    const sources = [
      {
        id: "src-1",
        title: "Documento A",
        excerpt: "Trecho",
        relevance: 0.92,
        documentUrl: null,
        filename: "doc-a.pdf",
      },
    ];

    mockSendMessage.mockResolvedValue({
      userMessage: {
        id: "user-1",
        conversationId: "conv-1",
        role: "USER",
        content: "teste",
        createdAt: "2026-01-01T00:00:00Z",
      },
      assistantMessage: {
        id: "assistant-1",
        conversationId: "conv-1",
        role: "ASSISTANT",
        content: "Resposta com fontes",
        createdAt: "2026-01-01T00:00:01Z",
      },
      sources,
    });

    const { result } = renderHook(() => useChat("conv-1"));

    await result.current.sendMessage("teste");

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_SOURCES",
        payload: {
          messageId: "assistant-1",
          sources,
        },
      });
    });
  });

  it("does not dispatch SET_SOURCES when sources is empty", async () => {
    mockSendMessage.mockResolvedValue({
      userMessage: {
        id: "user-2",
        conversationId: "conv-1",
        role: "USER",
        content: "teste",
        createdAt: "2026-01-01T00:00:00Z",
      },
      assistantMessage: {
        id: "assistant-2",
        conversationId: "conv-1",
        role: "ASSISTANT",
        content: "Resposta sem fontes",
        createdAt: "2026-01-01T00:00:01Z",
      },
      sources: [],
    });

    const { result } = renderHook(() => useChat("conv-1"));

    await result.current.sendMessage("teste");

    await waitFor(() => {
      const calls = mockDispatch.mock.calls.filter(
        (c: unknown[]) => (c[0] as { type: string }).type === "SET_SOURCES",
      );
      expect(calls).toHaveLength(0);
    });
  });

  it("does not dispatch SET_SOURCES when sources is undefined", async () => {
    mockSendMessage.mockResolvedValue({
      userMessage: {
        id: "user-3",
        conversationId: "conv-1",
        role: "USER",
        content: "teste",
        createdAt: "2026-01-01T00:00:00Z",
      },
      assistantMessage: {
        id: "assistant-3",
        conversationId: "conv-1",
        role: "ASSISTANT",
        content: "Resposta legado",
        createdAt: "2026-01-01T00:00:01Z",
      },
    });

    const { result } = renderHook(() => useChat("conv-1"));

    await result.current.sendMessage("teste");

    await waitFor(() => {
      const calls = mockDispatch.mock.calls.filter(
        (c: unknown[]) => (c[0] as { type: string }).type === "SET_SOURCES",
      );
      expect(calls).toHaveLength(0);
    });
  });
});
