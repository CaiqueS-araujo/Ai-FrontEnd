export type UploadStatus =
  | "idle"
  | "validating"
  | "uploading"
  | "done"
  | "error";

export interface UploadState {
  status: UploadStatus;
  progress: number;
  error: string | null;
}

import type { Source } from "../api/contracts";

export type SourcesMap = Record<string, Source[]>;
