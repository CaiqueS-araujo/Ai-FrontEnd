import { apiFetch, getBaseUrl } from "./client";
import type {
  Conversation,
  ConversationSummary,
  Message,
  SendMessageResponse,
  Attachment,
} from "./contracts";

export function createConversation(
  title?: string,
): Promise<Conversation> {
  return apiFetch<Conversation>("/api/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function listConversations(): Promise<ConversationSummary[]> {
  return apiFetch<ConversationSummary[]>("/api/conversations");
}

export function getMessages(
  conversationId: string,
): Promise<Message[]> {
  return apiFetch<Message[]>(
    `/api/conversations/${conversationId}/messages`,
  );
}

export function sendMessage(
  conversationId: string,
  content: string,
): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>(
    `/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
}

export function uploadAttachment(
  conversationId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as Attachment);
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(err);
        } catch {
          reject(new Error(`Upload falhou: ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Erro de rede no upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload abortado")));

    xhr.open("POST", `${getBaseUrl()}/api/conversations/${conversationId}/attachments`);
    xhr.send(formData);
  });
}
