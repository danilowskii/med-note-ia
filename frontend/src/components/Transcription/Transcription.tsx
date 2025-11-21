import { useEffect, useState, useRef } from "react";
import Button from "../Button";

// Props que o Transcription irá receber
type Props = {
  appointmentType: "presential" | "online";
  speciality: string | null;
  webSocket: WebSocket | null;
  recording: boolean;
  paused: boolean;
  notes: string;

  onChangeNotes: (value: string) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
};

// tipagem da mensagem websocket
type MessageWebSocket =
  | { type: "partial_transcription"; text: string } // chunks parciais
  | {
      type: "report_ready";
      report: {
        transcription: string;
      };
    }
  | { type: "error"; message: string };

export default function Transcription({
  appointmentType,
  speciality,
  notes,
  webSocket,
  recording,
  paused,

  onChangeNotes,
  onPause,
  onResume,
  onStop,
}: Props) {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [partialTranscription, setPartialTranscription] = useState<string>("");

  useEffect(() => {
    if (!webSocket) return;
    wsRef.current = webSocket;

    wsRef.current.onmessage = (event: MessageEvent) => {
      try {
        // Se vier como Blob (arraybuffer), ignora ou converte (depende do seu back)
        if (typeof event.data !== "string") return;

        const message: MessageWebSocket = JSON.parse(event.data);

        if (message.type === "partial_transcription") {
          setPartialTranscription(message.text);
        }
        // Não precisamos tratar 'report_ready' aqui para envio,
        // pois o envio final será feito via HTTP no onStop do WebRecorder.
      } catch (error) {
        console.error("Erro WS:", error);
      }
    };
  }, [webSocket]);

  // para ir mostrando texto mais recente, auto scroll
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop =
        textContainerRef.current.scrollHeight;
    }
  }, [partialTranscription]);

  return (
    <section
      className="
    relative
            
    sm:-mt-24      
    md:-mt-28      
    lg:-mt-32      
    w-full
     
    
    flex flex-col
    bg-gray-900 text-white font-sans
    p-4 sm:p-6 md:p-5
    rounded-2xl shadow-lg
    max-h-[90vh]
    gap-6
    overflow-y-auto
  "
    >
      {/* Anotações */}
      <div className="">
        <div className="flex flex-row justify-between items-center border-b border-gray-700 pb-2">
          <p className="text-white text-base md:text-xl font-bold">
            Anotações da consulta
          </p>
          <div className="flex gap-2">
            {speciality && (
              <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded shadow">
                {speciality}
              </span>
            )}
            <span className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded shadow">
              {appointmentType === "presential" ? "Presencial" : "Teleconsulta"}
            </span>
          </div>
        </div>

        <textarea
          className="w-full h-28 max-h-60 p-4 mt-2 bg-gray-800 text-gray-100 placeholder:text-gray-400 rounded-2xl shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={notes}
          onChange={(event) => onChangeNotes(event.target.value)}
          placeholder="Anote pontos importantes da consulta."
        />
      </div>

      {/* Transcrição em tempo real */}
      <div className="border-t border-gray-700 pt-4 flex flex-col gap-3">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white text-base md:text-xl font-bold">
            Transcrição em tempo real
          </h2>
          {recording && !paused && (
            <span className="text-xs block bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
              🎙️ Gravando...
            </span>
          )}

          {recording && paused && (
            <span className="text-xs block bg-red-500 text-nowrap text-white px-2 py-1 rounded-full">
              🎙️ Pausado...
            </span>
          )}
        </div>

        <div
          ref={textContainerRef}
          className="bg-gray-800 rounded-2xl gap-2 h-40 p-4 overflow-y-auto shadow-inner scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700"
        >
          {partialTranscription ? (
            <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
              {partialTranscription}
              <br />
            </p>
          ) : (
            <p className="text-gray-400 italic">
              A transcrição em tempo real aparecerá aqui
            </p>
          )}
        </div>

        {/* Botões de controle */}
        <div className="flex flex-row pt-6 justify-center items-center">
          <div className={`flex gap-4 py-2 ${!recording ? "invisible" : ""}`}>
            {recording && !paused && (
              <>
                <Button
                  variant="secondary"
                  className="group py-2 px-3 font-semibold rounded-2xl text-white shadow hover:bg-gray-700 transition-colors"
                  onClick={onPause}
                >
                  <span className="group-hover:text-yellow-600">❚❚</span> Pausar
                </Button>
                <Button
                  variant="primary"
                  className="group py-2 px-3 font-semibold bg-gray-200 text-gray-900 rounded-2xl border border-white shadow hover:bg-gray-300 flex items-center gap-2 transition-all"
                  onClick={onStop}
                >
                  <span className="group-hover:text-red-600">■</span> Terminar
                  gravação
                </Button>
              </>
            )}
            {recording && paused && (
              <>
                <Button
                  variant="secondary"
                  className="group py-2 px-3 font-semibold rounded-2xl text-white shadow hover:bg-gray-700 transition-colors"
                  onClick={onResume}
                >
                  <span className="group-hover:text-green-600">▶︎</span> Retomar
                </Button>
                <Button
                  variant="primary"
                  className="group py-2 px-3 font-semibold bg-gray-200 text-gray-900 rounded-2xl border border-white shadow hover:bg-gray-300 flex items-center gap-2 transition-all"
                  onClick={onStop}
                >
                  <span className="group-hover:text-red-600">■</span> Terminar
                  gravação
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
