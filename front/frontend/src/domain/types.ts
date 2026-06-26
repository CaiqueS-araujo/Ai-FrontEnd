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
