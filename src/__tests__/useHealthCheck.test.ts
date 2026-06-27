import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useHealthCheck } from "../hooks/useHealthCheck";

const mockGetHealth = vi.fn();

vi.mock("../api/health.api", () => ({
  getHealth: () => mockGetHealth(),
}));

describe("useHealthCheck", () => {
  beforeEach(() => {
    mockGetHealth.mockResolvedValue({
      status: "UP",
      service: "chat-backend",
      version: "0.1.0",
      timestamp: "2026-06-25T14:32:00Z",
      checks: { database: "UP" },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts as UNKNOWN then moves to UP", async () => {
    const { result } = renderHook(() => useHealthCheck(5000));
    expect(result.current.status).toBe("UNKNOWN");
    await waitFor(() => expect(result.current.status).toBe("UP"));
    expect(result.current.lastCheckedAt).toBeTruthy();
  });

  it("returns DOWN on API error", async () => {
    mockGetHealth.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useHealthCheck(5000));
    await waitFor(() => expect(result.current.status).toBe("DOWN"));
  });
});
