# 02 — SPEC FRONTEND (React)

> Consome o [`01-CONTRATO.md`](./01-CONTRATO.md). Regra de ouro:
> **componentes renderizam, hooks pensam.**

---

## 1. Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Lib UI | React 18 | SPA orientada a componentes. |
| Linguagem | TypeScript (strict) | Contrato tipado de ponta a ponta. |
| Build/dev | Vite | Dev server rápido, `import.meta.env` para config. |
| Estilo | Tailwind CSS | Utilitário, sem CSS órfão. |
| Primitivos UI | Próprios (sem lib pesada) | Controle total + acessibilidade explícita. |
| Estado global | **Context API + hooks** | Sem dependência externa de store. |
| HTTP | `fetch` (cliente fino próprio) | Sem dependência extra; `XHR` só no upload (progresso). |
| Testes | Vitest + React Testing Library | Hooks testáveis isolados da renderização. |

---

## 2. Estrutura de pastas

```
src/
├── api/
│   ├── client.ts          # wrapper fetch + baseURL + parse de erro (ApiError)
│   ├── chat.api.ts        # createConversation, listConversations, getMessages,
│   │                      #   sendMessage, uploadAttachment
│   ├── health.api.ts      # getHealth
│   └── contracts.ts       # tipos = espelho do 01-CONTRATO.md (§6)
├── context/
│   ├── ConversationsContext.tsx   # provider: lista, ativa, cache de mensagens
│   └── useConversationsContext.ts # acesso tipado ao contexto
├── hooks/                 # COMPORTAMENTO — todo estado/efeito/IO
│   ├── useConversations.ts
│   ├── useChat.ts
│   ├── useFileUpload.ts
│   └── useHealthCheck.ts
├── components/            # APRESENTAÇÃO — só recebem props e renderizam
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageComposer.tsx
│   │   └── TypingIndicator.tsx
│   ├── conversations/
│   │   ├── ConversationSidebar.tsx
│   │   ├── ConversationItem.tsx
│   │   └── NewConversationButton.tsx
│   ├── upload/
│   │   ├── FileDropzone.tsx
│   │   ├── UploadProgressBar.tsx
│   │   └── AttachmentChip.tsx
│   ├── system/
│   │   └── HealthBadge.tsx
│   └── ui/                # primitivos
│       ├── Button.tsx
│       ├── IconButton.tsx
│       ├── Spinner.tsx
│       └── VisuallyHidden.tsx
├── domain/
│   └── types.ts           # tipos de domínio derivados do contrato
├── lib/
│   ├── fileValidation.ts  # extensão / contentType / tamanho (client-side)
│   └── format.ts          # datas relativas, previews, truncamento
├── styles/
│   └── index.css          # @tailwind base/components/utilities
├── App.tsx                # layout: Sidebar + ChatWindow + HealthBadge
└── main.tsx               # bootstrap + <ConversationsProvider>
```

---

## 3. Camada de API (`src/api/`)

`client.ts` centraliza:
- baseURL via `import.meta.env.VITE_API_BASE_URL`;
- `Content-Type: application/json` (exceto multipart);
- parse de resposta: em erro, lê o `ApiError` do corpo e lança um `ApiError` tipado.

`chat.api.ts` expõe **uma função por endpoint**, sem estado:
```ts
createConversation(title?: string): Promise<Conversation>
listConversations(): Promise<ConversationSummary[]>
getMessages(conversationId: string): Promise<Message[]>
sendMessage(conversationId: string, content: string): Promise<SendMessageResponse>
uploadAttachment(conversationId: string, file: File,
                 onProgress?: (pct: number) => void): Promise<Attachment>
```
> `uploadAttachment` usa **`XMLHttpRequest`** para emitir `onProgress` (o `fetch`
> não dá progresso de upload de forma confiável em todos os browsers).

`health.api.ts`:
```ts
getHealth(): Promise<Health>
```

---

## 4. Estado global (Context API)

`ConversationsContext` é a **única** fonte de estado compartilhado:

```ts
interface ConversationsState {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  messagesByConversation: Record<string, Message[]>;  // cache local
  isLoadingList: boolean;
}
```
Ações expostas (mutam o estado): `loadConversations`, `selectConversation`,
`createConversation`, `appendMessages`, `setMessages`.

Os componentes **nunca** chamam essas ações direto — sempre via hooks (§5).

---

## 5. Hooks (comportamento)

> Cada hook encapsula IO + estado e devolve dados prontos. Testáveis com
> `renderHook`, mockando as funções de `chat.api.ts`/`health.api.ts`.

