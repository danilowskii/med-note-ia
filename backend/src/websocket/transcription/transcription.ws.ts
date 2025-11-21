import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import {
  groqPartialTranscription,
  groqFullTranscription,
} from "../../services/groq.service.js";

interface Session {
  buffers: Buffer[];
  baseBuffer?: Buffer; // opcional e do tipo correto
}

const sessions = new WeakMap<WebSocket, Session>();

// função de transcrição parcial com retry
async function tryPartialTranscription(
  ws: WebSocket,
  buffer: Buffer,
  retries = 3
) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const partial = await groqPartialTranscription(buffer);
      if (partial) {
        ws.send(
          JSON.stringify({ type: "partial_transcription", text: partial })
        );
      }
      return; // sucesso, sai do loop
    } catch (error: any) {
      console.warn(
        `Falha na transcrição parcial (tentativa ${attempt + 1} ):`,
        error.message
      );
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 100)); // espera antes de tentar novamente
      } else {
        ws.send(JSON.stringify({ type: "partial_transcription", text: "" }));
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Erro na transcrição parcial.",
          })
        );
      }
    }
  }
}

export default function initWebSocketServer(server: Server) {
  const wsServer = new WebSocketServer({ server });

  console.log("- WebSocket Server iniciado.");

  wsServer.on("connection", (ws: WebSocket) => {
    console.log("- Cliente conectado ao WebSocket.");

    // inicia sessão para essa conexão
    sessions.set(ws, { buffers: [] });

    // recebimento de cada chunk
    ws.on("message", async (data: Buffer | string) => {
      try {
        // tratamento de mensagens de controle
        if (typeof data === "string" || !Buffer.isBuffer(data)) {
          // se ws enviar arraybuffer, garantimos a conversão

          const textData = data.toString();

          // tenta fazer o parse apenas se parecer um json
          if (!textData.trim().startsWith("{")) return;

          let parsed;
          try {
            parsed = JSON.parse(textData);
          } catch {
            console.warn(
              "Mensagem WS texto não-JSON recebida:",
              textData.slice(0, 200)
            );
            return;
          }

          const type = parsed.type;

          if (type === "finish") {
            const session = sessions.get(ws);
            const bufs = session?.buffers ?? [];
            // se não tiver audio enviado
            if (bufs.length === 0) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Nenhum chunk recebido.",
                })
              );
              return;
            }
            //concatena chunks em um único buffer (arquivo completo)
            const fullBuffer = Buffer.concat(bufs);

            let finalTranscript = "";
            try {
              finalTranscript = await groqFullTranscription(fullBuffer);
            } catch (error) {
              console.error("Erro ao executar groqFullTranscription:", error);
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Falha na transcrição final.",
                })
              );
              return;
            }

            //limpar sessão
            sessions.delete(ws);
            return;
          }
          return;
        } else {
          const chunk = Buffer.isBuffer(data)
            ? data
            : Buffer.from(data as ArrayBuffer);

          let session = sessions.get(ws);
          if (!session) {
            session = { buffers: [chunk], baseBuffer: chunk };
            sessions.set(ws, session);
          } else session.buffers.push(chunk);

          if (!session.baseBuffer) {
            session.baseBuffer = chunk;
          } else {
            session.baseBuffer = Buffer.concat([session.baseBuffer, chunk]);
          }

          // chama a transcrição parcial
          await tryPartialTranscription(ws, session.baseBuffer);
        }
      } catch (err) {
        console.error("[WS] Erro no message handler:", err);
        try {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Erro interno no servidor WS.",
            })
          );
        } catch {}
      }
    });

    // eventos de encerramento
    ws.on("close", async (code, reason) => {
      console.log(
        `- Cliente desconectado. code= ${code}, reason= ${
          reason?.toString?.() ?? reason
        }`
      );
      const session = sessions.get(ws);
      if (!session) return;
      const bufs = session.buffers;
      if (!bufs || bufs.length === 0) {
        sessions.delete(ws);
        return;
      }

      try {
        const fullBuffer = Buffer.concat(session.buffers);
      } catch (error) {
        console.error("Erro ao processa sessão de cliente fechado:", error);
      } finally {
        sessions.delete(ws);
      }
    });

    ws.on("error", (error) => {
      console.error("WS erro na conexão:", error);
      sessions.delete(ws);
    });
  });
}
