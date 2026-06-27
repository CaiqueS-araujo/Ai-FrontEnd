# 💬 AI Chat Frontend

Frontend de uma aplicação de chat desenvolvida em **React + TypeScript**, concebida seguindo a metodologia **Spec-Driven Development (SDD)**. O projeto consome uma API REST responsável pelo gerenciamento de conversas, envio de mensagens, upload de anexos e monitoramento da aplicação.

---

## 📖 Sobre o projeto

O objetivo deste projeto é construir uma **Single Page Application (SPA)** moderna, acessível e desacoplada, preparada para futuras integrações com modelos de Inteligência Artificial.

A arquitetura foi definida priorizando:

- Componentização
- Clean Code
- Separação de responsabilidades
- Hooks para regras de negócio
- Componentes focados apenas em renderização
- Evolução contínua do sistema

---

## 🏛 Arquitetura

O frontend segue a regra:

> **Componentes renderizam. Hooks pensam.**

Toda a lógica de negócio permanece isolada em Hooks customizados.

Usuário 

    │ 
    ▼
  
Componentes React

    │ 
    ▼

Hooks Customizados 

    │ 
    ▼ 

Camada API 

    │ 
    ▼ 
  
Backend Spring Boot

---

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- CSS Modules
- Context API
- React Hook Form
- Axios
- Vitest
- React Testing Library

---

## 📂 Estrutura do projeto
```
src/ 

  ├── api/

  ├── components/

  ├── context/ 

  ├── domain/ 

  ├── hooks/ 

  ├── lib/

  ├── styles/

  ├── App.tsx 

  └── main.tsx
```
---

## ✨ Funcionalidades

### Chat

- Envio de mensagens
- Recebimento de respostas
- Conversa única por sessão
- Indicador de carregamento
- Tratamento de erros

### Upload de arquivos

- Drag and Drop
- Upload pela caixa de mensagem
- Apenas um arquivo por mensagem
- Arquivos permitidos: `.txt` `.pdf`
- Limite de 10 MB
- Barra de progresso
- Validação antes do envio

### Monitoramento

Consulta periódica ao endpoint:


GET /api/health


Exibindo um pequeno indicador visual de disponibilidade da API.

---

## 📡 Integração com API

Endpoints utilizados:

| Método | Endpoint                              |
|--------|---------------------------------------|
| GET    | `/api/health`                         |
| POST   | `/api/conversations`                  |
| GET    | `/api/conversations`                  |
| GET    | `/api/conversations/{id}/messages`    |
| POST   | `/api/conversations/{id}/messages`    |
| POST   | `/api/conversations/{id}/attachments` |

---

## 🖥 Executando o projeto

### Instalação

```bash
npm install


🖥 Executando o projeto Instalação npm install


Crie o arquivo .env

VITE_API_BASE_URL=[localhost](http://localhost:8080)

Inicie o projeto

npm run dev


Build

npm run build

Testes

npm run test

Lint

npm run lint
```
---

## ♿ Acessibilidade

O projeto foi especificado considerando:

- Navegação por teclado
- aria-live para mensagens
- Labels acessíveis
- Contraste AA
- Compatibilidade com prefers-reduced-motion

---

## 📋 Convenções do projeto

Componentes não possuem regra de negócio.

- Hooks concentram estados e efeitos.
- Toda comunicação HTTP ocorre pela camada api.
- Validação de arquivos realizada antes do upload.
- Tipagem baseada no contrato da API.

---

## 🧪 Testes

O projeto utiliza:

- Vitest
- React Testing Library

Os testes contemplam:

- Hooks
- Componentes principais
- Fluxo de chat
- Upload de arquivos

---

## 📚 Documentação

Este repositório possui documentação baseada em Spec-Driven Development.

Documentos:

01-CONTRATO.md

02-SPEC-FRONTEND.md

03-CRITERIOS-DE-ACEITE.md

04-AGENTS.md


---

## 🛣 Roadmap

- Etapa 1:

 Chat

 Upload de arquivos

 Health Check

 Histórico de conversa

- Evoluções futuras:

 Login

 Streaming de respostas

 WebSocket

 Múltiplas conversas simultâneas

 Integração com IA

 Persistência avançada

---

## 👥 Equipe

CAIQUE SIMÕES DE ARAÚJO

DAVI DE SÁ PORTUGAL SILVA

LEONARDO DE MATTOS VEIGA

SIMONE BROMERSCHENCKEL

VANESSA CRISTINA SEVERIANO XAVIER

