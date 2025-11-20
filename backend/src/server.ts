import app from "./app.js";
import http from "http";
import { connectDB } from "./config/database.js";
import dotenv from "dotenv";
import initWebSocketServer from "./websocket/transcription/transcription.ws.js";

//puxa as infos do .env
dotenv.config();

//funcao para iniciar servidor com segurança
async function startServer() {
  const server = http.createServer(app);
  initWebSocketServer(server);

  await connectDB(); //ativa a conexão com banco de dados

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}.`));
}

startServer();
