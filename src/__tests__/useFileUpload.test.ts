import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFileUpload } from "../hooks/useFileUpload";

const mockUploadAttachment = vi.fn();

vi.mock("../api/chat.api", () => ({
  uploadAttachment: (...args: unknown[]) => mockUploadAttachment(...args),
}));

function createMockFile(name: string, type: string, size: number): File {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], name, { type });
}

describe("useFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts idle", () => {
    const { result } = renderHook(() => useFileUpload("conv-1"));
    expect(result.current.status).toBe("idle");
    expect(result.current.progress).toBe(0);
    expect(result.current.error).toBeNull();
    expect(result.current.attachment).toBeNull();
  });

  it("rejects invalid file type client-side", async () => {
    const { result } = renderHook(() => useFileUpload("conv-1"));
    const file = createMockFile("test.exe", "application/x-msdownload", 1000);

    result.current.upload(file);
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toContain("não suportado");
  });

  it("rejects oversized file client-side", async () => {
    const { result } = renderHook(() => useFileUpload("conv-1"));
    const file = createMockFile("test.pdf", "application/pdf", 11 * 1024 * 1024);

    result.current.upload(file);
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toContain("10 MB");
  });

  it("uploads valid file and returns attachment", async () => {
    mockUploadAttachment.mockResolvedValue({
      id: "att-1",
      conversationId: "conv-1",
      filename: "doc.pdf",
      contentType: "application/pdf",
      sizeBytes: 5000,
      createdAt: "2026-06-25T14:32:00Z",
    });

    const { result } = renderHook(() => useFileUpload("conv-1"));
    const file = createMockFile("doc.pdf", "application/pdf", 5000);

    result.current.upload(file);
    await waitFor(() => expect(result.current.status).toBe("done"));
    expect(result.current.attachment).toBeTruthy();
    expect(result.current.attachment?.filename).toBe("doc.pdf");
    expect(result.current.progress).toBe(100);
  });

  it("handles upload error", async () => {
    mockUploadAttachment.mockRejectedValue(new Error("Falha na rede"));

    const { result } = renderHook(() => useFileUpload("conv-1"));
    const file = createMockFile("doc.pdf", "application/pdf", 5000);

    result.current.upload(file);
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Falha na rede");
  });

  it("reset restores idle state", async () => {
    const { result } = renderHook(() => useFileUpload("conv-1"));
    result.current.reset();
    expect(result.current.status).toBe("idle");
    expect(result.current.progress).toBe(0);
    expect(result.current.error).toBeNull();
    expect(result.current.attachment).toBeNull();
  });
});