| Hook | Assinatura | Responsabilidade |
|---|---|---|
| `useConversations` | `() => { conversations, activeId, isLoading, selectConversation, createConversation }` | Lista/cria/seleciona conversa via contexto; dispara `getMessages` ao selecionar. |
| `useChat` | `(conversationId) => { messages, sendMessage, isSending, error, retryLast }` | Envio otimista da msg do usuário → `TypingIndicator` → `sendMessage` → anexa `assistantMessage`; trata erro com retry. |
| `useFileUpload` | `(conversationId) => { upload, progress, status, error, reset }` | Valida client-side (`fileValidation`), chama `uploadAttachment` com `onProgress`. `status`: `idle\|validating\|uploading\|done\|error`. |
| `useHealthCheck` | `(intervalMs = 15000) => { status, lastCheckedAt }` | Polling de `getHealth`; expõe `UP\|DOWN\|UNKNOWN`. Pausa quando a aba está oculta. |

---

## 6. Componentes (apresentação)

Todos são **declarativos** (props in, JSX out). Sem `fetch`, sem regra.

| Componente | Props principais | Papel |
|---|---|---|
| `App` | — | Compõe layout, conecta hooks aos componentes. |
| `ConversationSidebar` | `conversations, activeId, onSelect, onCreate, isLoading` | Lista lateral + botão de nova conversa. |
| `ConversationItem` | `conversation, isActive, onSelect` | Item clicável (título + preview). |
| `NewConversationButton` | `onClick, disabled` | Cria conversa. |
| `ChatWindow` | `messages, onSend, isSending, onUploadFile, uploadState` | Container do chat ativo. |
| `MessageList` | `messages, isTyping` | Lista rolável; mostra `TypingIndicator` no fim. |
| `MessageBubble` | `message` | Bolha estilizada por `role` (USER à direita, ASSISTANT à esquerda). |
| `MessageComposer` | `onSend, disabled` | Textarea + envio; Enter envia, Shift+Enter quebra linha. |
| `TypingIndicator` | — | Animação "digitando…" (respeita `prefers-reduced-motion`). |
| `FileDropzone` | `onFileSelected, accept, disabled` | Drag-and-drop + clique; input file escondido. |
| `UploadProgressBar` | `progress, status` | Barra 0–100% + estado. |
| `AttachmentChip` | `attachment` | Chip com nome/ícone/tamanho do anexo. |
| `HealthBadge` | `status, lastCheckedAt` | Indicador visual do `/api/health`. |
| `ui/*` | — | Primitivos reutilizáveis. |

---

## 7. Comportamentos-chave

**Enviar mensagem**
1. Usuário envia → `useChat` adiciona a msg dele **otimisticamente** ao cache.
2. `MessageList` exibe `TypingIndicator`.
3. `sendMessage` resolve → substitui/anexa `userMessage` (com ID real) + `assistantMessage`.
4. Em erro → bolha com estado de falha + ação **"tentar novamente"** (`retryLast`).

**Histórico**
- Ao selecionar uma conversa, `useConversations` chama `getMessages` e popula o cache; trocas seguintes usam o cache.

**Upload**
1. Arrastar **ou** clicar → `fileValidation` checa `.txt/.pdf` e `≤ 10MB` **antes** de enviar.
2. Inválido → erro inline, **não** chama a API.
3. Válido → `UploadProgressBar` acompanha `onProgress`; sucesso → `AttachmentChip`.

**Health**
- `HealthBadge` reflete o polling; `DOWN` exibe aviso não-bloqueante.

---

## 8. Acessibilidade (requisito, não enfeite)

- `MessageList`: `role="log"` + `aria-live="polite"` → novas mensagens são anunciadas.
- `MessageComposer`: `<textarea>` com `<label>` associado; botão de envio com nome acessível; teclado: Enter envia / Shift+Enter quebra.
- `FileDropzone`: acionável por teclado (botão + input oculto), `aria-describedby` informando formatos aceitos; feedback de drag via estado visível **e** textual.
- Foco gerenciado ao trocar de conversa (move para o topo da `MessageList`).
- Contraste mínimo **AA**; animações respeitam `prefers-reduced-motion`.
- Ícones decorativos com `aria-hidden`; texto alternativo onde houver significado.

---

## 9. Configuração & ambiente

`.env.example`:
```
VITE_API_BASE_URL=http://localhost:8080
```

Scripts (`package.json`): `dev`, `build`, `preview`, `test`, `lint`, `format`.

---

## 10. Critérios de pronto do front

- [ ] Nenhum componente em `components/` faz `fetch` ou contém regra de negócio.
- [ ] Toda chamada de API passa por `src/api/` e é orquestrada por um hook.
- [ ] `.txt`/`.pdf` e limite de tamanho validados **no cliente** antes do upload.
- [ ] Histórico recuperável por conversa; envio com estado otimista + erro/retry.
- [ ] `HealthBadge` reflete `/api/health`.
- [ ] Testes: pelo menos 1 por hook + render dos componentes de chat e upload.
- [ ] A11y conferida (navegação por teclado + `aria-live` no log de mensagens).
