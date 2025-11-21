# MedNote - Medico Copilot

Aplicação Fullstack para transcrição e análise médica usando IA (Groq).

## 🛠 Tecnologias

**Frontend:**

- React 18, TypeScript, TailwindCSS, Vite, React Router 7, Axios, Lottie React

**Backend:**

- Node.js, Express 5, TypeScript (tsx), MongoDB (Native Driver), Groq SDK, WebSocket (ws), Multer

## 🚀 Instalação e Execução

Monorepo. Rode backend e frontend em terminais separados.

## 1. Backend (API & WebSocket)

```bash
cd backend
npm install
```

### Crie backend/.env:

```bash
PORT=8000
MONGOURI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/medNote
CLIENT_ORIGIN=http://localhost:5173
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxx
```

### Rodar Backend

```bash
npm run dev
# Servidor em http://localhost:8000
```

## 2. Frontend (Interface)

```bash
cd frontend
npm install
```

### Crie frontend/.env:

```bash
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/stream
```

### Rodar Frontend

```bash
npm run dev

# Vite em http://localhost:5173
```

## 📡 Endpoints Principais

```bash
|  Método   |   Rota   |               Descrição                  |
|-----------|----------|------------------------------------------|
| POST      | /upload  | Upload de áudio/arquivo (Multer)         |
| POST      |  /chat   | Envio de mensagens para IA (Groq)        |
| GET       | /history | Histórico do MongoDB                     |
| WS        | /stream  | WebSocket para respostas em tempo real   |
```

## 📦 Estrutura do Repositório

```bash
├── backend/     # API Node.js/Express + TS
├── frontend/    # React + Vite + TS
└── README.md
```

### backend/.env.example

```bash
PORT=8000
MONGOURI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/medNote
CLIENT_ORIGIN=http://localhost:5173
GROQ_API_KEY=gsk_INSIRA_SUA_CHAVE_AQUI
```

### frontend/.env.example

```bash
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/stream
```

### .gitignore (raiz)

```bash
# Dependências
node_modules/

# Build
dist/
build/

# Variáveis de ambiente
.env
.env.local
*.env
!*.env.example

# Logs e sistema
npm-debug.log
.DS_Store
Thumbs.db
.vscode/
```
