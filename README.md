# MedNote - Medico Copilot

**MedNote** é uma aplicação **Fullstack** projetada para auxiliar profissionais de saúde, **automatizando a transcrição** de consultas e **gerando análises clínicas detalhadas** (anamnese, sugestão de diagnóstico, método SOAP) utilizando o poder da **Inteligência Artificial** generativa (Groq/Llama 3).

## 🛠 Tecnologias Utilizadas
O projeto foi construído utilizando uma **arquitetura Monorepo**.

### Frontend (Client)
- Core: React 18 + Vite (Build ultrarrápido).
- Linguagem: TypeScript.
- Estilização: TailwindCSS (Utility-first CSS).
- Roteamento: React Router 7 (Data API).
- HTTP Client: Axios.

### Backend (Server)
- Runtime: Node.js.
- Framework: Express 5 (Beta - Melhor tratamento de erros assíncronos).
- Linguagem: TypeScript (executado via tsx para desenvolvimento).
- Banco de Dados: MongoDB (Native Driver - para máxima performance e controle).
- AI SDK: Groq SDK (Inferência rápida de LLMs).
- Real-time: WebSocket (ws).

## 🚀 Instalação e Execução

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

## 📡 Principais Endpoints 

```bash
|  Método   |   Rota      |               Descrição                  |
|-----------|-------------|------------------------------------------|
| POST      | /transcribe | Transcrição de áudio em tempo real       |
| POST      |  /diagnose  | Geração de diagnóstico clínico com IA    |
| POST      |   /chat     | Envio de mensagens para IA (Groq)        |
| GET       |   /reports  | Histórico de consultas (MongoDB)         |
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
