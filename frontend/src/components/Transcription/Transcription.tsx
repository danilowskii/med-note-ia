import { useEffect, useState, useRef } from "react";
import Button from "../Button";
import api from "../../Services/api";

// Props que o Transcription irá receber
type Props = {
  appointmentType: "presential" | "online";
  webSocket: WebSocket | null;
  recording: boolean;
  paused: boolean;
  audioURL: string | null;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
};

// tipagem da mensagem websocket
type MessageWebSocket = {
  type: "partial_transcription" | "final_transcription";
  text: string;
};

export default function Transcription({
  appointmentType,
  webSocket,
  recording,
  paused,
  audioURL,
  onPause,
  onResume,
  onStop,
}: Props) {
  const wsRef = useRef<WebSocket | null>(null);
  const [partialTranscription, setPartialTranscription] = useState<string>("");
  const [finalTranscription, setFinalTranscription] = useState<string[]>([]);
  const [appointmentNotes, setAppointmentNotes] = useState<string>("");

  useEffect(() => {
    if (!webSocket) return;

    wsRef.current = webSocket;

    wsRef.current.onmessage = (event: MessageEvent) => {
      try {
        const message: MessageWebSocket = JSON.parse(event.data);

        if (message.type === "partial_transcription") {
          setPartialTranscription(message.text);
        }

        if (message.type === "final_transcription") {
          setFinalTranscription((prev) => [...prev, message.text]);
          setPartialTranscription("");
        }
      } catch (error) {
        console.error("Erro ao processar mensagem WebSocket:", error);
      }
    };

    return () => {
      wsRef.current = null;
    };
  }, [webSocket]);

  //funcao que envia payload para backend
  const sendPayloadAppointment = async () => {
    console.log("Criando o objeto payload...");
    const payload = {
      finalTranscription: finalTranscription.join(" "), //junta todas as transcricoes em 1 so
      appointmentType,
      appointmentNotes,
      audioURL,
    };

    console.log("Payload criado. Enviando JSON:", payload);

    try {
      console.log("Tentando enviar payload para o servidor em /diagnose.");
      const response = await api.post("/api/diagnose", payload);
      console.log("Relatório recebido:", response.data);
    } catch (error) {
      console.error("Erro ao enviar consulta:", error);
    }
  };

  return (
    <section className="absolute z-50 bg-gradient-to-b from-green-700 via-green-600 to-green-700 rounded-lg p-4 overflow-visible top-8 min-h-[500px] md:w-1/2 w-3/4">
      {/* Anotações */}
      <div className="pb-3">
        <p className="text-white text-lg pb-2">Anotações da consulta</p>
        <textarea
          className="w-full rounded-lg text-gray-900 placeholder:text-slate-500 h-40 p-2 bg-green-200"
          name="appointment-notes"
          id="appointment-notes"
          value={appointmentNotes}
          onChange={(event) => setAppointmentNotes(event.target.value)}
          placeholder="Anote pontos importantes da consulta."
        />
      </div>

      <div className="border-t border-gray-300">
        <h2 className="text-white py-2 text-lg">Transcrição em tempo real</h2>

        <div className="pb-2 flex items-end justify-end">
          <p className="text-white text-sm bg-green-900 w-fit p-1 px-4 rounded">
            Modalidade da consulta:{" "}
            <span>
              {appointmentType === "presential" ? "Presencial" : "Teleconsulta"}
            </span>
          </p>
        </div>

        <div className="bg-green-200 rounded-lg gap-2 h-40 p-2 overflow-y-auto">
          {partialTranscription ? (
            <p className="text-gray-900">...{partialTranscription}</p>
          ) : (
            <p className="text-slate-500">
              A transcrição em tempo real aparecerá aqui
            </p>
          )}
        </div>

        {/* Botões */}
        <div className="flex flex-row justify-center items-center">
          {recording && !paused && (
            <div className="flex gap-4 py-4">
              <Button
                variant="secondary"
                className="p-2 rounded text-white"
                onClick={onPause}
              >
                ⏸ Pausar
              </Button>

              <Button
                variant="primary"
                className="p-2 rounded border border-white text-white"
                onClick={() => {
                  onStop();
                  sendPayloadAppointment();
                }}
              >
                ⏹ Terminar gravação
              </Button>
            </div>
          )}

          {recording && paused && (
            <div className="flex gap-4 py-4">
              <Button
                variant="secondary"
                className="p-2 rounded text-white"
                onClick={onResume}
              >
                ▶ Retomar
              </Button>

              <Button
                variant="primary"
                className="p-2 rounded text-white border border-white"
                onClick={() => {
                  onStop();
                  sendPayloadAppointment();
                }}
              >
                ⏹ Terminar gravação
              </Button>
            </div>
          )}
        </div>

        {/* Reproduzir áudio */}
        <div>
          {audioURL && (
            <div className="py-8 flex gap-4 flex-col">
              <p className="text-white py-2 text-lg">Gravação disponível:</p>
              <audio className="w-full" controls src={audioURL} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
