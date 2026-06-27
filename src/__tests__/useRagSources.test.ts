import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useRagSources } from "../hooks/useRagSources";

vi.mock("../context/useConversationsContext", () => ({
  useConversationsContext: () => ({
    state: {
      sourcesByMessageId: {
        "msg-1": [
          {
            id: "src-1",
            title: "Documento A",
            excerpt: "Trecho do documento A",
            relevance: 0.92,
            documentUrl: null,
            filename: "doc-a.pdf",
          },
        ],
        "msg-2": [],
      },
    },
    dispatch: vi.fn(),
  }),
}));

describe("useRagSources", () => {
  it("returns sources for a message that has them", () => {
    const { result } = renderHook(() => useRagSources("conv-1"));
    const sources = result.current.getSourcesForMessage("msg-1");
    expect(sources).toHaveLength(1);
    expect(sources[0].title).toBe("Documento A");
  });

  it("returns empty array for a message without sources", () => {
    const { result } = renderHook(() => useRagSources("conv-1"));
    const sources = result.current.getSourcesForMessage("msg-2");
    expect(sources).toEqual([]);
  });

  it("returns empty array for unknown message id", () => {
    const { result } = renderHook(() => useRagSources("conv-1"));
    const sources = result.current.getSourcesForMessage("non-existent");
    expect(sources).toEqual([]);
  });

  it("hasSources returns true when sources exist", () => {
    const { result } = renderHook(() => useRagSources("conv-1"));
    expect(result.current.hasSources("msg-1")).toBe(true);
  });

  it("hasSources returns false when no sources", () => {
    const { result } = renderHook(() => useRagSources("conv-1"));
    expect(result.current.hasSources("msg-2")).toBe(false);
  });
});
