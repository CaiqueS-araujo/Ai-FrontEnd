import type { Message } from "../../api/contracts";
import type { UploadState, SourcesMap } from "../../domain/types";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { FileDropzone } from "../upload/FileDropzone";
import { UploadProgressBar } from "../upload/UploadProgressBar";

interface ChatWindowProps {
  messages: Message[];
  onSend: (content: string) => void;
  isSending: boolean;
  onUploadFile: (file: File) => void;
  uploadState: UploadState;
  fontesData?: SourcesMap;
}

export function ChatWindow({
  messages,
  onSend,
  isSending,
  onUploadFile,
  uploadState,
  fontesData = {},
}: ChatWindowProps) {
  return (
    <div className="flex h-full flex-col">
      <MessageList messages={messages} isTyping={isSending} fontesData={fontesData} />
      <div className="border-t bg-gray-50 p-2">
        <FileDropzone onFileSelected={onUploadFile} disabled={isSending} />
        {uploadState.status !== "idle" && (
          <div className="mt-2">
            {uploadState.status === "error" && (
              <p className="text-sm text-red-600" role="alert">{uploadState.error}</p>
            )}
            {(uploadState.status === "uploading" || uploadState.status === "done") && (
              <UploadProgressBar
                progress={uploadState.progress}
                status={uploadState.status}
              />
            )}
          </div>
        )}
      </div>
      <MessageComposer onSend={onSend} disabled={isSending} />
    </div>
  );
}
