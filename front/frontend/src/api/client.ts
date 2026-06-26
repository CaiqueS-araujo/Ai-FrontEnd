import type { ApiError } from "./contracts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiErrorTyped extends Error {
  public readonly timestamp: string;
  public readonly status: number;
  public readonly error: string;
  public readonly path: string;

  constructor(err: ApiError) {
    super(err.message);
    this.name = "ApiErrorTyped";
    this.timestamp = err.timestamp;
    this.status = err.status;
    this.error = err.error;
    this.path = err.path;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    let body: ApiError;
    try {
      body = await res.json();
    } catch {
      throw new ApiErrorTyped({
        timestamp: new Date().toISOString(),
        status: res.status,
        error: res.statusText,
        message: `Erro inesperado: ${res.status}`,
        path,
      });
    }
    throw new ApiErrorTyped(body);
  }

  return res.json() as Promise<T>;
}

export function getBaseUrl(): string {
  return BASE_URL;
}
