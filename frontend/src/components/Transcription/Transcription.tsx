import { useEffect, useState, useRef } from "react";
import Button from "../Button";
import api from "../../Services/api";

// Props que o Transcription irá receber
type Props = {
  appointmentType: "presential" | "online";
  webSocket: WebSocket | null;
  recording: boolean;
  paused: boolean;

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
        diagnosis?: string;
        summary?: string;
        prescription?: string;
        fullReport?: any;
      };
    }
  | { type: "error"; message: string };

export default function Transcription({
  appointmentType,
  webSocket,
  recording,
  paused,

  onPause,
  onResume,
  onStop,
}: Props) {
  const wsRef = useRef<WebSocket | null>(null);
  const [partialTranscription, setPartialTranscription] = useState<string>("");
  const [finalTranscription, setFinalTranscription] = useState<string>("");
  const [fullReport, setFullReport] = useState<any>(null);
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

        if (message.type === "report_ready") {
          setFinalTranscription(message.report.transcription);
          setPartialTranscription("");
          setFullReport(message.report);
          console.log("Relatório completo recebido:", message.report);
        }
        if (message.type === "error") {
          console.error("WS Error:", message.message);
        }
      } catch (error) {
        console.error("Erro ao processar mensagem WebSocket:", error);
      }
    };

    return () => {
      wsRef.current = null;
    };
  }, [webSocket]);

  useEffect(() => {
    if (!finalTranscription) return;

    const sendFinalReport = async () => {
      const payload = {
        finalTranscription,
        appointmentType,
        appointmentNotes,

        fullReport,
      };

      try {
        const response = await api.post("diagnose", payload);
        console.log("Relatório enviado para o backend:", response.data);
      } catch (error) {
        console.error("Erro ao enviar consulta:", error);
      }
    };
  }, [finalTranscription, appointmentType, appointmentNotes, fullReport]);

  return (
    <section className="z-50 bg-gradient-to-b from-slate-900 via-slate-900 border border-slate-200/50 to-slate-950 rounded-lg p-4 min-h-[550px] overflow-visible ">
      {/* Anotações */}
      <div className="py-2">
        <div className="flex flex-row justify-between">
          <p className="text-white text-lg md:text-xl pb-2">
            Anotações da consulta
          </p>
          <div className="pb-2">
            <p className="text-slate-950 text-xs text-nowrap md:text-sm bg-gradient-to-tr from-slate-300 via-slate-200 to-slate-300 w-fit p-1 px-4 rounded">
              Modalidade:{" "}
              <span>
                {appointmentType === "presential"
                  ? "Presencial"
                  : "Teleconsulta"}
              </span>
            </p>
          </div>
        </div>
        <textarea
          className="w-full rounded-lg text-gray-900 placeholder:text-slate-500 h-40 p-2 bg-green-200"
          value={appointmentNotes}
          onChange={(event) => setAppointmentNotes(event.target.value)}
          placeholder="Anote pontos importantes da consulta."
        />
      </div>

      {/* Transcrição em tempo real */}
      <div className="border-t border-slate-200/50">
        <div className="flex flex-row justify-between">
          <h2 className="text-white py-2 text-lg md:text-xl">
            Transcrição em tempo real
          </h2>
          {recording ? (
            <p className="p-1 flex flex-row text-xs text-nowrap h-1/2 text-center rounded self-center bg-red-500 w-[100px]">
              {recording ? "🎙️ Escutando..." : ""}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="bg-green-200 rounded-lg gap-2 h-40 p-2 overflow-y-auto">
          {partialTranscription ? (
            <p className="text-slate-900">
              - {partialTranscription}
              <br />
            </p>
          ) : (
            <p className="text-slate-500">
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
                  className="py-2 px-3 rounded text-white"
                  onClick={onPause}
                >
                  ⏸
                </Button>
                <Button
                  variant="primary"
                  className="py-2 px-3 bg-slate-200 hover:bg-slate-300 rounded border border-white text-slate-950"
                  onClick={onStop}
                >
                  <span className="mr-1">⏹</span> Terminar gravação
                </Button>
              </>
            )}
            {recording && paused && (
              <>
                <Button
                  variant="secondary"
                  className="bg-transparent py-2 px-3 rounded text-white"
                  onClick={onResume}
                >
                  ▶
                </Button>
                <Button
                  variant="primary"
                  className="py-2 px-3 bg-slate-200 hover:bg-slate-300 rounded border border-white text-slate-950"
                  onClick={onStop}
                >
                  <span className="mr-1">⏹</span> Terminar gravação
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
