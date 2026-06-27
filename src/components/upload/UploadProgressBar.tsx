import type { UploadStatus } from "../../domain/types";
import { Spinner } from "../ui/Spinner";

interface UploadProgressBarProps {
  progress: number;
  status: UploadStatus;
}

export function UploadProgressBar({
  progress,
  status,
}: UploadProgressBarProps) {
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      {status === "uploading" && <Spinner size="sm" />}
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            status === "done" ? "bg-green-500" : "bg-blue-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{progress}%</span>
    </div>
  );
}
