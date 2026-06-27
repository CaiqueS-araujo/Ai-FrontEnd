export type Role = "USER" | "ASSISTANT";

export interface Message {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationSummary extends Conversation {
  messageCount: number;
  lastMessagePreview: string | null;
}

export interface Attachment {
  id: string;
  conversationId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface Source {
  id: string;
  title: string;
  excerpt: string;
  relevance: number;
  documentUrl: string | null;
  filename: string | null;
}

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
  sources?: Source[];
}

export interface CreateConversationRequest {
  title?: string;
}

export interface Health {
  status: "UP" | "DOWN";
  service: string;
  version: string;
  timestamp: string;
  checks: Record<string, "UP" | "DOWN">;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
