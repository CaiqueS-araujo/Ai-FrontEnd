# AGENTS.md — Repositório Frontend

> Documenta o **escopo de atuação do agente** (opencode) e os **prompts-base
> CRISP** usados para gerar o código estrutural a partir das specs. Exigido pelo
> padrão de entrega sempre que ferramentas de IA gerarem artefatos de código.

---

## 1. Contexto do repositório

SPA React (Vite + TypeScript + Tailwind) que consome a API definida em
`01-CONTRATO.md`. Estado global em **Context API + hooks**. Princípio central:
**componentes renderizam, hooks pensam.**

Specs de referência (contexto-base do agente):
- `01-CONTRATO.md` — contrato (fonte da verdade)
- `02-SPEC-FRONTEND.md` — arquitetura do front
- `04-CRITERIOS-ACEITACAO.md` — critérios de validação

---

## 2. Escopo do agente

**Pode:** criar a estrutura de pastas de `02-SPEC-FRONTEND.md §2`; gerar
`api/`, `context/`, `hooks/`, `components/`, primitivos `ui/`, configs (Vite,
Tailwind, TS) e testes.

**Não pode (guardrails):**
- Colocar `fetch`/regra de negócio em componentes.
- Inventar campos/endpoints fora de `01-CONTRATO.md`.
- Trocar Context API por outra store.
- Adicionar lib de UI pesada (manter primitivos próprios).
- Quebrar acessibilidade (`aria-live` no log, navegação por teclado).

---

## 3. Padrão de prompt — CRISP

Todo prompt segue **C**ontexto · **R**ole (papel) · **I**nstruções ·
**S**pecifics (especificidade) · **P**arâmetros. *(Ajuste os rótulos se a sua
turma definir o CRISP de forma diferente — a estrutura permanece.)*

---

## 4. Prompts-base (executar nesta ordem)

### Prompt 1 — Scaffolding + contrato tipado
```
[Contexto] Repositório front de um sistema de chat. Specs anexas:
01-CONTRATO.md e 02-SPEC-FRONTEND.md são a verdade.
[Role] Aja como dev front-end sênior especialista em React + TypeScript.
[Instruções] Gere a estrutura de pastas de 02-SPEC-FRONTEND.md §2 e implemente
a camada src/api/ (client.ts, chat.api.ts, health.api.ts) e src/api/contracts.ts.
[Specifics] contracts.ts deve ser o espelho EXATO de 01-CONTRATO.md §6.
client.ts lê VITE_API_BASE_URL e lança ApiError tipado no shape do envelope.
uploadAttachment usa XMLHttpRequest para emitir onProgress.
[Parâmetros] TypeScript strict; sem libs além de React/Vite/Tailwind; uma função
por endpoint, sem estado nessa camada.
```

### Prompt 2 — Estado global (Context) + hooks
```
[Contexto] Camada src/api/ já existe. Specs: 02-SPEC-FRONTEND.md §4 e §5.
[Role] Dev React sênior com foco em separação apresentação/comportamento.
[Instruções] Implemente ConversationsContext + provider e os hooks useConversations,
useChat, useFileUpload, useHealthCheck com as assinaturas da §5.
[Specifics] Componentes nunca chamam ações do contexto direto — só via hooks.
useChat: envio otimista → typing → append da resposta → erro com retryLast.
useFileUpload: valida client-side antes de chamar a API; status idle|validating|
uploading|done|error. useHealthCheck pausa quando a aba está oculta.
[Parâmetros] Sem efeito colateral em componentes; hooks testáveis com renderHook.
```

### Prompt 3 — Componentes de apresentação + a11y
```
[Contexto] Hooks e contexto prontos. Specs: 02-SPEC-FRONTEND.md §6, §7, §8.
[Role] Dev React sênior com foco em UX e acessibilidade.
[Instruções] Gere os componentes de chat/, conversations/, upload/, system/ e os
primitivos ui/, todos declarativos (props in, JSX out).
[Specifics] MessageList: role="log" aria-live="polite". MessageComposer: Enter
envia, Shift+Enter quebra. FileDropzone: drag-and-drop + clique, acionável por
teclado, aria-describedby com formatos aceitos. Respeitar prefers-reduced-motion.
[Parâmetros] Zero fetch/regra nos componentes; Tailwind; contraste AA.
```

### Prompt 4 — Testes
```
[Contexto] App estruturado. Spec: 04-CRITERIOS-ACEITACAO.md §3 (bloco Frontend).
[Role] Dev sênior em testes com Vitest + React Testing Library.
[Instruções] Gere os testes da tabela: 1 unit por hook (API mockada) + render de
MessageComposer e FileDropzone.
[Specifics] Cobrir envio otimista/erro, validação de arquivo e mapeamento do health.
[Parâmetros] Mockar src/api/ (não usar backend real nos testes); nada de snapshot frágil.
```

---

## 5. Validação pós-geração

Rodar o checklist de `02-SPEC-FRONTEND.md §10` e os critérios `AQ-2`, `AQ-3`,
`AQ-7` de `04-CRITERIOS-ACEITACAO.md`. Qualquer divergência de contrato → corrigir
`contracts.ts` e a chamada, nunca o componente.
