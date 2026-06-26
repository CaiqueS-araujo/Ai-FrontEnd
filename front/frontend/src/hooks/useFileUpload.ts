import { useState, useCallback } from "react";
import * as chatApi from "../api/chat.api";
import { validateFile } from "../lib/fileValidation";
import type { Attachment } from "../api/contracts";
import type { UploadStatus } from "../domain/types";

interface UseFileUploadReturn {
  upload: (file: File) => Promise<void>;
  progress: number;
  status: UploadStatus;
  error: string | null;
  attachment: Attachment | null;
  reset: () => void;
}

export function useFileUpload(
  conversationId: string | null,
): UseFileUploadReturn {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setAttachment(null);
  }, []);

  const upload = useCallback(
    async (file: File) => {
      if (!conversationId) return;
      setError(null);
      setAttachment(null);

      setStatus("validating");
      const validation = validateFile(file);
      if (!validation.valid) {
        setStatus("error");
        setError(validation.error);
        return;
      }

      setStatus("uploading");
      setProgress(0);
      try {
        const result = await chatApi.uploadAttachment(
          conversationId,
          file,
          (pct) => setProgress(pct),
        );
        setAttachment(result);
        setStatus("done");
        setProgress(100);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro no upload";
        setStatus("error");
        setError(msg);
      }
    },
    [conversationId],
  );

  return { upload, progress, status, error, attachment, reset };
}
