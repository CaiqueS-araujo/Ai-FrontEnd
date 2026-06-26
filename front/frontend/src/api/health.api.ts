import { apiFetch } from "./client";
import type { Health } from "./contracts";

export function getHealth(): Promise<Health> {
  return apiFetch<Health>("/api/health");
}
