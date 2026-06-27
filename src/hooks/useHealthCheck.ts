import { useState, useEffect, useRef } from "react";
import { getHealth } from "../api/health.api";

type HealthStatus = "UP" | "DOWN" | "UNKNOWN";

interface UseHealthCheckReturn {
  status: HealthStatus;
  lastCheckedAt: string | null;
}

export function useHealthCheck(
  intervalMs = 15000,
): UseHealthCheckReturn {
  const [status, setStatus] = useState<HealthStatus>("UNKNOWN");
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const health = await getHealth();
        setStatus(health.status === "UP" ? "UP" : "DOWN");
      } catch {
        setStatus("DOWN");
      }
      setLastCheckedAt(new Date().toISOString());
    }

    check();

    intervalRef.current = setInterval(() => {
      if (document.hidden) return;
      check();
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs]);

  return { status, lastCheckedAt };
}
