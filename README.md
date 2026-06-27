# Chat — Frontend

SPA de chat em React: envio de mensagens, histórico por sessão e upload de
anexos (`.txt`/`.pdf`) com drag-and-drop. Consome a API descrita no contrato do
projeto. Arquitetura: **componentes renderizam, hooks pensam.**

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Context API + hooks · Vitest + React Testing Library

## Pré-requisitos

- Node.js `>= 20 LTS`
- Backend rodando (default `http://localhost:8080`)

## Setup

```bash
npm install
cp .env.example .env   # ajuste VITE_API_BASE_URL se necessário
```

`.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Rodar

```bash
npm run dev       # http://localhost:5173
npm run build     # build de produção
npm run preview   # serve o build
npm run test      # testes
npm run lint      # lint
```

## Estrutura

```
src/
├── api/          # cliente HTTP + contrato tipado
├── context/      # estado global (conversas)
├── hooks/        # comportamento (estado, efeitos, IO)
├── components/   # apresentação (chat, conversations, upload, system, ui)
├── domain/       # tipos de domínio
└── lib/          # utils (validação de arquivo, formatação)
```

## Contrato da API

Base: `VITE_API_BASE_URL`.

| Método | Caminho |
|---|---|
| GET  | `/api/health` |
| POST | `/api/conversations` |
| GET  | `/api/conversations` |
| GET  | `/api/conversations/{id}/messages` |
| POST | `/api/conversations/{id}/messages` |
| POST | `/api/conversations/{id}/attachments` |

Upload aceita **somente** `.txt` e `.pdf`, até **10MB**.

## Convenções

- Nenhum `fetch` ou regra de negócio em componentes — tudo em `hooks/` + `api/`.
- Acessibilidade: log de mensagens com `aria-live`; chat e upload navegáveis por teclado.

## IA / Geração de código

Os artefatos foram gerados via opencode a partir das specs do projeto. Prompts-base
e escopo do agente em [`AGENTS.md`](./AGENTS.md).
