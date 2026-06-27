import type { Attachment } from "../../api/contracts";
import { formatFileSize } from "../../lib/format";

interface AttachmentChipProps {
  attachment: Attachment;
}

export function AttachmentChip({ attachment }: AttachmentChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
      <span aria-hidden="true">📎</span>
      <span className="max-w-[200px] truncate">{attachment.filename}</span>
      <span className="text-xs text-gray-400">
        {formatFileSize(attachment.sizeBytes)}
      </span>
    </div>
  );
}
